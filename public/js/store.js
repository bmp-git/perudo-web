const store = new Vuex.Store( {
    state: {
        user : {
            _id : "",
            username : "",
            email : "",
        },
        authenticated : false,
        token: "",
        in_game : false,
        game_notifications : 0,
        game: {
            name: "",
            players: 0,
            turn_time: 30,
            id: 0,
            password: null,
            owner_id: "",
            started: false,
            game_creation_time: "",
            users: [],
            tick: 0
        }
    },
    mutations: {
        setToken(state, token) {
            if(token !== 'null') {
                state.authenticated = true;
                tokenData = JSON.parse(atob(token.split('.')[1]));
                state.user = tokenData.user;
                state.token = token;
                localStorage.token = token;
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
            localStorage.token = "";
            axios.defaults.headers.common['Authorization'] = "";
        },
        setGame(state, game) {
            state.in_game = true;
            state.game = game;
        },
        unsetGame(state) {
            state.in_game = false;
            state.game = {
                name: "",
                players: 0,
                turn_time: 30,
                id: 0,
                password: null,
                owner_id: "",
                started: false,
                game_creation_time: "",
                users: [],
                tick: 0
            }
        },
        addNotifications(state, notifications) {
            state.game_notifications += notifications;
        },
        clearNotifications(state) {
            state.game_notifications = 0;
        }
    }
});