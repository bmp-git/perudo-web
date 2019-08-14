var allGames = new Map(); //game id -> game
const Games = {
    template: `
    <div class="container">
        <hr class="hr-text" data-content="All games" />
        <template v-for="(val,index) in games_index.slice().reverse()">
            <template v-if="index === (games_index.length - 1)">
                <gameComponent :gameid="val" includedivisor=""></gameComponent>
            </template>
            <template v-if="index < (games_index.length - 1)">
                <gameComponent :gameid="val" includedivisor="true"></gameComponent>
            </template>
        </template>
        <template v-if="this.$store.state.authenticated">
            <div class="row mt-5">
                <div class="col-12 col-sm-12 col-md-10 offset-md-1 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
                    <button type="button" class="btn btn-primary btn-circle btn-xl animated tada" @click.prevent="newGame" style="float: right"><i class="fas fa-plus"></i></button>
                    <errorSuccessNotifier ref="new_game_notifier" class="mt-4"></errorSuccessNotifier>
                </div>
            </div>
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
        },
        newGame: function () {
            if(!this.isUserInGame()) {
                router.push({ name: 'new_game' });
            } else {
                this.$refs.new_game_notifier.showError("Cannot create a new game while in another game", 1000);
            }
        },
        isUserInGame: function () {
            var result = false;
            allGames.forEach(g => {
                if (g.users.some(u => u.id === this.$store.state.user._id)) {
                    result = true;
                }
            });
            return result;
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