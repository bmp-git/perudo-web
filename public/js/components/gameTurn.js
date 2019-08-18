const gameTurn = { template: `
        <div class="col-12 col-sm-12 col-md-10 offset-md-1 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2 pl-0 pr-0">
            <div class="row justify-content-around">
                <div v-bind:class="isUserTurn(user.id) ? 'animated pulse infinite slow' : ''" v-for="user in this.game.users">
                        <div class="row d-flex justify-content-center">
                            {{user.remaining_dice > 0 ? user.remaining_dice + " dice" : "loses"}}
                        </div>
                        <div class="row d-flex justify-content-center">
                            <router-link :to="{ name: 'profile', params: { id: user.id }}">
                                <template v-if="user.remaining_dice <= 0">
                                    <useravatar :userid="user.id" v-bind:style="[!isMe(user.id) ? {'border': '2px solid #AAAAAA'} : {}]" style="opacity: 0.5;" show_status="true"/>
                                </template>
                                <template v-else>
                                    <useravatar :userid="user.id" v-bind:style="[!isMe(user.id) ? {'border': '2px solid #AAAAAA'} : {}]" show_status="true"/>
                                </template>
                            </router-link>
                        </div>
                        <div class="row d-flex justify-content-center">
                            <router-link :to="{ name: 'profile', params: { id: user.id }}">
                                <template v-if="isMe(user.id)"> You </template> <template v-else><username :userid="user.id"/></template>
                            </router-link>
                        </div>
                        <template v-if="isUserTurn(user.id)">
                            <div class="row d-flex justify-content-center">
                                <i class="fas fa-chevron-up"></i>
                            </div>
                        </template>
                </div>
            </div>
        </div>`,
 props: ['game'],
 components: {
     'useravatar' : Useravatar,
     'username': Username,
 },
 data() {
    return {
    }
 },
 methods: {
     isMe: function(id) {
         return id === this.$store.state.user._id;
     },
     isUserTurn: function(user_id) {
         return this.game.current_turn_user_id === user_id;
     }
 }
};