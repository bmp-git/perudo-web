const Logout = { template: `<div class="row">
                        Logging out...
	</div>`,
	data() {
		return {
		}
	},
	methods: {
		logout: function(){
			store.commit('unsetToken');
            router.push("/login");
		}
	},
	watch: {
		$route: function(to, from) {
			if(to.name === 'logout') {
				this.logout();
			}
		}
	},
	mounted(){
		this.logout();
	}
};