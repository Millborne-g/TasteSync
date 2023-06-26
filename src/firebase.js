import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC9dbAkPVf2hAJEQmg8jDIYvKx1eoDYIaA",
    authDomain: "nutriplan-465d5.firebaseapp.com",
    databaseURL: "https://nutriplan-465d5-default-rtdb.firebaseio.com",
    projectId: "nutriplan-465d5",
    storageBucket: "nutriplan-465d5.appspot.com",
    messagingSenderId: "600227714968",
    appId: "1:600227714968:web:e396a322d6b380255dfded",
    measurementId: "G-TVH5V2EB6Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export { db, storage };