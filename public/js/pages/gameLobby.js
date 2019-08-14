const gameLobby = {
    template: `
            <div class="container">
            
            <template v-if="game.id !== null">
                    <template v-if="!game.started">
                    
                        <hr class="hr-text" v-bind:data-content="'Inside lobby: ' + game.name" />
                        
                        <gameComponent :gameid="game.id"></gameComponent>
                   
                    </template>
                    <template v-else>
                    
                        <hr class="hr-text" v-bind:data-content="'In game: ' + game.name" />
                        <roundTimer v-bind:game="game" v-bind:refresh_time_ms="100"></roundTimer>

                        <currentbid v-bind:game="game"></currentbid>

                        <gameTurn v-bind:game="game"></gameTurn>
                        
                        <hr class="hr-text" data-content="My dice" />
                        
                        <dice v-bind:game="game"></dice>
                        
                        <hr class="hr-text" data-content="Actions" />
                        
                        <diceSelector v-bind:game="game" v-bind:bid.sync="this.bid"></diceSelector>
                        <gameButtons v-bind:game="game" v-bind:bid="this.bid"></gameButtons>
                        <endOfRoundComponent ref="endOfRoundModal"></endOfRoundComponent>
                        <template v-if="game.last_round_recap">
                            <button type="button" @click="toggle_last_round" class="btn btn-primary m-1">Last round</button>
                        </template>
                   
                    </template>
                
                    <hr class="hr-text" data-content="Chat" />
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
        'currentbid' : currentBid,
        'dice': dice,
        'endOfRoundComponent' : EndOfRoundModal,
        'roundTimer' : roundTimer
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
    },
    methods: {
        reload: function(game_id) {
            axios.get("/api/games/" + game_id, { headers: { Authorization: 'bearer '.concat(this.$store.state.token) } })
                .then(response => {
                    if(response.data.result.round > this.game.round || (response.data.result.is_over === true && this.game.is_over === false)) {
                        this.$refs.endOfRoundModal.show(response.data.result);
                    }
                    this.game = response.data.result;
                })
                .catch(error => {
                    console.log(error);
                    router.push("/404")
                });
        },
        gameChanged: function (game) {
            if (game.id === this.game.id) {
                this.reload(this.game.id);
            }
        },
        toggle_last_round: function () {
            this.$refs.endOfRoundModal.show(this.game);
        }
    },
    filters: {
    },
    watch: {
        $route: function(to, from) {
            if(to.name === 'gamelobby') {
                this.$refs.chat.scrollChatToBottom();
            }
        }
    },
    mounted: function () {
        socket.on('game changed', this.gameChanged);
        this.reload(this.$route.params.id);
    },
    destroyed: function () {
        socket.off('game changed');
    }
};