import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDpKwCZ0Xew99aY2B2DUCMjP4IDG9spDL4",
  authDomain: "campuseventui-3fe4f.firebaseapp.com",
  projectId: "campuseventui-3fe4f",
  storageBucket: "campuseventui-3fe4f.firebasestorage.app",
  messagingSenderId: "548491353901",
  appId: "1:548491353901:web:abe9f5572b91052ff83da4"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)