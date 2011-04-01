//@+leo-ver=5-thin
//@+node:celine.20110401213457.1807: * @file Menu.js
//@@language javascript
//@@tabwidth -4
Class.create('AOBMenu', {
    __construct: function()
        {
        this.game = null;
        this.parentMenu = null;
        this.active = false;
        this.items = [];
        this.game_was_running = false;
        this.title = null;
        },
    makeItems: function()
        {
        },
    setTitle: function(text)
        {
        if (this.title)
            {
            this.title.x = WIDTH / 2 - text.length * 16;
            this.title.setString(0,0,text);
            }
        else
            {
            var plane = new SpritePlane();
            Effect.Port.attach(plane);
            var tsprite = new TextSprite();
            tsprite.setFont('Optimer');
            tsprite.setTracking(1.0,1.0);
            tsprite.setTableSize(text.length,1);
            tsprite.x = WIDTH / 2 - text.length * 16;
            tsprite.y = 10;
            tsprite.setString(0,0,text);
            plane.attach(tsprite);
            this.title = tsprite;
            }
        },
    makeTextItem: function(text)
        {
        var plane = new SpritePlane();
        Effect.Port.attach(plane);
        var tsprite = new TextSprite();
        tsprite.setFont('Optimer');
        tsprite.setTracking(1.0,1.0);
        tsprite.setTableSize(text.length,1);
        tsprite.x = WIDTH / 2 - text.length * 16;
        tsprite.y = this.items.length * 40 + 80;
        tsprite.setString(0,0,text);
        plane.attach(tsprite);
        this.items.push([plane, tsprite, null]);
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
        tsprite.y = this.items.length * 40 + 80;
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
                if ((sprite) && (sprite == item[1]) && (item[2])) item[2].call(this);
                }, this);
            }
        else if (buttonIdx == Effect.RIGHT_BUTTON)
            {
            this.quit();
            }
        },
    start: function(game_was_running)
        {
        this.show();
        this.game_was_running = game_was_running;
        this.active = true;
        this.game.active_menu = this;
        },
    show: function()
        {
        if (this.title) this.title.show();
        this.items.forEach(function (i)
            {
            i[0].show();
            });
        },
    hide: function()
        {
        if (this.title) this.title.hide();
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
            this.game.game_running = this.game_was_running;
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
        this.setTitle("All On Board - Main Menu");
        this.makeItem('Help', function() {this.branchToMenu('helpmenu')});
        this.makeItem('Credits', function() {this.branchToMenu('creditsmenu')});
        this.makeItem('Add Player', function() {this.branchToMenu('newplayer')});
        this.makeItem('Del Player', function() {this.branchToMenu('delplayer')});
        this.makeItem('(re)Start game', this.restartGame);
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
        this.setTitle("Add player");
        this.makeItem('Human', this.addHuman);
        this.makeItem('CPU1', function () {this.addRobot(Weighter1);});
        this.makeItem('CPU2', function () {this.addRobot(Weighter2);});
        this.makeItem('CPU3', function () {this.addRobot(Weighter3);});
        this.makeItem('CPU4', function () {this.addRobot(Weighter4);});
        this.makeItem('CPU5', function () {this.addRobot(Weighter5);});
        this.makeItem('CPU6', function () {this.addRobot(Weighter6);});
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
        this.setTitle("Remove player");
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

AOBMenu.subclass('HelpMenu', {
    makeItems: function()
        {
        this.setTitle("All On Board - Help");
        this.makeItem('Using the menu', function() {this.branchToMenu('helponmenu')});
        this.makeItem('The game rules and how to play', function() {this.branchToMenu('helprules')});
        }
    });
AOBMenu.subclass('HelpOnMenuMenu', {
    makeItems: function()
        {
        this.setTitle("All On Board - Help");
        this.makeTextItem('Using the menu');
        this.makeTextItem('Just left-click items you want');
        this.makeTextItem('to activate. Right-click to go');
        this.makeTextItem('back to the previous menu or to');
        this.makeTextItem('exit the menu and return to the');
        this.makeTextItem('game.');
        }
    });
AOBMenu.subclass('HelpOnRulesMenu', {
    makeItems: function()
        {
        this.setTitle("All On Board - Help");
        this.makeTextItem('The goal is to advance your 6');
        this.makeTextItem('pawns to the end. To advance a');
        this.makeTextItem('pawn, click it then click a');
        this.makeTextItem('card on the right. The pawn will');
        this.makeTextItem('go to the next free cell of');
        this.makeTextItem('this color. To draw new cards,');
        this.makeTextItem('click a pawn then click the');
        this.makeTextItem('\'Back\' button. The pawn will');
        this.makeTextItem('go back until it finds a cell');
        this.makeTextItem('containing 1 or 2 pawns. You');
        this.makeTextItem('will pick up respectively 1 or');
        this.makeTextItem('2 cards.');
        }
    });
AOBMenu.subclass('CreditsMenu', {
    makeItems: function()
        {
        this.setTitle("All On Board - Credits");
        this.makeTextItem('Coding - Court-Jus');
        this.makeTextItem('--');
        this.makeTextItem('All the nice GFX');
        this.makeTextItem('(pawns, tiles, some cards)');
        this.makeTextItem('are from');
        this.makeTextItem('"Planet Cute" by Daniel Cook');
        this.makeTextItem('www.lostgarden.com');
        this.makeTextItem('--');
        this.makeTextItem('The bad GFX are from me :-/');
        this.makeTextItem('--');
        this.makeTextItem('Ghislain \'Court-Jus\' LEVEQUE');
        this.makeTextItem('ghislain.leveque@gmail.com');
        }
    });

//@+others
//@-others
//@-leo
