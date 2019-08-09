var allGames = new Map(); //game id -> game
var socket = io();
const Games = {
    template: `
    <div class="container">
        <hr class="hr-text" data-content="All games" />
        <template v-for="(val,index) in games_index">
            <template v-if="index === (games_index.length - 1)">
                <gameComponent :gameid="val" includedivisor=""></gameComponent>
            </template>
            <template v-if="index < (games_index.length - 1)">
                <gameComponent :gameid="val" includedivisor="true"></gameComponent>
            </template>
        </template>
    </div>`,
    components: {
        'gameComponent': Game
    },
    data() {
        return {
            games_index: [],
        }
    },
    methods: {
        updateGames: function () {
            axios.get("/api/games")
                .then(response => {
                    allGames = new Map();
                    response.data.result.forEach(g => {
                        allGames.set(g.id, g);
                    });
                    this.games_index = response.data.result.map(g => g.id);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },
    mounted: function () {
        this.updateGames();
        socket.on('game removed', game_id => {
            allGames.delete(game_id);
            for (var i = 0; i < this.games_index.length; i++) {
                if (this.games_index[i] === game_id) {
                    Vue.delete(this.games_index, i);
                }
            } 
        });
        socket.on('game added', game_id => {
            axios.get("/api/games/" + game_id)
                .then(response => {
                    allGames.set(response.data.result.id, response.data.result);
                    this.games_index.push(response.data.result.id);
                })
                .catch(error => {
                    console.log(error);
                });
        });
    }
};