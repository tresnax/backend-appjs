// frontend.js

const apiUrl = 'http://localhost:8080'; // Ganti dengan URL API yang sesuai

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Contoh pemanggilan endpoint login menggunakan fetch
  fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        console.log('Login successful. Token:', data.token);
        // Setelah login berhasil, arahkan ke dashboard.html atau halaman lainnya
        window.location.href = 'dashboard.html';
      } else {
        console.error('Login failed. Invalid credentials.');
        // Tampilkan pesan error atau lakukan tindakan lainnya
      }
    })
    .catch(error => console.error('Error during login:', error));
}

function getUserInfo() {
  // Logika untuk mendapatkan informasi pengguna
  // ...

  // Contoh pemanggilan endpoint menggunakan fetch
  fetch(`${apiUrl}/user-info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Sertakan token atau informasi autentikasi lain jika diperlukan
    },
    // Body request jika diperlukan
  })
    .then(response => response.json())
    .then(userInfo => {
      console.log('User Info:', userInfo);
      // Tampilkan informasi pengguna di DOM atau lakukan manipulasi lainnya
    })
    .catch(error => console.error('Error fetching user info:', error));
}

function getCourseList() {
  // Logika untuk mendapatkan daftar kursus
  // ...

  // Contoh pemanggilan endpoint menggunakan fetch
  fetch(`${apiUrl}/courses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Sertakan token atau informasi autentikasi lain jika diperlukan
    },
    // Body request jika diperlukan
  })
    .then(response => response.json())
    .then(courseList => {
      console.log('Course List:', courseList);
      // Tampilkan daftar kursus di DOM atau lakukan manipulasi lainnya
    })
    .catch(error => console.error('Error fetching course list:', error));
}

function getPurchases() {
  // Logika untuk mendapatkan daftar pembelian
  // ...

  // Contoh pemanggilan endpoint menggunakan fetch
  fetch(`${apiUrl}/purchases`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Sertakan token atau informasi autentikasi lain jika diperlukan
    },
    // Body request jika diperlukan
  })
    .then(response => response.json())
    .then(purchases => {
      console.log('Purchases:', purchases);
      // Tampilkan daftar pembelian di DOM atau lakukan manipulasi lainnya
    })
    .catch(error => console.error('Error fetching purchases:', error));
}
