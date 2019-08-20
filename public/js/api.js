class Api {

    static log(message) {
        console.log("API => " + message);
    }
    static login(email, password, succHandler, errorHandler) {
        Api.log("posting on /api/users/" + email + "/token");
        axios.post("/api/users/" + email + "/token", { password })
            .then(response => {
                succHandler(response.data.token);
            })
            .catch(error => {
                errorHandler(error);
            });
    }

    static signup(email, username, password, succHandler, errorHandler) {
        Api.log("posting on /api/users/");
        axios.post("/api/users/", { email, username, password })
            .then(response => {
                succHandler();
            })
            .catch(error => {
                errorHandler(error);
            });
    }

    static get_dice(game_id, round, succHandler, errorHandler) {
        Api.log("getting on /api/games/" + game_id + "/dice");
        const authHeader = 'bearer '.concat(app.$store.state.token);
        axios.get("/api/games/" + game_id + "/dice", { params: { round }, headers: { Authorization: authHeader } })
            .then(response => {
                succHandler(response.data.result);
            })
            .catch(error => {
                errorHandler(error);
            });
    }

    static get_online_users(succHandler, errorHandler) {
        Api.log("getting on /api/online/users");
        axios.get("/api/online/users")
            .then(response => {
                if (succHandler) {
                    succHandler(response.data.result);
                }
            })
            .catch(error => {
                if (errorHandler) {
                    errorHandler(error);
                } else {
                    console.log(error);
                }
            });
    }

    static get_date(succHandler, errorHandler) {
        Api.log("getting on /api/date");
        axios.get("/api/date")
            .then(response => {
                if (succHandler) {
                    succHandler(new Date(response.data.date));
                }
            })
            .catch(error => {
                if (errorHandler) {
                    errorHandler(error);
                } else {
                    console.log(error);
                }
            });
    }

    static get_games(succHandler, errorHandler) {
        Api.log("getting on /api/games");
        axios.get("/api/games")
            .then(response => {
                if (succHandler) {
                    succHandler(response.data.result);
                }
            })
            .catch(error => {
                if (errorHandler) {
                    errorHandler(error);
                } else {
                    console.log(error);
                }
            });
    }

    //TODO rest of api calls...
}