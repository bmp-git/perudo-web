const NewGame = {
    template: `<div class="container">
        <form class="form-group">
            <hr class="hr-text" data-content="Create new game!">

            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text" :state="true">Game name</div>
                </div>
                <input v-model="game_info.name" type="text" class="form-control" placeholder="Game name"
                    required>
            </div>

            <div class="input-group mb-2 mt-2">
                <div class="input-group-prepend">
                    <div class="input-group-text">Maximum player number</div>
                </div>
                <input v-model="game_info.players" type="number" class="form-control" placeholder="Maximun player number">
            </div>

            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text">Maximum turn time (second)</div>
                </div>
                <input v-model="game_info.turn_time" type="number" class="form-control" placeholder="Max turn time (seconds)">
            </div>

            <div class="input-group mb-2 mt-2">
                <div class="input-group-prepend">
                    <div class="input-group-text">Password</div>
                </div>
                <input v-model="game_info.password" type="password" class="form-control" placeholder="Password">
            </div>

            <errorSuccessNotifier ref="notifier"></errorSuccessNotifier>
            <div class="form-group" style="padding-top:10px">
                <input type="button" @click.prevent="create_game" class="btn btn-primary btn-lg btn-block" value="Create game!">
            </div>
        </form>
    </div>`,
    components: {
        'errorSuccessNotifier': errorSuccessNotifier
    },
    data() {
        return {
            game_info: {
                name: "",
                players: 5,
                turn_time: 600,
                password: null,
            }
        }
    },
    methods: {
        create_game: function () {
            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.post("/api/games/", this.game_info, {headers: { Authorization: authHeader}})
                .then(response => {
                    this.$refs.notifier.showSuccess("Game created!");

                    this.game_info.name = "";
                    this.game_info.password = "";

                    games.set(response.data.result.id, response.data.result);
                    router.push("/game/" + response.data.result.id);
                })
                .catch(error => {
                    this.$refs.notifier.showError(error.response.data.message);
                });
        },
    },
    mounted: function () {

    },
    filters: {
        limit: function (text, length) {
            return text.substring(0, length);
        }
    },
}