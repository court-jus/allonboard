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
#@+node:celine.20110401205125.1803: *3* class LoadGame
class LoadGame(webapp.RequestHandler):
    #@+others
    #@+node:celine.20110401205125.1804: *4* get
    def get(self):
        self.response.headers['Content-Type'] = 'application/json'
        result = {
            "name": None,
            "deck": [],
            "players": [],
            "status": None,
            }
        gq = Game.all()
        if gq.count() == 0:
            game = Game()
            game.name="test game"
            game.deck=DEFAULT_DECK
            game.put()
        else:
            game = gq[0]
        result.update({
            "name": game.name,
            "status": game.status,
            "deck": game.deck,
            "cards": game.cards,
            })
        self.response.out.write(json.dumps(result))

    #@-others
#@-others
#@+node:celine.20110401205125.1805: ** main
application = webapp.WSGIApplication(
    [
        ('/player/logout/', LogoutPage),
        ('/player/', PlayerPage),
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
