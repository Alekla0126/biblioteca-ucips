<?php
require_once 'includes/db.php';

$id_recurso = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// 1. SUMAR UNA VISTA AL CONTADOR
$pdo->prepare("UPDATE recursos SET vistas = vistas + 1 WHERE id_recurso = ?")->execute([$id_recurso]);

// 2. TRAER DATOS DEL LIBRO
$stmt = $pdo->prepare("SELECT r.*, c.nombre AS categoria_nombre FROM recursos r LEFT JOIN categorias c ON r.id_categoria = c.id_categoria WHERE r.id_recurso = ?");
$stmt->execute([$id_recurso]);
$libro = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$libro) { header("Location: index.php"); exit; }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($libro['titulo']) ?> - UCIPS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap" rel="stylesheet">
    
    <link href="https://cdn.jsdelivr.net/npm/@dearhive/dearflip-jquery-flipbook@1.7.3/dflip/css/dflip.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@dearhive/dearflip-jquery-flipbook@1.7.3/dflip/css/themify-icons.min.css" rel="stylesheet">

    <style>
        body { font-family: 'Poppins', sans-serif; background-color: #f4f6f9; }
        .navbar { background-color: #131a2f !important; border-bottom: 2px solid #d4af37; }
        .text-accent-gold { color: #d4af37; }
        
        /* Contenedor Premium para el Libro */
        .flipbook-container {
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
            border: 4px solid #131a2f;
            background-color: #131a2f;
            position: relative;
        }
    </style>
</head>
<body class="d-flex flex-column min-vh-100">

<nav class="navbar navbar-dark sticky-top shadow-sm mb-4">
    <div class="container">
        <a class="navbar-brand text-white text-decoration-none fw-bold" href="categoria.php?id=<?= $libro['id_categoria'] ?>">
            <i class="fa-solid fa-arrow-left me-2 text-accent-gold"></i> Volver a <?= htmlspecialchars($libro['categoria_nombre']) ?>
        </a>
    </div>
</nav>

<div class="container flex-grow-1 mb-5">
    
    <div class="row mb-5 bg-white p-4 p-md-5 rounded-4 shadow-sm align-items-center" style="border-top: 5px solid #d4af37;">
        <div class="col-md-9">
            <span class="badge px-3 py-2 mb-3" style="background-color: #131a2f; color: #d4af37;"><i class="fa-solid fa-tag me-1"></i> <?= htmlspecialchars($libro['categoria_nombre']) ?></span>
            <h1 class="fw-bolder mb-3" style="color: #131a2f;"><?= htmlspecialchars($libro['titulo']) ?></h1>
            
            <div class="d-flex flex-wrap gap-4 mb-4 text-muted small fw-semibold">
                <?php if(!empty($libro['autor'])): ?>
                    <div><i class="fa-solid fa-user-pen me-2" style="color: #d4af37;"></i>Autor: <?= htmlspecialchars($libro['autor']) ?></div>
                <?php endif; ?>
                <?php if(!empty($libro['anio'])): ?>
                    <div><i class="fa-solid fa-calendar-days me-2" style="color: #d4af37;"></i>Año: <?= htmlspecialchars($libro['anio']) ?></div>
                <?php endif; ?>
                <div><i class="fa-solid fa-eye me-2" style="color: #d4af37;"></i>Consultas: <?= $libro['vistas'] ?></div>
            </div>

            <h6 class="fw-bold text-dark">Sinopsis / Descripción</h6>
            <p class="text-secondary mb-4" style="line-height: 1.7;"><?= htmlspecialchars($libro['descripcion']) ?></p>
            
            <a href="uploads/pdfs/<?= htmlspecialchars($libro['ruta_pdf']) ?>" download class="btn btn-outline-secondary btn-sm rounded-pill px-4">
                <i class="fa-solid fa-download me-2"></i> Descargar PDF Original
            </a>
        </div>
        <div class="col-md-3 text-center mt-4 mt-md-0 d-none d-md-block">
            <img src="uploads/portadas/<?= htmlspecialchars($libro['ruta_portada']) ?>" class="img-fluid rounded shadow" style="max-height: 220px;">
        </div>
    </div>

    <div class="row">
        <div class="col-12 text-center mb-3">
            <h3 class="fw-bold" style="color: #131a2f;"><i class="fa-solid fa-book-open-reader me-2 text-accent-gold"></i> Visor Interactivo</h3>
            <p class="text-muted small">Arrastra las esquinas de las páginas para hojear el documento.</p>
        </div>
        
        <div class="col-12">
            <div class="flipbook-container">
                <div class="_df_book" height="750" webgl="true" backgroundcolor="#131a2f" source="uploads/pdfs/<?= htmlspecialchars($libro['ruta_pdf']) ?>" id="visor_flipbook"></div>
            </div>
        </div>
    </div>

</div>

<footer class="text-white py-4 mt-auto" style="background-color: #080b18;">
    <div class="container text-center text-md-start text-muted small">
        <div class="row align-items-center">
            <div class="col-md-6 mb-2 mb-md-0">
                <i class="fa-solid fa-building-shield me-2" style="color: #d4af37;"></i> UCIPS | Biblioteca Virtual
            </div>
            <div class="col-md-6 text-md-end">
                &copy; <?= date('Y') ?> Desarrollado para la excelencia académica.
            </div>
        </div>
    </div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@dearhive/dearflip-jquery-flipbook@1.7.3/dflip/js/dflip.min.js"></script>

<script>
document.addEventListener("DOMContentLoaded", function() {
    
    // Identificador único para cada libro basado en su ID de la base de datos
    const idLibro = "<?= $id_recurso ?>";
    const nombreSeparador = 'ucips_separador_' + idLibro;
    
    // 1. REVISAR SI HAY UNA PÁGINA GUARDADA AL ENTRAR
    const paginaGuardada = localStorage.getItem(nombreSeparador);
    
    // Si ya tiene una página guardada (> 1) y no viene de un enlace directo a una página...
    if (paginaGuardada && paginaGuardada > 1 && !window.location.hash.includes('page=')) {
        
        // Lanzar la pregunta al usuario
        const quiereRegresar = confirm("📚 ¡Hola! La última vez te quedaste leyendo en la página " + paginaGuardada + ". ¿Quieres continuar desde ahí?");
        
        if (quiereRegresar) {
            // Magia pura: Le inyectamos el hash a la URL antes de que el Flipbook cargue por completo.
            // DearFlip lo detecta automáticamente y abre el libro en esa página exacta.
            window.location.hash = "page=" + paginaGuardada;
        }
    }

    // 2. VIGILAR Y GUARDAR LA PÁGINA MIENTRAS EL ALUMNO LEE
    // Como DearFlip actualiza el hash (#page=X) cada vez que se pasa la hoja, 
    // hacemos un chequeo cada segundo para guardar ese número en el LocalStorage.
    setInterval(function() {
        const hashActivo = window.location.hash;
        const buscarPagina = hashActivo.match(/page=([0-9]+)/);
        
        if (buscarPagina && buscarPagina[1]) {
            localStorage.setItem(nombreSeparador, buscarPagina[1]);
        }
    }, 1000); // 1000 milisegundos = 1 segundo
    
});
</script>

</body>
</html>