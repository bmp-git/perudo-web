var useravatars = new Map();
const Useravatar = {
    template: `
    <template v-if="userid">
        <img alt="User avatar" ref="avatar" v-bind:src="'/api/users/'+userid+'/avatar'" class="useravatar" 
        v-bind:style="'opacity: '+(($store.state.online_users.some(u => u.id === userid) || !show_status)?'1':'0.2')" 
        v-bind:title="$store.state.online_users.some(u => u.id === userid)?'Online':'Offline'">
    </template>
    <template v-else>
        <img alt="Empty space" ref="avatar" src="/public/img/empty.png" class="useravatar emptyuseravatar">
    </template>`,
    props: ['userid' ,'show_status'],
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