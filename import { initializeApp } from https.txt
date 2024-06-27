import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js"; // The Firebase Authentication module

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsBYLI--9DMvyI6WgK_RcpdfqUOdewNj0",
  authDomain: "login-feaf7.firebaseapp.com",
  databaseURL: "https://login-feaf7-default-rtdb.firebaseio.com",
  projectId: "login-feaf7",
  storageBucket: "login-feaf7.appspot.com",
  messagingSenderId: "350132601610",
  appId: "1:350132601610:web:c791f1d717fcf7f181b0f3",
  measurementId: "G-EKCTRJJNWC"
};

const firebaseApp = initializeApp(firebaseConfig); // Initialize firebaseApp using the firebaseConfig
const auth = getAuth(firebaseApp); // Initialize auth using the app instance

const signUpForm = document.getElementById('signup-form');
const nameInpute = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');


signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // user value OBJect
    var user = {
      name:nameInpute.value,
      email:emailInput.value,
      password:passwordInput.value
    }

    signUpForm.reset();

    try {
        // Create a new user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
        const User = userCredential.user;
        console.log('User signed up:', User);
        alert("User Created");
        // You can redirect or show a success message here
    } catch (error) {
        // Handle sign-up errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Sign-up error:', errorCode, errorMessage);
        alert('Sign-up error:', errorCode, errorMessage);
        // You can display an error message to the user here
    }

    console.log(user);

//here I get some error like The requested module 'https://www.gstatic.com/firebasejs/8.2.9/firebase-auth.js' does not provide an export named 'createUserWithEmailAndPassword',
//so I just use 'async' because we're making use of the createUserWithEmailAndPassword function, which is likely an asynchronous operation (it communicates with a server to create a user account).
// so I don't use below code 

    // createUserWithEmailAndPassword(auth, obj.email, obj.password)
    //     .then((userCredential) => {
    //         // User signed up successfully
    //         const user = userCredential.user;
    //         console.log('User signed up:', user);
    //         // You can redirect or show a success message here
    //     })
    //     .catch((error) => {
    //         // Handle sign-up errors
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         console.error('Sign-up error:', errorCode, errorMessage);
    //         // You can display an error message to the user here
    //     });
});
