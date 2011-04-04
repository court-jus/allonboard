//@+leo-ver=5-thin
//@+node:celine.20110401213457.1806: * @file Game.js
//@@language javascript
//@@tabwidth -4
// All On Board
// Created January 17, 2011 9:17:39 PM
// Modified dimanche 6 mars 2011, 21:30:33 (UTC+0100)
// Copyright (c) 2011 Ghislain Leveque

Class.create('AOBGame', {
    //@+others
    //@+node:celine.20110401213457.6023: ** constructor
    __construct: function (name, players, hud)
        {
        this.name = name;
        this.gameid = null;
        this.hud = hud;
        this.level = 'CuteLevel';
        this.players = players;
        this.menus = {}
        this.active_menu = null;
        this.scores = {};
        this.current_error_message = "";
        this.drawgame = 0;
        this.turns_without_a_victory = 0;
        this.deck = DEFAULT_DECK;
        this.cards = this.deck.slice();
        this.shuffleCards();
        this.loaded_config = null;
        for (var i = 0; i < this.players.length ; i ++ )
            {
            this.players[i].linkToGame(this);
            this.scores[this.players[i].name] = 0;
            }
        this.current_player_index = Math.floor(Math.random() * players.length);
        },
    //@+node:celine.20110401213457.6024: ** apply state
    apply_state: function(config)
        {
        this.loaded_config = config;
        this.gameid = config.gameid;
        this.deck = [];
        config.deck.forEach(function (a)
            {
            this.deck.push(CARD_CLASSES[a]);
            }, this);
        config.players.forEach(function (pconfig)
            {
            if (this.players.length < 6)
                {
                var i = this.players.length;
                var p = new Human();
                p.init(pconfig.id, i, i, false);
                p.linkToGame(this);
                this.scores[p.name] = 0;
                this.players.push(p);
                }
            }, this);
        this.cards = [];
        config.cards.forEach(function (a)
            {
            this.cards.push(CARD_CLASSES[a]);
            }, this);
        /*
        In the case of a NEW game, the server will not
        prefill the cards array
        */
        if (this.cards.length == 0)
            {
            this.cards = this.deck.slice();
            this.shuffleCards();
            }
        },
    //@+node:celine.20110401213457.6025: ** clear HUD
    clearHud: function()
        {
        for (var r = 0 ; r < 10 ; r ++)
            {
            this.hud.setString(0,r,"                                             ");
            }
        },
    //@+node:celine.20110401213457.6026: ** hide game
    hideAllGame: function()
        {
        this.tilesplane.setOpacity(0.1);
        this.buttonsplane.hide();
        this.players.forEach(function (p)
            {
            p.cardsplane.hide();
            p.dotsplane.hide();
            }, this);
        },
    //@+node:celine.20110401213457.6027: ** show game
    showGame: function()
        {
        this.tilesplane.show();
        this.tilesplane.setOpacity(1);
        this.buttonsplane.show();
        this.players.forEach(function (p)
            {
            p.dotsplane.show();
            }, this);
        if (this.current_player) this.current_player.activate();
        if (this.players.length == 0)
            {
            this.clearHud();
            this.hud.setString(0,0,"You must add players");
            this.hud.setString(0,1,"to be able to play.");
            }
        },
    //@+node:celine.20110401213457.6028: ** set error
    setError: function(text)
        {
        this.hud.setString(0,1,"                                             ");
        if (text) this.hud.setString(0,1,text);
        },
    //@+node:celine.20110401213457.6029: ** show scores
    showScores: function()
        {
        var t = '';
        var total = 0;
        this.players.forEach(function(p,i,ps)
            {
            t +=  " " + p.name + ":" + this.scores[p.name];
            total += this.scores[p.name]
            }, this);
        console.debug(t, "total : ", total);
        },
    //@+node:celine.20110401213457.6030: ** draw card
    drawCard: function()
        {
        var drawncard = this.cards.pop();
        if (this.cards.length == 0)
            {
            this.cards = this.deck.slice();
            this.shuffleCards();
            }
        return drawncard;
        },
    //@+node:celine.20110401213457.6031: ** shuffle cards
    shuffleCards: function()
        {
        this.cards = shuffle(this.cards);
        },
    //@+node:celine.20110401213457.6032: ** launch
    launch: function ()
        {
        // Effect.Game.loadLevel(this.level, [this, this.level_loaded]);
        this.buttonsplane = new SpritePlane('buttonsplane');
        this.tilesplane = new SpritePlane('tilesplane');
        Effect.Port.attach(this.buttonsplane);
        Effect.Port.attach(this.tilesplane);
        this.createMap();
        this.menub = this.buttonsplane.createSprite('MenuButton', {
            x: 0,
            y: HEIGHT - BUTTON_HEIGHT,
            zIndex: 999});
        this.endturnb = this.buttonsplane.createSprite('EndTurnButton', {
            x: WIDTH - 2*BUTTON_WIDTH,
            y: HEIGHT - BUTTON_HEIGHT,
            zIndex: 999});
        this.backb = this.buttonsplane.createSprite('BackButton', {
            x: WIDTH - BUTTON_WIDTH,
            y: HEIGHT - BUTTON_HEIGHT,
            zIndex: 999});
        Effect.Port.addEventListener('onMouseDown', [this, this.mouseButtonHandler]);
        Effect.Port.addEventListener('onMouseMove', [this, this.mouseMoveHandler]);
        this.menus['main'] = new MainMenu();
        this.menus['newplayer'] = new NewPlayerMenu();
        this.menus['newplayer'].parentMenu = this.menus['main'];
        this.menus['delplayer'] = new DelPlayerMenu();
        this.menus['delplayer'].parentMenu = this.menus['main'];
        this.menus['helpmenu'] = new HelpMenu();
        this.menus['helpmenu'].parentMenu = this.menus['main'];
        this.menus['creditsmenu'] = new CreditsMenu();
        this.menus['creditsmenu'].parentMenu = this.menus['main'];
        this.menus['helponmenu'] = new HelpOnMenuMenu();
        this.menus['helponmenu'].parentMenu = this.menus['helpmenu'];
        this.menus['helprules'] = new HelpOnRulesMenu();
        this.menus['helprules'].parentMenu = this.menus['helpmenu'];
        for(menuid in this.menus)
            {
            this.menus[menuid].linkToGame(this);
            }
        this.active_menu = this.menus['main'];
        if (this.players.length == 0)
            {
            this.openMenu();
            }
        else
            {
            this.game_running = true;
            this.startTurn();
            }
        },
    //@+node:celine.20110401213457.6033: ** create map
    createMap: function()
        {
        MAP_COLORS.forEach(function (mc, i, mcs)
            {
            if ((mc != -1) && (mc != 37))
                {
                z = mapIndexToMapCoord(i)[1] + 10;
                this.tilesplane.createSprite(TILE_CLASSES[mc], {
                    x: mapIndexToScreenX(i),
                    y: mapIndexToScreenY(i)-30,
                    zIndex: z});
                }
            }, this);
        },
    //@+node:celine.20110401213457.6034: ** start turn
    startTurn: function()
        {
        if (!this.isGameActive()) return;
        this.clearHud();
        this.current_player = this.players[this.current_player_index];
        this.hud.setString(0, 0, "It's " + this.current_player.name + " turn.");
        for(var i = 0 ; i < MAXMAPINDEX + 1 ; i ++)
            {
            var whos = this.whoIsHere(i);
            if (whos.length > 1)
                {
                whos.forEach(function (s,i,a) { s.calculateAndApplyScale(i); });
                }
            }
        this.current_player.startTurn();
        },
    //@+node:celine.20110401213457.6035: ** end turn
    endTurn: function()
        {
        this.current_player.endTurn();
        this.nextPlayer();
        this.checkWinConditions();
        this.startTurn();
        },
    //@+node:celine.20110401213457.6036: ** next player
    nextPlayer: function()
        {
        this.current_player_index += 1;
        if (this.current_player_index >= this.players.length)
            this.current_player_index = 0;
        },
    //@+node:celine.20110401213457.6037: ** end game
    endGame: function(restart)
        {
        this.game_running = false;
        if (this.current_player) this.current_player.endGame(true);
        this.players.forEach(function (p) { if (p != this.current_player) p.endGame(false); }, this);
        if (restart) this.restartGame();
        },
    //@+node:celine.20110401213457.6038: ** is game active
    isGameActive: function()
        {
        return ((this.game_running) && (this.players.length > 0));
        },
    //@+node:celine.20110401213457.6039: ** restart game
    restartGame: function()
        {
        this.showScores();
        this.current_error_message = "";
        this.drawgame = 0;
        this.cards = this.deck.slice();
        this.shuffleCards();
        this.players.forEach(function(p,i,ps)
            {
            p.restartGame();
            });
        this.current_player_index = Math.floor(Math.random() * this.players.length);
        this.current_player = this.players[this.current_player_index];
        this.game_running = true;
        this.startTurn();
        },
    //@+node:celine.20110401213457.6040: ** check win condition
    checkWinConditions: function()
        {
        var p, i;
        for (i = 0; i < this.players.length; i ++)
            {
            p = this.players[i];
            if (p.checkWinConditions())
                {
                this.clearHud();
                this.hud.setString(0,0,this.current_player.name + " WON !!!");
                this.scores[this.current_player.name] += 1;
                this.endGame(AUTORESTART);
                }
            }
        },
    //@+node:celine.20110401213457.6041: ** level loaded
    level_loaded: function()
        {
        },
    //@+node:celine.20110401213457.6042: ** open menu
    openMenu: function(menu_name)
        {
        var game_was_running = this.game_running;
        this.clearHud();
        this.game_running = false;
        this.hideAllGame();
        if (menu_name)
            {
            this.menus[menu_name].start(game_was_running);
            }
        else
            {
            this.active_menu.start();
            }
        },
    //@+node:celine.20110401213457.6043: ** mouse button handler
    mouseButtonHandler: function(pt, buttonIdx)
        {
        if (buttonIdx == Effect.LEFT_BUTTON)
            {
            //@+<< left button >>
            //@+node:celine.20110401213457.6044: *3* << left button >>
            var sprite = this.buttonsplane.lookupSpriteFromGlobal(pt);
            if (sprite)
                {
                if (sprite == this.endturnb)
                    {
                    if (this.isGameActive()) this.pressEndTurnButton();
                    return;
                    }
                if (sprite == this.backb)
                    {
                    if (!this.isGameActive()) return;
                    if ((this.current_player.selected_dot) && (this.current_player.goingBack))
                        {
                        this.validateMove();
                        return;
                        }
                    }
                if (sprite == this.menub)
                    {
                    this.openMenu();
                    return;
                    }
                }
            //@-<< left button >>
            }
        else if (buttonIdx == Effect.RIGHT_BUTTON)
            {
            //@+<< right button >>
            //@+node:celine.20110401213457.6045: *3* << right button >>
            this.setError();
            //@-<< right button >>
            }
        if (this.isGameActive()) this.current_player.mouseButtonHandler(pt, buttonIdx);
        this.active_menu.mouseButtonHandler(pt, buttonIdx);
        },
    //@+node:celine.20110401213457.6046: ** validate move
    validateMove: function()
        {
        this.drawgame = 0;
        if (this.current_player.selected_dot && this.current_player.selected_card)
            {
            this.current_player.selected_dot.go_to(this.findNextPosition(this.current_player.selected_dot.mapindex, this.current_player.selected_card.color), this.whoIsHere(this.current_player.selected_dot.mapindex));
            this.current_player.selected_dot.setScale( 1.0 );
            this.current_player.withdrawCard();
            this.current_player.unselectAll();
            this.endTurn();
            }
        else if (this.current_player.selected_dot && this.current_player.goingBack)
            {
            var newpos_and_count = this.findBackPosition(this.current_player.selected_dot.mapindex);
            if (newpos_and_count !== null)
                {
                this.current_player.drawCard(newpos_and_count.count);
                this.current_player.selected_dot.go_to(newpos_and_count.position, this.whoIsHere(this.current_player.selected_dot.mapindex));
                this.current_player.unselectAll();
                this.endTurn();
                }
            }
        },
    //@+node:celine.20110401213457.6047: ** press end turn button
    pressEndTurnButton: function()
        {
        this.drawgame += 1;
        if (this.drawgame == this.players.length)
            {
            console.debug("every one did 'end turn'. Draw Game");
            this.hud.setString(0,0,"Every one passed.");
            this.hud.setString(0,1,"Draw Game.");
            this.endGame(AUTORESTART);
            }
        this.endTurn();
        },
    //@+node:celine.20110401213457.6048: ** mouse move handler
    mouseMoveHandler: function(pt, mouseEvent)
        {
        if (!this.isGameActive()) return;
        var sprite = this.buttonsplane.lookupSpriteFromGlobal(pt);
        if (sprite)
            {
            if (sprite == this.backb)
                {
                if (this.current_player.selected_dot && !this.current_player.selected_card)
                    {
                    var bpos = this.findBackPosition(this.current_player.selected_dot.mapindex);
                    if (bpos === null)
                        {
                        this.setError("Can't go back");
                        return;
                        }
                    this.current_player.indicator_dot.go_to(bpos.position);
                    this.current_player.goingBack = true;
                    }
                }
            }
        this.current_player.mouseMoveHandler(pt, mouseEvent);
        },
    //@+node:celine.20110401213457.6050: ** is there anybody out there
    isThereAnybodyOutThere: function(position)
        {
        for (var i = 0; i < this.players.length ; i ++)
            {
            if (this.players[i].isThereAnybodyOutThere(position))
                {
                return true;
                }
            }
        return false;
        },
    //@+node:celine.20110401213457.6051: ** how many dots here
    howManyDotsHere: function(position)
        {
        var count = 0;
        for (var i = 0; i < this.players.length ; i ++)
            {
            count += this.players[i].howManyDotsHere(position);
            }
        return count;
        },
    //@+node:celine.20110401213457.6052: ** who is here
    whoIsHere: function(position)
        {
        var who = [];
        for (var i = 0; i < this.players.length ; i ++)
            {
            who = who.concat(this.players[i].whoIsHere(position));
            }
        return who;
        },
    //@+node:celine.20110401213457.6053: ** find next position
    findNextPosition: function(dotmapindex, cardcolor)
        {
        var cc = cardcolor,
            di = dotmapindex;
        for (var i = di ; i < MAXMAPINDEX ; i ++)
            {
            if (MAP_COLORS[i] == cc)
                {
                if (!this.isThereAnybodyOutThere(i)) return i;
                }
            }
        return LANDHERE;
        },
    //@+node:celine.20110401213457.6054: ** find back position
    findBackPosition: function(dotmapindex)
        {
        var di = dotmapindex;
        if (di == 1) return null;
        for(var i = di-1 ; i > 0 ; i --)
            {
            var count = this.howManyDotsHere(i);
            if ((count == 1) || (count == 2)) 
                {
                return {position: i, count: count};
                }
            }
        return null;
        },
    //@+node:celine.20110401213457.6055: ** calculate score
    calculateScore: function(dots, cards)
        {
        // calculates a "score" for a given position
        // may be used by AI
        // the score aims to represent how far this position
        // is from wining. So the smaller, the best.
        var score = 0,
            distance = 0,
            pickups = 0,
            group = 0
            ;
        dots.forEach(function(s,i,a) {
            // For each dot, add his distance from the finish line to the score
            distance += (MAP.length - 2) - s;
            // If this dot can go back and pickup two cards, it's a good point
            bpos = this.findBackPosition(s);
            // The distance between the dots is important too
            dots.forEach(function(os,oi,oa) {
                group += Math.abs(s - os);
                }, this);
            if ((bpos) && (bpos.count==2)) pickups --;
            }, this);
        return {
            score:score,
            distance:distance,
            pickups:pickups,
            group: group
            };
        },
    //@-others
    });
//@-leo
