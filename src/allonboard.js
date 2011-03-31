// All On Board
// Created January 17, 2011 9:17:39 PM
// Copyright (c) 2011 Ghislain Leveque

var THEGAME = null;

Effect.Game.addEventListener( 'onLoadGame', function() {
    var thehud = new HUD('hud');
    thehud.setTableSize(45,10);
    thehud.setFont('Optimer');
    thehud.setTracking(1.0,1.0);
    thehud.setPosition(10,10);
    thehud.setZIndex(999);
    Effect.Port.attach(thehud);

    var players = [];
    PLAYERS.forEach(function (cls, i)
        {
        p = new cls();
        p.init((cls == Human ? 'Human' + i : 'Robot' + i), i, i, cls != Human);
        players.push(p);
        });
    THEGAME = new AOBGame('AOB', players, thehud);
    loadgame(THEGAME);
    });
