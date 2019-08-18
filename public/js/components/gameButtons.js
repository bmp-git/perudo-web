const GameButtons = { 
 template: `<div class="col-12 col-sm-12 col-md-10 offset-md-1 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2 pl-0 pr-0">
                    <div class="row d-flex justify-content-around">
                            <template v-if="gameOver()">
                                <button type="button" @click="leaveGame" class="btn btn btn-danger ml-1 mr-1">Leave game</button>
                            </template>
                            <template v-else>
                                <button type="button" @click="doBid" class="btn btn-primary ml-1 mr-1" v-bind:disabled="!canBid()">Bid</button>
                                <button type="button" @click="doubt" class="btn btn-primary ml-1 mr-1" v-bind:disabled="!canDoubt()">Doubt</button>
                                <button type="button" @click="spotOn" class="btn btn-primary ml-1 mr-1" v-bind:disabled="!canSpotOn()">Spot on</button>
                                <button type="button" @click="palifico" class="btn btn-primary ml-1 mr-1" v-bind:disabled="!canPalifico()">Palifico</button>
                            </template>
                    </div>  
            </div>`,
 data() {
    return {
    }
 },
 props: ['game', 'bid'],
 computed: {
 },
 methods: {
    makeAction: function(action) {
        const authHeader = 'bearer '.concat(this.$store.state.token);
        axios.post("/api/games/" + this.game.id + "/actions/" + action, {}, {headers: { Authorization: authHeader}})
            .then(response => {
                console.log(action + "done!");
            })
            .catch(error => {
                console.log(error.response.data.message);
            });
     },
     doBid: function() {
        const authHeader = 'bearer '.concat(this.$store.state.token);
        axios.post("/api/games/" + this.game.id + "/actions/bids", {dice : this.bid.dice, quantity : this.bid.quantity}, {headers: { Authorization: authHeader}})
            .then(response => {
                console.log("bid done!");
                console.log(response.data);
            })
            .catch(error => {
                console.log(error.response.data.message);
            });
     },
     doubt: function() {
        this.makeAction("doubt");
     },
     spotOn: function() {
        this.makeAction("spoton");
     },
     palifico: function() {
        this.makeAction("palifico");
     },
     leaveGame: function() {
        if(this.game.users.find(u => u.id === this.$store.state.user._id)) {
            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.delete("/api/games/" + this.game.id, { headers: { Authorization: authHeader } })
               .then(response => {
                  store.commit('unsetGame');
                  router.push({ name: 'games' });
               })
               .catch(error => {
                  console.log(error);
               });
        } else {
            router.push({ name: 'games' });
        }
        
     },
     assert_is_my_turn: function() {
        return this.game.current_turn_user_id === this.$store.state.user._id;
     },
     assert_was_my_turn: function() {
        return this.game.last_turn_user_id === this.$store.state.user._id;
     },
     get_user_dices: function() {
        return this.game.users.find(u => u.id === this.$store.state.user._id).remaining_dice;
     },
     canBid: function() {
        return this.assert_is_my_turn();
     },
     canDoubt: function() {
        return this.assert_is_my_turn() && this.game.current_bid;
     },
     canSpotOn: function() {
        return (!this.assert_is_my_turn() &&
                !this.assert_was_my_turn() &&
                this.game.current_bid &&
                this.get_user_dices() < 5 &&
                this.get_user_dices() > 0);
     },
     canPalifico: function() {
        return (!this.game.current_bid &&
                this.get_user_dices() === 1 &&
                this.game.users.find(u => u.id === this.$store.state.user._id).can_palifico);
     },
     gameOver: function() {
        return this.game.is_over || this.get_user_dices() === 0;
    }
 }
}