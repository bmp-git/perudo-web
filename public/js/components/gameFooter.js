const gameFooter = {
    template: `<div class="container"><template v-if="this.$store.state.in_game">
    <div class="row" @mouseover="footer_active = true" @mouseleave="footer_active = false">
          <div class="gameFooter col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12" >
              <div id="content" v-show="footer_active">
              <template v-if="this.$store.state.game.started">
                <span class="badge badge-pill badge-danger" style="margin-right:10px">Game started</span>
              </template>
              <template v-else>
                <span class="badge badge-pill badge-success" style="margin-right:10px" >In lobby</span>
              </template>
              <router-link :to="{ name: 'gamelobby', params: { id: this.$store.state.game.id }}" style="color:white; text-decoration:underline;">{{this.$store.state.game.name}}</router-link> 
              
              <i class=" fas fa-users ml-3" title="Number of users"> </i><small> {{usedSpaces}} </small>
              <i class="fas fa-stopwatch" title="Maximum time per turn"> </i> <small>{{turnTime}}</small>
              
              </div>
          </div>
    </div></div>`,
    data() {
        return {
            footer_active: false,
        }
    },
    methods: {
    },
    computed: {
        usedSpaces: function () {
            return Object.keys(this.$store.state.game.users).length + "/" + this.$store.state.game.players;
        },
        turnTime: function () {
            if (this.$store.state.game.turn_time) { 
                if(this.$store.state.game.turn_time % 60 === 0) {
                    return (this.$store.state.game.turn_time / 60) + " min";
                } else if(this.$store.state.game.turn_time > 60) {
                    return (this.$store.state.game.turn_time / 60 | 0)+ " min " + (this.$store.state.game.turn_time % 60) + " sec";
                }
                return this.$store.state.game.turn_time + " sec";
            } else {
                return "∞ s";
            }
        },
        getGameid: function() {
            return this.$store.state.game.id;
        }
    }
}