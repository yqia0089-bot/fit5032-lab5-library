import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCrq3om_g-QB8HpeY-m4FL93Q6lYQk1BtQ",
  authDomain: "fit5032-nomash-library.firebaseapp.com",
  projectId: "fit5032-nomash-library",
  storageBucket: "fit5032-nomash-library.firebasestorage.app",
  messagingSenderId: "526807623075",
  appId: "1:526807623075:web:68ef8736b54bf460696616",
  measurementId: "G-29F0NQR2CN"
}

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)

export {
  firebaseApp,
  auth,
}