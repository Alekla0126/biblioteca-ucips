<?php
// includes/db.php

$host = 'localhost';
$dbname = 'u207317217_biblioteca'; 
$username = 'u207317217_biblioadmin'; 
$password = 'Arturo96@'; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error crítico de conexión: " . $e->getMessage());
}
?>