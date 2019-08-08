const Chat = {
    template: `
            <div class="container">
            
                <div class="col-12">
                    <div class="card border-dark mb-3" style="border-radius:.99rem!important; border-width: 2px;">
                        <div class="card-body text-dark">
                            
                            <div class="chat-container">
                                
                                <template v-for="msg in messages">
                                    <template v-if="msg.type === 'message'">
                                        <div class="container chat-message">
                                            <img v-bind:src="'/api/users/' + msg.user_id +'/avatar'" width="64px" height="64px" style="object-fit: cover; border-radius: 50%; border: 2px solid #007BFF;">
                                            <p>{{msg.content}}</p>
                                            <span class="time-right">{{msg.date}}</span>
                                        </div>                                    
                                    </template>
                                
                                </template>
                            
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
                                <button class="btn btn-outline-secondary" @click.prevent="sendMessage" type="button">Send Message</button>
                              </div>
                            </div>

                    </div>
                </div>
                        
            

            </div>     
`,
    components: {

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
            index : 0,
            my_game: null
        }
    },
    props: ['gameid'],
    computed: {
    },
    methods: {
        sendMessage: function() {
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
        }

    },
    filters: {
    },
    mounted: function () {
        this.my_game = allGames.get(this.gameid); /*.users.find(u => u.id === message.user_id).name;*/
        socket.emit('watch game', this.gameid);
        socket.on('new action', game_id => {
            if(game_id === this.gameid) {
                this.update();
            }
        });
    }
};