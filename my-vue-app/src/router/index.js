import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../components/About.vue';
import Register from '../components/Register.vue';
import Login from '../components/Login.vue';
import Profile from '../views/Profile.vue';
import Dashboard from '../components/Dashboard.vue';
import BookDetail from '../views/BookDetail.vue';
import Unauthorized from '../components/Unauthorized.vue';
import AdminPanel from '../components/AdminPanel.vue';
import LibrarianPanel from '../components/LibrarianPanel.vue';

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
    meta: { requiresAuth: true, role: 0 },
  },
  {
    path: '/librarian',
    name: 'LibrarianPanel',
    component: LibrarianPanel,
    meta: { requiresAuth: true, role: 1 },
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
  } else if (to.matched.some(record => record.meta.requiresAuth) && loggedIn) {
    const userRole = user.role;
    if (to.meta.role !== undefined && to.meta.role !== userRole) {
      next('/unauthorized');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
