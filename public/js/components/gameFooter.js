const gameFooter = {
    template: `<div class="container" v-if="showFooter">
    <div class="row">
          <div class="gameFooter col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
              <div id="content">
            <div class="row d-flex justify-content-around">
              <div>
                <span class="badge badge-pill badge-light" v-bind:class="notification_animation" v-show="notification > 0">{{notification}} new notifications! </span>
                <gameBadge v-bind:game="this.$store.state.game" v-bind:margin="0"></gameBadge>
                <router-link :to="{ name: 'gamelobby', params: { id: this.$store.state.game.id }}" style="color:white; text-decoration:underline;">{{this.$store.state.game.name}}</router-link>
              </div>
              
              <div><i class=" fas fa-users ml-3" title="Number of users"> </i><small> {{usedSpaces}} </small>
              <i class="fas fa-stopwatch" title="Maximum time per turn"> </i> <small>{{turnTime}}</small></div>
              </div>
          </div>
    </div></div>`,
    components: {
        'gameBadge' : gameBadge
    },
    data() {
        return {
            first_notification : true,
            last_tick : 0,
            notification_animation: ''
        }
    },
    methods: {
        updateNotification: function(game) {
            if(this.showFooter) {
                store.commit('addNotifications', this.first_notification ? 1 : (game.tick - this.last_tick));
                this.first_notification = false;
            }
            this.last_tick = game.tick;
        }
    },
    computed: {
        notification: function() {
            return this.$store.state.game_notifications;
        },
        showFooter: function() {
            return this.$store.state.in_game && this.$route.name !== "gamelobby";
        },
        usedSpaces: function() {
            return Object.keys(this.$store.state.game.users).length + "/" + this.$store.state.game.players;
        },
        turnTime: function() {
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
    },
    mounted: function () {
        socket.on('game changed', (g) => {
            this.updateNotification(g);
        });
    },
    destroyed: function () {
        socket.off('game changed');
    },
    watch: { 
        notification: function(_,_) {
            this.notification_animation = '';
            setInterval(() => {
                this.notification_animation = 'animated heartBeat';
            },100)
        }
    }
}