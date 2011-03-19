// All On Board
// Created January 17, 2011 9:17:39 PM
// Modified dimanche 6 mars 2011, 21:30:33 (UTC+0100)
// Copyright (c) 2011 Ghislain Leveque

Class.create('AOBGame', {
    __construct: function (name, players, hud)
        {
        this.name = name;
        this.hud = hud;
        this.level = 'CuteLevel';
        this.players = players;
        this.menus = {}
        this.active_menu = null;
        this.scores = {};
        this.current_error_message = "";
        this.drawgame = 0;
        this.turns_without_a_victory = 0;
        this.cards = DEFAULT_DECK.slice();
        this.shuffleCards();
        for (var i = 0; i < this.players.length ; i ++ )
            {
            this.players[i].linkToGame(this);
            this.scores[this.players[i].name] = 0;
            }
        this.current_player_index = Math.floor(Math.random() * players.length);
        },
    clearHud: function()
        {
        this.hud.setString(0,0,"                                             ");
        this.hud.setString(0,1,"                                             ");
        },
    hideAllGame: function()
        {
        this.tilesplane.hide();
        this.players.forEach(function (p)
            {
            p.cardsplane.hide();
            p.dotsplane.hide();
            }, this);
        },
    showGame: function()
        {
        this.tilesplane.show();
        this.players.forEach(function (p)
            {
            p.dotsplane.show();
            }, this);
        if (this.current_player) this.current_player.activate();
        },
    setError: function(text)
        {
        this.hud.setString(0,1,"                                             ");
        if (text) this.hud.setString(0,1,text);
        },
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
    drawCard: function()
        {
        var drawncard = this.cards.pop();
        if (this.cards.length == 0)
            {
            this.cards = DEFAULT_DECK.slice();
            this.shuffleCards();
            }
        return drawncard;
        },
    shuffleCards: function()
        {
        this.cards = shuffle(this.cards);
        },
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
    endTurn: function()
        {
        this.current_player.endTurn();
        this.nextPlayer();
        this.checkWinConditions();
        this.startTurn();
        },
    nextPlayer: function()
        {
        this.current_player_index += 1;
        if (this.current_player_index >= this.players.length)
            this.current_player_index = 0;
        },
    endGame: function(restart)
        {
        this.game_running = false;
        this.current_player.endGame(true);
        this.players.forEach(function (p) { if (p != this.current_player) p.endGame(false); }, this);
        if (restart) this.restartGame();
        },
    isGameActive: function()
        {
        return ((this.game_running) && (this.players.length > 0));
        },
    restartGame: function()
        {
        this.showScores();
        this.current_error_message = "";
        this.drawgame = 0;
        this.cards = DEFAULT_DECK.slice();
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
    level_loaded: function()
        {
        },
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
    mouseButtonHandler: function(pt, buttonIdx)
        {
        if (buttonIdx == Effect.LEFT_BUTTON)
            {
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
            }
        else if (buttonIdx == Effect.RIGHT_BUTTON)
            {
            this.setError();
            }
        if (this.isGameActive()) this.current_player.mouseButtonHandler(pt, buttonIdx);
        this.active_menu.mouseButtonHandler(pt, buttonIdx);
        },
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
    howManyDotsHere: function(position)
        {
        var count = 0;
        for (var i = 0; i < this.players.length ; i ++)
            {
            count += this.players[i].howManyDotsHere(position);
            }
        return count;
        },
    whoIsHere: function(position)   
        {
        var who = [];
        for (var i = 0; i < this.players.length ; i ++)
            {
            who = who.concat(this.players[i].whoIsHere(position));
            }
        return who;
        },
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
    });
