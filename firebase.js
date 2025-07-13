// Initialize Firebase with environment variables
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCpJ0qObrgMUyqhsHUSHvYzwyYQKbK6HLA",
    authDomain: "reactnativechat-d3184.firebaseapp.com",
    projectId: "reactnativechat-d3184",
    storageBucket: "reactnativechat-d3184.appspot.com",
    messagingSenderId: "294164835584",
    appId: "1:294164835584:web:7be43c2542f89ee37017e5",
    measurementId: "G-Z4ZC6HCBDD"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Firestore collections
const postsCollection = collection(db, "posts");

// Authentication state observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById('usernameDisplay').textContent = `👋 Hi, ${user.displayName || user.email.split('@')[0]}`;
  } else {
    document.getElementById('usernameDisplay').textContent = '👋 Hi, Guest';
  }
});

// Logout function
window.logout = async function() {
  try {
    await signOut(auth);
    localStorage.removeItem('userToken');
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Logout error:', error);
    alert('Error during logout. Please try again.');
  }
};

export { 
  db, 
  postsCollection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  startAfter,
  doc,
  deleteDoc,
  auth,
  collection
};

