//@+leo-ver=5-thin
//@+node:celine.20110401213457.1809: * @file sprites.js
//@@language javascript
//@@tabwidth -4
// All On Board
// Created January 17, 2011 9:17:39 PM
// Modified dimanche 6 mars 2011, 21:30:14 (UTC+0100)
// Copyright (c) 2011 Ghislain Leveque
//@+others
//@+node:celine.20110401213457.6056: ** end turn button
Sprite.extend('EndTurnButton', {
    width: 100,
    height: 44,
    url: '/images/buttons/end.png'
    });
//@+node:celine.20110401213457.6057: ** back button
Sprite.extend('BackButton', {
    width: 100,
    height: 44,
    url: '/images/buttons/back.png'
    });
//@+node:celine.20110401213457.6058: ** menu button
Sprite.extend('MenuButton', {
    width: 100,
    height: 44,
    url: '/images/buttons/menu.png'
    });
//@+node:celine.20110401213457.6059: ** Dot
Sprite.extend('Dot', {
    mapindex: 0,
    width: 64,
    height: 64,
    color: null,
    is_peon: true,
    base_url: '/images/sprites/reddot.png',
    sel_url: '/images/sprites/selreddot.png',
    __construct: function()
        {
        this.go_to(this.mapindex);
        },
    selectMe: function()
        {
        this.setZIndex(999);
        this.setImage(this.sel_url);
        },
    unselectMe: function()
        {
        this.setZIndex(900);
        this.setImage(this.base_url);
        },
    go_toScreenPosition: function(mx, my)
        {
        this.x = mx;
        this.y = my;
        },
    go_to: function (mi, whos)
        {
        if (whos && whos.length == 2)
            {
            whos.forEach(function (s,i,a) { s.setScale(1.0); s.go_to(s.mapindex); });
            this.setScale(1.0);
            }
        this.mapindex = mi;
        this.x = mapIndexToScreenX(mi, this);
        this.y = mapIndexToScreenY(mi, this);
        if (this.is_peon)
            {
            this.y -= 20;
            }
        else
            {
            this.x += (64-40)/2;
            this.y += (52-40)/2;
            }
        },
    calculateAndApplyScale: function (index)
        {
        this.setScale(0.66);
        if ((this.mapindex != 0) && (this.mapindex != MAP.length-1))
            {
            var moveby = (index-1) * 21; // -21 or 0 or +21
            this.go_to(this.mapindex);
            this.go_toScreenPosition(this.x + moveby, this.y + moveby);
            }
        }
    });
//@+node:celine.20110401213457.6060: ** Card
Sprite.extend('Card', {
    width: 68,
    height: 120,
    cardindex: 0,
    color: null,
    base_url: '/images/cards/cwhite.png',
    sel_url: '/images/cards/selwhite.png',
    selectMe: function()
        {
        this.setZIndex(999);
        this.setImage(this.sel_url);
        },
    unselectMe: function()
        {
        this.setZIndex(950 + this.cardindex);
        this.setImage(this.base_url);
        },
    setIndex: function(i)
        {
        this.cardindex = i;
        this.y = VERTICAL_CARD_OFFSET * i;
        this.setZIndex(950 + i);
        }
    });
//@+node:celine.20110401213457.6061: ** Tile
Sprite.extend('Tile', {
    width: 64,
    height: 108,
    color: null,
    url: '/images/tiles/white.png',
    });
//@+node:celine.20110401213457.6062: ** Dot subclasses
//@+others
//@+node:celine.20110401213457.6063: *3* Indicator
Dot.subclass('Indicator', {
    width: 40,
    height: 40,
    color: null,
    is_peon: false,
    base_url: '/images/sprites/indicator.png',
    url: '/images/sprites/indicator.png',
    sel_url: '/images/sprites/indicator.png',
    });
//@+node:celine.20110401213457.6064: *3* RedDot
Dot.subclass('RedDot', {
    color: RED,
    base_url: '/images/sprites/reddot.png',
    url: '/images/sprites/reddot.png',
    sel_url: '/images/sprites/selreddot.png',
    });
//@+node:celine.20110401213457.6065: *3* GreenDot
Dot.subclass('GreenDot', {
    color: GREEN,
    base_url: '/images/sprites/greendot.png',
    url: '/images/sprites/greendot.png',
    sel_url: '/images/sprites/selgreendot.png',
    });
//@+node:celine.20110401213457.6066: *3* BlueDot
Dot.subclass('BlueDot', {
    color: BLUE,
    base_url: '/images/sprites/bluedot.png',
    url: '/images/sprites/bluedot.png',
    sel_url: '/images/sprites/selbluedot.png',
    });
//@+node:celine.20110401213457.6067: *3* WhiteDot
Dot.subclass('WhiteDot', {
    color: WHITE,
    base_url: '/images/sprites/whitedot.png',
    url: '/images/sprites/whitedot.png',
    sel_url: '/images/sprites/selwhitedot.png',
    });
//@+node:celine.20110401213457.6068: *3* BlackDot
Dot.subclass('BlackDot', {
    color: BLACK,
    base_url: '/images/sprites/blackdot.png',
    url: '/images/sprites/blackdot.png',
    sel_url: '/images/sprites/selblackdot.png',
    });
//@+node:celine.20110401213457.6069: *3* BrownDot
Dot.subclass('BrownDot', {
    color: BROWN,
    base_url: '/images/sprites/browndot.png',
    url: '/images/sprites/browndot.png',
    sel_url: '/images/sprites/selbrowndot.png',
    });
//@-others
//@+node:celine.20110401213457.6070: ** Card subclasses
//@+others
//@+node:celine.20110401213457.6071: *3* RedCard
Card.subclass('RedCard', {
    color: RED,
    base_url: 'images/cards/cred.png',
    url: 'images/cards/cred.png',
    sel_url: 'images/cards/selred.png'
    });
//@+node:celine.20110401213457.6072: *3* BlueCard
Card.subclass('BlueCard', {
    color: BLUE,
    base_url: 'images/cards/cblue.png',
    url: 'images/cards/cblue.png',
    sel_url: 'images/cards/selblue.png'
    });
//@+node:celine.20110401213457.6073: *3* GreenCard
Card.subclass('GreenCard', {
    color: GREEN,
    base_url: 'images/cards/cgreen.png',
    url: 'images/cards/cgreen.png',
    sel_url: 'images/cards/selgreen.png'
    });
//@+node:celine.20110401213457.6074: *3* BlackCard
Card.subclass('BlackCard', {
    color: BLACK,
    base_url: 'images/cards/cblack.png',
    url: 'images/cards/cblack.png',
    sel_url: 'images/cards/selblack.png'
    });
//@+node:celine.20110401213457.6075: *3* BrownCard
Card.subclass('BrownCard', {
    color: BROWN,
    base_url: 'images/cards/cbrown.png',
    url: 'images/cards/cbrown.png',
    sel_url: 'images/cards/selbrown.png'
    });
//@+node:celine.20110401213457.6076: *3* WhiteCard
Card.subclass('WhiteCard', {
    color: WHITE,
    base_url: 'images/cards/cwhite.png',
    url: 'images/cards/cwhite.png',
    sel_url: 'images/cards/selwhite.png'
    });
//@-others
//@+node:celine.20110401213457.6077: ** Tile subclasses
//@+others
//@+node:celine.20110401213457.6078: *3* BlackTile
Tile.subclass('BlackTile', {
    color: BLACK,
    url: '/images/newtiles/black.png',
    });
//@+node:celine.20110401213457.6079: *3* BlueTile
Tile.subclass('BlueTile', {
    color: BLUE,
    url: '/images/newtiles/blue.png',
    });
//@+node:celine.20110401213457.6080: *3* BrownTile
Tile.subclass('BrownTile', {
    color: BROWN,
    url: '/images/newtiles/brown.png',
    });
//@+node:celine.20110401213457.6081: *3* GreenTile
Tile.subclass('GreenTile', {
    color: GREEN,
    url: '/images/newtiles/green.png',
    });
//@+node:celine.20110401213457.6082: *3* RedTile
Tile.subclass('RedTile', {
    color: RED,
    url: '/images/newtiles/red.png',
    });
//@+node:celine.20110401213457.6083: *3* WhiteTile
Tile.subclass('WhiteTile', {
    color: WHITE,
    url: '/images/newtiles/white.png',
    });
//@-others
//@-others
//@-leo
