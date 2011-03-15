/*
 * MyRobot is a robot you can customize
 *
 * the method chooseNextMove must return a valid position from "whatAreMyOptions"
 *
 * methods available :
 *
 * this.whatAreMyOptions()
 *      will return a liste of all playable options
 *
 * this.game.whoIsHere(position)
 *      will return a liste of dots present in that position (0 = start, 37 = end)
 *
 * this.game.findNextPosition: function(dotmapindex, cardcolor)
 *      given a dot position and card color, will return this dot's new position if
 *      you play this card on it.
 *
 * this.game.findBackPosition: function(dotmapindex)
 *      given a dot position, will return this dot's new position if you decide to
 *      play it "backward". The return will be of this form :
 *      {position: new dot position,
 *       count   : how many cards will be picked
 *      }
 */

AOBPlayer.subclass('MyRobot', {
    chooseNextMove: function()
        {
        var options = this.whatAreMyOptions();
        return options[0];
        },
    });
