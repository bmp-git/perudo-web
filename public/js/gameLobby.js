const gameLobby = {
    template: `
            <div class="container">
            
            <hr class="hr-text" v-bind:data-content="'Inside lobby: ' + game.name" />

            </div>     
`,
    data() {
        return {
            game : {}
        }
    },
    props: [],
    components: {
    },
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