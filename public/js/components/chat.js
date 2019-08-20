const Chat = {
    template: `
                <div class="col-12 col-sm-12 col-md-10 offset-md-1 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2 pl-0 pr-0">
                    <div ref="chat" class="chat-container">
                        <template v-for="msg in messages">
                            <div class="animated fadeIn faster">
                            <template v-if="msg.type === 'message'">
                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-2 col-md-2 col-lg-1">
                                            <useravatar :userid="msg.user_id"/>
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
                                            <div><i class="text-secondary">{{msg.content}}</i></div>
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
                                            <div><strong><username :userid="msg.user_id"></username></strong><i> called</i><i class="text-primary"> Palifico</i><i>.</i></div>
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
                                            <div>
                                                <strong><username :userid="msg.user_id"></username></strong>
                                                <i>
                                                    <span class="text-primary"> bid</span>
                                                    <strong> {{msg.bid.quantity}}</strong>
                                                    dice of 
                                                    <span v-bind:class="'ml-1 dice dice-' + msg.bid.dice"></span>
                                                </i>
                                            
                                            </div>
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
                                            <div><strong><username :userid="msg.user_id"></username></strong><i class="text-primary"> doubted</i><i>.</i></div>
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
                                            <div><strong><username :userid="msg.user_id"></username></strong><i class="text-primary"> spotted on</i><i>.</i></div>
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
                                            <div><i class="text-info">Started game round {{msg.round}}</i></div>
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
                                            <div><strong><username :userid="msg.user_id"></username>'s </strong><i class="text-warning">turn</i></div>
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
                                            <div><strong><username :userid="msg.user_id"></username></strong><i class="text-danger"> left</i><i> the game.</i></div>
                                        </div>
                                        <div class="col-2 offset-2 col-md-2 offset-md-2 col-lg-1 offset-lg-1">
                                            <span class="time-right">{{msg.date | formatDate}}</span>
                                        </div>                                          
                                    
                                    </div>
                                </div>                              
                            
                            </template>
                            
                            <template v-else-if="msg.type === 'lost'">
                            
                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-8 col-md-8 col-lg-10">
                                            <div><strong><username :userid="msg.user_id"></username></strong><i class="text-danger"> lost</i><i> the game.</i></div>
                                        </div>
                                        <div class="col-2 offset-2 col-md-2 offset-md-2 col-lg-1 offset-lg-1">
                                            <span class="time-right">{{msg.date | formatDate}}</span>
                                        </div>                                          
                                    
                                    </div>
                                </div>                              
                            
                            </template>  
                            
                            
                            <template v-else-if="msg.type === 'win'">
                            
                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-8 col-md-8 col-lg-10">
                                            <div><strong><username :userid="msg.user_id"></username></strong><i class="text-success"> wins</i><i> the game.</i></div>
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
                                            <div><strong><username :userid="msg.user_id"></username></strong><i class="text-danger"> lost</i><i> a dice.</i></div>
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
                                            <div><strong><username :userid="msg.user_id"></username></strong><i class="text-success"> gained</i><i> a dice.</i></div>
                                        </div>
                                        <div class="col-2 offset-2 col-md-2 offset-md-2 col-lg-1 offset-lg-1">
                                            <span class="time-right">{{msg.date | formatDate}}</span>
                                        </div>                                          
                                    
                                    </div>
                                </div>                              
                            
                            </template>
                            
                            <template v-else-if="msg.type === 'too_slow'">
                            
                                <div class="container chat-message">
                                    <div class="row">
                                        <div class="col-8 col-md-8 col-lg-10">
                                            <div>
                                                <strong><username :userid="msg.user_id"></username></strong>
                                                <i> has</i>
                                                <i class="text-info"> not</i>
                                                <i> made a play</i>
                                                <i class="text-info"> in time</i><i>!</i>
                                                <i> Forcing a default play.</i>
                                            </div>
                                        </div>
                                        <div class="col-2 offset-2 col-md-2 offset-md-2 col-lg-1 offset-lg-1">
                                            <span class="time-right">{{msg.date | formatDate}}</span>
                                        </div>                                          
                                    
                                    </div>
                                </div>                              
                            
                            </template>                            
                            </div>
                        </template>
                    
                    
                    </div>
                        
                    <label class="sr-only" :for="this._uid + '_chat'">Message to send</label>    
                    <div class="input-group mb-2 mt-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text"><i class="fas fa-paper-plane"></i></div>
                        </div>                                
                      <input :id="this._uid + '_chat'" v-model="message" type="text" class="form-control" placeholder="Type a message" @keyup.enter="sendMessage">
                      <div class="input-group-append d-none d-sm-block">
                        <button class="btn btn-outline-secondary" @click.prevent="sendMessage" @keyup.enter="sendMessage" type="button">Send</button>
                      </div>
                    </div>
                </div>  
`,
    components: {
        'username': Username,
        'useravatar': Useravatar
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