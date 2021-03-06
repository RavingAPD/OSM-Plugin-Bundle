/*
 *Plugin deprecated since Bot version: x.x.x
 */

'use strict';

const runtime = require('../../utils/Runtime');

module.exports = [{
    types: ['message'],
    regex: /^(!|\/)(chelp|ccommands)$/,
    action: function( chat, stanza ) {
        var output = `
Custom Commands:

!op {@username} {#lvl} - Mod only - Gives the user a certain lvl.

!q {question} - all - Notifies the streamer that a question has been asked.

!rg {genre} - all - Creates a pool for a specific genre.

!rank - all - Prints out the users rank

!schedule - all - Prints out the schedule (**Does not work ATM**)
`;

        // Get our custom commands
        var customCommands = runtime.brain.get('customCommands') || {};
        var customCommandKeys = Object.keys( customCommands );

        if ( customCommandKeys.length > 0 ) {
            output += '\n\nCustom commands:\n';
            customCommandKeys.forEach( ( command ) => {
                output += '\n!' + command;
            } );
        }

        chat.sendMessage( output );
    }
}]
