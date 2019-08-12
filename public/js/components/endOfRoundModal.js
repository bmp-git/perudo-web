const EndOfRoundModal = {
  template: `
    <template v-if="visible">
    <div id="myModal" class="modal" @click.prevent="close">

      <!-- Modal content -->
      <div class="modal-content">
        <h4>
        <template v-if="game.last_round_recap.spoton_user"><b class="text-primary"><username :userid="game.last_round_recap.spoton_user"></username></b> spoton </template>
        <template v-if="game.last_round_recap.doubt_user"><b class="text-primary"><username :userid="game.last_round_recap.doubt_user"></username></b> doubt on </template>
        <b class="text-primary"><username :userid="game.last_round_recap.bid_user"></username></b> bid!</h4>
        <h5><b class="text-info">Bid:</b> {{game.last_round_recap.bid.quantity}} dice of <span v-bind:class="'ml-2 dice dice-' + game.last_round_recap.bid.dice"></span></h5>
        <template v-for="d in dice">
          <h6><username :userid="d.user"></username>
            <template v-for="v in d.dice">
              <template v-if="valid_dice(v, d.user)">
                <span v-bind:class="'ml-2 dice dice-' + v" style="background-color:red;"></span>
              </template>
              <template v-else>
                <span v-bind:class="'ml-2 dice dice-' + v"></span>
              </template>
            </template>
          </h6>
        </template>
        <h6>Total count: {{total_count}}!</h6>
        <h6>So the spoton was an <b class="text-danger">error</b> and <b class="text-primary">Loan</b> loses a dice</h6>
      </div>
      

    </div>
  </template>
`,
  props: [],
  data() {
    return {
      visible: true,
      game: {
        last_round_recap: {
          bid: {
            dice: 3,
            quantity: 3
          },
          bid_user: "5d485d76e58e243b48f19b5b",
          spoton_user: "5d4bf099d4e6900a64ad5738"
        }
      },
      dice: [
        {
          "user": "5d485d76e58e243b48f19b5b",
          "dice": [
            1,
            3,
            3,
            4,
            6
          ]
        },
        {
          "user": "5d4bf099d4e6900a64ad5738",
          "dice": [
            1,
            1,
            3,
            5
          ]
        }
      ]
    }
  },
  components: {
    'username': Username,
  }, methods: {
    close() {
      this.visible = false;
    },
    show(title, dice) {
      this.visible = true;
      this.dice = dice;
      this.title = title;
    },
    valid_dice(value, user) {
      return value === this.game.last_round_recap.bid.dice || (user === this.game.last_round_recap.bid_user && value === 1);
    },

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
    }
  }

};