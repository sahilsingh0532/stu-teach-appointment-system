// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const auth = firebase.auth();
const db = firebase.firestore();
const realtimeDb = firebase.database().ref("appointments");

// Get form elements
const scheduleForm = document.getElementById('schedule-appointment-form');
const appointmentList = document.querySelector('.appointment-list');
const messageList = document.querySelector('.message-list');

// Log out functionality
document.getElementById('logout').addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = "../index.html";
    }).catch(error => {
        console.error("Logout error: ", error);
    });
});

// Schedule Appointment
scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const studentEmail = document.getElementById('student-email').value;
    const appointmentTime = document.getElementById('appointment-time').value;

    // Save appointment in Firebase
    scheduleAppointment(studentEmail, appointmentTime);
    scheduleForm.reset();
});

const scheduleAppointment = (studentEmail, appointmentTime) => {
    const appointmentId = realtimeDb.push().key;
    realtimeDb.child(appointmentId).set({
        studentEmail: studentEmail,
        teacherEmail: auth.currentUser.email,
        appointmentTime: appointmentTime,
        status: "pending"
    });
    alert("Appointment scheduled successfully!");
    loadAppointments();
};

// Load all appointments
const loadAppointments = () => {
    appointmentList.innerHTML = '';  // Clear the list
    realtimeDb.on('value', (snapshot) => {
        const appointments = snapshot.val();
        if (appointments) {
            Object.keys(appointments).forEach((key) => {
                const appointment = appointments[key];
                if (appointment.teacherEmail === auth.currentUser.email) {
                    const appointmentDiv = document.createElement('div');
                    appointmentDiv.classList.add('appointment-item');
                    appointmentDiv.innerHTML = `
                        <p><strong>Student:</strong> ${appointment.studentEmail}</p>
                        <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
                        <p><strong>Status:</strong> ${appointment.status}</p>
                        <button onclick="approveAppointment('${key}')">Approve</button>
                        <button onclick="cancelAppointment('${key}')">Cancel</button>
                    `;
                    appointmentList.appendChild(appointmentDiv);
                }
            });
        }
    });
};

// Approve appointment
const approveAppointment = (id) => {
    realtimeDb.child(id).update({ status: 'approved' })
        .then(() => alert("Appointment approved"))
        .catch(error => console.error("Error approving appointment: ", error));
};

// Cancel appointment
const cancelAppointment = (id) => {
    realtimeDb.child(id).remove()
        .then(() => alert("Appointment canceled"))
        .catch(error => console.error("Error canceling appointment: ", error));
};

// Load messages
const loadMessages = () => {
    messageList.innerHTML = '';  // Clear the list
    db.collection('messages').where('teacherEmail', '==', auth.currentUser.email).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const message = doc.data();
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message-item');
                messageDiv.innerHTML = `
                    <p><strong>From:</strong> ${message.studentEmail}</p>
                    <p><strong>Message:</strong> ${message.content}</p>
                    <p><strong>Time:</strong> ${message.timestamp.toDate()}</p>
                `;
                messageList.appendChild(messageDiv);
            });
        })
        .catch(error => console.error("Error loading messages: ", error));
};

// On page load, get the list of appointments and messages
window.onload = () => {
    loadAppointments();
    loadMessages();
};
