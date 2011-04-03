//@+leo-ver=5-thin
//@+node:celine.20110403213834.1542: * @file aob_ss.js
//@@language javascript
//@@tabwidth -4
//@+others
//@+node:celine.20110403213834.1549: ** loadgame
function loadgame(THEGAME)
    {
    var my_game_id = readCookie('aob_gameid');
    if (my_game_id)
        {
        dojo.xhrGet({
            // The URL to request
            url: "/webs/loadgame/",
            content: {gameid: my_game_id},
            handleAs: "json",
            // The method that handles the request's successful result
            // Handle the response any way you'd like!
            load: function(result) {
                THEGAME.apply_state(result);
            }
            });
        }
    else
        {
        alert("Aucune partie sélectionnée. Merci d'en créer une ou de passer par l'écran 'Mes parties'");
        }
    }
//@-others
//@-leo
