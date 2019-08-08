var allGames = new Map(); //game id -> game
const Games = {
    template: `
    <div class="container">
        <template v-for="game in games" :key="game_changed">
            <gameComponent :gameid="game.id"></gameComponent>
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
        
    },
    mounted: function () {
        axios.get("http://localhost:3000/api/games")
            .then(response => {
                this.games = response.data.result;
                this.game_changed = new Date();
                allGames = new Map();
                this.games.forEach(g => {
                    allGames.set(g.id, g);
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
};