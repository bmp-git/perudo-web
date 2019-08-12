const endOfRoundModal = {
    template: `
    <template v-if="visible">
    <div id="myModal" class="modal" @click.prevent="close">

      <!-- Modal content -->
      <div class="modal-content">
        <p>Paolo call Calza! ...</p>
      </div>

    </div>
  </template>
`,
props: [],
    data() {
        return {
          visible: false
        }
    },
    methods: {
      close() {
        this.visible = false;
        this.$emit('close');
      },
      show(dice) {
        this.visible = true;
      }
    },
    mounted: function () {

    }
};