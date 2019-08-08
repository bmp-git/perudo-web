const gameLobby = {
    template: `
            <div class="container">
            
            <hr class="hr-text" v-bind:data-content="'Inside lobby: ' + game.name" />
            
            <gameComponent :gameid="game.id"></gameComponent>
            
            <hr class="hr-text" data-content="Chat" />
            <chat :gameid="game.id"></chat>

            </div>     
`,
    components: {
        'gameComponent': Game,
        'chat': Chat
    },
    data() {
        return {
            game: null
        }

    },
    props: [],
    computed: {
    },
    methods: {

    },
    filters: {
    },
    mounted: function () {
        axios.get("/api/games/" + this.$route.params.id, { headers: { Authorization: 'bearer '.concat(this.$store.state.token) } })
            .then(response => {
                this.game = response.data.result;
                console.log(response);
            })
            .catch(error => {
                router.push("/404")
            });
    }
};