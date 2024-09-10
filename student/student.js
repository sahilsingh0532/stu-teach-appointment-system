// Firebase configuration
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
const auth = firebase.auth();
const db = firebase.firestore();

// Register function
function register() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (!email || !password) {
        alert("Please fill out both fields");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Registration successful
            alert("Registration successful!");
            document.getElementById('registerEmail').value = '';
            document.getElementById('registerPassword').value = '';
        })
        .catch((error) => {
            console.error("Error during registration: ", error);
            alert(`Registration failed: ${error.message}`);
        });
}

// Login function
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert("Please fill out both fields");
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login successful
            alert("Login successful!");
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
        })
        .catch((error) => {
            console.error("Error during login: ", error);
            alert(`Login failed: ${error.message}`);
        });
}

// Search for a teacher
function searchTeacher() {
    const searchName = document.getElementById('searchTeacher').value.trim().toLowerCase();
    const teacherList = document.getElementById('teacherList');
    teacherList.innerHTML = ''; // Clear the previous list

    if (!searchName) {
        alert("Please enter a teacher's name");
        return;
    }

    db.collection('teachers')
        .where('name', '==', searchName)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                teacherList.innerHTML = '<li>No teachers found</li>';
            } else {
                querySnapshot.forEach((doc) => {
                    const teacher = doc.data();
                    const li = document.createElement('li');
                    li.textContent = `Name: ${teacher.name}, Subject: ${teacher.subject}`;
                    teacherList.appendChild(li);
                });
            }
        })
        .catch((error) => {
            console.error("Error during teacher search: ", error);
            alert(`Error searching for teachers: ${error.message}`);
        });
}

// Book an appointment
function bookAppointment() {
    const teacherName = document.getElementById('appointmentTeacher').value.trim();
    const appointmentTime = document.getElementById('appointmentTime').value;

    if (!teacherName || !appointmentTime) {
        alert("Please fill out all fields");
        return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
        alert("You must be logged in to book an appointment");
        return;
    }

    db.collection('appointments').add({
        teacherName: teacherName,
        appointmentTime: appointmentTime,
        studentEmail: currentUser.email
    })
    .then(() => {
        alert("Appointment booked successfully!");
        document.getElementById('appointmentTeacher').value = '';
        document.getElementById('appointmentTime').value = '';
    })
    .catch((error) => {
        console.error("Error during appointment booking: ", error);
        alert(`Error booking appointment: ${error.message}`);
    });
}

// Send a message
function sendMessage() {
    const messageContent = document.getElementById('messageContent').value.trim();

    if (!messageContent) {
        alert("Please enter a message");
        return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
        alert("You must be logged in to send a message");
        return;
    }

    db.collection('messages').add({
        messageContent: messageContent,
        studentEmail: currentUser.email
    })
    .then(() => {
        alert("Message sent successfully!");
        document.getElementById('messageContent').value = '';
    })
    .catch((error) => {
        console.error("Error sending message: ", error);
        alert(`Error sending message: ${error.message}`);
    });
}
