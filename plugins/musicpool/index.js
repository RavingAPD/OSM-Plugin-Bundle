"use strict";


let runtime = require("../../utils/Runtime");
var say = require("winsay");
var auth = require("../op/auth");

let regex = new RegExp( /^(\!|\/)rg\s(.+)$/ );

module.exports = [{
    name: '!rg',
    help: 'Starts or continues a pool of voted music genres.',
    types: ['message'],
    regex: regex,
    action: function( chat, stanza ) {

        //Get the user who typed the command
        //Get the chatOPS
        //Set the opName to chatOPS[{user who typed}]
        var user = chat.getUser( stanza.user.username );
        var chatOPS = runtime.brain.get("chatOPS") || {};
        var opName = chatOPS[user.username];

        //If the user who typed the command is at least donator
        //make them access this command
        if ( ! auth.has(user.username, "donator") ) {
            return false;
        } 

        //Get the regex group
        var match = regex.exec( stanza.message );
        var requestedGenre = match[2].toLowerCase();

        //Get the genrePool from the brain
        var genrePool = runtime.brain.get( 'genrePool' ) || {};

        //If that Pool doesn't exists, create it and add one to the pool count
        if ( genrePool[requestedGenre] === undefined ) {
            console.log("Trying to create pool");
            genrePool[requestedGenre] = {
                genreName: requestedGenre,
                genreCount: 1
            };

            console.log("Made pool item");

            let genreName = genrePool[requestedGenre].genreName;
            let genreCount = genrePool[requestedGenre].genreCount;

            runtime.brain.set("genrePool", genrePool);

            console.log("The pool item is set");

            chat.sendMessage(`"${genreName}" pool count is now: ${genreCount}`);
        } else if ( genrePool !== undefined ) {
            
            //If the genrePool already exists, add 1 to the Pool count
            genrePool[requestedGenre].genreCount = genrePool[requestedGenre].genreCount + 1;

            let genreName = genrePool[requestedGenre].genreName;
            let genreCount = genrePool[requestedGenre].genreCount;

            runtime.brain.set("genrePool", genrePool);

            chat.sendMessage(`"${genreName}" pool count is now: ${genreCount}`);
        }

        //If the Pool count hits 5, notify the streamer which genre wished to be heard
        if ( genrePool[requestedGenre].genreCount >= 5 ) {
            console.log("genre is greater than 5");

            say.speak("Victoria", "Requested genre: " + genrePool[requestedGenre].genreName);

            //Reset the requested song count
            genrePool[requestedGenre].genreCount = 0;
            runtime.brain.set("genrePool", genrePool);
        }
    }
}]