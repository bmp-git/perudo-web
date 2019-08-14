const roundTimer = { template: `
<div class="container">
    <div class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" v-bind:style="'width: '+ (remaining_time * 100) / this.game.turn_time +'%'">{{remaining_time}}</div>
    </div>
  </div>
</div>
`,
props: ['game'],
 data() {
    return {
        remaining_time: 0,
        current_interval : null
    }
 },
 methods: {
     startTimer: function() {
        this.remaining_time = this.game.turn_time;
        this.current_interval = setInterval(() => {
            this.remaining_time -= 1;
            if(this.remaining_time < 0) {
                clearInterval(this.current_interval);
                this.remaining_time = 0;
            }
        }, 1000)
     }
 },
 mounted: function () {
    this.startTimer();
 },
 watch: { 
    game: function(newGame, oldGame) {
    if(newGame.turn_start_time !== oldGame.turn_start_time) {
        if(this.current_interval != null) {
            clearInterval(this.current_interval);
        }
        this.startTimer();
    }
  }
 }
};