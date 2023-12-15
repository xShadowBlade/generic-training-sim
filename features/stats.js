Game.data.stats = {
    power: new Game.classes.currency(),
}

Game.static.stats = {
    power: new Game.classes.currencyStatic(() => Game.data.stats.power),
}

addLoopFunction((dt) => {
    Game.static.stats.power.gain(dt);
    document.getElementById('power').innerHTML = `✊ | Power: ${Game.data.stats.power.value.format()}`;
});