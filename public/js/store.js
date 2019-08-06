const store = new Vuex.Store( {
    state: {
        user : {
            _id : "",
            username : "",
            email : "",
        },
        authenticated : false,
        token: ""
    },
    mutations: {
        setToken(state, token) {
            if(token !== 'null') {
                state.authenticated = true;
                tokenData = JSON.parse(atob(token.split('.')[1]));
                state.user = tokenData.user;
                state.token = token;
                axios.defaults.headers.common['Authorization'] = "bearer" + token;
            }
        },
        unsetToken(state) {
            state.authenticated = false;
            state.user = {
                _id : "",
                username : "",
                email : "",
            };
            state.token = "";
            axios.defaults.headers.common['Authorization'] = "";
        },
        setUsername(state, username) {
            state.user.username = username;
        }
    }
});