const router = new VueRouter({
    mode: 'history',
    routes: [
      { path: '/', component: Home },
      { path: '/login', component: Login },
      { path: '/signout', component: Logout },
      
      { path: '/movies', component: Movies },
      { path: '/crud', component: Crud },
      { path: '/404', component: NotFound },  
      { path: '*', redirect: '/404' }
    ]
  })
  