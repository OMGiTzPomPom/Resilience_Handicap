import {createRouter, createWebHistory} from 'vue-router'

import Wrapper from "../components/Wrapper.vue";
import Users from "../views/Users.vue";
import Register from "../views/Register.vue";
import Http404 from "../pages/404.vue";
import toHomepage from "../components/ToHomepage.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes:
        [
            {
                path: '',
                component: Wrapper,
                children: [
                    {path: '', component: toHomepage},
                    {path: '/users', component: Users, name: 'Users'},
                    {path: '/register', component: Register, name: 'Register'},
                ]
            },
            /*
                Not found
            */
            {path: '/:pathMatch(.*)*', component: Http404, name: '404 - Page not found'}
        ]
})

router.beforeEach((to, from, next) => {
    document.title = 'ParkingUCAManger | ' + to.name;
    next();
});

export default router
