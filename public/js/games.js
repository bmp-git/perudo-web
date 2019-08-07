const games = new Map(); //game id -> game
const Games = { template: `
<div class="row">
    <div class="col-md-4 offset-md-4">
    <div class="card border-dark mb-3" style="border-radius:.99rem!important">
    <div class="card-body text-dark">
    <h6 class="card-title">{{game.name}} &emsp;
        <template v-if="game.password != null"> <i class="fas fa-lock" data-toggle="tooltip" data-placement="bottom" title="Password needed"></i> </template> 
        <template v-else> <i class="fas fa-lock-open" data-toggle="tooltip" data-placement="bottom" title="No password needed"></i> </template>
        <i class="fas fa-stopwatch"></i> {{turnTime}}
        <p class="card-title float-right" data-toggle="tooltip" data-placement="bottom" v-bind:title="users"> players: {{usedSpaces}} </p>
    </h6>
    
    <p class="card-text"><small class="text-muted">Created by {{ownerUsername}} {{game.game_creation_time | formatTime}} ago</small></p>
    <div class="row">
        <template v-for="user in game.users">
            <div class="col">
                <p class="card-text" style="margin-bottom:0px">{{user.username}} </p>
                <img src="/static/img/avatar.png" class="ig-avatar" width="48px" height="48px">
            </div>
        </template>
    </div>
    <template v-if="game.started && freeSpaceAvailable">
        <button type="button" class="btn btn-primary btn-sm float-right" disabled>Join</button>
    </template>
    <template v-else>
        <button type="button" class="btn btn-primary btn-sm float-right">Join</button>
    </template>
    </div>
    </div>
    </div>
</div>`, 
data() {
    return {
        game: {
            name: "",
            players: 0,
            turn_time: 30,
            id: 0,
            password : null,
            owner_id: "",
            started: false,
            game_creation_time: "",
            users: [],
            tick: 0
        }
    }
},
methods: {
    updateGame: function(game) {
        this.game = game;
    }
},
mounted: function () {
    axios.get("http://localhost:3000/api/games/" + 0)
        .then(response => {
            this.updateGame(response.data.result);
        })
        .catch(error => {
            console.log(error);
        });
},
filters: {
    formatTime: function(value) {
        return moment.duration(moment().diff(value)).humanize();
    }
},
computed: {
    freeSpaceAvailable: function () {
      return Object.keys(this.game.users).length < this.game.players;
    },
    usedSpaces: function () {
      return Object.keys(this.game.users).length + "/" + this.game.players;
    },
    users: function () {
        var res = "";
        for(var user_index in this.game.users) {
           res += this.game.users[user_index].username + "\n"; 
        }
        return res;
    },
    ownerUsername: function () {
        for(var user_index in this.game.users) {
            if(this.game.users[user_index].id === this.game.owner_id) {
                return this.game.users[user_index].username;
            }
         }
    },
    turnTime : function () {
        console.log(this.game)
        if(this.game.turn_time) {
            return this.game.turn_time + " s";
        } else {
            return "∞ s";
        }
    }
  }
}