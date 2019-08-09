const ProfileSettings = {
    template: `
        <div class="container">
                
                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <hr class="hr-text" data-content="Edit my profile" />
                    </div>
                </div>
                
                
                <div class="row">
                    
                    <div class="col-lg-3 offset-lg-2 col-md-4 offset-md-2">
                        <profileImage ref="profileImage" :userid="this.$store.state.user._id" canedit="true" :onnewimage="changeAvatar"></profileImage>
                    </div>
                    
                    
                    <div class="col-lg-5 col-md-4">

                        
                        <editableForm icon="user" type="" placeholder="Username" :value.sync="user.username" :onchangeconfirm="changeUsername"></editableForm>
                        
                        <editableForm icon="flag" type="" placeholder="Nationality" :value.sync="user.nationality" :onchangeconfirm="changeNationality"></editableForm>


                    </div>
                </div>
                              

                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <hr class="hr-text" data-content="E-mail" />
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <editableForm icon="envelope" type="email" placeholder="Email" :value.sync="user.email" :onchangeconfirm="changeEmail"></editableForm>
                    </div>
                </div>
                
                
                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <hr class="hr-text" data-content="Change password" />
                    </div>
                </div> 
                
                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        
                        <div class="input-group mb-2 mt-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fas fa-key"></i></div>
                            </div>
                            <input v-model="newPassword" type="password" class="form-control" placeholder="New Password" required>
                        </div>
                        
                        <div class="input-group mb-2 mt-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fas fa-check-double"></i></div>
                            </div>
                            <input v-model="confirmNewPassword" type="password" class="form-control" placeholder="Confirm Password" required>
                        </div>                        

                        <errorSuccessNotifier ref="passwordNotifier"></errorSuccessNotifier>
                        
                        <div class="form-group" style="padding-top:10px">
                            <input type="button" @click.prevent="changePassword" class="btn btn-primary btn-lg btn-block" value="Update password">
                        </div>                      
                    
                    </div>
                </div> 


                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <hr class="hr-text" data-content="Reset my stats and rankings" />
                    </div>
                </div>                 
                

                <div class="row">
                    <div class="col-md-8 offset-md-2">
                    
                        <div class="form-group" style="padding-top:10px">
                            <input type="button" @click.prevent="resetStats" class="btn btn-danger btn-lg btn-block" value="Reset my stats">
                        </div>
                        
                        <errorSuccessNotifier ref="resetNotifier"></errorSuccessNotifier>   
                                             
                    </div>
                </div>                


        </div>
`,
    components: {
        'errorSuccessNotifier': errorSuccessNotifier,
        'editableForm': editableForm,
        'profileImage': profileImage
    },
    data() {
        return {
            user: {
                id : '',
                nationality: 'Italy',
                email: '',
                username: '',
                avatar: ''
            },
            newPassword: '',
            confirmNewPassword: '',

        }
    },
    computed: {
    },
    watch: {
        $route: function(to, from) {
            if(to.name === 'settings') {
                this.reload();
            }
        }
    },
    methods: {
        reload: function() {
            axios.get("/api/users/" + this.$store.state.user._id, { headers: { Authorization: 'bearer '.concat(this.$store.state.token) } })
                .then(response => {
                    this.user = response.data.user;
                })
                .catch(error => {
                    router.push("/404")
                });
            this.$refs.profileImage.reload();
        },
        changeUsername: function(username, succ, err) {
            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.put("/api/users/" + this.$store.state.user._id + "/username", {username: username}, {headers: { Authorization: authHeader}})
                .then(response => {
                    succ("Username changed successfully!");
                    cache_username(this.$store.state.user._id, username);
                    this.refreshToken();
                })
                .catch(error => {
                    err(error.response.data.message);
                });
        },
        changeNationality: function(nationality, succ, err) {
            succ("Nationality changed successfully!");
        },
        changeEmail: function(email, succ, err) {
            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.put("/api/users/" + this.$store.state.user._id + "/email", {email: email}, {headers: { Authorization: authHeader}})
                .then(response => {
                    succ("Email changed successfully!");
                    this.refreshToken();
                })
                .catch(error => {
                    err(error.response.data.message);
                });
        },
        changeAvatar: function(avatar, succ, err) {
            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.put("/api/users/" + this.$store.state.user._id + "/avatar", {avatar: avatar}, {headers: { Authorization: authHeader}})
                .then(response => {
                    succ("Avatar changed successfully!");
                })
                .catch(error => {
                    err(error.response.data.message);
                });
        },
        refreshToken: function() {
            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.get("/api/users/" + this.$store.state.user._id + "/token", {headers: { Authorization: authHeader}})
                .then(
                    tokenRes => {
                        store.commit('setToken', tokenRes.data.token);
                    }
                );
        },
        changePassword: function() {
            if (this.newPassword === '') {
                this.$refs.passwordNotifier.showError("Password is empty!");
                return;
            }
            if (this.newPassword !== this.confirmNewPassword) {
                this.$refs.passwordNotifier.showError("Password does not match!");
                return;
            }

            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.put("/api/users/" + this.$store.state.user._id + "/password", {password: this.newPassword}, {headers: { Authorization: authHeader}})
                .then(response => {
                    this.$refs.passwordNotifier.showSuccess("Password changed successfully!");
                    this.newPassword = '';
                    this.confirmNewPassword = '';
                })
                .catch(error => {
                    this.$refs.passwordNotifier.showError(error.response.data.message);
                });
        },
        resetStats: function() {
            if(!confirm("Are you sure? All your stats and ranking will be erased.")) {
                return;
            }
            if(!confirm("Really?")) {
                return;
            }
            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.delete("/api/users/" + this.$store.state.user._id + "/info", {headers: { Authorization: authHeader}})
                .then(response => {
                    this.$refs.resetNotifier.showSuccess("User stats reset successfully!");
                })
                .catch(error => {
                    this.$refs.resetNotifier.showError(error.response.data.message);
                });
        }
    },
    filters: {
    },
    mounted: function () {
        this.reload();
    }
};