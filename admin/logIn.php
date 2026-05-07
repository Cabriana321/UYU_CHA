<?php
session_start();

$username = $_POST['username'];
$password = $_POST['password'];

$stored_username = 'Uyucha2025';
$stored_password = '25UYU_CHA';

if ($username === $stored_username && $password === $stored_password) {
    $_SESSION['loggedIn'] = true;

    echo 
    "<script>
        sessionStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'dashboard.php'; // Use .php for server-side session check
    </script>";
} else {
    echo 
    "<script>
        alert('Invalid credentials');
        window.location.href = 'index.html';
    </script>";
}
?>
