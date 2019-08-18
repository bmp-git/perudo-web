var socket = io();
socket.on('you are connected', function (game_id) {
    socket.emit("online", localStorage.token);
});

//this fires every time a game is removed
socket.on('game removed', function (game_id) {
    console.log("game removed: " + game_id);
});
//this fires every time a game is added
socket.on('game added', function (game_id) {
    console.log("game added: " + game_id);
});
//this fires everytime the game changed
socket.on('game changed', function (game) {
    console.log("game changed: " + game.id + ", current tick: " + game.tick);
});
//this will fires every time a new action is posted (ex. messages, bids, turn change, end of round...)
socket.on('new action', function (game_id) {
    console.log("new action: " + game_id);
});

var setTokenTimeout = function (tokenData) {
    setTimeout(function () {
        const authHeader = 'bearer '.concat(localStorage.token);
        axios.get("/api/users/" + tokenData.user._id + "/token", { headers: { Authorization: authHeader } })
            .then(
                tokenRes => {
                    socket.emit("online", tokenRes.data.token);
                    store.commit('setToken', tokenRes.data.token);
                    var tokenData = JSON.parse(atob(tokenRes.data.token.split('.')[1]));
                    setTokenTimeout(tokenData);
                }
            );
    }, tokenData.exp * 1000 - Date.now() - 1000 * 90);
    console.log("Token refresh timer set in " + (Math.round((tokenData.exp * 1000 - Date.now() - 1000 * 90) / (60 * 1000))) + "  minutes");
}
var loadToken = function () {
    if (localStorage.token) {
        console.log("Loaded token from localstorage " + localStorage.token);
        store.commit('setToken', localStorage.token);

        var tokenData = JSON.parse(atob(localStorage.token.split('.')[1]));
        if ((tokenData.exp * 1000 - Date.now()) <= 1000 * 60) { //token expired or exipre in less than a minute, TODO: timezones?
            console.log("Token is expired");
            store.commit('unsetToken');
            socket.emit("offline");
        } else {
            setTokenTimeout(tokenData);
            socket.emit("online", localStorage.token);
        }
    }
}
var unloadToken = function() {
    socket.emit("offline", localStorage.token);
}
loadToken();

const app = new Vue({
    router,
    el: "#perudo",
    store,
    components: {
        'gamefooter': gameFooter,
        'navbar': Navbar
    },
    methods: {
    },
    mounted() {
        axios.get("/api/games")
            .then(response => {
                allGames = new Map();
                response.data.result.forEach(g => {
                    allGames.set(g.id, g);
                    if (g.users.some(u => u.id === this.$store.state.user._id)) {
                        console.log("sono in un game!")
                        store.commit('setGame', g);
                    }
                });
            })
            .catch(error => {
                console.log(error);
            });

    }
});
