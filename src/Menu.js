Class.create('AOBMenu', {
    __construct: function()
        {
        this.game = null;
        this.parentMenu = null;
        this.active = false;
        this.items = [];
        },
    makeItems: function()
        {
        },
    makeItem: function(text, callback)
        {
        var plane = new SpritePlane();
        Effect.Port.attach(plane);
        var tsprite = new TextSprite();
        tsprite.setFont('Optimer');
        tsprite.setTracking(1.0,1.0);
        tsprite.setTableSize(text.length,1);
        tsprite.x = WIDTH / 2 - text.length * 16;
        tsprite.y = this.items.length * 40 + 50;
        tsprite.setString(0,0,text);
        plane.attach(tsprite);
        this.items.push([plane, tsprite, callback]);
        },
    linkToGame: function(game)
        {
        this.game = game;
        this.makeItems();
        this.hide();
        },
    mouseButtonHandler: function(pt, buttonIdx)
        {
        if (!this.active) return;
        if (buttonIdx == Effect.LEFT_BUTTON)
            {
            this.items.forEach(function (item, idx, items)
                {
                var buttonsplane = item[0];
                var sprite = buttonsplane.lookupSpriteFromGlobal(pt);
                if ((sprite) && (sprite == item[1])) item[2].call(this);
                }, this);
            }
        else if (buttonIdx == Effect.RIGHT_BUTTON)
            {
            this.quit();
            }
        },
    start: function()
        {
        this.show();
        this.active = true;
        this.game.active_menu = this;
        },
    show: function()
        {
        this.items.forEach(function (i)
            {
            i[0].show();
            });
        },
    hide: function()
        {
        this.items.forEach(function (i)
            {
            i[0].hide();
            });
        },
    quit: function()
        {
        this.active = false;
        this.hide();
        if (this.parentMenu)
            {
            this.parentMenu.start();
            }
        else
            {
            this.game.showGame();
            this.game.game_running = true;
            }
        },
    branchToMenu: function(menuid)
        {
        var submenu = this.game.menus[menuid];
        this.active = false;
        this.hide();
        submenu.start();
        }
    });

AOBMenu.subclass('MainMenu', {
    makeItems: function()
        {
        this.makeItem('Add Player', function() {this.branchToMenu('newplayer')});
        this.makeItem('Del Player', function() {this.branchToMenu('delplayer')});
        this.makeItem('Restart game', this.restartGame);
        },
    restartGame: function()
        {
        this.active = false;
        this.hide();
        this.game.showGame();
        this.game.restartGame();
        }
    });

AOBMenu.subclass('NewPlayerMenu', {
    makeItems: function()
        {
        this.makeItem('Human', this.addHuman);
        this.makeItem('Weighter1', function () {this.addRobot(Weighter1);});
        },
    addHuman: function()
        {
        if (this.game.players.length == 6) return;
        var i = this.game.players.length;
        var p = new Human();
        p.init('Human' + i, i, i, false);
        p.linkToGame(this.game);
        this.game.scores[p.name] = 0;
        this.game.players.push(p);
        },
    addRobot: function(cls)
        {
        if (this.game.players.length == 6) return;
        var i = this.game.players.length;
        var p = new cls();
        p.init('Robot' + i, i, i, true);
        p.linkToGame(this.game);
        this.game.scores[p.name] = 0;
        this.game.players.push(p);
        }
    });
AOBMenu.subclass('DelPlayerMenu', {
    makeItems: function()
        {
        this.makeItem('Last', this.delLast);
        this.makeItem('All', this.delAll);
        },
    delLast: function()
        {
        if (this.game.players.length == 0) return false;
        var p = this.game.players.pop();
        p.dotsplane.deleteAll();
        p.cardsplane.deleteAll();
        if (this.game.current_player == p) this.game.nextPlayer();
        delete(p);
        delete(this.game.scores[p.name]);
        return true;
        },
    delAll: function()
        {
        while (this.delLast())
            {
            }
        this.game.endGame(false);
        }
    });
