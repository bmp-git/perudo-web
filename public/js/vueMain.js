if (localStorage.token) {
    console.log("Loaded token from localstorage " + localStorage.token);
    store.commit('setToken', localStorage.token);
}
if(localStorage.game) {
    axios.get("/api/games/" + localStorage.game)
        .then(response => {
            console.log("Loaded game from localstorage " + localStorage.game);
            store.commit('setGame', response.data.result);
        })
        .catch(error => {
            //ignore
        });
}

const app = new Vue({
    router,
    el: "#perudo",
    store,
    components : {
        'gamefooter' : gameFooter,
        'navbar' : Navbar
    },
    methods: {
    },
    mounted() {
        axios.get("/api/games")
            .then(response => {
                allGames = new Map();
                response.data.result.forEach(g => {
                    allGames.set(g.id, g);
                });
            })
            .catch(error => {
                console.log(error);
            });

    }
});


var socket = io();
//this fires every time a game is removed
socket.on('game removed', function (game_id) {
    console.log("game removed: " + game_id);
});
//this fires every time a game is added
socket.on('game added', function (game_id) {
    console.log("game added: " + game_id);
});
//this fires everytime the game changed
//when game starts will receive last 'game changed',
//if interested in receive 'game changed' furthermore ==> socket.emit('watch game', game_id);
//on game finish ==> socket.emit('ununwatch game', game_id);
socket.on('game changed', function (game) {
    console.log("game changed: " + game.id + ", current tick: " + game.tick);
});
//if called socket.emit('watch game', game_id); this will fires
//every time a new action is posted (ex. messages, bids, turn change, end of round...)
socket.on('new action', function (game_id) {
    console.log("new action: " + game_id);
});

socket.emit('watch game', 0);
//socket.emit('unwatch game', 0);

//socket.off('game added');