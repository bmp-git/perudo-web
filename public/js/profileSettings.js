const ProfileSettings = {
    template: `
        <div class="container">
                
                <hr class="hr-text" data-content="Edit my profile" />
                
                <div class="row">
                    <div class="col-md-2 offset-md-3">
                        <img src="/static/img/avatar.png" class="ig-avatar">
                    </div>
                    <div class="col-md-4">
                        
                        
                        
                        <div class="input-group mb-2 mt-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fas fa-user"></i></div>
                            </div>
                            <input v-model="user.username" class="form-control" placeholder="Username" v-bind:disabled="usernameFormDisabled">
                            <div class="input-group-append">
                                <div class="input-group-text"><a href="" title="edit" @click.prevent="toggleUsernameEdit"><i v-bind:class="usernameFormDisabled ? 'fas fa fa-edit' : 'fas fa fa-check'"></i></a></div>
                            </div>
                        </div>
                        
                        <errorSuccessNotifier ref="userNotifier"></errorSuccessNotifier>
                        
                        <div class="input-group mb-2 mt-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fas fa-flag"></i></div>
                            </div>
                            <input v-model="user.nationality" class="form-control" placeholder="Nationality" v-bind:disabled="nationalityFormDisabled">
                            <div class="input-group-append">
                                <div class="input-group-text"><a href="" title="edit" @click.prevent="toggleNationalityEdit"><i v-bind:class="nationalityFormDisabled ? 'fas fa fa-edit' : 'fas fa fa-check'"></i></a></div>
                            </div>
                        </div>                                                  

                    
                    
                    </div>
                </div>
                              

                <hr class="hr-text" data-content="E-mail" />
                
                
                <label class="sr-only" for="txbEmail">Email</label>
                <div class="input-group mb-2 mt-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fas fa-envelope"></i></div>
                    </div>
                    <input v-model="user.email" type="email" class="form-control" placeholder="Email" v-bind:disabled="emailFormDisabled">
                    <div class="input-group-append">
                        <div class="input-group-text"><a href="" title="edit" @click.prevent="toggleEmailEdit"><i v-bind:class="emailFormDisabled ? 'fas fa fa-edit' : 'fas fa fa-check'"></i></a></div>
                    </div>
                </div>   
                
                
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
        'errorSuccessNotifier': errorSuccessNotifier
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
            usernameFormDisabled: true,
            emailFormDisabled: true,
            nationalityFormDisabled: true,

        }
    },
    computed: {
    },
    methods: {
        toggleEmailEdit: function(event) {
            if(!this.emailFormDisabled) {

            } else {

            }
            this.emailFormDisabled = !this.emailFormDisabled;

        },
        toggleUsernameEdit: function(event) {
            let res = true;
            if(!this.usernameFormDisabled) {
                //toggle delegated
                this.changeUsername();
            } else {
                this.usernameFormDisabled = !this.usernameFormDisabled;
            }
        },
        toggleNationalityEdit: function(event) {
            if(!this.nationalityFormDisabled) {

            } else {

            }
            this.nationalityFormDisabled = !this.nationalityFormDisabled;

        },
        changeUsername: function() {
            if (this.user.username === '') {
                this.$refs.userNotifier.showError("The new username is empty!");
                return false;
            }

            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.put("http://localhost:3000/api/users/" + this.$store.state.user._id + "/username", {username: this.user.username}, {headers: { Authorization: authHeader}})
                .then(response => {
                    this.$refs.userNotifier.showSuccess("Username changed successfully!");
                    store.commit('setUsername', this.user.username);
                    this.usernameFormDisabled = !this.usernameFormDisabled;
                })
                .catch(error => {
                    this.$refs.userNotifier.showError(error.response.data.message);
                });
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
            axios.put("http://localhost:3000/api/users/" + this.$store.state.user._id + "/password", {password: this.newPassword}, {headers: { Authorization: authHeader}})
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
        console.log(this.$store.state);
        axios.get("http://localhost:3000/api/users/" + this.$store.state.user._id, { headers: { Authorization: 'bearer '.concat(this.$store.state.token) } })
            .then(response => {
                this.user = response.data.user;
                console.log(response)
            })
            .catch(error => {
                router.push("/404")
            });
    }
};