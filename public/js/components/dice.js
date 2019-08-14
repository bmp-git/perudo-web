var dice_animation = 'animated bounceInLeft'
const dice = {
    template: `
            <div class="col-12 col-sm-12 col-md-10 offset-md-1 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2 pl-0 pr-0">
                    <div class="row justify-content-around" v-bind:class="dice_class">
                        <template v-for="diceFace in this.dice">   
                        <span style="font-size: 3em;" v-bind:class="'dice dice-' + diceFace"></span>                                 
                        </template>  
                    </div>

            </div>   
`,
    components: {

    },
    data() {
        return {
            dice : [],
            dice_class : dice_animation
        }

    },
    props: ['game'],
    computed: {
    },
    methods: {
        update: function () {
            this.dice_class = dice_animation;
            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.get("/api/games/" + this.game.id + "/dice", { params: {round:this.game.round}, headers: { Authorization: authHeader}})
                .then(response => {
                    this.dice = response.data.result.find( elem => elem.user === this.$store.state.user._id).dice;
                })
                .catch(error => {
                    console.log(error.response.data.message);
                });
        }
    },
    filters: {
    },
    watch: {
        game: function (newGame, oldGame) {
            this.dice_class = '';
            if(newGame.round !==  oldGame.round) {
                this.update();
            }
        }
    },
    mounted: function () {
        this.update();
    },
    updated: function () {

    },
    destroyed: function () {

    }
};