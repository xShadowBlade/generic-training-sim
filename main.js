let timestamp = E(Date.now());
let deltaT = E(0);
const temp = {

}
// addLoopFunction("time", function(dt) {
//     Game["data"].playtime.tActive.plus(dt);
//     Game["data"].playtime.tPassive.plus(dt);
//     Game["data"].playtime.active = Game["data"].playtime.active.plus(Game["data"].playtime.boost.calculate().times(dt));
//     Game["data"].playtime.passive = Game["data"].playtime.passive.plus(Game["data"].playtime.boost.calculate().times(dt));
//     Game["data"].playtime.points = Game["data"].playtime.points.plus(Game["data"].playtime.boost.calculate().times(dt));
// });
function addLoopFunction(func) {Game["functions"].loop.push(func)}
function addStartFunction(func) {Game["functions"].start.push(func)}
function addConsoleFunction(func) {Game["functions"].console.push(func)}
function main () { //t = no decimal
    deltaT = (E(Date.now()).sub(timestamp)).plus(Game["data"].chronos.timewarp); //Time since last update (scale factor)
    Game["data"].chronos.timewarp = E(); //reset timewarp
    timestamp = E(Date.now());
    for (let i = 0; i < Game.functions.loop.length; i++) Game.functions.loop[i](deltaT);
    // console.clear();
    for (let i = 0; i < Game.functions.console.length; i++) Game.functions.console[i](deltaT);
}

window.addEventListener("load", () => {
    setInterval(main, 1000 / Game.settings.framerate); 
    Game.dataManagement.loadData(); 
    for (let i = 0; i < Game.functions.start.length; i++) Game.functions.start[i](); 
});