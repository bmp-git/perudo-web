const EndOfRoundModal = {
  template: `
    <template v-if="visible">
    <div id="myModal" class="modal" @click.prevent="close">

      <!-- Modal content -->
      <div class="modal-content">
        <template v-if="game.last_round_recap.leave_user">
          <h4 class="text-center mb-4">
          <img v-bind:src="'/api/users/'+game.last_round_recap.leave_user+'/avatar'" width="48px" height="48px" style="object-fit: cover; border-radius: 50%; border: 1px solid #007BFF;">
          <b class="text-primary"><username :userid="game.last_round_recap.leave_user"></username></b> left the game</h4>
         
        </template>
        <template v-else>
          <h4 class="text-center mb-4">
          <template v-if="game.last_round_recap.spoton_user"><b class="text-primary"><username :userid="game.last_round_recap.spoton_user"></username></b> spoton </template>
          <template v-if="game.last_round_recap.doubt_user"><b class="text-primary"><username :userid="game.last_round_recap.doubt_user"></username></b> doubt on </template>
          <b class="text-primary"><username :userid="game.last_round_recap.bid_user"></username></b> bid!</h4>
        
          <template v-for="d in dice">
            <h5 class="text-center">
              <img v-bind:src="'/api/users/'+d.user+'/avatar'" width="32px" height="32px" style="object-fit: cover; border-radius: 50%; border: 1px solid #007BFF;">
              <i v-bind:class="(game.last_round_recap.bid_user === d.user || game.last_round_recap.doubt_user === d.user || game.last_round_recap.spoton_user === d.user)?'text-primary':''"><username :userid="d.user"></username></i>
              <template v-for="v in d.dice">
                <template v-if="valid_dice(v, d.user)">
                  <span v-bind:class="'ml-2 dice dice-' + v" style="background-color: rgba(255,0,0, 1);"></span>
                </template>
                <template v-else>
                  <span v-bind:class="'ml-2 dice dice-' + v"></span>
                </template>
              </template>
            </h5>
          </template>
          <h4 class="text-center mt-3"><b class="text-info">Bid </b> is {{game.last_round_recap.bid.quantity}} dice of <span v-bind:class="'ml-2 dice dice-' + game.last_round_recap.bid.dice"></span></h4>
          <h6 class="text-center mb-3">Total count: {{total_count}}</h6>

          <template v-if="spoton_failed">
            <h6 class="text-center">Spoton was a <b class="text-danger">mistake</b>! <b class="text-primary"><username :userid="game.last_round_recap.spoton_user"></username></b> loses a dice</h6>
          </template>
          <template v-if="spoton_successful">
            <h6 class="text-center">Spoton was <b class="text-success">successful</b> and <b class="text-primary"><username :userid="game.last_round_recap.spoton_user"></username></b> earns a dice</h6>
          </template>
          <template v-if="doubt_failed">
            <h6 class="text-center">Doubt was a <b class="text-danger">mistake</b>! <b class="text-primary"><username :userid="game.last_round_recap.doubt_user"></username></b> loses a dice</h6>
          </template>
          <template v-if="doubt_successful">
            <h6 class="text-center"> <b class="text-primary"><username :userid="game.last_round_recap.doubt_user"></username></b> was right to doubt! <b class="text-primary"><username :userid="game.last_round_recap.bid_user"></username></b> loses a dice</h6>
          </template>
        </template>

        <template v-if="game.is_over">
          <h4 class="text-center mt-3"><b class="text-primary"><username :userid="game.winning_user"></username></b> won</h4>
          <img v-bind:src="'/api/users/'+game.winning_user+'/avatar'" class="mx-auto d-block" width="128px" height="128px" style="object-fit: cover; border-radius: 25%; border: 1px solid #007BFF;">
          </template>
          <template v-else>
            <h6 class="text-center mt-4">A new round is started</h6>
        </template>
      </div>
     

    </div>
  </template>
`,
  props: [],
  data() {
    return {
      visible: false,
      game: null,
      dice: [],
    }
  },
  components: {
    'username': Username,
  }, methods: {
    close: function () {
      this.visible = false;
    },
    show: function (game) {
      this.game = game;
      Api.get_dice(game.id, game.round - 1, dice => {
        this.dice = dice;
        this.visible = true;
      }, error => {
        console.log(error);
      });
    },
    valid_dice: function (value, user) {
      return value === this.game.last_round_recap.bid.dice || (user === this.game.last_round_recap.bid_user && value === 1);
    }
  },
  mounted: function () {

  },
  computed: {
    total_count: function () {
      var count = 0;
      this.dice.forEach(d => {
        d.dice.forEach(v => {
          if (this.valid_dice(v, d.user)) {
            count++;
          }
        });
      });
      return count;
    },
    spoton_failed: function () {
      return this.game.last_round_recap.spoton_user && this.total_count !== this.game.last_round_recap.bid.quantity;
    },
    spoton_successful: function () {
      return this.game.last_round_recap.spoton_user && this.total_count === this.game.last_round_recap.bid.quantity;
    },
    doubt_failed: function () {
      return this.game.last_round_recap.doubt_user && this.total_count >= this.game.last_round_recap.bid.quantity;
    },
    doubt_successful: function () {
      return this.game.last_round_recap.doubt_user && this.total_count < this.game.last_round_recap.bid.quantity;
    }
  }

};