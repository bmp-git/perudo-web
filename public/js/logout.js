const Logout = { template: `<div class="row">
                        Logging out...
	</div>`,
	data() {
		return {
		}
	},
	methods: {
		init: function(){
            app.token = null;
            axios.defaults.headers.common['Authorization'] = null;
            router.push("/login");
		}
	},
	mounted(){
		this.init()
	}
}