// Initialize Firebase
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
const auth = firebase.auth(); // Firebase Authentication
const db = firebase.database().ref("teachers"); // Reference to the teachers path in Firebase Realtime Database

// Function to get form input values
const getElementVal = (id) => document.getElementById(id).value;

// Add teacher to Firebase
document.getElementById("add-teacher-form").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  const name = getElementVal('teacher-name');
  const department = getElementVal('teacher-department');
  const subject = getElementVal('teacher-subject');
  const email = getElementVal('teacher-email');
  const password = getElementVal('teacher-password');

  // Register the teacher in Firebase Authentication
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // User registered successfully, now save additional data to Realtime Database
      const user = userCredential.user;
      saveTeacher(user.uid, name, department, subject, email);
    })
    .catch((error) => {
      console.error("Error registering teacher: ", error);
      alert(error.message);
    });

  // Clear form after submission
  document.getElementById("add-teacher-form").reset();
}

// Function to save teacher data in Firebase Realtime Database
const saveTeacher = (uid, name, department, subject, email) => {
  db.child(uid).set({
    name: name,
    department: department,
    subject: subject,
    email: email
  }, (error) => {
    if (error) {
      console.error("Error saving teacher: ", error);
    } else {
      alert("Teacher added successfully!");
      displayTeachers(); // Refresh the list after adding a teacher
    }
  });
}

// Function to display teachers from Firebase
function displayTeachers() {
  const teacherList = document.querySelector('.teacher-list');
  teacherList.innerHTML = '';  // Clear list before displaying updated content

  db.on('value', (snapshot) => {
    const teachers = snapshot.val();
    if (teachers) {
      Object.keys(teachers).forEach((key) => {
        const teacher = teachers[key];
        const teacherDiv = document.createElement('div');
        teacherDiv.classList.add('teacher-item');
        teacherDiv.innerHTML = `
          <p><strong>Name:</strong> ${teacher.name}</p>
          <p><strong>Department:</strong> ${teacher.department}</p>
          <p><strong>Subject:</strong> ${teacher.subject}</p>
          <p><strong>Email:</strong> ${teacher.email}</p>
          <button class="delete-btn" onclick="deleteTeacher('${key}')">Delete</button>
        `;
        teacherList.appendChild(teacherDiv);
      });
    } else {
      teacherList.innerHTML = '<p>No teachers available</p>';
    }
  });
}

// Call displayTeachers when the page loads
window.onload = displayTeachers;

// Delete teacher from Firebase
function deleteTeacher(id) {
  db.child(id).remove()
    .then(() => {
      auth.getUser(id).delete();  // Optional: Also remove teacher from Firebase Authentication
      alert("Teacher deleted successfully!");
      displayTeachers(); // Refresh the list after deletion
    })
    .catch((error) => {
      console.error("Error deleting teacher: ", error);
    });
}
