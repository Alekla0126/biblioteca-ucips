<?php
// buscar_ajax.php
require_once 'includes/db.php';

header('Content-Type: application/json');

$busqueda = isset($_GET['q']) ? trim($_GET['q']) : '';

// Solo buscamos si el usuario ha escrito al menos 2 letras
if (strlen($busqueda) >= 2) {
    try {
        // Buscamos coincidencias en el título o descripción
        $stmt = $pdo->prepare("SELECT id_recurso, titulo, ruta_portada FROM recursos WHERE titulo LIKE ? OR descripcion LIKE ? LIMIT 5");
        $termino = "%{$busqueda}%";
        $stmt->execute([$termino, $termino]);
        
        $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($resultados);
    } catch (PDOException $e) {
        echo json_encode([]);
    }
} else {
    echo json_encode([]);
}
?>