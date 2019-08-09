const gameLobby = {
    template: `
            <div class="container">
            
            <template v-if="game !== null">
                <hr class="hr-text" v-bind:data-content="'Inside lobby: ' + game.name" />
                
                <gameComponent :gameid="game.id"></gameComponent>
           
                <hr class="hr-text" data-content="Chat" />
                <chat ref="chat" :gameid="game.id"></chat>
            </template>

            </div>     
`,
    components: {
        'gameComponent': Game,
        'chat': Chat
    },
    data() {
        return {
            game: null,
        }

    },
    props: [],
    computed: {
    },
    methods: {

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
        if (allGames.get(this.$route.params.id)) {
            this.game = allGames.get(this.$route.params.id);
        } else {
            axios.get("/api/games/" + this.$route.params.id, { headers: { Authorization: 'bearer '.concat(this.$store.state.token) } })
                .then(response => {
                    this.game = response.data.result;
                })
                .catch(error => {
                    router.push("/404")
                });
        }
    }
};