<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet ekr_test?>
<leo_file>
<leo_header file_format="2" tnodes="0" max_tnode_index="0" clone_windows="0"/>
<globals body_outline_ratio="0.5" body_secondary_ratio="0.5">
	<global_window_position top="50" left="50" height="500" width="700"/>
	<global_log_window_position top="0" left="0" height="0" width="0"/>
</globals>
<preferences/>
<find_panel_settings/>
<vnodes>
<v t="celine.20110401205125.1774"><vh>Doc</vh>
<v t="celine.20110401205125.1826"><vh>FR</vh></v>
<v t="celine.20110401205125.1827"><vh>EN</vh></v>
</v>
<v t="celine.20110401205125.1775" a="E"><vh>Code</vh>
<v t="celine.20110401213457.1811" a="E"><vh>@path /home/celine</vh>
<v t="celine.20110401213457.1810" a="E"><vh>@path public_html/allonboard</vh>
<v t="celine.20110401205125.1776" a="E"><vh>Google App Engine</vh>
<v t="celine.20110401205125.1777" a="E"><vh>@path appengine</vh>
<v t="celine.20110401205125.1778"><vh>@file app.yaml</vh></v>
<v t="celine.20110401205125.1787" a="E"
expanded="celine.20110401205125.1824,"><vh>@file appengine.py</vh></v>
<v t="celine.20110401205125.1788"><vh>@file constants.py</vh></v>
</v>
</v>
<v t="celine.20110401205125.1825" a="E"><vh>JS</vh>
<v t="celine.20110401205125.1828" a="E"><vh>@path src</vh>
<v t="celine.20110401213457.1809"><vh>@file sprites.js</vh></v>
<v t="celine.20110401213457.1808"
expanded="celine.20110401213457.6109,"><vh>@file Player.js</vh></v>
<v t="celine.20110401213457.1807"><vh>@file Menu.js</vh></v>
<v t="celine.20110401213457.1806"><vh>@file Game.js</vh></v>
<v t="celine.20110401213457.1805"><vh>@file fonctions.js</vh></v>
<v t="celine.20110401213457.1804"><vh>@file customrobot.js</vh></v>
<v t="celine.20110401213457.1803"><vh>@file constantes.js</vh></v>
<v t="celine.20110401213457.1802" a="E"><vh>@file config.js</vh></v>
<v t="celine.20110401213457.1801"><vh>@file allonboard.js</vh>
<v t="celine.20110401213457.1828"><vh>allonboard declarations</vh></v>
<v t="celine.20110401213457.1829"><vh>function</vh></v>
</v>
</v>
</v>
</v>
</v>
</v>
</vnodes>
<tnodes>
<t tx="celine.20110401205125.1774"></t>
<t tx="celine.20110401205125.1775"></t>
<t tx="celine.20110401205125.1776"></t>
<t tx="celine.20110401205125.1777"></t>
<t tx="celine.20110401205125.1825"></t>
<t tx="celine.20110401205125.1826"></t>
<t tx="celine.20110401205125.1827"></t>
<t tx="celine.20110401205125.1828">console.txt
</t>
<t tx="celine.20110401213457.1801">@language javascript
@tabwidth -4
@others
);
@ignore</t>
<t tx="celine.20110401213457.1810"></t>
<t tx="celine.20110401213457.1811"></t>
<t tx="celine.20110401213457.1828">// All On Board
// Created January 17, 2011 9:17:39 PM
// Copyright (c) 2011 Ghislain Leveque

var THEGAME = null;

</t>
<t tx="celine.20110401213457.1829">Effect.Game.addEventListener( 'onLoadGame', function() {
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
    }</t>
</tnodes>
</leo_file>
