const diceSelector = {
    template: `
            <div class="col-12 col-sm-12 col-md-10 offset-md-1 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2 pl-0 pr-0">



                <div class="row d-flex justify-content-around">

                        <div>
                            <button class="btn btn-primary m-2" v-bind:disabled="buttonMinusDisabled" @click.prevent="decrementQuantity"><i class="fa fa-minus"></i></button>
                            <strong class="align-self-center">{{bid.quantity}}</strong>
                            <button class="btn btn-primary m-2" @click.prevent="incrementQuantity"><i class="fa fa-plus"></i></button>
                        </div>
                    

                        <span class="align-self-center"> dices of </span>

                    
                    
                        <div ref="carousel" class="carousel">
                          
                            <template v-for="diceFace in 6">
                                <i v-bind:value="diceFace" class="carousel-item"><span style="font-size: 3em;" v-bind:class="'dice dice-' + diceFace"></span></i>                                   
                            </template>  
        
                        </div>

                                          
                                
                
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
        buttonMinusDisabled: function () {
            console.log(this.bid.quantity === this.getMinQuantity());
            return this.bid.quantity === this.getMinQuantity();
        }
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
        incrementQuantity: function() {
            this.bid.quantity = this.bid.quantity + 1;
        },
        decrementQuantity: function() {
            this.bid.quantity = this.bid.quantity - 1;
        },
        updateQuantity: function (newValue) {
            const minQuantity = this.getMinQuantity();
            this.bid.quantity = newValue >= minQuantity ? newValue : minQuantity;
        },
        selectedDiceChange: function (elem) {
            this.bid.dice = Number(elem.getAttribute('value'));
            console.log(this.getMinQuantity());
            this.bid.quantity = this.getMinQuantity();
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
        M.Carousel.init(this.$refs.carousel, {padding:20, onCycleTo: this.selectedDiceChange});
        this.updateQuantity();

    },
    updated: function () {

    },
    destroyed: function () {

    }
};