class Api {

    static login(email, password, succHandler, errorHandler) {
        axios.post("/api/users/" + email + "/token", { password })
            .then(response => {
                succHandler(response.data.token);
            })
            .catch(error => {
                errorHandler(error);
            });
    }

    static signup(email, username, password, succHandler, errorHandler) {
        axios.post("/api/users/", { email, username, password })
            .then(response => {
                succHandler();
            })
            .catch(error => {
                errorHandler(error);
            });
    }

    static get_dice(game_id, round, succHandler, errorHandler) {
        const authHeader = 'bearer '.concat(this.$store.state.token);
        axios.get("/api/games/" + game_id + "/dice", { params: { round }, headers: { Authorization: authHeader } })
            .then(response => {
                succHandler(response.data.result);
            })
            .catch(error => {
                errorHandler(error);
            });
    }

    //TODO rest of api calls...

}