const Game = {
    template: `
<div class="row">
    <div class="col-12 col-sm-12 col-md-10 offset-md-1 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
    <div class="card-body text-dark">
    <h6 class="card-title"><router-link :to="{ name: 'gamelobby', params: { id: gameid }}">{{game.name}}</router-link>&emsp;
        <template v-if="game.password != null"> <i class="fas fa-lock" data-toggle="tooltip" data-placement="bottom" title="Password needed"></i> </template> 
        <template v-else> <i class="fas fa-lock-open" data-toggle="tooltip" data-placement="bottom" title="No password needed"></i> </template>
        <i class="fas fa-stopwatch"></i> {{turnTime}}
        <p class="card-title float-right" data-toggle="tooltip" data-placement="bottom" v-bind:title="users"> players: {{usedSpaces}} </p>
    </h6>
    
    <p class="card-text"><small class="text-muted">Created {{game.game_creation_time | formatTime}} ago</small></p>
    <div class="row" style="margin-bottom:0px">
        <template v-for="user in game.users">
        <div class="col-4 col-md-2 text-center">

                <router-link :to="{ name: 'profile', params: { id: user.id }}">
                    <img v-bind:src="user.avatar_url" class="ig-avatar" width="64px" height="64px" style="object-fit: cover; border-radius: 50%; border: 2px solid #007BFF;">
                </router-link>

                <router-link :to="{ name: 'profile', params: { id: user.id }}" style="margin-bottom:0px">
                    <username :userid="user.id"></username>
                    <template v-if="game.owner_id === user.id">
                    <i class="fas fa-crown"></i>
                    </template>
                </router-link>

            </div>
        </template>
        <template v-for="i in freeSpaces" :key="i">
            <div class="col-4 col-md-2 text-center">
                <a href="" @click.prevent="joinGame">
                    <img src="/img/avatar"  class="ig-avatar" width="64px" height="64px" style="object-fit: cover; border-radius: 50%;">
                 </a>
                <a href="" @click.prevent="joinGame" style="color:black; text-decoration: none; background-color: none;">
                    <p>Empty</p>
                </a>
            </div>
        </template>
    </div>
    <template v-if="game.started">
        <button type="button" class="btn btn-primary btn-sm float-right" disabled>Game started</button>
    </template>
    <template v-if="userIsOwner && !game.started">
        <button type="button" @click.prevent="startGame" class="btn btn-primary btn-sm float-right">Start game!</button>
    </template>
    <template v-if="(!freeSpaceAvailable && !currentUserInside)">
        <button type="button" class="btn btn-primary btn-sm float-right" disabled>Join</button>
    </template>
    <template v-if="!currentUserInside">
        <div class="input-group-append float-right">
        <template v-if="game.password != null">
            <input v-model="inserted_password" type="password" v-bind:class="'form-control '+(password_wrong?'is-invalid':'')" placeholder="Password" required>
        </template>
        <button type="button" @click.prevent="joinGame" class="btn btn-primary btn-sm float-right ml-2">Join</button>
        </div>
    </template>
    <template v-if="currentUserInside">
        <button type="button" @click.prevent="leaveGame" class="btn btn-primary btn-sm float-right mr-2">Leave</button>
    </template>
    </div>
    <template v-if="includedivisor">
        <hr class="hr-text mb-0" data-content="">
    </template>
    </div>
   
</div>`,
    components: {
        'username': Username
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
            //send event to parent ==> parent says to all other child that a game is changed, update Join button
        },
        updateGameFromWeb: function () {
            console.log("refreshing game " + this.gameid + " from web");
            axios.get("/api/games/" + this.gameid)
                .then(response => {
                    this.updateGame(response.data.result);
                })
                .catch(error => {
                    console.log(error);
                });
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
                    } else if (operation === "join" && error.response.data.message === "You are already in another game.") {
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
                    router.push({ name: 'games' });
                })
                .catch(error => {
                    console.log(error);
                });
        },
        gameChanged: function (game) {
            if (game.id === this.gameid && game.tick > this.game.tick) {
                this.updateGameFromWeb();
            }
        },
        initialize: function() {
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
        freeSpaceAvailable: function () {
            return Object.keys(this.game.users).length < this.game.players;
        },
        userIsOwner: function () {
            return this.game.owner_id === this.$store.state.user._id;
        },
        usedSpaces: function () {
            return Object.keys(this.game.users).length + "/" + this.game.players;
        },
        freeSpaces: function () {
            return this.game.players - Object.keys(this.game.users).length;
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
                return this.game.turn_time + " s";
            } else {
                return "∞ s";
            }
        }
    }
}