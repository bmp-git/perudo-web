var useravatars = new Map();
const Useravatar = {
    template: `
    <template v-if="userid">
        <img ref="avatar" v-bind:src="'/api/users/'+userid+'/avatar'" class="useravatar animated pulse infinite">
    </template>
    <template v-else>
        <img ref="avatar" src="/img/empty" class="useravatar emptyuseravatar">
    </template>`,
    props: ['userid'],
    methods: {
        reload: function () {
            useravatars.get(this.userid).forEach(e => {
                e.refresh_src();
            });
        },
        refresh_src: function() {
            this.$refs.avatar.src = this.$refs.avatar.src + ' ';  //workaround to refresh image
        }
    },
    mounted: function() {
        if(!useravatars.get(this.userid)) {
            useravatars.set(this.userid, []);
        }

        useravatars.get(this.userid).push(this);
    },
    destroyed: function () {
        useravatars.set(this.userid, useravatars.get(this.userid).filter(e => e !== this));
    }
};