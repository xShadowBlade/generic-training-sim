const Game = {
    version: {
        saveAPI: 1,
        phase: "alpha",
        version: "0.1.0",
    },
    classes: {},
    data: {
        player: {
            state: ["idle", 0]
        },
    },
    functions: {
        console: [],
        start: [],
        loop: [],
    
        timewarp: t => Game["data"].playtime.timewarp = E(t),
    },
    static: {},
    settings: {
        framerate: 30,
        c2: false, //whether or not to display the "c^2" on formating eV
    },
    
    features: {}
}