const gameTurn = { template: `
<div class="container">
    <div class="row">
    <template v-for="user in users">
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
            <template v-if="current_turn_user_id == user.id">
            <div class="row d-flex justify-content-center">
            <i class="fas fa-chevron-up"></i>
            </div>
            </template>
        </div>
    </template>
    </div>
</div>
`,
 data() {
    return {
        current_turn_user_id : "5d48650a8572232ea487da2b",
        users: [
            {
                id: "5d48650a8572232ea487da2b",
                avatar_url : "data:image/png;base64,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",
                username: "Panchh",
                remaining_dice: 5,
            },
            {
                id: "5d4edb010e4688201c5a8444",
                avatar_url : "data:image/png;base64,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",
                username: "Giaocomo",
                remaining_dice: 0,
            },
            {
                id: "5d4edb010e4688201c5a8444",
                avatar_url : "data:image/png;base64,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",
                username: "Giaocomo",
                remaining_dice: 2,
            }
        ]
    }
 },
 methods: {
     isMe: function(id) {
         return id == this.$store.state.user._id;
     },
     update: function(game) {
        this.users = game.users;
        this.current_turn_user_id = game.current_turn_user_id;
     }
 }
}