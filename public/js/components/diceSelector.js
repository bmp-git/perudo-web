const diceSelector = {
    template: `
            <div class="container">

                <div class="row d-flex justify-content-around">
                    <input style="width: 60px;" type="number" class="form-control" name="quantity" v-bind:min="getMinQuantity" v-model="selectedQuantity">
                    <p> dices of </p>
                    <template v-for="diceFace in getDiceFaces">
                        <label class="m-0">
                          <input class="dice-selector" type="radio" name="dice" v-bind:value="diceFace" v-model="selectedFace">
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
            selectedFace: 1,
            selectedQuantity: 1
        }

    },
    props: ['game'],
    computed: {
        getDiceFaces: function () {
            var validDice = [];
            if (this.game.current_bid) {
                if (this.game.is_palifico_round) {
                    if (this.selectedQuantity > this.game.current_bid.quantity) {
                        validDice.push(this.game.current_bid.dice);
                    }
                } else {
                    if (this.game.current_bid.dice === 1) {
                        if (this.selectedQuantity > this.game.current_bid.quantity) {
                            validDice.push(1);
                        }
                        if (this.selectedQuantity > this.game.current_bid.quantity * 2) {
                            validDice.push(2, 3, 4, 5, 6);
                        }
                    } else {
                        if (this.selectedQuantity >= Math.floor((this.game.current_bid.quantity + 1) / 2)) {
                            validDice.push(1);
                        }
                        if (this.selectedQuantity > this.game.current_bid.quantity) {
                            validDice.push(2, 3, 4, 5, 6);
                        } else if (this.selectedQuantity === this.game.current_bid.quantity) {
                            validDice.push(this.game.current_bid.dice);
                        }
                    }
                }
            } else {
                validDice.push(1, 2, 3, 4, 5, 6);
            }
            return validDice;
        },
        getMinQuantity: function () {
            if (this.game.current_bid) {
                if (this.game.is_palifico_round) {
                    return this.current_bid.quantity + 1;
                } else {
                    if (this.game.current_bid.dice === 1) {
                        if (this.selectedFace === 1) {
                            return this.game.current_bid.quantity + 1;
                        } else {
                            return this.game.current_bid.quantity * 2 + 1;
                        }
                    } else {
                        if (this.selectedFace === 1) {
                            return Math.floor((this.game.current_bid.quantity + 1) / 2);
                        } else if (this.selectedFace > this.game.current_bid.dice) {
                            return this.game.current_bid.quantity;
                        } else {
                            return this.game.current_bid.quantity + 1;
                        }
                    }
                }
            } else {
                return 1;
            }
        }
    },
    methods: {

    },
    filters: {
    },
    watch: {

    },
    mounted: function () {

    },
    destroyed: function () {

    }
};