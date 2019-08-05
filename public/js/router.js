const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', component: Home},
        {path: '/login', component: Login, meta: {requiresNotAuth: true}},
        {path: '/signup', component: Signup, meta : {requiresNotAuth : true}},
        {path: '/signout', component: Logout, meta: {requiresAuth: true}},
        {path: '/profile', component: Profile, meta: {requiresAuth: true}},
        {path: '/movies', component: Movies},
        {path: '/crud', component: Crud},
        {path: '/404', component: NotFound},
        {path: '*', redirect: '/404'}
    ]
});

router.beforeEach((to, from, next) => {
    console.log("Called beforeEach. requiresAuth: " + to.meta.requiresAuth + " requiresNotAuth: " + to.meta.requiresNotAuth)

    if (to.meta.requiresAuth) { // check the meta field
        if (localStorage.token !== 'null') { // check if the user is authenticated
            next() // the next method allow the user to continue to the router
        } else {
            next('/') // Redirect the user to the main page
        }
    } else if (to.meta.requiresNotAuth) {
        console.log("Called beforeEach. requiresNotAuth and authenticated " + store.state.authenticated + localStorage.token);
        if (localStorage.token === 'null') {
            next()
        } else {
            next('/')
        }
    } else {
        next()
    }
});

  