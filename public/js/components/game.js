const Game = {
    template: `
<div class="row">
    <div class="col-12 col-sm-12 col-md-10 offset-md-1 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
            <gameBadge v-bind:game="game"></gameBadge>
        
            <h6 class="card-title">
            <template v-if="this.$store.state.authenticated">
                <router-link :to="{ name: 'gamelobby', params: { id: gameid }}">{{game.name}}</router-link>&emsp;
            </template>
            <template v-else>
                <a href="#" class="mr-3">{{game.name}}</a>
            </template>
            <template v-if="game.password != null"> <i class="fas fa-lock mr-3" data-toggle="tooltip" data-placement="bottom" title="Password needed"></i> </template> 
            <template v-else> <i class="mr-3 fas fa-lock-open" data-toggle="tooltip" data-placement="bottom" title="No password needed"></i> </template>
            
            <i class="fas fa-stopwatch" title="Maximum time per turn"> </i> <small>{{turnTime}}</small>
            <i class=" fas fa-users ml-3" title="Number of users"> </i><small> {{usedSpaces}} </small>

            <template v-if="this.$store.state.authenticated">
                <template v-if="game.started">
                    <button type="button" class="btn btn-primary btn-sm float-right" disabled>Game started</button>
                </template>
                <template v-else>
                    <template v-if="userIsOwner">
                        <button type="button" @click.prevent="startGame" class="btn btn-primary btn-sm float-right" v-bind:disabled="userNumber < 2">Start game!</button>
                    </template>
                    <template v-if="!currentUserInside">
                        <div class="input-group-append float-right">
                            <template v-if="game.password != null">
                                <input v-model="inserted_password" type="password" :disabled="(!freeSpaceAvailable && !currentUserInside)" v-bind:class="'form-control '+(password_wrong?'is-invalid':'')" placeholder="Password" required>
                            </template>
                            <button type="button" @click.prevent="joinGame" :disabled="(!freeSpaceAvailable && !currentUserInside)" class="btn btn-primary btn-sm float-right ml-2">Join</button>
                        </div>
                    </template>
                </template>
                <template v-if="currentUserInside">
                    <button type="button" @click.prevent="leaveGame" class="btn btn-primary btn-sm float-right mr-2">Leave</button>
                </template>
                <template v-else>
                    <button type="button" @click.prevent="spectateGame" class="btn btn-secondary btn-sm float-right mr-2">Spectate</button>
                </template>
            </template>
            </h6>

    <p class="card-text" data-toggle="tooltip" data-placement="bottom" v-bind:title="game.game_creation_time | formatTimeTooltip"><small class="text-muted">Created {{game.game_creation_time | formatTime}} ago</small></p>
    <div class="row" style="margin-bottom:0px">
        <template v-for="user in game.users" v-bind:key="user.id">
        <div class="col-4 col-md-2 text-center pl-3 pr-3 animated bounceIn">
                <div class="animated bounceIn">
                    <router-link :to="{ name: 'profile', params: { id: user.id }}">
                        <useravatar v-bind:userid="user.id" size="64" show_status="true"></useravatar> 
                    </router-link>

                    <router-link :to="{ name: 'profile', params: { id: user.id }}" style="margin-bottom:0px">
                        <username :userid="user.id"></username>
                        <template v-if="game.owner_id === user.id">
                        <i class="fas fa-crown"></i>
                        </template>
                    </router-link>
                </div>
            </div>
        </template>
        
        <template v-if="!game.is_over && !game.started" v-for="i in freeSpaces" v-bind:key="i">
            <div class="col-4 col-md-2 text-center animated fadeIn">
                <a href="" @click.prevent="joinGame">
                    <useravatar size="64"></useravatar> 
                </a>
                <a href="" @click.prevent="joinGame" style="color:black; text-decoration: none; background-color: none;">
                    <p><i>Empty</i></p>
                </a>
            </div>
        </template>
        
    </div>
    <template v-if="includedivisor">
        <hr class="hr-text mb-4 mt-0" data-content="">
    </template>
    </div>
   
</div>`,
    components: {
        'username': Username,
        'useravatar': Useravatar,
        'gameBadge': gameBadge
    },
    props: ['gameid', 'includedivisor'],
    data() {
        return {
            inserted_password: "",
            password_wrong: false,
            game: {
                name: "",
                players: 0,
                turn_time: 30,
                id: 0,
                password: null,
                owner_id: "",
                started: false,
                game_creation_time: "",
                users: [],
                tick: 0
            }
        }
    },
    methods: {
        updateGame: function (game) {
            this.game = game;
            allGames.set(this.gameid, game);
            if (this.currentUserInside) {
                store.commit('setGame', game);
            }
        },
        updateGameFromWeb: function () {
            console.log("refreshing game " + this.gameid + " from web");
            Api.get_game(this.gameid, game => this.updateGame(game));
        },
        joinStartGame: function (operation) {
            const authHeader = 'bearer '.concat(this.$store.state.token);
            var body = this.game.password == null ? { operation: operation } : { operation: operation, password: this.inserted_password };
            axios.put("/api/games/" + this.game.id, body, { headers: { Authorization: authHeader } })
                .then(response => {
                    this.updateGame(response.data.result);
                    if (operation === "join") {
                        router.push({ name: 'gamelobby', params: { id: response.data.result.id } });
                    }
                })
                .catch(error => {
                    if (operation === "join" && error.response.status === 403) {
                        this.password_wrong = true;
                    } else if (operation === "join" && error.response.data.error_code === 12) {
                        //Leave other game and re-join this game
                        const authHeader = 'bearer '.concat(this.$store.state.token);
                        var result = "null";
                        allGames.forEach(g => {
                            if (g.id !== this.gameid && g.users.some(u => u.id === this.$store.state.user._id)) {
                                result = g.id;
                            }
                        });
                        if (result !== "null") {
                            axios.delete("/api/games/" + result, { headers: { Authorization: authHeader } })
                                .then(response => {
                                    this.joinGame();
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        }
                    }
                    console.log(error.response.data.message);
                });
        },
        joinGame: function () {
            if (!this.game.users.some(u => u.id == this.$store.state.user._id)) {
                this.joinStartGame("join");
            }
        },
        startGame: function () {
            if (this.userIsOwner) {
                this.joinStartGame("start");
            }
        },
        leaveGame: function () {
            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.delete("/api/games/" + this.gameid, { headers: { Authorization: authHeader } })
                .then(response => {
                    this.updateGame(response.data.result);
                    store.commit('unsetGame');
                    if (this.$router.currentRoute.name !== "games") {
                        router.push({ name: 'games' });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        spectateGame: function () {
            router.push({ name: 'gamelobby', params: { id: this.gameid } });
        },
        gameChanged: function (game) {
            if (game.id === this.gameid && game.tick > this.game.tick) {
                this.updateGameFromWeb();
            }
        },
        initialize: function () {
            socket.on('game changed', this.gameChanged);
            var cachedGame = allGames.get(this.gameid);
            //console.log(this.gameid);
            if (cachedGame) {
                this.updateGame(cachedGame);
            } else {
                this.updateGameFromWeb();
            }
        }
    },
    destroyed: function () {
        socket.off('game changed', this.gameChanged);
    },
    mounted: function () {
        this.initialize();
    },
    filters: {
        formatTime: function (value) {
            return moment.duration(moment().diff(value)).humanize();
        },
        formatTimeTooltip: function (value) {
            return moment(value).format('LLL');
        }
    },
    watch: {
        gameid: function (val) {
            this.initialize();
        }
    },
    computed: {
        currentUserInside: function () {
            var id = this.$store.state.user._id;
            for (var user_index in this.game.users) {
                if (this.game.users[user_index].id === id) {
                    return true;
                }
            }
            return false;
        },
        userNumber: function () {
            return Object.keys(this.game.users).length;
        },
        freeSpaceAvailable: function () {
            return this.userNumber < this.game.players;
        },
        userIsOwner: function () {
            return this.game.owner_id === this.$store.state.user._id;
        },
        usedSpaces: function () {
            return this.userNumber + "/" + this.game.players;
        },
        freeSpaces: function () {
            return this.game.players - this.userNumber;
        },
        users: function () {
            var res = "";
            for (var user_index in this.game.users) {
                res += this.game.users[user_index].username + "\n";
            }
            return res;
        },
        ownerUsername: function () {
            for (var user_index in this.game.users) {
                if (this.game.users[user_index].id === this.game.owner_id) {
                    return this.game.users[user_index].username;
                }
            }
        },
        turnTime: function () {
            if (this.game.turn_time) {
                if (this.game.turn_time % 60 === 0) {
                    return (this.game.turn_time / 60) + " min";
                } else if (this.game.turn_time > 60) {
                    return (this.game.turn_time / 60 | 0) + " min " + (this.game.turn_time % 60) + " sec";
                }
                return this.game.turn_time + " sec";
            } else {
                return "∞ s";
            }
        }
    }
}