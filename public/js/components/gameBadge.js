const gameBadge = {
    template: ` <template v-if="game.is_over">
                    <span class="badge badge-dark" style="margin-bottom:10px">Game is over</span>
                </template>
                <template v-else-if="game.started">
                    <span class="badge badge-pill badge-danger" style="margin-bottom:10px">Game started</span>
                </template>
                <template v-else>
                    <span class="badge badge-pill badge-success" style="margin-bottom:10px">In lobby</span>
                </template>`,
    props: ['game']
}