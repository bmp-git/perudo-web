const GameButtons = { 
 template: `<div class="container">
                <div class="row d-flex justify-content-center m-1">
                        <button type="button" @click="bid" class="btn btn-primary m-1" v-bind:disabled="!canBid">Bid</button>
                        <button type="button" @click="doubt" class="btn btn-primary m-1" v-bind:disabled="!canDoubt">Dubt</button>
                        <button type="button" @click="spotOn" class="btn btn-primary m-1" v-bind:disabled="!canSpotOn">Spot on</button>
                        <button type="button" @click="palifico" class="btn btn-primary m-1" v-bind:disabled="!canPalifico">Palifico</button>
                </div>
            </div>`,
 data() {
    return {
    }
 },
 props: ['game', 'bid'],
 computed: {
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
        return (this.game.current_bid &&
                this.get_user_dices() === 1 &&
                this.game.users.find(u => u.id === this.$store.state.user._id).can_palifico);
    },
 },
 methods: {
    makeAction: function(action) {
        const authHeader = 'bearer '.concat(this.$store.state.token);
        axios.post("/api/games/" + this.game.gameid + "/actions/" + action, {headers: { Authorization: authHeader}})
            .then(response => {
                console.log(action + "done!");
            })
            .catch(error => {
                console.log(error.response.data.message);
            });
     },
     bid: function() {
        const authHeader = 'bearer '.concat(this.$store.state.token);
        axios.post("/api/games/" + this.game.gameid + "/actions/bid", {dice : this.bid.dice, quantity : this.bid.quantity}, {headers: { Authorization: authHeader}})
            .then(response => {
                console.log(action + "done!");
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
     assert_is_my_turn: function() {
        return this.game.current_turn_user_id === this.$store.state.user._id;
     },
     assert_was_my_turn: function() {
        return this.game.last_turn_user_id === this.$store.state.user._id;
     },
     get_user_dices: function() {
        return this.game.users.find(u => u.id === this.$store.state.user._id).remaining_dice >= 5;
     }
 }
}