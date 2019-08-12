const diceSelector = {
    template: `
            <div class="container">

                <div class="row d-flex justify-content-around">
                    <input style="width: 60px;" type="number" class="form-control" name="quantity" v-model="bid.quantity">
                    <p> dices of </p>
                    <template v-for="diceFace in 6">
                        <label class="m-0">
                          <input class="dice-selector" type="radio" name="dice" v-bind:value="diceFace" v-model="bid.dice">
                          <span style="font-size: 3em;" v-bind:class="'dice dice-' + diceFace"></span>
                        </label>                                    
                    </template>                                  
                
                </div>


            </div>     
`,
    components: {

    },
    data() {
        return {
        }

    },
    props: ['bid', 'game'],
    computed: {
    },
    methods: {
        getMinQuantity: function () {
            if (this.game.current_bid) {
                if (this.game.is_palifico_round) {
                    return this.game.current_bid.quantity + 1;
                } else {
                    if (this.game.current_bid.dice === 1) {
                        if (this.bid.dice === 1) {
                            return this.game.current_bid.quantity + 1;
                        } else {
                            return this.game.current_bid.quantity * 2 + 1;
                        }
                    } else {
                        if (this.bid.dice === 1) {
                            return Math.floor((this.game.current_bid.quantity + 1) / 2);
                        } else if (this.bid.dice > this.game.current_bid.dice) {
                            return this.game.current_bid.quantity;
                        } else {
                            return this.game.current_bid.quantity + 1;
                        }
                    }
                }
            } else {
                return 1;
            }
        },
        updateQuantity: function (newValue) {
            const minQuantity = this.getMinQuantity();
            this.bid.quantity = newValue >= minQuantity ? newValue : minQuantity;
        }
    },
    filters: {
    },
    watch: {
        game: function (newGame) {
            this.updateQuantity(this.bid.quantity);
        },
        bid: {
            handler: function (newBid) {
                console.log(newBid);
                this.updateQuantity(newBid.quantity);
                this.$emit('update:bid', this.bid);
            },
            deep: true
        }
    },
    mounted: function () {
        console.log(this.bid);
        this.updateQuantity();

    },
    updated: function () {

    },
    destroyed: function () {

    }
};