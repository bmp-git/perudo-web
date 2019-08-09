const Chat = {
    template: `
                <div class="col-12 col-sm-12 col-md-10 offset-md-1 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
                    <div ref="chat" class="chat-container">
                        
                        <template v-for="msg in messages">
                            <template v-if="msg.type === 'message'">
                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-3 col-md-2 col-lg-1">
                                            <img v-bind:src="'/api/users/' + msg.user_id +'/avatar'">
                                        </div>
                                        <div class="col-5 col-md-7 col-lg-9">
                                            <strong><username :userid="msg.user_id"></username></strong>
                                            <p>{{msg.content}}</p>
                                        </div>
                                        <div class="col-4 col-md-3 col-lg-2">
                                            <span class="time-right">{{msg.date | formatDate}}</span>
                                        </div>                                          
                                    
                                    </div>
                                    
                                </div>                                    
                            </template>
                        
                        </template>
                    
                   
                    </div>
                        
                    <div class="input-group mb-2 mt-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text"><i class="fas fa-paper-plane"></i></div>
                        </div>                                
                      <input v-model="message" type="text" class="form-control" placeholder="Send message" @keyup.enter="sendMessage">
                      <div class="input-group-append">
                        <button class="btn btn-outline-secondary" @click.prevent="sendMessage" @keyup.enter="sendMessage" type="button">Send Message</button>
                      </div>
                    </div>
                </div>  
`,
    components: {
        'username': Username
    },
    /*
    *   content: "Hey come stai?"
    *   date: "2019-08-08T16:09:46.640Z"
    *   index: 4
    *   type: "message"
    *   user_id: "5d4bd25fb9976803582381a5"
    *
    * */
    data() {
        return {
            game : {
                id: ''
            },
            messages : [],
            message : '',
            index : 0
        }
    },
    props: ['gameid'],
    computed: {
    },
    methods: {
        sendMessage: function() {
            if(!this.message) {
                return;
            }
            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.post("/api/games/" + this.gameid + "/actions/messages", {message: this.message}, {headers: { Authorization: authHeader}})
                .then(response => {
                    console.log("Message sent successfully!");
                    this.message = '';
                })
                .catch(error => {
                    console.log(error.response.data.message);
                });
        },
        update: function () {
            const authHeader = 'bearer '.concat(this.$store.state.token);
            axios.get("/api/games/" + this.gameid + "/actions", { params: {from_index:this.index}, headers: { Authorization: authHeader}})
                .then(response => {
                    this.index = this.index + response.data.result.length;
                    this.messages.push(...response.data.result);
                })
                .catch(error => {
                    console.log(error.response.data.message);
                });
        },
        scrollChatToBottom: function() {
            const chatContainer = this.$refs.chat;
            if(chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }

    },
    filters: {
        formatDate: function(value) {
            if (value) {
                return moment(String(value)).format("h:mm:ss a");
            }
        }
    },
    mounted: function () {
        this.update();
        socket.emit('watch game', this.gameid);
        socket.on('new action', game_id => {
            if(game_id === this.gameid) {
                this.update();
            }
        });
    },
    updated: function() {
        this.scrollChatToBottom();
    }
};