Game.functions.move = (areaN, force = false) => {
    if (!force && Game.data.stats.power.value.lt(Game.training.format(areaN, 1).req)) { console.log(`You are not strong enough to withstand this area. (You need ${Game.training.format(areaN, 1).req.format()} power)`); return; }
    Game.data.player.state = ["idle", areaN];
    Game.static.stats.power.boost.bSet(
        "trainingArea",
        "Training Area",
        "Boost from training area",
        (n) => E(n).mul(Game.training.format(areaN, 1).mul),
        2
    );
    console.log(Game.training.format(areaN));
}
addStartFunction(() => Game.functions.move(Game.data.player.state[1]));