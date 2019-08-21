const gameLobby = {
    template: `
            <div class="container">
            
            <template v-if="game.id !== null">
                    <template v-if="!game.started">
                    
                        <hr class="hr-text" v-bind:data-content="'Inside lobby: ' + game.name" />
                        
                        <gameComponent :gameid="game.id"></gameComponent>
                   
                    </template>
                    <template v-else>
                    <div class="container">
                        <div class="col-12 col-sm-12 col-md-10 offset-md-1 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2 pl-0 pr-0">
                        <hr class="hr-text" v-bind:data-content="'In game: ' + game.name" />

                        <div class="row row-with-margin">
                            <currentbid v-bind:game="game"></currentbid>
                        </div>

                        <template v-if="canPlay">
                            <div class="row row-with-margin">
                                <roundTimer v-bind:game="game" v-bind:refresh_time_ms="100"></roundTimer>
                            </div>
                        </template>

                        <div class="row row-with-margin">
                            <gameTurn v-bind:game="game"></gameTurn>
                        </div>

                        <template v-if="canPlay">
                            <div class="row row-with-margin">
                                <dice v-bind:game="game"></dice>
                            </div>

                            <div class="row row-with-margin">
                                <diceSelector v-bind:game="game" v-bind:bid.sync="this.bid"></diceSelector>
                            </div>
                        </template>

                        <div class="row row-with-margin">
                            <gameButtons v-bind:game="game" v-bind:bid="this.bid"></gameButtons>
                        </div>

                        
                        <div class="row row-with-margin">
                        <div class="col-12 col-sm-12 col-md-10 offset-md-1 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2 pl-0 pr-0" v-if="game.last_round_recap">
                            <div class="row d-flex justify-content-around">
                                <button type="button" @click="toggle_last_round" class="btn btn-primary btn-sm m-1">Last round</button>
                            </div>
                        </div>
                        </div>
                        <endOfRoundComponent ref="endOfRoundModal"></endOfRoundComponent>
                        </div>
                    </div>
                    </template>
                
                    <chat ref="chat" :gameid="game.id"></chat>
                
            </template>
        </div>     
`,
    components: {
        'gameComponent': Game,
        'chat': Chat,
        'diceSelector': diceSelector,
        'gameButtons': GameButtons,
        'gameTurn': gameTurn,
        'currentbid': currentBid,
        'dice': dice,
        'endOfRoundComponent': EndOfRoundModal,
        'roundTimer': roundTimer
    },
    data() {
        return {
            game: {
                id: null
            },
            bid: {
                dice: 1,
                quantity: 1
            }
        }

    },
    props: [],
    computed: {
        canPlay: function() {
            return !this.game.is_over && this.game.users.find(u => u.id === this.$store.state.user._id);
        }
    },
    methods: {
        reload: function (game_id) {
            Api.get_game(game_id, game => {
                if (game.round > this.game.round || (game.is_over === true && this.game.is_over === false)) {
                    this.$refs.endOfRoundModal.show(game);
                }
                this.game = game;
            }, error => {
                router.push("/404");
            });
        },
        gameChanged: function (game) {
            if (game.id === this.game.id) {
                this.reload(this.game.id);
            }
        },
        toggle_last_round: function () {
            this.$refs.endOfRoundModal.show(this.game);
        },
        game_removed: function (game_id) {
            if (this.game && game_id === this.game.id && this.$router.currentRoute.name === "gamelobby" && this.$route.params.id ===  this.game.id ) {
                router.push({ name: 'games' });
            }
        }
    },
    filters: {
    },
    watch: {
        $route: function (to, from) {
            if (to.name === 'gamelobby') {
                this.$refs.chat.scrollChatToBottom();
            }
        }
    },
    mounted: function () {
        socket.on('game changed', this.gameChanged);
        socket.on('game removed', this.game_removed);
        this.reload(this.$route.params.id);
    },
    destroyed: function () {
        socket.off('game changed', this.gameChanged);
        socket.off('game removed', this.game_removed);
    }
};