if (localStorage.token) {
    console.log("Loaded token from localstorage " + localStorage.token);
    store.commit('setToken', localStorage.token);
}

const app = new Vue({
    router,
    el: "#perudo",
    store,
    methods: {
    },
    mounted() {
    }
});