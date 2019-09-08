const gameBadge = {
    template: ` <template v-if="game.is_over">
                    <span class="badge badge-dark" v-bind:style="'margin-bottom: ' + margin + 'px'">Game is over</span>
                </template>
                <template v-else-if="game.started">
                    <span class="badge badge-pill badge-danger" v-bind:style="'margin-bottom: ' + margin + 'px'">Game started</span>
                </template>
                <template v-else>
                    <span class="badge badge-pill badge-success" v-bind:style="'margin-bottom: ' + margin + 'px'">In lobby</span>
                </template>`,
    props: ['game', 'margin']
}