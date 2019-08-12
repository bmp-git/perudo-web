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
            selectedFace : 1,
            selectedQuantity : 1
        }

    },
    props: ['game'],
    computed: {
        getDiceFaces : function () {
            return [1, 2, 3, 4, 5, 6];
        },
        getMinQuantity: function () {
            return 2;
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