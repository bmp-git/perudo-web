const app = new Vue({
    router,
    el: "#perudo",
    store,
    methods: {
    },
    mounted() {
        if (localStorage.token !== 'null') {
            console.log("Loaded token from localstorage " + localStorage.token);
            store.commit('setToken', localStorage.token);
        }
    }
});