var allGames = new Map(); //game id -> game
const Games = {
    template: `
    <div class="container">
        <hr class="hr-text" data-content="All games" />
        <template v-if="!emptyList()">
            <template v-for="(val,index) in games_index.slice().reverse()">
                <template v-if="index === (games_index.length - 1)">
                    <gameComponent :gameid="val" includedivisor=""></gameComponent>
                </template>
                <template v-if="index < (games_index.length - 1)">
                    <gameComponent :gameid="val" includedivisor="true"></gameComponent>
                </template>
            </template>
        </template>
        <template v-else>
            <div class="empty-page">
                <template v-if="this.$store.state.authenticated">
                    <p> There aren't any games at the moment, create a new one clicking the plus button in the bottom right of this page! </p>
                </template>
                <template v-else>
                    <p> There aren't any games at the moment, in order to create a new game and play, please <router-link to="/signup">sign-up</router-link> and <router-link to="/signin">sign-in</router-link>!</p>
                </template>
            </div>
        </template>
        <template v-if="this.$store.state.authenticated && !isUserInGame">
            <button type="button" class="btn btn-primary btn-botton-right btn-circle btn-xl animated tada" @click.prevent="newGame"><i class="fas fa-plus"></i></button>
            <errorSuccessNotifier ref="new_game_notifier" class="mt-4"></errorSuccessNotifier>
        </template>
    </div>`,
    components: {
        'gameComponent': Game,
        'errorSuccessNotifier': errorSuccessNotifier
    },
    data() {
        return {
            games_index: [],
        }
    },
    computed: {
        isUserInGame: function () {
            return this.$store.state.in_game;
        }
    },
    methods: {
        emptyList: function() {
            return this.games_index.length === 0;
        },
        updateGames: function () {
            Api.get_games(games => {
                allGames = new Map();
                games.forEach(g => {
                    allGames.set(g.id, g);
                });
                this.games_index = games.map(g => g.id);
            });
        },
        newGame: function () {
            if(!this.isUserInGame) {
                router.push({ name: 'new_game' });
            } else {
                this.$refs.new_game_notifier.showError("Cannot create a new game while in another game", 1000);
            }
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
            if(this.$store.state.game && this.$store.state.game.id === game_id) {
                this.$store.commit('unsetGame');
            }
        });
        socket.on('game added', game_id => {
            Api.get_game(game_id, game => {
                allGames.set(game.id, game);
                this.games_index.push(game.id);
            });
        });
    }
};