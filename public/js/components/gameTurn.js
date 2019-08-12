const gameTurn = { template: `
<div class="container">
    <div class="row">
    <template v-for="user in this.game.users">
    <div class="col-4 col-md-2 pl-3 pr-3" >
            <div class="row d-flex justify-content-center">
                {{user.remaining_dice > 0 ? user.remaining_dice + " dice" : "loses"}}
            </div>
            <div class="row d-flex justify-content-center">
            <router-link :to="{ name: 'profile', params: { id: user.id }}">
                <template v-if="user.remaining_dice <= 0">
                    <img v-bind:src="user.avatar_url" class="ig-avatar" width="64px" height="64px" v-bind:style="[isMe(user.id) ? {'border': '2px solid #007BFF'} : {'border': '2px solid #AAAAAA'}]" style="object-fit: cover; border-radius: 50%; opacity: 0.5;">
                </template>
                <template v-else>
                    <img v-bind:src="user.avatar_url" class="ig-avatar" width="64px" height="64px" v-bind:style="[isMe(user.id) ? {'border': '2px solid #007BFF'} : {'border': '2px solid #AAAAAA'}]" style="object-fit: cover; border-radius: 50%;">
                </template>
            </router-link>
            </div>
            <div class="row d-flex justify-content-center">
            <router-link :to="{ name: 'profile', params: { id: user.id }}">
                <template v-if="isMe(user.id)"> You </template> <template v-else>{{user.username}}</template>
            </router-link>
            </div>
            <template v-if="this.game.current_turn_user_id === user.id">
            <div class="row d-flex justify-content-center">
            <i class="fas fa-chevron-up"></i>
            </div>
            </template>
        </div>
    </template>
    </div>
</div>
`,
props: ['game'],
 data() {
    return {
    }
 },
 methods: {
     isMe: function(id) {
         return id == this.$store.state.user._id;
     },
 }
}