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
firebase.initializeApp(firebaseConfig);

var addTeacherFormDB = firebase.database().red("add-teacher-form");

document.getElementById("add-teacher-form").addEventListener("submit", submitForm );

function submitForm(e) {
  e.preventDefault();

  var name = getElementVal('teacher-name');
  var department = getElementVal('teacher-department');
  var subject = getElementVal('teacher-subject');

  console.log(name, department, subject);
}

const getElementVal = (id) => {
  return document.getElementById(id).value;
}

// Export Firestore and Storage
const db = firebase.firestore();
const storage = firebase.storage();

