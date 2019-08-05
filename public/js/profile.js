const Profile = {
    template: `
        <div class="container">
                
                <hr />
                
                <div class="row">
                    <div class="col-md-6 offset-md-3">
                        <h1>Player info</h1>                                          
                    </div>                                  
                </div>
                
                
                <div class="row">
                    <div class="col-md-2 offset-md-3">
                        <img src="static/img/avatar.png" class="ig-avatar">
                    </div>
                    <div class="col-md-4">
                        <h2>{{this.$store.state.user.username}}</h2>
                        <h4>Italy</h4>
                    </div>
                </div>
                
                <hr />

                
                <div class="row">
                    <div class="col-md-3 offset-md-3">
                        <p>Chart</p>                                          
                    </div>
                    <div class="col-md-3">
                        Global ranking: 2039 <br>
                        Country ranking: 234 <br>
                        Points: 32 <br>                                     
                    </div>
                </div>
                
                <hr />
                
                
                <div class="row">
                    <div class="col-md-6 offset-md-3">
                        <h2>Stats</h2>
                        Member since: 20/07/18 <br>
                        Last stat reset: 18/09/18 <br>
                        Total play time: 29 hours <br>
                        Play time since reset: 15 hours <br>
                        Play count: 56 <br>
                        Wins: 31 <br>
                        Losses: 25 <br>
                        Win/Loss ratio: 1.24 <br>                                   
                    </div>           
                         
                </div>
                
                <hr />
                
                <div class="row">
                    <div class="col-md-6 offset-md-3">
                        <h2>Play history</h2>
                        Chart <br>                                
                    </div>           
                         
                </div>
                
        </div>
`,
    data() {
    },
    methods: {
    },
    mounted: function () {
    }
};