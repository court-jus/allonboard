#@+leo-ver=5-thin
#@+node:celine.20110401205125.1787: * @file appengine.py
#@@language python
#@@tabwidth -4
#@+others
#@+node:celine.20110401205125.1790: ** appengine declarations
# -*- coding: utf-8 -*-

import os, datetime
from google.appengine.dist import use_library
use_library('django', '1.2')
import logging

from django.utils import simplejson as json

from google.appengine.api import users
from google.appengine.ext import webapp, db
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app
from constants import *

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), 'templates')

#@+node:celine.20110401205125.1812: ** Models
#@+others
#@+node:celine.20110401205125.1791: *3* class Game
class Game(db.Model):
    #@+<< docstring >>
    #@+node:celine.20110401205125.1813: *4* << docstring >>
    """
    Represents an AllOnBoard game
    """
    #@-<< docstring >>
    #@+<< properties >>
    #@+node:celine.20110401205125.1814: *4* << properties >>
    name = db.StringProperty()
    status = db.IntegerProperty(choices = GAME_STATUS.keys())
    deck = db.ListProperty(int)
    cards = db.ListProperty(int)
    #@-<< properties >>
#@+node:celine.20110401205125.1792: *3* class Player
class Player(db.Model):
    #@+<< docstring >>
    #@+node:celine.20110401205125.1816: *4* << docstring >>
    """
    Represents a player (may be anonymous or have a google account)
    """
    #@-<< docstring >>
    #@+<< properties >>
    #@+node:celine.20110401205125.1820: *4* << properties >>
    nickname = db.StringProperty(required = True)
    registered = db.BooleanProperty(required = True, default = False)
    user = db.UserProperty()
    creation = db.DateTimeProperty(required = True, auto_now_add = True)
    last_use = db.DateTimeProperty(required = True, auto_now_add = True)
    cards = db.ListProperty(int)
    dots = db.ListProperty(int)
    #@-<< properties >>
#@+node:celine.20110401205125.1793: *3* class Participation
class Participation(db.Model):
    #@+<< docstring >>
    #@+node:celine.20110401205125.1818: *4* << docstring >>
    """
    Represents and user participation into a Game
    """
    #@-<< docstring >>
    #@+<< properties >>
    #@+node:celine.20110401205125.1822: *4* << properties >>
    player = db.ReferenceProperty(Player, required = True)
    game = db.ReferenceProperty(Game, required = True)
    status = db.IntegerProperty(choices = PLAYER_STATUS.keys(), required = True, default = PLAYER_INGAME)
    #@-<< properties >>

#@-others
#@+node:celine.20110401205125.1823: ** Helpers
#@+others
#@+node:celine.20110401205125.1794: *3* who_calls
def who_calls(request):
    user = users.get_current_user()
    p = None
    nickname = None
    if user:
        q = Player.all().filter("user =", user)
        p = q.get()
        nickname = request.cookies.get('aob_nickname', user.nickname())
        if not p:
            p = Player(nickname = nickname)
            p.user = user
            p.registered = True
            p.put()
        else:
            p.nickname = nickname
            p.last_use = datetime.datetime.now()
            p.put()
    else:
        nickname = request.cookies.get('aob_nickname')
        if nickname:
            q = Player.all().filter("nickname =", nickname).filter("user =", None)
            p = q.get()
            if not p:
                p = Player(nickname = nickname)
                p.user = None
                p.nickname = nickname
                p.registered = False
                p.put()
            else:
                p.last_use = datetime.datetime.now()
                p.put()
    return {'user': user, 'nickname' : nickname, 'player': p}

#@-others
#@+node:celine.20110401205125.1824: ** Url Handlers
#@+others
#@+node:celine.20110401205125.1795: *3* class MainPage
class MainPage(webapp.RequestHandler):
    #@+others
    #@+node:celine.20110401205125.1796: *4* get
    def get(self):
        who = who_calls(self.request)
        template_values = {
            'who': who,
            'login_url': users.create_login_url(self.request.url),
            }

        path = os.path.join(TEMPLATE_DIR, 'index.html')
        self.response.out.write(template.render(path, template_values))

    #@-others
#@+node:celine.20110401205125.1797: *3* class GamePage
class GamePage(webapp.RequestHandler):
    #@+others
    #@+node:celine.20110401205125.1798: *4* get
    def get(self):
        # Just display the game
        template_values = {}
        path = os.path.join(TEMPLATE_DIR, 'game.html')
        self.response.out.write(template.render(path, template_values))

    #@-others
#@+node:celine.20110401205125.1799: *3* class PlayerPage
class PlayerPage(webapp.RequestHandler):
    #@+others
    #@+node:celine.20110401205125.1800: *4* get
    def get(self):
        who = who_calls(self.request)
        q = Player.all()

        template_values = {
            'who': who,
            'players': q,
            }

        path = os.path.join(TEMPLATE_DIR, 'players.html')
        self.response.out.write(template.render(path, template_values))

    #@-others
#@+node:celine.20110401205125.1801: *3* class LogoutPage
class LogoutPage(webapp.RequestHandler):
    #@+others
    #@+node:celine.20110401205125.1802: *4* get
    def get(self):
        self.redirect(users.create_logout_url('/'))

    #@-others
#@+node:celine.20110403213834.1508: *3* class NewGame
class NewGame(webapp.RequestHandler):
    #@+others
    #@+node:celine.20110403213834.1509: *4* get
    def get(self):
        template_values = {
            }

        path = os.path.join(TEMPLATE_DIR, 'newgame.html')
        self.response.out.write(template.render(path, template_values))

    #@+node:celine.20110403213834.1538: *4* post
    def post(self):
        who = who_calls(self.request)

        me = who.get('player')

        new_game_name = self.request.get('name')
        template_values = {}
        gq = Game.all().filter("name =", new_game_name)
        if gq.count() == 0:
            game = Game(
                name = new_game_name,
                deck = DEFAULT_DECK
                )
            game.put()
            if me:
                my_participation = Participation(
                    game = game,
                    player = me
                    )
                my_participation.put()
            template_values['msg'] = "Game created"
        else:
            game = gq[0]
            template_values['msg'] = "Game already exists"
        template_values['game_id'] = game.key()

        path = os.path.join(TEMPLATE_DIR, 'newgame.html')
        self.response.out.write(template.render(path, template_values))
    #@-others
#@+node:celine.20110403213834.1536: *3* class MyGames
class MyGames(webapp.RequestHandler):
    #@+others
    #@+node:celine.20110403213834.1537: *4* get
    def get(self):
        who = who_calls(self.request)

        template_values = {
            'me': who.get('player'),
            }

        path = os.path.join(TEMPLATE_DIR, 'mygames.html')
        self.response.out.write(template.render(path, template_values))

    #@-others
#@+node:gl.20110404131229.1545: *3* class JoinGame
class JoinGame(webapp.RequestHandler):
    #@+others
    #@+node:gl.20110404131229.1546: *4* get
    def get(self):
        who = who_calls(self.request)
        game = db.get(self.request.get('gameid'))
        me = who.get('player')
        current_players = [part.player for part in game.participation_set.all()]

        if game and me and len(current_players) != 6\
            and me not in current_players and game.status == GAME_CREATED:
            part = Participation(player = me,
                                 game = game)
            part.put()

        template_values = {
            'me': me,
            }

        path = os.path.join(TEMPLATE_DIR, 'mygames.html')
        self.response.out.write(template.render(path, template_values))

    #@-others
#@+node:celine.20110407213159.2327: *3* web services
#@+others
#@+node:celine.20110401205125.1803: *4* class LoadGame
class LoadGame(webapp.RequestHandler):
    #@+others
    #@+node:celine.20110401205125.1804: *5* get
    def get(self):
        self.response.headers['Content-Type'] = 'application/json'
        result = {
            "ok": False,
            "status": None,
            "gameid": None,
            "name": None,
            "deck": [],
            "cards": [],
            "players": [],
            "current_player": None,
            "owner": None,
            }
        gk = self.request.get('gameid')
        logging.error("gk %s " %(gk,))
        if gk:
            game = db.get(gk)
            logging.error("game = %s" % (game,))
            if game:
                result.update({
                    "ok": True,
                    "status": game.status,
                    "gameid": str(game.key()),
                    "name": game.name,
                    "deck": game.deck,
                    "cards": game.cards,
                    "players": [{'id':str(p.key())} for p in Participation.all().filter("game = ", game)],
                    "current_player": game.current_player.key() if game.current_player else None,
                    "owner" : game.owner.key() if game.owner else None,
                    })
        self.response.out.write(json.dumps(result))

    #@-others
#@-others
#@+node:celine.20110401205125.1805: ** main
application = webapp.WSGIApplication(
    [
        ('/player/logout/', LogoutPage),
        ('/player/', PlayerPage),
        ('/game/new/', NewGame),
        ('/game/mine/', MyGames),
        ('/game/join/', JoinGame),
        ('/game/', GamePage),
        ('/webs/loadgame/', LoadGame),
        ('/', MainPage),
    ],
    debug = True)

def main():
    run_wsgi_app(application)

#@-others
if __name__ == "__main__":
    main()
#@-leo
