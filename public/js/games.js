var allGames = new Map(); //game id -> game
var socket = io();
const Games = {
    template: `
    <div class="container">
        <template v-for="game in games" :key="game_changed">
            <gameComponent :gameid="game.id" includedivisor="true"></gameComponent>
        </template>
    </div>`,
    components: {
        'gameComponent': Game
    },
    data() {
        return {
            games: [],
            game_changed: null,
        }
    },
    methods: {
        updateGames: function () {
            axios.get("http://localhost:3000/api/games")
                .then(response => {
                    allGames = new Map();
                    response.data.result.forEach(g => {
                        allGames.set(g.id, g);
                    });
                    this.games = response.data.result;
                    this.game_changed = new Date();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },
    mounted: function () {
        this.updateGames();
        socket.on('game removed', game_id => {
            /*allGames.delete(game_id);
            for (var i = 0; i < this.games.length; i++) {
                if (this.games[i].id === game_id) {
                    Vue.delete(this.games, i);
                    this.game_changed = new Date();
                    console.log(this.games);
                }
            }*/ //TODO investigate why it's not working
            this.games = [];
            this.updateGames();
        });
        socket.on('game added', game_id => {
            axios.get("http://localhost:3000/api/games/" + game_id)
                .then(response => {
                    allGames.set(response.data.result.id, response.data.result);
                    this.games.push(response.data.result);
                    this.game_changed = new Date();
                })
                .catch(error => {
                    console.log(error);
                });
        });
    }
};