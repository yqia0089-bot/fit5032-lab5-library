import {
  createRouter,
  createWebHistory,
} from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseAccountView from '../views/FirebaseAccountView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/firebase-register',
    name: 'FirebaseRegister',
    component: FirebaseRegisterView,
  },
  {
    path: '/firebase-signin',
    name: 'FirebaseSignin',
    component: FirebaseSigninView,
  },
  {
    path: '/firebase-account',
    name: 'FirebaseAccount',
    component: FirebaseAccountView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router