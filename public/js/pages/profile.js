const Profile = {
    template: `
        <div class="container">
        
                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <hr class="hr-text" data-content="Player info" />
                    </div>
                </div>        
                
                
                <div class="row">
                    
                    <div class="col-lg-3 offset-lg-3 col-md-4 offset-md-2 col-6">
                        <profileImage ref="profileImage" :userid="this.$route.params.id"></profileImage>
                    </div>
                    
                    <div class="col-lg-3 col-md-4 col-6 align-self-center">
                        <h2>{{user.username}}</h2>
                        <h4><i>Italy</i></h4>
                    </div>
                
                </div>
                              

                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <hr class="hr-text" data-content="Ranking" />
                    </div>
                </div>                  
                

                
                <div class="row">
                    <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
                        <div class="row">
                            <div class="col-8">
                                <strong>Global ranking</strong>
                            </div>
                            <div class="col-4">
                                <p class="float-right" style="font-size:23px">{{globalRank}}</p>
                            </div>                            
                        </div>
                        <div class="row">
                            <div class="col-8">
                                <strong>Country ranking</strong>
                            </div>
                            <div class="col-4">
                                <p class="float-right">{{globalRank}}</p>
                            </div>                            
                        </div>                        
                        <div class="row">
                            <div class="col-8">
                                <strong>Points</strong>
                            </div>
                            <div class="col-4">
                                <p class="float-right">{{user.points}}</p>
                            </div>                            
                        </div>                        
                                   
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
                        <line-chart :data="{'2017-05-13': 2, '2017-05-14': 5}"></line-chart>
                    </div>
                </div>
                

                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <hr class="hr-text" data-content="Stats" />
                    </div>
                </div>
                                
                <div class="row">
                    <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
                        <div class="row">
                            <div class="col-8">
                                <strong>Member since</strong>
                            </div>
                            <div class="col-4">
                                <p class="float-right">{{user.registeredDate | formatDate}}</p>
                            </div>                            
                        </div>
                        <div class="row">
                            <div class="col-8">
                                <strong>Last stat reset</strong>
                            </div>
                            <div class="col-4">
                                <p class="float-right">{{user.lastReset | formatDate}}</p>
                            </div>                            
                        </div>                         
                        <div class="row">
                            <div class="col-8">
                                <strong>Total play time</strong>
                            </div>
                            <div class="col-4">
                                <p class="float-right">{{user.totalPlayTime}} hours</p>
                            </div>                            
                        </div>                         
                        <div class="row">
                            <div class="col-8">
                                <strong>Play time since reset</strong>
                            </div>
                            <div class="col-4">
                                <p class="float-right">{{user.playTime}} hours</p>
                            </div>                            
                        </div>                         
                        <div class="row">
                            <div class="col-8">
                                <strong>Play count</strong>
                            </div>
                            <div class="col-4">
                                <p class="float-right">{{user.wins + user.losses}}</p>
                            </div>                            
                        </div>                         
                        <div class="row">
                            <div class="col-8">
                                <strong>Wins</strong>
                            </div>
                            <div class="col-4">
                                <p class="float-right">{{user.wins}}</p>
                            </div>                            
                        </div>                         
                         <div class="row">
                            <div class="col-8">
                                <strong>Losses</strong>
                            </div>
                            <div class="col-4">
                                <p class="float-right">{{user.losses}}</p>
                            </div>                            
                        </div> 
                        <div class="row">
                            <div class="col-8">
                                <strong>Win/Loss ratio</strong>
                            </div>
                            <div class="col-4">
                                <p class="float-right">{{user.wins | ratio(user.losses)}}</p>
                            </div>                            
                        </div>                                                                        
                                
                    </div>           
                         
                </div>
                
                
                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <hr class="hr-text" data-content="Play History" />
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
                        <line-chart :data="{'2017-05-13': 2, '2017-05-14': 5}"></line-chart>                                
                    </div>           
                         
                </div>
                
        </div>
`,
    components: {
        'profileImage': profileImage
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
            },
            globalRank : -1

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
            axios.get("/api/users/" + this.$route.params.id + "/rank")
                .then(response => {
                    this.globalRank = response.data.rank;
                })
                .catch(error => {
                    router.push("/404")
                });
            this.$refs.profileImage.reload();
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