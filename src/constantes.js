// All On Board
// Created January 17, 2011 9:17:39 PM
// modifier dimanche 6 mars 2011, 21:44:15 (UTC+0100)
// Copyright (c) 2011 Ghislain Leveque

var LAUNCH = -1,
    RED = 0,
    BLUE = 1,
    GREEN = 2,
    WHITE = 3,
    BLACK = 4,
    BROWN = 5,
    LANDHERE = 37,
    WIDTH = 1024,
    HEIGHT = 768,
    TILE_WIDTH = 64,
    TILE_HEIGHT = 52,
    MAP_X_OFFSET = 64 * 2,
    MAP_Y_OFFSET = 64,
    LAUNCH_POSITION   = {x: 50,   y: 100},
    LANDHERE_POSITION = {x: 880,  y: 100},
    SLEEPING_INDICATOR_POSITION = {x: -500, y: -500},
    DOTS_PER_PLAYER = 6,
    MAP = new Array([-1 ,-1],
                        [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
	                    [5, 1], [5, 2], [4, 2], [3, 2], [2, 2], [1, 2],
	                    [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8],
	                    [1, 9], [1,10], [2,10], [3,10], [4,10], [4, 9],
	                    [4, 8], [4, 7], [5, 7], [5, 6], [6, 6], [6, 5],
	                    [6, 4], [7, 4], [8, 4], [9, 4], [9, 5], [10,5],
	                    [-10, -10]),
    MAP_COLORS = new Array(LAUNCH, BROWN, WHITE, BLUE, BLACK, GREEN, RED,
                           BLACK, WHITE, GREEN, BROWN, BLUE, RED,
                           WHITE, GREEN, BLUE, BLACK, RED, BROWN,
                           GREEN, RED, BLUE, BLACK, BROWN, WHITE,
                           GREEN, BROWN, RED, WHITE, BLUE, BLACK,
                           BLUE, GREEN, RED, WHITE, BROWN, BLACK, LANDHERE),
    CARDNAMES    = ['RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard'],
    DEFAULT_DECK = ['RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard',
                    'RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard',
                    'RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard',
                    'RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard',
                    'RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard',
                    'RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard',
                    'RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard',
                    'RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard',
                    'RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard',
                    'RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard'],
    DOT_CLASSES = new Array('RedDot','BlueDot','GreenDot','WhiteDot','BlackDot','BrownDot'),
    TILE_CLASSES = new Array('RedTile','BlueTile','GreenTile','WhiteTile','BlackTile','BrownTile'),
    MAXMAPINDEX = 37,
    VERTICAL_CARD_OFFSET = 60,
    CARD_WIDTH = 68,
    BUTTON_WIDTH = 100,
    BUTTON_HEIGHT = 44,
    STARTING_CARDS = 4,
    ROBOT_SLEEP = 150,
    WEIGHTS = [
        [   5,   1,  20,   1,  20,  20,   1, 0.1], //
        [   6,   1,  20,   1,  16,  18,   1, 0.3], //
        [   5,   1,  20,   1,  20,  20,   1, 0.2], //
        [   1,   1,   1,  10,   1,  10,   1, 0.4], //
        [   1,   1,   1,  10,   1,   1,   1, 0.3], //
        [  20,  10,  20,  20,   5,  80,  30, 0.4], //
        // --- the winners -----
        [   5,   1,  20,   1,  20,  20,   1, 0.3], //123/339 = 0.363 D1  1
        [   6,   1,  20,   1,  16,  18,   1, 0.3], // 96/339 = 0.283 A1  2
        [   5,   1,  20,   1,  20,  20,   1, 0.2], // 63/339 = 0.186 F1  3
        [   1,   1,   1,  10,   1,  10,   1, 0.4], // 36/339 = 0.106 C1  4
        [   1,   1,   1,  10,   1,   1,   1, 0.3], // 16/339 = 0.047 B1  5
        [  20,  10,  20,  20,   5,  80,  30, 0.4], //  5/339 = 0.015 E1  6
        // ----- F -----
        [   5,   1,  20,   1,  20,  20,   1, 3.2], //  0/25  = 0.000
        [   5,   1,  20,   1,  20,  20,   1, 1.6], //  0/25  = 0.000
        [   5,   1,  20,   1,  20,  20,   1, 0.8], //  0/25  = 0.000
        [   5,   1,  20,   1,  20,  20,   1, 0.4], // 10/25  = 0.400 F2
        [   5,   1,  20,   1,  20,  20,   1, 0.2], // 13/25  = 0.520 F1
        [   5,   1,  20,   1,  20,  20,   1, 0.1], //  2/25  = 0.080
        // ----- E -----
        [  50,  10,  20,  20,   5,  50,  30, 0.4], // 22/120 = 0.183
        [  30,  10,  20,  20,   5,  70,  30, 0.4], // 18/120 = 0.150
        [  20,  10,  20,  20,   5,  80,  30, 0.4], // 28/120 = 0.233 E1
        [  50,  10,  10,  30,   5,  50,  30, 0.4], // 19/120 = 0.158
        [  50,  10,  30,  10,   5,  50,  30, 0.4], //  9/120 = 0.075
        [  50,  20,  20,  20,   5,  50,  20, 0.4], // 24/120 = 0.200 E2
        // ----- D -----
        [  10,   1,  20,   1,  20,  20,   1, 0.3], //  6/51  = 0.118
        [  10,   1,  20,   1,  20,  20,   1, 0.4], //  9/51  = 0.176 D2
        [   5,   1,  20,   1,  15,  20,   1, 0.3], //  6/51  = 0.118
        [   5,   1,  20,   1,  15,  20,   1, 0.4], //  9/51  = 0.176
        [   5,   1,  20,   1,  20,  20,   1, 0.3], // 12/51  = 0.235 D1
        [   5,   1,  20,   1,  20,  20,   1, 0.4], //  9/51  = 0.176
        // ----- A1 + B1 + C1 + A2 + B2 + C2 -------
        [   6,   1,  20,   1,  16,  18,0.01, 0.3], // 98/282 = 0.348
        [   1,   1,   1,   1,   1,  10,   1, 0.3], //  9/282 = 0.032
        [   1,   1,   1,  20,   1,   1,   1, 0.4], // 17/282 = 0.060
        [   6,   1,  20,   1,  16,  18,   1, 0.3], // 88/282 = 0.312
        [   1,   1,   1,  10,   1,   1,   1, 0.3], // 21/282 = 0.074
        [   1,   1,   1,  10,   1,  10,   1, 0.4], // 49/282 = 0.174
        // ------ C ------
        [   1,   1,   1,   1,   1,   1,  10, 0.4], //  2/192 = 0.010
        [   1,   1,   1,  10,   1,   1,   1, 0.4], // 36/192 = 0.188
        [   1,   1,   1,   1,   1,  10,   1, 0.4], // 11/192 = 0.057
        [   1,   1,   1,  20,   1,   1,   1, 0.4], // 51/192 = 0.266 C2
        [   1,   1,   1,   1,   1,  20,   1, 0.4], // 15/192 = 0.078
        [   1,   1,   1,  10,   1,  10,   1, 0.4], // 77/192 = 0.401 C1
        // ------ B ------
        [  10,   1,   1,   1,   1,   1,   1, 0.3], //  9/79  = 0.114
        [   1,  10,   1,   1,   1,   1,   1, 0.3], //  1/79  = 0.013
        [   1,   1,  10,   1,   1,   1,   1, 0.3], //  0/79  = 0.000
        [   1,   1,   1,  10,   1,   1,   1, 0.3], // 36/79  = 0.456 B1
        [   1,   1,   1,   1,  10,   1,   1, 0.3], //  4/79  = 0.051
        [   1,   1,   1,   1,   1,  10,   1, 0.3], // 29/79  = 0.367 B2
        // ------ A ------
        [   6,   1,  20,   1,  16,  18,0.10, 0.3], // 26/102 = 0.255
        [   6,   1,  20,   1,  16,  18,0.01, 0.3], // 26/102 = 0.255 A2
        [   6,   1,  20,   1,  16,  18,   1, 0.3], // 31/102 = 0.304 A1
        [   6,   1,  20,   1,  16,  18,0.10, 0.5], // 13/102 = 0.127
        [   6,   1,  20,   1,  16,  18,0.10, 0.9], //  2/102 = 0.020
        [   6,   1,  20,   1,  16,  18,0.10, 0.1], //  4/102 = 0.039
        ]
    ;
    /*
    CARDNAMES = ['RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard'],
    DEFAULT_DECK = ['RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard',
                    'RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard',
                    'RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard',
                    'RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard',
                    'RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard',
                    'RedCard','GreenCard','BlueCard','BrownCard','WhiteCard','BlackCard'],
                    */
