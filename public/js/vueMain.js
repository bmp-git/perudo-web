var socket = io();
socket.on('you are connected', function () {
    if (localStorage.token) {
        socket.emit("online", localStorage.token);
    }
});
Api.get_online_users(users => {
    store.commit('setOnlineUsers', users);
    socket.on('new online or offline user', function () {
        Api.get_online_users(users => {
            store.commit('setOnlineUsers', users);
        });
    });
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

var setTokenTimeout = function (tokenData, server_date) {
    setTimeout(function () {
        Api.refresh_token(token => {
            socket.emit("online", token);
            store.commit('setToken', token);
            var newTokenData = JSON.parse(atob(token.split('.')[1]));
            Api.get_date(s_date => {
                setTokenTimeout(newTokenData, s_date);
            });
        });
    }, tokenData.exp * 1000 - server_date - 1000 * 60 * 60);
    console.log("Token refresh timer set in " + (Math.round((tokenData.exp * 1000 - server_date - 1000 * 60 * 60) / (60 * 1000))) + "  minutes");
}

let app = null;
var start_app = function () {
    app = new Vue({
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
            Api.get_games(games => {
                allGames = new Map();
                games.forEach(g => {
                    allGames.set(g.id, g);
                    if (g.users.some(u => u.id === this.$store.state.user._id)) {
                        store.commit('setGame', g);
                    }
                });
            });
        }
    });
}

var loadToken = function () {
    Api.get_date(server_date => {
        if (localStorage.token) {
            Api.refresh_token(
                token => {
                    store.commit('setToken', token);
                    var tokenData = JSON.parse(atob(token.split('.')[1]));
                    setTokenTimeout(tokenData, server_date);
                    socket.emit("online", token);
                },
                error => {
                    console.log("Token is expired");
                    store.commit('unsetToken');
                    socket.emit("offline");
                });
        }
        if (!app) {
            start_app();
        }
    }, error => { start_app(); });
}
var unloadToken = function () {
    socket.emit("offline", localStorage.token);
}
loadToken();


