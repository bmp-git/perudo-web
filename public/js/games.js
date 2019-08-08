const games = new Map(); //game id -> game
var socket = io();
const Games = {
    template: `
<div class="row">
    <div class="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
    <div class="card border-dark mb-3" style="border-radius:.99rem!important">
    <div class="card-body text-dark">
    <h6 class="card-title">{{game.name}} &emsp;
        <template v-if="game.password != null"> <i class="fas fa-lock" data-toggle="tooltip" data-placement="bottom" title="Password needed"></i> </template> 
        <template v-else> <i class="fas fa-lock-open" data-toggle="tooltip" data-placement="bottom" title="No password needed"></i> </template>
        <i class="fas fa-stopwatch"></i> {{turnTime}}
        <p class="card-title float-right" data-toggle="tooltip" data-placement="bottom" v-bind:title="users"> players: {{usedSpaces}} </p>
    </h6>
    
    <p class="card-text"><small class="text-muted">Created by {{ownerUsername}} {{game.game_creation_time | formatTime}} ago</small></p>
    <div class="row" style="margin-bottom:25px">
        <template v-for="user in game.users">
            <div class="col">
                <a v-bind:href="'/profile/'+user.id" style="margin-bottom:0px">
                    <img v-bind:src="user.avatar_url" class="ig-avatar" width="48px" height="48px" style="object-fit: cover; border-radius: 50%;">
                </a>
                <a v-bind:href="'/profile/'+user.id" style="margin-bottom:0px">{{user.username}} </a>
                <!--<p class="card-text" style="margin-bottom:0px">{{user.username}} </p>-->
            </div>
        </template>
    </div>
    <template v-if="game.started">
        <button type="button" class="btn btn-primary btn-sm float-right" disabled>Game started</button>
    </template>
    <template v-if="userIsOwner && !game.started">
        <button type="button" @click.prevent="startGame" class="btn btn-primary btn-sm float-right">Start game!</button>
    </template>
    <template v-if="!freeSpaceAvailable && !currentUserInside">
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
    </div>
    </div>
</div>`,
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
        },
        operateInGame: function (operation) {
            const authHeader = 'bearer '.concat(this.$store.state.token);
            var body = this.game.password == null ? { operation: operation } : { operation: operation, password: this.inserted_password };
            axios.put("/api/games/" + this.game.id, body, { headers: { Authorization: authHeader } })
                .then(response => {
                    //if start need to route in game
                    this.updateGame(response.data.result);
                })
                .catch(error => {
                    if (operation === "join" && error.response.status == 403) {
                        this.password_wrong = true;
                    }
                    console.log(error.response);
                    console.log(error.response.data.message);
                });
        },
        joinGame: function () {
            this.operateInGame("join");
        },
        startGame: function () {
            if (this.userIsOwner) {
                this.operateInGame("start");
            }
        },
        leaveGame: function () {
            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.delete("http://localhost:3000/api/games/" + 0, { headers: { Authorization: authHeader } })
                .then(response => {
                    this.updateGame(response.data.result);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        gameChanged: function (game) {
            if(game.id === this.game.id && game.tick > this.game.tick) {
                axios.get("http://localhost:3000/api/games/" + 0)
                .then(response => {
                    this.updateGame(response.data.result);
                })
                .catch(error => {
                    console.log(error);
                });
            }
        }
    },
    destroyed: function() {
        socket.off('game changed', this.gameChanged);
    },
    mounted: function () {
        socket.on('game changed', this.gameChanged);
        axios.get("http://localhost:3000/api/games/" + 0)
            .then(response => {
                this.updateGame(response.data.result);
            })
            .catch(error => {
                console.log(error);
            });
    },
    filters: {
        formatTime: function (value) {
            return moment.duration(moment().diff(value)).humanize();
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