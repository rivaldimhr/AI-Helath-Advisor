// Konfigurasi Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Fungsi Sign Up
async function signUp(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Simpan username ke Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username
    });

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Fungsi Sign In
async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const signInButton = document.getElementById("signIn_btn");
  const signUpButton = document.getElementById("signUp_btn");

  if (signInButton) {
    signInButton.addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (!email || !password) {
        alert("Harap isi email dan password.");
        return;
      }

      try {
        const user = await signIn(email, password);
        alert(`Login berhasil, selamat datang kembali!`);
        window.location.href = "AI-Health-Advisor/homepage.html";
      } catch (error) {
        alert(`Login gagal: ${error.message}`);
      }
    });
  }

  if (signUpButton) {
    signUpButton.addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const username = document.getElementById("name").value;

      // Validasi input
      if (!email || !password || !confirmPassword || !username) {
        alert("Semua field harus diisi!");
        return;
      }

      if (password !== confirmPassword) {
        alert("Password dan konfirmasi password tidak cocok!");
        return;
      }

      try {
        const user = await signUp(email, password, username);
        alert(`Berhasil daftar, selamat datang ${username}`);
        document.getElementById("register_form").reset();
        window.localStorage.setItem("username", username);
        window.location.href = "index.html";
      } catch (error) {
        alert(`Gagal daftar: ${error.message}`);
      }
    });
  }
});
