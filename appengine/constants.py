#@+leo-ver=5-thin
#@+node:celine.20110401205125.1788: * @file constants.py
#@@language python
#@@tabwidth -4
#@+others
#@+node:celine.20110401205125.1789: ** infrastructure
LOGIN_REQUIRED = True
#@+others
#@+node:celine.20110401205125.1809: *3* status
#@+node:celine.20110401205125.1810: *4* game
GAME_CREATED, GAME_RUNNING, GAME_PAUSED, GAME_ENDED = range(4)
GAME_STATUS = {
    GAME_CREATED: u'created',
    GAME_RUNNING: u'running',
    GAME_PAUSED: u'paused',
    GAME_ENDED: u'ended',
    }
#@+node:celine.20110401205125.1811: *4* player
PLAYER_INGAME, PLAYER_WINNER, PLAYER_LOOSER = range(3)
PLAYER_STATUS = {
    PLAYER_INGAME: u'playing',
    PLAYER_WINNER: u'winner',
    PLAYER_LOOSER: u'looser',
    }
#@-others
#@+node:celine.20110401205125.1806: ** jeu
#@+others
#@+node:celine.20110401205125.1807: *3* colors
RED = 0
BLUE = 1
GREEN = 2
WHITE = 3
BLACK = 4
BROWN = 5
#@+node:celine.20110401205125.1808: *3* deck, cards
DEFAULT_DECK = [RED,BLUE,GREEN,WHITE,BLACK,BROWN,
                RED,BLUE,GREEN,WHITE,BLACK,BROWN,
                RED,BLUE,GREEN,WHITE,BLACK,BROWN,
                RED,BLUE,GREEN,WHITE,BLACK,BROWN,
                RED,BLUE,GREEN,WHITE,BLACK,BROWN,
                RED,BLUE,GREEN,WHITE,BLACK,BROWN,
                RED,BLUE,GREEN,WHITE,BLACK,BROWN,
                RED,BLUE,GREEN,WHITE,BLACK,BROWN,
                RED,BLUE,GREEN,WHITE,BLACK,BROWN,
                RED,BLUE,GREEN,WHITE,BLACK,BROWN]
#@-others
#@-others
#@-leo
