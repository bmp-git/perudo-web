const Useravatar = {
    template: `
    <template v-if="userid">
        <img ref="avatar" v-bind:src="'/api/users/'+userid+'/avatar'" class="useravatar">
    </template>
    <template v-else>
        <img ref="avatar" src="/img/empty" class="useravatar emptyuseravatar">
    </template>`,
    props: ['userid'],
    methods: {
        reload: function () {
            //workaround to refresh image
            this.$refs.avatar.src = this.$refs.avatar.src + ' '; 
        }
    }
};