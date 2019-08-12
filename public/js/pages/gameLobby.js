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
                        <currentbid v-bind:game="game"></currentbid>

                        <gameTurn v-bind:game="game"></gameTurn>
                        
                        <br/>
                        
                        <diceSelector v-bind:game="game"></diceSelector>
                        <gameButtons v-bind:game="game"></gameButtons>

                   
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
        'currentbid' : currentBid
    },
    data() {
        return {
            game: {
                id: null
            },
        }

    },
    props: [],
    computed: {
    },
    methods: {
        reload: function() {
            axios.get("/api/games/" + this.$route.params.id, { headers: { Authorization: 'bearer '.concat(this.$store.state.token) } })
                .then(response => {
                    this.game = response.data.result;
                    console.log(this.game);
                })
                .catch(error => {
                    router.push("/404")
                });
        },
        gameRemoved: function (game_id) {
            if (game_id === this.game.id) {
                router.push({ name: 'games' });
            }
        },
        gameChanged: function (game) {
            if (game.id === this.game.id) {
                this.reload();
            }
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
        socket.on('game removed', this.gameRemoved);
        socket.on('game changed', this.gameChanged);
        this.reload();
    },
    destroyed: function () {
        socket.off('game removed');
    }
};