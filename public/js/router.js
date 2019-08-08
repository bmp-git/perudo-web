const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', component: Home},
        {path: '/leaderboard', component: Leaderboard},
        {path: '/games', component: Games},
        {path: '/new_game', component: NewGame, meta: {requiresAuth: true} },
        {path: '/game/:id', component: gameLobby, name: "gamelobby", meta: {requiresAuth: true} },
        {path: '/signin', component: Login, meta: {requiresNotAuth: true}},
        {path: '/signup', component: Signup, meta : {requiresNotAuth : true}},
        {path: '/signout', component: Logout, name: "logout", meta: {requiresAuth: true}},
        {path: '/settings', component: ProfileSettings, name: "settings", meta: {requiresAuth: true}},
        {path: '/profile/:id', component: Profile, name: "profile"},
        {path: '/404', component: NotFound},
        {path: '*', redirect: '/404'}
    ]
});


router.beforeEach((to, from, next) => {
    //console.log("Called beforeEach. requiresAuth: " + to.meta.requiresAuth + " requiresNotAuth: " + to.meta.requiresNotAuth);
    console.log("from: " + from.path + ", to:" + to.path);
    if (to.meta.requiresAuth) { // check the meta field
        if (localStorage.token) { // check if the user is authenticated
            next() // the next method allow the user to continue to the router
        } else {
            next('/') // Redirect the user to the main page
        }
    } else if (to.meta.requiresNotAuth) {
        //console.log("Called beforeEach. requiresNotAuth and authenticated " + store.state.authenticated + localStorage.token);
        if (!localStorage.token) {
            next()
        } else {
            next('/')
        }
    } else {
        next()
    }
});

