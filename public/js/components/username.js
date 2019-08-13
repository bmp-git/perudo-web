var usernames = new Map(); //user id -> username
var waiting_username = new Map(); //user id -> true
var username_observers = [];
var cache_username = function(user_id, username) {
    usernames.set(user_id, username);
    username_observers.forEach(o => o());
    console.log("new name for " + user_id + " set");
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
            if (usernames.get(this.userid)) {
                this.username = usernames.get(this.userid);
            } else if(!waiting_username.get(this.userid)) {
                waiting_username.set(this.userid, true);
                axios.get("/api/users/" + this.userid + "/username")
                    .then(response => {
                        this.username = response.data.username;
                        cache_username(this.userid, this.username);
                        waiting_username.delete(this.userid);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        observer: function () {
            this.username = usernames.get(this.userid);
        }
    },
    mounted: function () {
        this.updateUsername();
        username_observers.push(this.observer);
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