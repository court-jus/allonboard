function getwebs()
    {
    dojo.xhrGet({
        // The URL to request
        url: "/webs/",
        handleAs: "json",
        // The method that handles the request's successful result
        // Handle the response any way you'd like!
        load: function(result) {
            alert("The message is: " + result);
        }
        });
    }
