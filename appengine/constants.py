
LOGIN_REQUIRED = True
GAME_CREATED, GAME_RUNNING, GAME_PAUSED, GAME_ENDED = range(4)
GAME_STATUS = {
    GAME_CREATED: u'created',
    GAME_RUNNING: u'running',
    GAME_PAUSED: u'paused',
    GAME_ENDED: u'ended',
    }
PLAYER_INGAME, PLAYER_WINNER, PLAYER_LOOSER = range(3)
PLAYER_STATUS = {
    PLAYER_INGAME: u'playing',
    PLAYER_WINNER: u'winner',
    PLAYER_LOOSER: u'looser',
    }
