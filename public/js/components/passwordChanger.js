const passwordChanger = {
    template: `
                
                
                
                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <form>
                            <input type="text" v-bind:value="this.$store.state.user.email" autocomplete="username email" hidden>
                            <div class="input-group mb-2 mt-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text"><i class="fas fa-key"></i></div>
                                </div>
                                <input v-model="newPassword" type="password" autocomplete="new-password" class="form-control" placeholder="New Password" required>
                            </div>
                            
                            <div class="input-group mb-2 mt-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text"><i class="fas fa-check-double"></i></div>
                                </div>
                                <input v-model="confirmNewPassword" type="password" autocomplete="new-password" class="form-control" placeholder="Confirm Password" required>
                            </div>                        
    
                            <errorSuccessNotifier ref="notifier"></errorSuccessNotifier>
                            
                            <div class="form-group" style="padding-top:10px">
                                <input type="button" @click.prevent="changePassword" class="btn btn-primary btn-lg btn-block" value="Update password">
                            </div>
                        </form>                      
                    
                    </div>
                </div> 


`,
    components: {
        'errorSuccessNotifier': errorSuccessNotifier
    },
    data() {
        return {
            newPassword: '',
            confirmNewPassword: ''
        }
    },
    props: [],
    computed: {
    },
    methods: {
        changePassword: function() {
            if (this.newPassword === '') {
                this.$refs.notifier.showError("Password is empty!");
                return;
            }
            if (this.newPassword !== this.confirmNewPassword) {
                this.$refs.notifier.showError("Password does not match!");
                return;
            }

            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.put("/api/users/" + this.$store.state.user._id + "/password", {password: this.newPassword}, {headers: { Authorization: authHeader}})
                .then(response => {
                    this.$refs.notifier.showSuccess("Password changed successfully!");
                    this.newPassword = '';
                    this.confirmNewPassword = '';
                })
                .catch(error => {
                    this.$refs.notifier.showError(error.response.data.message);
                });
        }
    },
    filters: {
    },
    mounted: function () {
    }
};