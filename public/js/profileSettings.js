const ProfileSettings = {
    template: `
        <div class="container">
                
                <hr class="hr-text" data-content="Edit my profile" />
                
                <div class="row">
                    <div class="col-md-2 offset-md-3">
                        <img src="/static/img/avatar.png" class="ig-avatar">
                    </div>
                    <div class="col-md-4">
                        <h2>{{this.$store.state.user.username}}</h2>
                        <h4>Italy</h4>
                    </div>
                </div>
                              

                <hr class="hr-text" data-content="Ranking" />
                
                
                <label class="sr-only" for="txbEmail">Email</label>
                <div class="input-group mb-2 mt-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fas fa-envelope"></i></div>
                    </div>
                    <input v-model="email" type="email" class="form-control" placeholder="Email" v-bind:disabled="emailFormDisabled">
                    <div class="input-group-append">
                        <div class="input-group-text"><a href="" title="edit" @click.prevent="toggleEmailEdit"><i v-bind:class="emailFormEditButtonClass"></i></a></div>
                    </div>
                </div>               
                
        </div>
`,
    data() {
        return {
            email: '',
            efd: true
        }
    },
    computed: {
        emailFormDisabled: function(){
            return this.efd;
        },
        emailFormEditButtonClass: function() {
            return this.efd ? "fas fa fa-edit" : "fas fa fa-check";
        }
    },
    methods: {
        toggleEmailEdit: function(event) {
            if(this.efd) {

            } else {

            }
            this.efd = !this.efd;

        }
    },
    filters: {
    },
    mounted: function () {
        this.efd = true;
    }
};