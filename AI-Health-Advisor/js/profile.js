// Konfigurasi Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth ,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc ,collection} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js"; 
import { firebaseConfig } from "./firebase.js";

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Calculate BMI
function calculateBMI(height, weight) {
    if (height > 0 && weight > 0) {
        return (weight / ((height / 100) ** 2)).toFixed(2);
    }
    return null;
}

// Generate Activity Recommendations
function generateRecommendations({ bloodType, bloodSugar, height, weight }) {
    const recommendationsDiv = document.getElementById("activityRecommendations");
    if (!recommendationsDiv) {
        console.error("Recommendations div not found!");
        return;
    }

    recommendationsDiv.innerHTML = ""; // Clear existing recommendations

    const bmi = calculateBMI(height, weight);
    let recommendations = [];
    const currentTime = new Date(); // Waktu saat ini

    // Menentukan rekomendasi berdasarkan BMI
    if (bmi < 18.5) {
        recommendations.push({
            message: "Pertimbangkan diet tinggi protein untuk menambah berat badan dengan sehat.",
            timeRemaining: 30, // 30 menit untuk aktivitas ini
            startTime: "08:00"
        });
        recommendations.push({
            message: "Lakukan latihan beban untuk memperkuat otot dan meningkatkan massa tubuh.",
            timeRemaining: 60, // 1 jam untuk aktivitas ini
            startTime: "09:00"
        });
    } else if (bmi >= 18.5 && bmi < 24.9) {
        recommendations.push({
            message: "Pertahankan berat badan Anda dengan nutrisi yang seimbang dan olahraga teratur.",
            timeRemaining: 60, // 1 jam untuk aktivitas ini
            startTime: "10:00"
        });
        recommendations.push({
            message: "Lakukan latihan kardio ringan, seperti berjalan cepat atau bersepeda, untuk menjaga kebugaran.",
            timeRemaining: 45, // 45 menit untuk aktivitas ini
            startTime: "11:30"
        });
    } else if (bmi >= 25) {
        recommendations.push({
            message: "Lakukan aktivitas fisik secara teratur dan konsultasikan dengan ahli gizi untuk strategi penurunan berat badan.",
            timeRemaining: 120, // 2 jam untuk aktivitas ini
            startTime: "12:30"
        });
        recommendations.push({
            message: "Cobalah latihan interval intensitas tinggi (HIIT) untuk meningkatkan pembakaran kalori.",
            timeRemaining: 60, // 1 jam untuk aktivitas ini
            startTime: "14:00"
        });
    }

    // Menambahkan rekomendasi untuk kadar gula darah tinggi
    if (bloodSugar > 140) {
        recommendations.push({
            message: "Pantau asupan gula Anda dan konsultasikan dengan dokter untuk mengelola kadar gula darah.",
            timeRemaining: 90, // 1,5 jam untuk aktivitas ini
            startTime: "15:00"
        });
        recommendations.push({
            message: "Perbanyak konsumsi makanan yang mengandung serat tinggi dan rendah glikemik.",
            timeRemaining: 45, // 45 menit untuk aktivitas ini
            startTime: "16:30"
        });
    }

    // Menambahkan rekomendasi untuk tipe darah
    if (bloodType === "O") {
        recommendations.push({
            message: "Perbanyak konsumsi protein tanpa lemak, seperti daging ayam dan ikan.",
            timeRemaining: 45, // 45 menit untuk aktivitas ini
            startTime: "17:00"
        });
        recommendations.push({
            message: "Tingkatkan konsumsi sayuran hijau untuk mendukung pencernaan.",
            timeRemaining: 60, // 1 jam untuk aktivitas ini
            startTime: "18:00"
        });
    } else if (bloodType === "A") {
        recommendations.push({
            message: "Fokuskan pada makanan berbasis tanaman dan hindari daging berat.",
            timeRemaining: 75, // 1,25 jam untuk aktivitas ini
            startTime: "19:00"
        });
        recommendations.push({
            message: "Konsumsi lebih banyak biji-bijian, kacang-kacangan, dan sayuran untuk meningkatkan energi.",
            timeRemaining: 45, // 45 menit untuk aktivitas ini
            startTime: "20:00"
        });
    } else if (bloodType === "B") {
        recommendations.push({
            message: "Konsumsi makanan kaya protein seperti daging sapi, domba, dan ikan.",
            timeRemaining: 60, // 1 jam untuk aktivitas ini
            startTime: "17:30"
        });
        recommendations.push({
            message: "Tambahkan konsumsi sayuran hijau dan produk susu untuk memperkuat sistem kekebalan tubuh.",
            timeRemaining: 45, // 45 menit untuk aktivitas ini
            startTime: "19:00"
        });
    } else if (bloodType === "AB") {
        recommendations.push({
            message: "Kombinasikan makanan berbasis tanaman dan hewani untuk keseimbangan yang baik.",
            timeRemaining: 60, // 1 jam untuk aktivitas ini
            startTime: "18:00"
        });
        recommendations.push({
            message: "Hindari makanan yang dapat menyebabkan peradangan, seperti makanan olahan dan lemak jenuh.",
            timeRemaining: 30, // 30 menit untuk aktivitas ini
            startTime: "19:30"
        });
    }
    

    // Menambahkan aktivitas dengan waktu dari 08:00 sampai 20:00
    const activities = [
        { message: "Bangun dan lakukan stretching ringan untuk memulai hari.", timeRemaining: 15, startTime: "08:00" },
        { message: "Lakukan sarapan sehat dengan makanan bergizi.", timeRemaining: 30, startTime: "08:30" },
        { message: "Jalan pagi selama 30 menit untuk menjaga kesehatan jantung.", timeRemaining: 30, startTime: "09:00" },
        { message: "Kerjakan tugas atau pekerjaan rumah dengan fokus.", timeRemaining: 60, startTime: "10:00" },
        { message: "Cobalah meditasi atau yoga untuk mengurangi stres.", timeRemaining: 20, startTime: "11:00" },
        { message: "Makan siang dengan menu yang bergizi dan seimbang.", timeRemaining: 45, startTime: "12:30" },
        { message: "Berjalan kaki atau berjalan di sekitar lingkungan selama 15 menit.", timeRemaining: 15, startTime: "14:00" },
        { message: "Lakukan olahraga ringan seperti berenang atau bersepeda.", timeRemaining: 60, startTime: "16:00" },
        { message: "Makan camilan sehat seperti buah atau kacang-kacangan.", timeRemaining: 20, startTime: "17:30" },
        { message: "Beristirahat sejenak dan lakukan peregangan ringan.", timeRemaining: 10, startTime: "08:00" },
        { message: "Makan malam dengan menu bergizi dan rendah kalori.", timeRemaining: 45, startTime: "19:30" },
        { message: "Lakukan aktivitas relaksasi sebelum tidur seperti membaca buku.", timeRemaining: 30, startTime: "20:00" }
    ];

    recommendations = recommendations.concat(activities);

    // Menampilkan rekomendasi aktivitas dengan waktu tersisa
    recommendations.forEach((rec) => {
        const recommendationDiv = document.createElement("div");
        recommendationDiv.classList.add("recommendation");

        // Menambahkan pesan aktivitas
        const pMessage = document.createElement("p");
        pMessage.textContent = rec.message;
        recommendationDiv.appendChild(pMessage);

        // Menampilkan waktu mulai aktivitas
        const pStartTime = document.createElement("p");
        pStartTime.classList.add("start-time");
        pStartTime.textContent = `Dimulai pada: ${rec.startTime}`;
        recommendationDiv.appendChild(pStartTime);

        // Menghitung waktu tersisa
        const timeLeft = new Date(currentTime.getTime() + rec.timeRemaining * 60000); // Menambahkan waktu dalam menit
        const timeLeftFormatted = timeLeft.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Menampilkan waktu tersisa
        const pTimeLeft = document.createElement("p");
        pTimeLeft.classList.add("time-left");
        pTimeLeft.textContent = `Waktu tersisa: ${timeLeftFormatted}`;
        recommendationDiv.appendChild(pTimeLeft);

        // Menambahkan tombol untuk menyelesaikan aktivitas
        const completeButton = document.createElement("button");
        completeButton.classList.add("complete-button");
        completeButton.textContent = "Tandai sebagai Selesai";
        completeButton.onclick = function() {
            recommendationDiv.remove(); // Menghapus rekomendasi jika sudah selesai
        };
        recommendationDiv.appendChild(completeButton);

        // Menambahkan rekomendasi ke dalam div utama
        recommendationsDiv.appendChild(recommendationDiv);
    });
}




// Fungsi untuk mengambil data profil dari server
async function fetchProfile() {
    try {
        const user = auth.currentUser; 
        if (!user) {
            console.warn("No user logged in.");
            return;
        }// Mendapatkan pengguna yang sedang 

        const docRef = doc(db, "profiles", user.uid); // Menggunakan user.uid
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const profileData = docSnap.data();
            document.getElementById("name").value = profileData.name || "";
            document.getElementById("email").value = profileData.email || "";
            document.getElementById("birthDate").value = profileData.birthDate || "";
            document.getElementById("bloodType").value = profileData.bloodType || "";
            document.getElementById("height").value = profileData.height || "";
            document.getElementById("weight").value = profileData.weight || "";
            document.getElementById("medicalHistory").value = profileData.medicalHistory || "";
            document.getElementById("bloodSugar").value = profileData.bloodSugar || "";

            const profileImage = profileData.profileImage || "img/default-profile.png";
            document.getElementById("profileImagePreview").src = profileImage;
            generateRecommendations({
                bloodType: profileData.bloodType || "",
                bloodSugar: profileData.bloodSugar || 0,
                height: parseFloat(profileData.height) || 0,
                weight: parseFloat(profileData.weight) || 0,
            });
        } else {
            console.log("Data profil tidak ditemukan.");
        }
    } catch (error) {
        console.error("Error mengambil data profil:", error);
        alert(" memuat data profil");
    }
}

// Save Profile Data
async function saveProfile(event) {
    event.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert("No user logged in.");
        return;
    }

    const profileData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        birthDate: document.getElementById("birthDate").value,
        bloodType: document.getElementById("bloodType").value,
        height: parseFloat(document.getElementById("height").value),
        weight: parseFloat(document.getElementById("weight").value),
        medicalHistory: document.getElementById("medicalHistory").value,
        bloodSugar: parseFloat(document.getElementById("bloodSugar").value),
    };

    try {
        await setDoc(doc(db, "profiles", user.uid), profileData);
        alert("Profile saved successfully!");
        generateRecommendations(profileData);
    } catch (error) {
        console.error("Error saving profile:", error);
        alert("Failed to save profile.");
    }
}
// Menambahkan event listener
const donationForm = document.querySelector(".register_form");

donationForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Cegah reload halaman
    const profileData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        birthDate: document.getElementById("birthDate").value,
        bloodType: document.getElementById("bloodType").value,
        height: document.getElementById("height").value,
        weight: document.getElementById("weight").value,
        medicalHistory: document.getElementById("medicalHistory").value,
        bloodSugar: document.getElementById("bloodSugar").value,
        profileImage: document.getElementById("profileImagePreview").src,
    };
    try {
        if (!auth.currentUser) {
            alert("Please log in to update profile.");
            return;
        }

        // Simpan data profil ke dokumen di koleksi "profiles" menggunakan UID pengguna
        const userDonationsRef = doc(db, "profiles", auth.currentUser.uid);
        await setDoc(userDonationsRef, profileData);

        alert("Profil berhasil diperbarui!");
        donationForm.reset(); // Reset form
    } catch (error) {
        console.error("Error saving profile:", error);
        alert("Gagal menyimpan profil. Silakan coba lagi.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Mengambil data profil saat halaman dimuat
    fetchProfile();

    // Menambahkan event listener untuk pengiriman form
   

    // Menambahkan event listener untuk upload gambar profil
    const profileImageInput = document.getElementById("profileImage");
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User logged in:", user.uid);
            fetchProfile();
        } else {
            console.warn("No user logged in.");
        }
    });
});


