const Login = {
    template: `<div class="container">
                        <form class="form-group">
                        <hr class="hr-text" data-content="Sign in">


                        <label class="sr-only" for="txbEmail">Email</label>
                        <div class="input-group mb-2 mt-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fas fa-envelope"></i></div>
                            </div>
                            <input v-model="email" type="email" class="form-control" placeholder="Email" required>
                        </div>
                        <label class="sr-only" for="txbPasswordTmp">Password</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fas fa-key"></i></div>
                            </div>
                            <input v-model="login_request.password" type="password" class="form-control" placeholder="Password" required>
                        </div>
                        <small class="text-danger" v-if="show_error">
                            {{error_message}}
                        </small>
                        <div class="form-group" style="padding-top:10px">
                            <input type="button" @click.prevent="login" class="btn btn-primary btn-lg btn-block" value="Sign in">
                        </div>

                        </form>
                            
                        <div class="form-group" style="padding-top:10px">
                        <hr class="hr-text" data-content="Are you new?">
                        <router-link class="btn btn-primary btn-lg btn-block login-button" to="/signup"><i class="fas fa-user-plus"></i> Sign Up</router-link>
                        </div>
	</div>`,
    data() {
        return {
            email: "",
            login_request: {
                password: ""
            },
            show_error: false,
            error_message: ""
        }
    },
    methods: {
        login: function () {
            this.show_error = false;
            if (this.email && this.login_request.password) {
                axios.post("http://localhost:3000/api/users/" + this.email + "/token", this.login_request)
                    .then(response => {
                        store.commit('setToken', response.data.token);
                        localStorage.token = response.data.token;
                        axios.defaults.headers.common['Authorization'] = "Bearer" + response.data.token;
                        router.push("/");
                    })
                    .catch(error => {
                        this.show_error = true;
                        this.error_message = error.response.data.message;                    
                    });
            } else {
                this.show_error = true;
                this.error_message = "Please enter Email and Password!";
            }
        },
    },
    mounted: function () {
        if (tmp_email) {
            this.email = tmp_email; //Retrive email from signup page
        }
    },
    filters: {
        limit: function (text, length) {
            return text.substring(0, length);
        }
    },
}