import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-PplpArekUbyq1v1W0aGxbCglQHgquMc",
  authDomain: "stud-teacher-book-app.firebaseapp.com",
  databaseURL: "https://stud-teacher-book-app-default-rtdb.firebaseio.com",
  projectId: "stud-teacher-book-app",
  storageBucket: "stud-teacher-book-app.appspot.com",
  messagingSenderId: "579237329410",
  appId: "1:579237329410:web:ca38b5cc9c4b5c9c8cc51b",
  measurementId: "G-CRHFHNX58S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Signup
document.getElementById('signupButton').addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert('Signup successful! Welcome ' + user.email);
      toggleForm();  // Switch to login form after successful signup
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert('Error: ' + errorMessage);
    });
});

// Login
document.getElementById('loginButton').addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert('Login successful! Welcome ' + user.email);
      // Redirect or perform some other action upon successful login
      if (user.email === 'sahilsingh0532@gmail.com') {
        window.location.href = 'admin.html';  
      } else {
        window.location.href = 'teacher.html';  
      }
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert('Error: ' + errorMessage);
    });
});

// Toggle between login and signup forms
