const currentBid = { template: `
<div class="container">
    <div class="row d-flex justify-content-center">
        <template v-if="this.game.is_over">
            <h4>The game is over</h4>
        </template>
        <template v-else-if="this.game.current_bid">
            <h4>Current bid: {{this.game.current_bid.quantity}} dice of <p v-bind:class="'ml-1 dice dice-' + this.game.current_bid.dice"></p>
            </h4>
        </template>
        <template v-else>
            <h4>There are still no bids</h4>
        </template>
    </div>
</div>
`,
props: ['game']
}