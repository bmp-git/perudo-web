const Signup = { template: `<div class="row">
                        <form class="form-group" method="post">
                        <!-- divider Accesso -->

                        <label class="sr-only" for="txbPasswordTmp">Username</label>
                        <div class="input-group">
                            <div class="input-group-addon"><div class="fa fa-lock fa-fw"></div></div>
                            <input v-model="signup_request.username" type="text" class="form-control" placeholder="Username" required>
                        </div>
                        <label class="sr-only" for="txbEmail">Email</label>
                        <div class="input-group mb-2 mt-2">
                            <div class="input-group-addon"><div class="fa fa-envelope fa-fw"></div></div>
                            <input v-model="signup_request.email" type="email" class="form-control" placeholder="Email" required>
                        </div>
                        <label class="sr-only" for="txbPasswordTmp">Passowrd</label>
                        <div class="input-group">
                            <div class="input-group-addon"><div class="fa fa-lock fa-fw"></div></div>
                            <input v-model="signup_request.password" type="password" class="form-control" placeholder="Password" required>
                        </div>
                        <div class="form-group">
                            <input type="button" @click.prevent="login" class="btn btn-primary btn-lg btn-block" value="Sign up">
                        </div>

                        </form>
                        <p>{{ error_message }}</p>
                        <p>{{ success_message }}</p>
                        <div class="form-group" style="padding-top:10px">
                        <!-- divider Sei già dei nostri? -->
                        <button type="button" class="btn btn-primary btn-lg btn-block login-button" onclick="">Accedi</button>
                        </div>
	</div>`,
	data() {
		return {
            signup_request: {
                "username": "Edo",
                "email": "asd@asd.com",
                "password" : "asdasd"
            },
            error_message: "",
            success_message: ""
		}
	},
	methods: {
		login: function () {
            axios.post("http://localhost:3000/api/users/", this.signup_request)
			.then(response => {
                this.success_message = "Sign up completed. You will be redirected soon.";
                setTimeout(function(){ router.push("/login"); }, 2000);
			    
            })
            .catch(error => {
                this.error_message = error.response.data.message;
                console.log(error.response.data.message);
            });
		},
    },
	mounted: function(){

	},
	filters: {
		limit: function(text, length) {
			return text.substring(0, length); 
		}
	},
}