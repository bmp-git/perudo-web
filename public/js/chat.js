const Chat = {
    template: `
            <div class="container">
            
                <div class="col-12">
                    <div class="card border-dark mb-3" style="border-radius:.99rem!important; border-width: 2px;">
                        <div class="card-body text-dark">
                            
                            <div class="chat-container">
                            
                                <div class="container chat-message">
                                  <img src="" alt="Avatar">
                                  <p>Hello. How are you today?</p>
                                  <span class="time-right">11:00</span>
                                </div>
                           
                            </div>
                                
                            <div class="input-group mb-2 mt-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text"><i class="fas fa-paper-plane"></i></div>
                                </div>                                
                              <input v-model="message" type="text" class="form-control" placeholder="Send message">
                              <div class="input-group-append">
                                <button class="btn btn-outline-secondary" @click.prevent="" type="button">Send Message</button>
                              </div>
                            </div>

                    </div>
                </div>
                        
            

            </div>     
`,
    components: {

    },
    data() {
        return {
            game : {
                id: ''
            },
            message : ''
        }
    },
    props: [],
    computed: {
    },
    methods: {

    },
    filters: {
    },
    mounted: function () {

    }
};