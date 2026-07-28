import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'

import {
  onAuthStateChanged,
} from 'firebase/auth'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseAccountView from '../views/FirebaseAccountView.vue'
import AddBookView from '../views/AddBookView.vue'
import WeatherView from '../views/WeatherView.vue'
import CountBookAPIView from '../views/CountBookAPIView.vue'
import GetAllBookAPIView from '../views/GetAllBookAPIView.vue'

import { auth } from '../Firebase/init'

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
  {
    path: '/add-book',
    name: 'AddBook',
    component: AddBookView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/WeatherCheck',
    name: 'GetWeather',
    component: WeatherView,
  },
  {
    path: '/CountBookAPI',
    name: 'CountBookAPI',
    component: CountBookAPIView,
  },
  {
    path: '/GetAllBookAPI',
    name: 'GetAllBookAPI',
    component: GetAllBookAPIView,
  },
]

const useHashRouter =
  import.meta.env.VITE_USE_HASH_ROUTER ===
  'true'

const history = useHashRouter
  ? createWebHashHistory(
      import.meta.env.BASE_URL,
    )
  : createWebHistory(
      import.meta.env.BASE_URL,
    )

const router = createRouter({
  history,
  routes,
})

const getCurrentFirebaseUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
    )
  })
}

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) {
    return true
  }

  const currentUser =
    await getCurrentFirebaseUser()

  if (currentUser) {
    return true
  }

  return {
    name: 'FirebaseSignin',
    query: {
      redirect: to.fullPath,
    },
  }
})

export default router