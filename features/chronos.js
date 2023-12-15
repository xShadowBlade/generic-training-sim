Game.data.chronos = {
    currency: new Game.classes.currency(),
    lastReward: E(0),
    timewarp: E(0),
    timeLastPlayed: E(0),
}

Game.static.chronos = {
    currency: new Game.classes.currencyStatic(() => Game.data.chronos.currency),
}

//Daily Reward
Game.functions.claimDailyReward = (function () {
    let { chronos } = Game.data;
    return function (skipTime = false) {
        if (skipTime || chronos.lastReward.sub(Date.now()).mul(-1).gte(E(43200000))) { // 43200000 is 12 hours, checks if time elasped is greater
            chronos.lastReward = E(Date.now());
            return Game.static.chronos.currency.gain();
        }
    }
})()