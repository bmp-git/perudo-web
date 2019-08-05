var tmp_email;
const Signup = {
    template: `<div class="container">
        <form class="form-group">
            <hr class="hr-text" data-content="Sign up!">
            <label class="sr-only" for="txbPasswordTmp">Username</label>
            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text"><i class="fas fa-user"></i></div>
                </div>
                <input v-model="signup_request.username" type="text" class="form-control" placeholder="Username"
                    required>
            </div>
            <label class="sr-only" for="txbEmail">Email</label>
            <div class="input-group mb-2 mt-2">
                <div class="input-group-prepend">
                    <div class="input-group-text"><i class="fas fa-envelope"></i></div>
                </div>
                <input v-model="signup_request.email" type="email" class="form-control" placeholder="Email" required>
            </div>
            <label class="sr-only" for="txbPasswordTmp">Password</label>
            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text"><i class="fas fa-key"></i></div>
                </div>
                <input v-model="signup_request.password" type="password" class="form-control" placeholder="Password"
                    required>
            </div>
            <small class="text-danger" v-if="show_error">
                {{error_message}}
            </small>
            <small class="text-success" v-if="show_success">
                {{success_message}}
            </small>
            <div class="form-group" style="padding-top:10px">
                <input type="button" @click.prevent="login" class="btn btn-primary btn-lg btn-block" value="Sign up">
            </div>
        </form>
        <div class="form-group" style="padding-top:10px">
            <hr class="hr-text" data-content="Already one of us?">
            <router-link class="btn btn-primary btn-lg btn-block login-button" to="/login"><i class="fas fa-sign-in-alt"></i> Sign in</router-link>
        </div>
    </div>`,

    data() {
        return {
            signup_request: {
                username: "",
                email: "",
                password: ""
            },
            error_message: "",
            show_error: false,
            success_message: "",
            show_success: false
        }
    },
    methods: {
        login: function () {
            axios.post("http://localhost:3000/api/users/", this.signup_request)
                .then(response => {
                    this.success_message = "Sign up completed. You will be redirected soon.";
                    this.show_success = true;
                    this.show_error = false;
                    tmp_email = this.signup_request.email;
                    setTimeout(function () { router.push("/login"); }, 2000);
                })
                .catch(error => {
                    this.show_error = true;
                    this.error_message = error.response.data.message;
                });
        },
    },
    mounted: function () {

    },
    filters: {
        limit: function (text, length) {
            return text.substring(0, length);
        }
    },
}