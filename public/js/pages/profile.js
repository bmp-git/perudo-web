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
                    <div class="col-md-8 offset-md-2">
                        <hr class="hr-text" data-content="Rank History" />
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
                        <apexchart type=line height=350 :options="rank_chart_options" :series="rank_series" />
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <hr class="hr-text" data-content="Points History" />
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
                        <apexchart type=line height=350 :options="points_chart_options" :series="points_series" />
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
                                <p class="float-right">{{user.totalPlayTime | formatToHours}} hours</p>
                            </div>                            
                        </div>                         
                        <div class="row">
                            <div class="col-8">
                                <strong>Play time since reset</strong>
                            </div>
                            <div class="col-4">
                                <p class="float-right">{{user.playTime | formatToHours}} hours</p>
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
                        <apexchart type=bar height=350 :options="plays_chart_options" :series="plays_series" />                                
                    </div>           
                         
                </div>
                
                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <hr class="hr-text" data-content="Played time history" />
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
                        <apexchart type=bar height=350 :options="time_played_chart_options" :series="time_played_series" />                                
                    </div>           
                         
                </div>                
                
        </div>
`,
    components: {
        'profileImage': profileImage,
         'apexchart': VueApexCharts
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
            globalRank : -1,
            rankHistory : [],
            pointsHistory : [],
            playHistory : [],


            rank_series: [],
            points_series: [],
            plays_series: [],
            time_played_series: [],
            rank_chart_options: {
                colors:['#F86624'],
                chart: {
                    stacked: true,
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 3
                },
                xaxis: {
                    type: 'datetime',
                    categories: [],
                    labels: {
                        datetimeFormatter: {
                            year: 'yyyy',
                            month: "MMM 'yy",
                            day: 'dd MMM',
                            hour: '',
                        }
                    },
                    axisTicks: {
                        show: false
                    }
                },
                yaxis: {
                    reversed: true,
                    min: 1,
                    labels: {
                        show: false
                    }
                },
                tooltip: {
                    x: {
                        format: 'dd/MM/yy'
                    }
                }
            },
            points_chart_options: {
                colors:['#1B998B'],
                chart: {
                    stacked: true,
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 3
                },
                xaxis: {
                    type: 'datetime',
                    categories: [],
                    labels: {
                        datetimeFormatter: {
                            year: 'yyyy',
                            month: "MMM 'yy",
                            day: 'dd MMM',
                            hour: '',
                        }
                    },
                    axisTicks: {
                        show: false
                    }
                },
                yaxis: {
                    labels: {
                        show: false
                    }
                },
                tooltip: {
                    x: {
                        format: 'dd/MM/yy'
                    }
                }
            },
            plays_chart_options: {
                colors:['#4CAF50', '#F44336'],
                chart: {
                    stacked: true,
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                yaxis: {
                },
                xaxis: {
                    type: 'datetime',
                    categories: [],
                    labels: {
                        datetimeFormatter: {
                            year: 'yyyy',
                            month: "MMM 'yy",
                            day: 'dd MMM',
                            hour: '',
                        }
                    },
                    axisTicks: {
                        show: false
                    }
                }
            },
            time_played_chart_options: {
            colors:['#A5978B'],
                chart: {
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    type: 'datetime',
                    categories: [],
                    labels: {
                        datetimeFormatter: {
                            year: 'yyyy',
                            month: "MMM 'yy",
                            day: 'dd MMM',
                            hour: '',
                        }
                    },
                    axisTicks: {
                        show: false
                    }
                }
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
            axios.get("/api/users/" + this.$route.params.id + "/rank")
                .then(response => {
                    this.globalRank = response.data.rank;
                })
                .catch(error => {
                    router.push("/404")
                });
            axios.get("/api/users/" + this.$route.params.id + "/history")
                .then(response => {
                    const history = response.data;
                    const dates = history.map(e => e.date);
                    this.updateChartXAxis(dates);

                    this.rank_series[0] = {
                        name: 'Rank',
                        data: history.map(e => e.rank)
                    };

                    this.points_series[0] = {
                        name: 'Points',
                        data: history.map(e => e.points)
                    };

                    this.plays_series[0] = {
                        name: 'Wins',
                        data: history.map(e => e.wins)
                    };

                    this.plays_series[1] = {
                        name: 'Losses',
                        data: history.map(e => e.losses)
                    };

                    this.time_played_series[0] = {
                        name: 'Hours played',
                        data: history.map(e => (e.time_played / (1000 * 60 * 60)).toFixed(2))
                    }
                })
                .catch(error => {
                    router.push("/404")
                });
            this.$refs.profileImage.reload();
        },
        updateChartXAxis: function (categories) {
            const opts = {
                xaxis: {
                    categories: categories
                }
            };
            this.points_chart_options = opts;
            this.plays_chart_options = opts;
            this.time_played_chart_options = opts;
            this.rank_chart_options = opts;
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
        formatToHours: function(milliseconds) {
            return (milliseconds / (1000 * 60 * 60)).toFixed(2);
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