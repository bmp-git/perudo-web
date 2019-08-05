const Login = {
    template: `<div class="row">
                        <form class="form-group" method="post">
                        <!-- divider Accesso -->


                        <label class="sr-only" for="txbEmail">Email</label>
                        <div class="input-group mb-2 mt-2">
                            <div class="input-group-addon"><div class="fa fa-envelope fa-fw"></div></div>
                            <input v-model="email" type="email" class="form-control" placeholder="Email" value="">
                        </div>
                        <label class="sr-only" for="txbPasswordTmp">Passowrd</label>
                        <div class="input-group">
                            <div class="input-group-addon"><div class="fa fa-lock fa-fw"></div></div>
                            <input v-model="login_request.password" type="password" class="form-control" placeholder="Password">
                        </div>
                        <small class="text-danger" v-if="show_error">
                            {{error_message}}
                        </small>
                        <div class="form-group">
                            <input type="button" @click.prevent="login" class="btn btn-primary btn-lg btn-block" value="Accedi">
                        </div>

                        </form>
                            
                        <div class="form-group" style="padding-top:10px">
                        <!-- divider Sei nuovo? -->
                        <button type="button" class="btn btn-primary btn-lg btn-block login-button" onclick="">Registrati</button>
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