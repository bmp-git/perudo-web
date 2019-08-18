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
                <input v-model="signup_request.username" type="text" class="form-control" placeholder="Username">
            </div>
            <label class="sr-only" for="txbEmail">Email</label>
            <div class="input-group mb-2 mt-2">
                <div class="input-group-prepend">
                    <div class="input-group-text"><i class="fas fa-envelope"></i></div>
                </div>
                <input v-model="signup_request.email" type="email" class="form-control" placeholder="Email">
            </div>
            <label class="sr-only" for="txbPasswordTmp">Password</label>
            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text"><i class="fas fa-key"></i></div>
                </div>
                <input @keyup.enter="singup" v-model="signup_request.password" type="password" class="form-control" placeholder="Password">
            </div>
            <errorSuccessNotifier ref="notifier"></errorSuccessNotifier>
            <div class="form-group" style="padding-top:10px">
                <input type="button" @click.prevent="singup" class="btn btn-primary btn-lg btn-block" value="Sign up">
            </div>
        </form>
        <div class="form-group" style="padding-top:10px">
            <hr class="hr-text" data-content="Already one of us?">
            <router-link class="btn btn-primary btn-lg btn-block login-button" to="/signin"><i class="fas fa-sign-in-alt"></i> Sign in</router-link>
        </div>
    </div>`,
    components: {
        'errorSuccessNotifier': errorSuccessNotifier
    },
    data() {
        return {
            signup_request: {
                username: "",
                email: "",
                password: ""
            }
        }
    },
    methods: {
        singup: function () {
            Api.signup(this.signup_request.email, this.signup_request.username, this.signup_request.password, () => {
                this.$refs.notifier.showSuccess("Sign up completed. You will be redirected soon.");
                tmp_email = (' ' + this.signup_request.email).slice(1); //to force the creation of a copy

                this.signup_request.username = "";
                this.signup_request.email = "";
                this.signup_request.password = "";

                setTimeout(function () { router.push("/signin"); }, 2000);
            }, error => {
                this.$refs.notifier.showError(error.response.data.message);
            })
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