import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Profile from '../views/Profile.vue';
import Dashboard from '../views/Dashboard.vue';
import BookDetail from '../views/BookDetail.vue';
import Unauthorized from '../views/Unauthorized.vue'; // Удалено расширение ".vue"
import AdminPanel from '../views/AdminPanel.vue';
import LibrarianPanel from '../views/LibrarianPanel.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/books/:id',
    name: 'BookDetail',
    component: BookDetail,
    props: true,
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true },
  },
  {
    path: '/librarian',
    name: 'LibrarianPanel',
    component: LibrarianPanel,
    meta: { requiresAuth: true },
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: Unauthorized,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('user');
  const user = JSON.parse(localStorage.getItem('user'));

  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/login');
  } else if (to.meta.requiresAuth && loggedIn) {
    if (user.role === 0 || user.role === 1) {
      next();
    } else {
      next('/unauthorized');
    }
  } else {
    next();
  }
});

export default router;
