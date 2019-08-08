const Profile = {
    template: `
        <div class="container">
                
                <hr class="hr-text" data-content="Player info" />
                
                <div class="row">
                    <div class="col-md-2 offset-md-3">
                        <profileImageSelector :userid="this.$route.params.id"></profileImageSelector>
                    </div>
                    <div class="col-md-4">
                        <h2>{{user.username}}</h2>
                        <h4>Italy</h4>
                    </div>
                </div>
                              

                <hr class="hr-text" data-content="Ranking" />
                
                
                <div class="row">
                    <div class="col-md-3 offset-md-3">
                        <p>Chart</p>                                          
                    </div>
                    <div class="col-md-3">
                        Global ranking: 2039 <br>
                        Country ranking: 234 <br>
                        Points: {{user.points}} <br>                                     
                    </div>
                </div>
                

                <hr class="hr-text" data-content="Stats" />

                
                <div class="row">
                    <div class="col-md-6 offset-md-3">
                        
                        Member since: {{user.registeredDate | formatDate}} <br>
                        Last stat reset: {{user.lastReset | formatDate}} <br>
                        Total play time: {{user.totalPlayTime}} hours <br>
                        Play time since reset: {{user.playTime}} hours <br>
                        Play count: {{user.wins + user.losses}} <br>
                        Wins: {{user.wins}} <br>
                        Losses: {{user.losses}} <br>
                        Win/Loss ratio: {{user.wins | ratio(user.losses)}} <br>                                   
                    </div>           
                         
                </div>
                
                <hr class="hr-text" data-content="Play History" />
                
                <div class="row">
                    <div class="col-md-6 offset-md-3">
                        Chart <br>                                
                    </div>           
                         
                </div>
                
        </div>
`,
    components: {
        'profileImageSelector': profileImageSelector
    },
    data() {
        return {
            user: {
                username: "",
                registeredDate: "",
                lastReset: "",
                points: 0,
                wins: 0,
                losses: 0,
                playTime: 0,
                totalPlayTime: 0,
                avatar: ""
            }

        }
    },
    methods: {
        reload: function () {
            axios.get("/api/users/" + this.$route.params.id + "/info")
                .then(response => {
                    this.user = response.data.user
                })
                .catch(error => {
                    router.push("/404")
                });
        }
    },
    watch: {
        $route: function(to, from) {
            if(to.name === 'profile') {
                this.reload();
            }
        }
    },
    filters: {
        formatDate: function(value) {
            if (value) {
                return moment(String(value)).format("MM/DD/YYYY");
            }
        },
        ratio: function(wins, losses) {
            if (losses > 0) {
                return (wins / losses).toFixed(2);
            } else {
                return '*';
            }
        }
    },
    mounted: function () {
        this.reload();
    }
};