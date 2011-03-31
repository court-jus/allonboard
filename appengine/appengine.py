# -*- coding: utf-8 -*-

import os, datetime
from google.appengine.dist import use_library
use_library('django', '1.2')

from google.appengine.api import users
from google.appengine.ext import webapp, db
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app
from constants import *

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), 'templates')

class Game(db.Model):
    # Represents an AllOnBoard game
    name = db.StringProperty()
    status = db.IntegerProperty(choices = GAME_STATUS.keys())
class Player(db.Model):
    # Represents a player (may be anonymous or have a google account)
    nickname = db.StringProperty(required = True)
    registered = db.BooleanProperty(required = True, default = False)
    user = db.UserProperty()
    creation = db.DateTimeProperty(required = True, auto_now_add = True)
    last_use = db.DateTimeProperty(required = True, auto_now_add = True)
class Participation(db.Model):
    # Represents and user participation into a Game
    player = db.ReferenceProperty(Player, required = True)
    game = db.ReferenceProperty(Game, required = True)
    status = db.IntegerProperty(choices = PLAYER_STATUS.keys(), required = True, default = PLAYER_INGAME)

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

class MainPage(webapp.RequestHandler):
    def get(self):
        who = who_calls(self.request)
        template_values = {
            'who': who,
            'login_url': users.create_login_url(self.request.url),
            }

        path = os.path.join(TEMPLATE_DIR, 'index.html')
        self.response.out.write(template.render(path, template_values))

class GamePage(webapp.RequestHandler):
    def get(self):
        # Just display the game
        template_values = {}
        path = os.path.join(TEMPLATE_DIR, 'game.html')
        self.response.out.write(template.render(path, template_values))

class PlayerPage(webapp.RequestHandler):
    def get(self):
        who = who_calls(self.request)
        q = Player.all()

        template_values = {
            'who': who,
            'players': q,
            }

        path = os.path.join(TEMPLATE_DIR, 'players.html')
        self.response.out.write(template.render(path, template_values))

class LogoutPage(webapp.RequestHandler):
    def get(self):
        self.redirect(users.create_logout_url('/'))


application = webapp.WSGIApplication(
    [
        ('/player/logout/', LogoutPage),
        ('/player/', PlayerPage),
        ('/game/', GamePage),
        ('/', MainPage),
    ],
    debug = True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
