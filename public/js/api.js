class Api {

    static log(message) {
        console.log("API => " + message);
    }
    static handleError(error, errorHandler) {
        if (errorHandler) {
            errorHandler(error);
        }
        console.log("API error => " + error);
    }

    static login(email, password, succHandler, errorHandler) {
        Api.log("posting on /api/users/" + email + "/token");
        axios.post("/api/users/" + email + "/token", { password })
            .then(response => {
                if (succHandler) {
                    succHandler(response.data.token);
                }
            })
            .catch(error => Api.handleError(error, errorHandler));
    }

    static signup(email, username, password, succHandler, errorHandler) {
        Api.log("posting on /api/users/");
        axios.post("/api/users/", { email, username, password })
            .then(response => {
                if (succHandler) {
                    succHandler();
                }
            })
            .catch(error => Api.handleError(error, errorHandler));
    }

    static get_dice(game_id, round, succHandler, errorHandler) {
        Api.log("getting on /api/games/" + game_id + "/dice");
        const authHeader = 'bearer '.concat(app.$store.state.token);
        axios.get("/api/games/" + game_id + "/dice", { params: { round }, headers: { Authorization: authHeader } })
            .then(response => {
                if (succHandler) {
                    succHandler(response.data.result);
                }
            })
            .catch(error => Api.handleError(error, errorHandler));
    }

    static get_online_users(succHandler, errorHandler) {
        Api.log("getting on /api/online/users");
        axios.get("/api/online/users")
            .then(response => {
                if (succHandler) {
                    succHandler(response.data.result);
                }
            })
            .catch(error => Api.handleError(error, errorHandler));
    }

    static get_date(succHandler, errorHandler) {
        Api.log("getting on /api/date");
        axios.get("/api/date")
            .then(response => {
                if (succHandler) {
                    succHandler(new Date(response.data.date));
                }
            })
            .catch(error => Api.handleError(error, errorHandler));
    }

    static get_games(succHandler, errorHandler) {
        Api.log("getting on /api/games");
        axios.get("/api/games")
            .then(response => {
                if (succHandler) {
                    succHandler(response.data.result);
                }
            })
            .catch(error => Api.handleError(error, errorHandler));
    }

    static get_game(id, succHandler, errorHandler) {
        Api.log("getting on /api/games/" + id);
        axios.get("/api/games/" + id)
            .then(response => {
                if (succHandler) {
                    succHandler(response.data.result);
                }
            })
            .catch(error => Api.handleError(error, errorHandler));
    }
}