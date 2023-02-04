const child_process = require('child_process');

module.exports = {
    name: 'restart',
    group: 'moderation',
    deploy: false,
    description: "Commande de restart du bot",
    permission: "owner",
    hidden: false,
    place: "dm",
    options: undefined,
    async run() {
        console.log("Restarting...");
        child_process.exec("update-gab_bot.sh");
        process.exit(1);
    }
};
