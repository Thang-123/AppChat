import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

    const firebaseConfig = {
        apiKey: "AIzaSyD16srfwYvv-nG2se-kfSlmvZV_FqK3fug",
        authDomain: "",
        projectId: "appchat-54d2b",
        storageBucket: "appchat-54d2b.appspot.com",
        messagingSenderId: "115913491056",
        appId: "1:115913491056:ios:d749d5823ccfdf2f012ab5"
    };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { app, firestore, storage };
