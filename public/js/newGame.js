const NewGame = {
    template: `<div class="container">
        <form class="form-group">
            <hr class="hr-text" data-content="Create new Game">

            
            <div class="input-group mt-2">
                <div class="input-group-prepend">
                    <div class="input-group-text"><i class="fas fa-dice"></i></div>
                </div>
                <input v-model="game_info.name" type="text" v-bind:class="'form-control '+name_valid" placeholder="Game name">
            </div>
            <errorSuccessNotifier ref="name_notifier"></errorSuccessNotifier>

            <div class="input-group mt-2">
                <div class="input-group-prepend">
                    <div class="input-group-text"><i class="fas fa-users"></i></div>
                </div>
                <select v-bind:class="'form-control '+players_valid" v-model="game_info.players">
                    <option disabled value="0">Player number</option>
                    <option value="2">2 players</option>
                    <option value="3">3 players</option>
                    <option value="4">4 players</option>
                    <option value="5">5 players</option>
                    <option value="6">6 players</option>
                    <option value="7">7 players</option>
                    <option value="8">8 players</option>
                </select>
            </div>
            <errorSuccessNotifier ref="players_notifier"></errorSuccessNotifier>

            <div class="input-group mt-2">
                <div class="input-group-prepend">
                    <div class="input-group-text"><i class="fas fa-hourglass ml-1 mr-1"></i></div>
                </div>
                <select v-bind:class="'form-control '+time_valid" v-model="game_info.turn_time">
                    <option disabled value="0">Time per turn</option>
                    <option value="10">10 seconds</option>
                    <option value="15">15 seconds</option>
                    <option value="20">20 seconds</option>
                    <option value="25">25 seconds</option>
                    <option value="30">30 seconds</option>
                    <option value="40">40 seconds</option>
                    <option value="50">50 seconds</option>
                    <option value="60">1 minute</option>
                    <option value="120">2 minute</option>
                    <option value="300">5 minute</option>
                    <option value="600">10 minute</option>
                </select>
            </div>
            <errorSuccessNotifier ref="time_notifier"></errorSuccessNotifier>

            <div class="input-group mt-2">
                <div class="input-group-prepend">
                    <div class="input-group-text"><i class="fas fa-key ml-1"></i></div>
                </div>
                <input v-model="game_info.password" type="password" v-bind:class="'form-control '+password_valid" placeholder="Password (Optional)">
            </div>
            <errorSuccessNotifier ref="password_notifier"></errorSuccessNotifier>

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
            name_valid: "",
            password_valid: "",
            players_valid: "",
            time_valid: "",
            game_info: {
                name: "",
                players: 0,
                turn_time: 0,
                password: "",
            }
        }
    },
    methods: {
        create_game: function () {
            var error = false;
            if (this.game_info.name.length < 3 || this.game_info.name.length > 30) {
                this.$refs.name_notifier.showPersistentError("Please enter a name between 3 and 30 characters.");
                this.name_valid = "is-invalid";
                error = true;
            }
            if (this.game_info.password.length !== 0 && (this.game_info.password.length < 5 || this.game_info.password.length > 30)) {
                this.$refs.password_notifier.showPersistentError("Please enter a password between 5 and 30 characters.");
                this.password_valid = "is-invalid";
                error = true;
            }
            if (this.game_info.players === 0) {
                this.$refs.players_notifier.showPersistentError("Please select the players number.");
                this.players_valid = "is-invalid";
                error = true;
            }
            if (this.game_info.turn_time === 0) {
                this.$refs.time_notifier.showPersistentError("Please select the time per turn.");
                this.time_valid = "is-invalid";
                error = true;
            }

            if (!error) {
                const authHeader = 'bearer '.concat(this.$store.state.token);
                axios.post("/api/games/", this.game_info, { headers: { Authorization: authHeader } })
                    .then(response => {
                        this.$refs.notifier.showSuccess("Game created!");

                        this.game_info.name = "";
                        this.game_info.password = "";
                        this.game_info.players = 0;
                        this.game_info.turn_time = 0;

                        games.set(response.data.result.id, response.data.result);
                        router.push("/game/" + response.data.result.id);
                    })
                    .catch(error => {
                        this.$refs.notifier.showError(error.response.data.message);
                    });
            }
        },
    },
    computed: {
        name() {
            return this.game_info.name;
        },
        players() {
            return this.game_info.players;
        },
        password() {
            return this.game_info.password;
        },
        turn_time() {
            return this.game_info.turn_time;
        }
    },
    watch: {
        name() {
            if (this.game_info.name.length === 0) {
                this.name_valid = "";
                this.$refs.name_notifier.disappear();
            } else if (this.game_info.name.length < 3) {
                this.name_valid = "is-invalid";
                this.$refs.name_notifier.showError("Game name must be minimum 3 characters.");
            } else if (this.game_info.name.length > 30) {
                this.name_valid = "is-invalid";
                this.$refs.name_notifier.showError("Game name must be maximum 30 characters.");
            } else {
                this.name_valid = "";
                this.$refs.name_notifier.disappear();
            }
        },
        players() {
            if (this.game_info.players !== 0) {
                this.players_valid = "";
                this.$refs.players_notifier.disappear();
            }
        },
        turn_time() {
            if (this.game_info.turn_time !== 0) {
                this.time_valid = "";
                this.$refs.time_notifier.disappear();
            }
        },
        password() {
            if (this.game_info.password.length === 0) {
                this.password_valid = "";
                this.$refs.password_notifier.disappear();
            } else if (this.game_info.password.length < 5) {
                this.password_valid = "is-invalid";
                this.$refs.password_notifier.showError("Password must be minimum 5 characters.");
            } else if (this.game_info.password.length > 30) {
                this.password_valid = "is-invalid";
                this.$refs.npassword_notifier.showError("Password must be maximum 30 characters.");
            } else {
                this.password_valid = "";
                this.$refs.password_notifier.disappear();
            }
        }
    },
    filters: {
        limit: function (text, length) {
            return text.substring(0, length);
        }
    },
}