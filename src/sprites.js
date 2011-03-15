// All On Board
// Created January 17, 2011 9:17:39 PM
// Modified dimanche 6 mars 2011, 21:30:14 (UTC+0100)
// Copyright (c) 2011 Ghislain Leveque

Sprite.extend('EndTurnButton', {
	width: 68,
	height: 34,
	url: '/images/buttons/endturn.png'
	});
Sprite.extend('OkButton', {
	width: 68,
	height: 34,
	url: '/images/buttons/ok.png'
	});
Sprite.extend('BackButton', {
	width: 68,
	height: 34,
	url: '/images/buttons/back.png'
	});
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
Sprite.extend('Tile', {
	width: 64,
	height: 108,
    color: null,
    url: '/images/tiles/white.png',
    });
Dot.subclass('Indicator', {
    width: 40,
    height: 40,
	color: null,
    is_peon: false,
	base_url: '/images/sprites/indicator.png',
	url: '/images/sprites/indicator.png',
	sel_url: '/images/sprites/indicator.png',
    });
Dot.subclass('RedDot', {
	color: RED,
	base_url: '/images/sprites/reddot.png',
	url: '/images/sprites/reddot.png',
	sel_url: '/images/sprites/selreddot.png',
	});
Dot.subclass('GreenDot', {
	color: GREEN,
	base_url: '/images/sprites/greendot.png',
	url: '/images/sprites/greendot.png',
	sel_url: '/images/sprites/selgreendot.png',
	});
Dot.subclass('BlueDot', {
	color: BLUE,
	base_url: '/images/sprites/bluedot.png',
	url: '/images/sprites/bluedot.png',
	sel_url: '/images/sprites/selbluedot.png',
	});
Dot.subclass('WhiteDot', {
	color: WHITE,
	base_url: '/images/sprites/whitedot.png',
	url: '/images/sprites/whitedot.png',
	sel_url: '/images/sprites/selwhitedot.png',
	});
Dot.subclass('BlackDot', {
	color: BLACK,
	base_url: '/images/sprites/blackdot.png',
	url: '/images/sprites/blackdot.png',
	sel_url: '/images/sprites/selblackdot.png',
	});
Dot.subclass('BrownDot', {
	color: BROWN,
	base_url: '/images/sprites/browndot.png',
	url: '/images/sprites/browndot.png',
	sel_url: '/images/sprites/selbrowndot.png',
	});
Card.subclass('RedCard', {
	color: RED,
	base_url: 'images/cards/cred.png',
	url: 'images/cards/cred.png',
	sel_url: 'images/cards/selred.png'
	});
Card.subclass('BlueCard', {
	color: BLUE,
	base_url: 'images/cards/cblue.png',
	url: 'images/cards/cblue.png',
	sel_url: 'images/cards/selblue.png'
	});
Card.subclass('GreenCard', {
	color: GREEN,
	base_url: 'images/cards/cgreen.png',
	url: 'images/cards/cgreen.png',
	sel_url: 'images/cards/selgreen.png'
	});
Card.subclass('BlackCard', {
	color: BLACK,
	base_url: 'images/cards/cblack.png',
	url: 'images/cards/cblack.png',
	sel_url: 'images/cards/selblack.png'
	});
Card.subclass('BrownCard', {
	color: BROWN,
	base_url: 'images/cards/cbrown.png',
	url: 'images/cards/cbrown.png',
	sel_url: 'images/cards/selbrown.png'
	});
Card.subclass('WhiteCard', {
	color: WHITE,
	base_url: 'images/cards/cwhite.png',
	url: 'images/cards/cwhite.png',
	sel_url: 'images/cards/selwhite.png'
	});
Tile.subclass('BlackTile', {
    color: BLACK,
    url: '/images/newtiles/black.png',
    });
Tile.subclass('BlueTile', {
    color: BLUE,
    url: '/images/newtiles/blue.png',
    });
Tile.subclass('BrownTile', {
    color: BROWN,
    url: '/images/newtiles/brown.png',
    });
Tile.subclass('GreenTile', {
    color: GREEN,
    url: '/images/newtiles/green.png',
    });
Tile.subclass('RedTile', {
    color: RED,
    url: '/images/newtiles/red.png',
    });
Tile.subclass('WhiteTile', {
    color: WHITE,
    url: '/images/newtiles/white.png',
    });
