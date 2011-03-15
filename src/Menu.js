Class.create('AOBMenu', {
    __construct: function()
        {
        this.game = null;
        this.active = false;
        this.buttonsplane = new SpritePlane();
        Effect.Port.attach(this.buttonsplane);
        this.items = [];
        this.items.push(this.buttonsplane.createSprite('OkButton', {
			x: 500,
			y: 600,
			zIndex: 999
            }));
        this.hide();
        },
    linkToGame: function(game)
        {
        this.game = game;
        },
    mouseButtonHandler: function(pt, buttonIdx)
        {
        if (!this.active) return;
		if (buttonIdx == Effect.LEFT_BUTTON)
			{
			var sprite = this.buttonsplane.lookupSpriteFromGlobal(pt);
			if (sprite)
				{
                console.debug(sprite, "clicked");
				}
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
        },
    show: function()
        {
        this.buttonsplane.show();
        },
    hide: function()
        {
        this.buttonsplane.hide();
        },
    quit: function()
        {
        this.active = false;
        this.hide();
        this.game.showGame();
        this.game.game_running = true;
        }
    });
