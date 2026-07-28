import {
  createRouter,
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
import GetBookCountView from '../views/GetBookCountView.vue'
import FirestoreDataMarketView from '../views/FirestoreDataMarketView.vue'

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
  {
    path: '/cloud-book-count',
    name: 'CloudBookCount',
    component: GetBookCountView,
  },
  {
    path: '/firestore-data-market',
    name: 'FirestoreDataMarket',
    component: FirestoreDataMarketView,
    meta: {
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
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