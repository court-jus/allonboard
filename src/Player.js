// All On Board
// Created January 17, 2011 9:17:39 PM
// Copyright (c) 2011 Ghislain Leveque

Class.create('AOBPlayer', {
    init: function(name, color, id, robotic)
        {
        this.name = name;
        this.game = null;
        this.color = color;
        this.id = id;
        this.selected_dot = null;
        this.selected_card = null;
        this.dots = [];
        this.cards = [];
        this.goingBack = false;
        this.robotic = false;
        if (robotic !== undefined) this.robotic = robotic;
        },
    restartGame: function() 
        {
        this.dots.forEach(function (d,i,ds)
            {
            d.go_to(0);
            });
        this.cards = [];
        this.cardsplane.deleteAll();
        this.inactivate();
        this.drawCard(STARTING_CARDS);
        },
    linkToGame: function (game)
        {
        this.game = game;
        this.cardsplane = new SpritePlane();
        Effect.Port.attach(this.cardsplane);
        this.dotsplane = new SpritePlane();
        Effect.Port.attach(this.dotsplane);
        this.indicator_dot = this.dotsplane.createSprite('Indicator', {});
        for (i = 0 ; i < DOTS_PER_PLAYER; i ++)
            {
            var newdot = this.dotsplane.createSprite(DOT_CLASSES[this.color], {});
            // newdot.go_to(Math.floor(Math.random() * 36));
            newdot.go_to(0);
            this.dots.push(newdot);
            }
        this.inactivate();
        this.drawCard(STARTING_CARDS);
        },
    drawCard: function(count)
        {
        if (this.game === null) return;
        for (i = 0 ; i < count ; i ++)
            {
            var cardname = this.game.drawCard();
            if (cardname)
                {
                var card = this.cardsplane.createSprite(cardname, {
                    x: WIDTH - CARD_WIDTH,
                    y: VERTICAL_CARD_OFFSET * i,
                    cardindex: this.cards.length});
                card.setZIndex(950 + i);
                this.cards.push(card);
                }
            }
        },
    withdrawCard: function (card)
        {
        var removed = [];
        var removed_names = [];
        if (!card && this.selected_card)
            {
            // Withdraw selected card
            var i = this.cards.indexOf(this.selected_card);
            if (i !== undefined)
                {
                removed = this.cards.splice(i,1);
                }
            }
        removed.forEach(function (v, i, a)
            {
            removed_names.push(v.type);
            v.destroy();
            });
        return removed_names;
        },
    activate: function ()
        {
        this.dotsplane.show();
        this.cardsplane.show();
        },
    changeMyDotsZIndex: function(z)
        {
        for (var i = 0; i < DOTS_PER_PLAYER; i ++)
            {
            this.dots[i].setZIndex(z);
            }
        this.indicator_dot.setZIndex(z);
        },
    inactivate: function()
        {
        this.unselectAll();
        // this.dotsplane.hide();
        this.cardsplane.hide();
        this.indicator_dot.go_toScreenPosition(SLEEPING_INDICATOR_POSITION.x, SLEEPING_INDICATOR_POSITION.y);
        },
    isThereAnybodyOutThere: function(position)
        {
        for (var i = 0 ; i < DOTS_PER_PLAYER; i ++)
            {
            if (this.dots[i].mapindex == position)
                {
                return true;
                }
            }
        return false;
        },
    howManyDotsHere: function(position)
        {
        var count = 0;
        for (var i = 0 ; i < DOTS_PER_PLAYER; i ++)
            {
            if (this.dots[i].mapindex == position)
                {
                count += 1;
                }
            }
        return count;
        },
    whoIsHere: function(position)
        {
        var who = [];
        for (var i = 0 ; i < DOTS_PER_PLAYER; i ++)
            {
            if (this.dots[i].mapindex == position)
                {
                who.push(this.dots[i]);
                }
            }
        return who;
        },
    unselectAll: function()
        {
        if (this.selected_dot)
            {
            this.selected_dot.unselectMe();
            this.selected_dot = null;
            }
        if (this.selected_card)
            {
            this.selected_card.unselectMe();
            this.selected_card = null;
            }
        this.goingBack = false;
        this.indicator_dot.go_toScreenPosition(SLEEPING_INDICATOR_POSITION.x, SLEEPING_INDICATOR_POSITION.y);
        },
    mouseButtonHandler: function(pt, buttonIdx)
        {
        if (buttonIdx == Effect.RIGHT_BUTTON)
            {
            this.unselectAll();
            return;
            }
        if (buttonIdx != Effect.LEFT_BUTTON)
            {
            return;
            }
        var dotclicked = this.dotsplane.lookupSpriteFromGlobal( pt );
        var cardclicked = this.cardsplane.lookupSpriteFromGlobal( pt );
        if (dotclicked)
            {
            if (dotclicked == this.indicator_dot)
                {
                this.unselectAll();
                }
            else if (dotclicked.mapindex == LANDHERE)
                {
                this.unselectAll();
                }
            else
                {
                if (this.selected_dot) { this.selected_dot.unselectMe(); }
                this.selected_dot = dotclicked;
                this.selected_dot.selectMe();
                }
            }
        if (cardclicked)
            {
            if (this.selected_card) { this.selected_card.unselectMe(); }
            this.selected_card = cardclicked;
            this.selected_card.selectMe();
            }
        if (this.selected_card && this.selected_dot)
            {
            this.game.validateMove();
            }
        },
    mouseMoveHandler: function(pt, mouseEvent)
        {
        if (this.selected_dot)
            {
            var hovercard = this.cardsplane.lookupSpriteFromGlobal(pt);
            if (hovercard)
                {
                this.indicator_dot.go_to(this.game.findNextPosition(this.selected_dot.mapindex, hovercard.color));
                }
            }
        if (this.selected_card)
            {
            var hoverdot = this.dotsplane.lookupSpriteFromGlobal(pt);
            if (hoverdot)
                {
                this.indicator_dot.go_to(this.game.findNextPosition(hoverdot.mapindex, this.selected_card.color));
                }
            }
        },
    checkWinConditions: function()
        {
        for (var i = 0 ; i < this.dots.length; i ++)
            {
            if (this.dots[i].mapindex != LANDHERE) return false;
            }
        return true;
        },
    startTurn: function()
        {
        this.goingBack = false;
        for(var i = 0 ; i < this.cards.length; i ++)
            {
            this.cards[i].setIndex(i);
            }
        this.activate();
        this.changeMyDotsZIndex(900);
        if (this.robotic)
            {
            this.robotStartTurn();
            }
        },
    robotStartTurn: function()
        {
        var nextmove = this.chooseNextMove();
        if (nextmove)
            {
            this.goingBack = nextmove.goingBack;
            if (nextmove.dot)
                {
                nextmove.dot.selectMe();
                this.selected_dot = nextmove.dot;
                }
            if (nextmove.card)
                {
                nextmove.card.selectMe();
                this.selected_card = nextmove.card;
                }
            if (ROBOT_SLEEP > 0)
                {
                window.setTimeout(function (o) {o.validateMove();}, ROBOT_SLEEP, this.game);
                }
            else
                {
                this.game.validateMove();
                }
            }
        else
            {
            if (ROBOT_SLEEP > 0)
                {
                window.setTimeout(function (o) {o.pressEndTurnButton();}, ROBOT_SLEEP, this.game);
                }
            else
                {
                this.game.pressEndTurnButton();
                }
            }
        },
    endTurn: function()
        {
        this.inactivate();
        this.changeMyDotsZIndex(100);
        },
    whatAreMyOptions: function(dots, cards)
        {
        var options = [];
        if (!dots) dots = this.dots;
        if (!cards) cards = this.cards;
        dots.forEach(function (s,i,a) {
            if (s.mapindex != LANDHERE)
                {
                bpos = this.game.findBackPosition(s.mapindex);
                if (bpos) options.push({goingBack:true,dot:s,card:null,newpos:bpos.position,newcards:bpos.count});
                cards.forEach(function (c, ic, ac)
                    {
                    options.push({goingBack:false,dot:s,card:c,newpos:this.game.findNextPosition(s.mapindex, c.color),newcards:0});
                    }, this);
                }
            }, this);
        return options;
        },
    scoreBasedOnOption: function(option)
        {
        var dotsi = [];
        var cardsc = [];
        this.dots.forEach(function (s,i,a)
            {
            if (s == option.dot)
                {
                dotsi.push(option.newpos);
                }
            else
                {
                dotsi.push(s.mapindex);
                }
            });
        this.cards.forEach(function (s,i,a)
            {
            if (s != option.card)
                {
                cardsc.push(s.color);
                }
            });
        return this.game.calculateScore(dotsi, cardsc);
        },
    weightedScore: function(before, after, weights)
        {
        var sb = this.scoreBasedOnOption(before);
        var sa = this.scoreBasedOnOption(after);
        var score = 0;
        if (after.goingBack)
            {
            // Plus le recul est court mieux c'est
            score += weights.rewind_distance * (after.dot.mapindex - after.newpos) / 37.0;
            // console.debug("rewind_distance",weights.rewind_distance, (after.newpos - after.dot.mapindex));
            // On prefere reculer les pions qui ont deja bien avance
            score += weights.rewind_advanced * (after.dot.mapindex) / 37.0;
            // console.debug("rewind_advanced", weights.rewind_advanced, (after.dot.mapindex));
            // Si le recul permet de piocher 2 cartes, c'est genial
            score += weights.pickup_two * (after.newcards) / 2.0;
            // console.debug("pickup_two", weights.pickup_two , (after.newcards));
            // Si on a 3 cartes ou moins, on va preferer piocher, sinon non
            score += weights.pickup_when_low_on_cards * (this.cards.length <= 3);
            // console.debug("pickup_when_low_on_cards", weights.pickup_when_low_on_cards, (this.cards.length <= 3));
            // On va piocher plus au debut de la partie
            score += weights.rewind_early * (sb.distance) / 216.0;
            // console.debug('rewind_early', weights.rewind_early, (sb.distance));

            score *= weights.prefer_rewind;
            }
        else
            {
            // Plus l'avancee est longue, mieux c'est
            score += weights.forward_distance * (after.newpos - after.dot.mapindex) / 37.0;
            // console.debug("forward_distance",weights.forward_distance, (after.newpos - after.dot.mapindex));
            // On va preferer avancer d'abbord les nains qui ont le moins avance
            score += weights.forward_late_peons * (MAXMAPINDEX - after.dot.mapindex) / 37.0;
            // console.debug("forward_late_peons", weights.forward_late_peons , (MAXMAPINDEX - after.dot.mapindex));
            }
        // console.debug("SCORE" , score);
        return score;
        },
    chooseBestFromWeights: function(weights)
        {
        var scoremax = -99999,
            newscore = null,
            options = this.whatAreMyOptions(),
            choosen = null;
        options.forEach(function (o,i,os)
            {
            newscore = this.weightedScore({dot:null, card:null, newpos: null}, o, weights);
            if (newscore > scoremax)
                {
                // console.debug("option",o,"is better",newscore,">",scoremax);
                scoremax = newscore
                choosen = o;
                }
            }, this);
        // console.debug("I chose option with score",scoremax);
        return choosen;
        },
    debugG: function()
        {
        var choosen = this.chooseBestFromWeights(WEIGHTS_1);
        // console.debug("Choosen",choosen.dot.mapindex, (choosen.goingBack ? "back" : choosen.card.type));
        },
    });

AOBPlayer.subclass('Human', {});
AOBPlayer.subclass('Robot', {
    chooseNextMove: function()
        {
        var options = this.whatAreMyOptions();
        return options[Math.floor(Math.random() * options.length)];
        },
    });

AOBPlayer.subclass('Runner', {
    chooseNextMove: function()
        {
        var options = this.whatAreMyOptions();
        var choosen_option = null;
        var choosen_score = null;
        var begining_score = this.scoreBasedOnOption({dot:null,card:null,newpos:null});
        options.forEach(function (o, i, os)
            {
            if (choosen_option)
                {
                var option_score = this.scoreBasedOnOption(o);
                if (option_score.distance < choosen_score.distance)
                    {
                    choosen_option = o;
                    choosen_score = this.scoreBasedOnOption(choosen_option);
                    }
                }
            else
                {
                choosen_option = o;
                choosen_score = this.scoreBasedOnOption(choosen_option);
                }
            }, this);
        return choosen_option;
        },
    });
AOBPlayer.subclass('Picker', {
    chooseNextMove: function()
        {
        var options = this.whatAreMyOptions();
        var choosen_option = null;
        var choosen_score = null;
        var begining_score = this.scoreBasedOnOption({dot:null,card:null,newpos:null});
        options.forEach(function (o, i, os)
            {
            if (choosen_option)
                {
                var option_score = this.scoreBasedOnOption(o);
                if (o.newcards > choosen_option.newcards)
                    {
                    choosen_option = o;
                    choosen_score = this.scoreBasedOnOption(choosen_option);
                    }
                else if (option_score.pickups < choosen_score.pickups)
                    {
                    choosen_option = o;
                    choosen_score = this.scoreBasedOnOption(choosen_option);
                    }
                else if (option_score.distance < choosen_score.distance)
                    {
                    choosen_option = o;
                    choosen_score = this.scoreBasedOnOption(choosen_option);
                    }
                }
            else
                {
                choosen_option = o;
                choosen_score = this.scoreBasedOnOption(choosen_option);
                }
            }, this);
        return choosen_option;
        },
    });
AOBPlayer.subclass('KidGardener', {
    chooseNextMove: function()
        {
        // Will choose in priority options that go forward and use the
        // dots that are closer to starting line
        var begining_score = this.scoreBasedOnOption({dot:null,card:null,newpos:null});
        var begining_distance = begining_score.distance;
        var options = this.whatAreMyOptions();
        var choosen_option = options[0];
        var choosen_score = this.scoreBasedOnOption(choosen_option);
        var choosen_delta = begining_distance - choosen_score.distance;
       // console.debug("Begin choice");
        options.forEach(function (o, i, os)
            {
            var option_score = this.scoreBasedOnOption(o);
            //console.debug(begining_distance, choosen_score.distance, option_score.distance, choosen_option.dot.mapindex, o.dot.mapindex);
            var delta_distance = begining_distance - option_score.distance;
            choosen_delta = begining_distance - choosen_score.distance;
            if (begining_distance > option_score.distance) // going forward
                {
                if (choosen_option.dot.mapindex > o.dot.mapindex)
                    {
                    choosen_option = o;
                    choosen_score = this.scoreBasedOnOption(choosen_option);
                    }
                }
            }, this);
        //console.debug("end choice",begining_distance, choosen_score.distance, '#', choosen_option.dot.mapindex, '#');
        if (choosen_option === null)
            {
            choosen_option = options[Math.floor(Math.random() * options.length)];
            }
        return choosen_option;
        },
    });
AOBPlayer.subclass('Weighter1', {
    chooseNextMove: function()
        {
        return this.chooseBestFromWeights(makeWeightFromArray(WEIGHTS[0]));
        },
    });
AOBPlayer.subclass('Weighter2', {
    chooseNextMove: function()
        {
        return this.chooseBestFromWeights(makeWeightFromArray(WEIGHTS[1]));
        },
    });
AOBPlayer.subclass('Weighter3', {
    chooseNextMove: function()
        {
        return this.chooseBestFromWeights(makeWeightFromArray(WEIGHTS[2]));
        },
    });
AOBPlayer.subclass('Weighter4', {
    chooseNextMove: function()
        {
        return this.chooseBestFromWeights(makeWeightFromArray(WEIGHTS[3]));
        },
    });
AOBPlayer.subclass('Weighter5', {
    chooseNextMove: function()
        {
        return this.chooseBestFromWeights(makeWeightFromArray(WEIGHTS[4]));
        },
    });
AOBPlayer.subclass('Weighter6', {
    chooseNextMove: function()
        {
        return this.chooseBestFromWeights(makeWeightFromArray(WEIGHTS[5]));
        },
    });
