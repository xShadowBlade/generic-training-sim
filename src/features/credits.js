Game.data.credits = {
    currency: new Game.classes.currency(),
}

Game.static.credits = {
    currency: new Game.classes.currencyStatic(() => Game.data.credits.currency),
}

Game.static.credits.currency.addUpgrade([
    {
        name: "Basic Stat Boost",
        cost: E(100),
        costScaling: n => Decimal.pow(1.2,scale(E(n),1e6,2,0)).mul(10).ceil(),
        maxLevel: E(1000),
        effect: function () {
            console.log(this);
            const level = this.getLevel();
            
            Game.static.stats.power.boost.bSet(
                "boostUpg1Credits",
                "Basic Stats Boost",
                "Basic Stats Boost",
                n => E(n).mul(Decimal.floor(Decimal.mul(0.5, level).mul(Decimal.ln(level)).add(level))),
                2
            );
        }
    }
]);

addLoopFunction((dt) => {
    Game.static.credits.currency.gain(dt);
    document.getElementById('credits').innerHTML = `🪙 | Credits: ${Game.data.credits.currency.value.format()}`;
});