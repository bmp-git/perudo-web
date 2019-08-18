var usernames = new Map(); //user id -> username
var waiting_username = new Map(); //user id -> true
var username_observers = [];
var cache_username = function (user_id, username) {
    usernames.set(user_id, username);
    username_observers.forEach(o => o());
    console.log("new name for " + user_id + " set (" + username + ")");
};
const Username = {
    template: `<template :key="count">{{username}}</template>`,
    props: ['userid'],
    data() {
        return {
            username: "Anonymous",
        }
    },
    methods: {
        updateUsername: function () {
            if (this.$store.state.user && this.userid === this.$store.state.user._id) {
                this.username = this.$store.state.user.username;
            } else if (usernames.get(this.userid)) {
                this.username = usernames.get(this.userid);
            } else if (!waiting_username.get(this.userid)) {
                waiting_username.set(this.userid, true);
                axios.get("/api/users/" + this.userid + "/username")
                    .then(response => {
                        cache_username(this.userid, response.data.username);
                        waiting_username.delete(this.userid);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        observer: function () {
            const username = usernames.get(this.userid);
            if (username) {
                this.username = username;
            }
        }
    },
    mounted: function () {
        username_observers.push(this.observer);
        this.updateUsername();
    },
    destroyed: function () {
        username_observers = username_observers.filter(o => o !== this.observer);
    },
    watch: {
        userid: function (val) {
            this.updateUsername();
        }
    }
};