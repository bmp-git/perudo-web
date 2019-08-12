const Chat = {
    template: `
                <div class="col-12 col-sm-12 col-md-10 offset-md-1 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2 pl-0 pr-0">
                    <div ref="chat" class="chat-container">
                        
                        <template v-for="msg in messages">
                            <template v-if="msg.type === 'message'">
                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-2 col-md-2 col-lg-1">
                                            <img v-bind:src="'/api/users/' + msg.user_id +'/avatar'">
                                        </div>
                                        <div class="col-8 col-md-8 col-lg-10">
                                            <strong><username :userid="msg.user_id"></username></strong>
                                            <p>{{msg.content}}</p>
                                        </div>
                                        <div class="col-2 col-md-2 col-lg-1">
                                            <span class="time-right">{{msg.date | formatDate}}</span>
                                        </div>                                          
                                    
                                    </div>
                                </div>   
                                                                 
                            </template>
                            
                            <template v-else-if="msg.type === 'event'">
                                
                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-8 col-md-8 col-lg-10">
                                            <p><i>{{msg.content}}</i></p>
                                        </div>
                                        <div class="col-2 offset-2 col-md-2 offset-md-2 col-lg-1 offset-lg-1">
                                            <span class="time-right">{{msg.date | formatDate}}</span>
                                        </div>                                          
                                    
                                    </div>
                                </div>                             
                                
                            </template>
                        
                                                    
                            <template v-else-if="msg.type === 'palifico'">

                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-8 col-md-8 col-lg-10">
                                            <p><i><username :userid="msg.user_id"></username> called Palifico.</i></p>
                                        </div>
                                        <div class="col-2 offset-2 col-md-2 offset-md-2 col-lg-1 offset-lg-1">
                                            <span class="time-right">{{msg.date | formatDate}}</span>
                                        </div>                                          
                                    
                                    </div>
                                </div> 
                                                            
                            </template>
                                                    
                            <template v-else-if="msg.type === 'bid'">

                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-8 col-md-8 col-lg-10">
                                            <p><i>
                                                <username :userid="msg.user_id"></username> bid {{msg.bid.quantity}} dice of 
                                                <span v-bind:class="'ml-2 dice dice-' + msg.bid.dice"></span>
                                            </i></p>
                                        </div>
                                        <div class="col-2 offset-2 col-md-2 offset-md-2 col-lg-1 offset-lg-1">
                                            <span class="time-right">{{msg.date | formatDate}}</span>
                                        </div>                                          
                                    
                                    </div>
                                </div>                            
                            
                            </template>
                                                    
                            <template v-else-if="msg.type === 'doubt'">
                            
                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-8 col-md-8 col-lg-10">
                                            <p><i><username :userid="msg.user_id"></username> doubted.</i></p>
                                        </div>
                                        <div class="col-2 offset-2 col-md-2 offset-md-2 col-lg-1 offset-lg-1">
                                            <span class="time-right">{{msg.date | formatDate}}</span>
                                        </div>                                          
                                    
                                    </div>
                                </div>                             
                            
                            </template>
                                                    
                            <template v-else-if="msg.type === 'spoton'">
                            
                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-8 col-md-8 col-lg-10">
                                            <p><i><username :userid="msg.user_id"></username> spotted on.</i></p>
                                        </div>
                                        <div class="col-2 offset-2 col-md-2 offset-md-2 col-lg-1 offset-lg-1">
                                            <span class="time-right">{{msg.date | formatDate}}</span>
                                        </div>                                          
                                    
                                    </div>
                                </div>                             
                            
                            </template>
                                                    
                            <template v-else-if="msg.type === 'round'">
                            
                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-8 col-md-8 col-lg-10">
                                            <p><i>Started game round {{msg.round}}</i></p>
                                        </div>
                                        <div class="col-2 offset-2 col-md-2 offset-md-2 col-lg-1 offset-lg-1">
                                            <span class="time-right">{{msg.date | formatDate}}</span>
                                        </div>                                          
                                    
                                    </div>
                                </div>                             
                            
                            </template>
                                                    
                            <template v-else-if="msg.type === 'turn'">
                            
                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-8 col-md-8 col-lg-10">
                                            <p><i>Turn of <username :userid="msg.user_id"></username></i></p>
                                        </div>
                                        <div class="col-2 offset-2 col-md-2 offset-md-2 col-lg-1 offset-lg-1">
                                            <span class="time-right">{{msg.date | formatDate}}</span>
                                        </div>                                          
                                    
                                    </div>
                                </div>                             
                            
                            </template>
                                                    
                            <template v-else-if="msg.type === 'left'">
                            
                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-8 col-md-8 col-lg-10">
                                            <p><i><username :userid="msg.user_id"></username> left the game.</i></p>
                                        </div>
                                        <div class="col-2 offset-2 col-md-2 offset-md-2 col-lg-1 offset-lg-1">
                                            <span class="time-right">{{msg.date | formatDate}}</span>
                                        </div>                                          
                                    
                                    </div>
                                </div>                              
                            
                            </template>
                                                    
                            <template v-else-if="msg.type === 'dice_lost'">
                            
                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-8 col-md-8 col-lg-10">
                                            <p><i><username :userid="msg.user_id"></username> lost a dice.</i></p>
                                        </div>
                                        <div class="col-2 offset-2 col-md-2 offset-md-2 col-lg-1 offset-lg-1">
                                            <span class="time-right">{{msg.date | formatDate}}</span>
                                        </div>                                          
                                    
                                    </div>
                                </div>                              
                            
                            </template>
                                                    
                            <template v-else-if="msg.type === 'dice_win'">
                            
                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-8 col-md-8 col-lg-10">
                                            <p><i><username :userid="msg.user_id"></username> gained a dice.</i></p>
                                        </div>
                                        <div class="col-2 offset-2 col-md-2 offset-md-2 col-lg-1 offset-lg-1">
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
                      <input v-model="message" type="text" class="form-control" placeholder="Type a message" @keyup.enter="sendMessage">
                      <div class="input-group-append d-none d-sm-block">
                        <button class="btn btn-outline-secondary" @click.prevent="sendMessage" @keyup.enter="sendMessage" type="button">Send</button>
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
                    const actions = response.data.result.filter( elem => elem.index >= this.index);
                    this.index = this.index + actions.length;
                    this.messages.push(...actions);
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
                return moment(String(value)).format("HH:mm:ss");
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