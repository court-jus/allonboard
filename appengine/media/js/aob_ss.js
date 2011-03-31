function loadgame(THEGAME)
    {
    dojo.xhrGet({
        // The URL to request
        url: "/webs/loadgame/",
        handleAs: "json",
        // The method that handles the request's successful result
        // Handle the response any way you'd like!
        load: function(result) {
            THEGAME.apply_state(result);
        }
        });
    }
