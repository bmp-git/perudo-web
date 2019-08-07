const ProfileSettings = {
    template: `
        <div class="container">
                
                <hr class="hr-text" data-content="Edit my profile" />
                
                <div class="row">
                    <div class="col-md-2 offset-md-3">
                        <img src="/static/img/avatar.png" class="ig-avatar">
                    </div>
                    <div class="col-md-4">

                        
                        <editableForm icon="user" type="" placeholder="Username" :value="user.username" :onchangeconfirm="changeUsername"></editableForm>
                        
                        <editableForm icon="flag" type="" placeholder="Nationality" :value="user.nationality" :onchangeconfirm="changeNationality"></editableForm>


                    </div>
                </div>
                              

                <hr class="hr-text" data-content="E-mail" />
                
                
                <editableForm icon="envelope" type="email" placeholder="Email" :value="user.email" :onchangeconfirm="changeEmail"></editableForm>
                
                
                <hr class="hr-text" data-content="Change password" />    
                
                
                
                
                
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
                
                
                
                
                <hr class="hr-text" data-content="Reset my stats and rankings" />   
                
                <div class="form-group" style="padding-top:10px">
                    <input type="button" @click.prevent="" class="btn btn-danger btn-lg btn-block" value="Reset my stats">
                </div>
                
                
             
                
        </div>
`,
    components: {
        'errorSuccessNotifier': errorSuccessNotifier,
        'editableForm': editableForm
    },
    data() {
        return {
            user: {
                _id : '',
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
    methods: {
        changeUsername: function(username, succ, err) {
            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.put("/api/users/" + this.$store.state.user._id + "/username", {username: username}, {headers: { Authorization: authHeader}})
                .then(response => {
                    succ("Username changed successfully!");
                    this.refreshToken();
                })
                .catch(error => {
                    err(error.response.data.message);
                });
        },
        changeNationality: function(username, succ, err) {
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
        }
    },
    filters: {
    },
    mounted: function () {
        axios.get("/api/users/" + this.$store.state.user._id, { headers: { Authorization: 'bearer '.concat(this.$store.state.token) } })
            .then(response => {
                this.user = response.data.user;
            })
            .catch(error => {
                router.push("/404")
            });
    }
};