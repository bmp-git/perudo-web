const roundTimer = {
    template: `
<div class="container">
    <div class="progress">
    <div class="progress-bar progress-bar-striped progress-bar-animated" v-bind:class="(notransition?'notransition ':'') + (isUserTurn() ? remaining_time < 5000 ? 'bg-danger' : '' : 'bg-secondary')" role="progressbar" v-bind:style="'width: '+ progress_bar +'%'">{{Math.ceil(remaining_time/1000)}}</div>
    </div>
  </div>
</div>
`,
    props: ['game', 'refresh_time_ms'],
    data() {
        return {
            remaining_time: 0,
            progress_bar: 100,
            current_interval: null,
            offset: 0,
            notransition: true,
            pre_finish_time: 1000 //ms
        }
    },
    methods: {
        startTimer: function () {
            this.notransition = true;
            this.remaining_time = this.game.turn_time * 1000 + (new Date(this.game.turn_start_time) - new Date() - this.offset);
            this.progress_bar = 100;
            this.current_interval = setInterval(() => {
                this.notransition = false;
                this.remaining_time -= this.refresh_time_ms + (this.pre_finish_time / ((this.game.turn_time * 1000) / this.refresh_time_ms));
                this.progress_bar = ((this.remaining_time) * 100 / 1000) / (this.game.turn_time);
                if (this.remaining_time < 0) {
                    clearInterval(this.current_interval);
                    this.remaining_time = 0;
                    this.progress_bar = 0;
                }
            }, this.refresh_time_ms)
        },
        isUserTurn: function () {
            return this.game.current_turn_user_id === this.$store.state.user._id;
        }
    },
    mounted: function () {
        if (this.game.is_over) {
            this.remaining_time = 0;
            this.progress_bar = 0;
        } else {
            var send_time = new Date();
            Api.get_date(date => {
                var receive_time = new Date();
                var round_trip_time = receive_time - send_time;
                this.offset = date - receive_time + round_trip_time / 2;
                this.startTimer();
            });
        }
    },
    watch: {
        game: function (newGame, oldGame) {
            if (newGame.turn_start_time !== oldGame.turn_start_time) {
                if (!newGame.is_over && this.isUserTurn()) {
                    if ("vibrate" in navigator) {
                        window.navigator.vibrate(200);
                    }
                }
                if (this.current_interval != null) {
                    clearInterval(this.current_interval);
                }
                this.startTimer();
            }
            if (!oldGame.is_over && newGame.is_over) {
                if ("vibrate" in navigator) {
                    window.navigator.vibrate([300, 400, 300, 400, 1000]);
                }
                this.remaining_time = 0;
            }
        }
    }
};