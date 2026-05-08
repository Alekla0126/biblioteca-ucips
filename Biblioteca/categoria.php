<?php
require_once 'includes/db.php';

$id_categoria = isset($_GET['id']) ? (int)$_GET['id'] : 0;

try {
    // Obtener nombre de la categoría
    $stmtCat = $pdo->prepare("SELECT * FROM categorias WHERE id_categoria = ?");
    $stmtCat->execute([$id_categoria]);
    $categoria = $stmtCat->fetch(PDO::FETCH_ASSOC);

    if (!$categoria) { header("Location: index.php"); exit; }

    // Obtener libros de esta categoría
    $stmtLibros = $pdo->prepare("SELECT * FROM recursos WHERE id_categoria = ? ORDER BY id_recurso DESC");
    $stmtLibros->execute([$id_categoria]);
    $libros = $stmtLibros->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="es" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($categoria['nombre']) ?> - UCIPS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap" rel="stylesheet">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    
    <style>
        :root {
            --bg-body: #f8f9fa;
            --text-main: #131a2f;
            --card-bg: #ffffff;
            --netflix-shadow: rgba(0, 0, 0, 0.2);
        }

        [data-theme="dark"] {
            --bg-body: #0a0f1c;
            --text-main: #e2e8f0;
            --card-bg: #121929;
            --netflix-shadow: rgba(0, 0, 0, 0.6);
        }

        body { font-family: 'Poppins', sans-serif; background-color: var(--bg-body); color: var(--text-main); transition: 0.4s; }
        .navbar { background-color: #131a2f !important; border-bottom: 2px solid #d4af37; }

        /* --- ESTILO NETFLIX CARDS --- */
        .netflix-row {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 25px;
            padding: 20px 0;
        }

        .netflix-card {
            position: relative;
            border-radius: 10px;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            cursor: pointer;
            aspect-ratio: 2 / 3;
            box-shadow: 0 10px 20px var(--netflix-shadow);
            border: 1px solid rgba(255,255,255,0.05);
        }

        .netflix-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s;
        }

        /* Overlay que aparece al hacer hover (Como Netflix) */
        .netflix-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to top, rgba(19, 26, 47, 0.95) 10%, rgba(0,0,0,0) 100%);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 20px;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .netflix-card:hover {
            transform: scale(1.1);
            z-index: 10;
            box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3);
        }

        .netflix-card:hover .netflix-overlay { opacity: 1; }
        .netflix-card:hover img { transform: scale(1.1); filter: brightness(0.6); }

        .btn-play {
            background-color: #d4af37;
            color: #131a2f;
            border: none;
            border-radius: 50px;
            padding: 8px 15px;
            font-weight: 700;
            font-size: 0.8rem;
            text-transform: uppercase;
            transition: 0.3s;
        }

        /* Título de la categoría estilo cine */
        .category-header {
            padding: 40px 0;
            border-left: 5px solid #d4af37;
            padding-left: 20px;
            margin-bottom: 30px;
        }

        .btn-theme-toggle {
            background: rgba(255,255,255,0.1); color: #d4af37; border: 1px solid rgba(212, 175, 55, 0.5);
            width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%;
        }

        @media (max-width: 600px) {
            .netflix-row { grid-template-columns: repeat(2, 1fr); gap: 15px; }
        }
    </style>
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark sticky-top">
    <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="index.php">
            <i class="fa-solid fa-arrow-left me-3 text-accent-gold"></i> 
            <span>UCIPS <span class="text-accent-gold">Biblioteca</span></span>
        </a>
        <div class="ms-auto d-flex align-items-center">
            <button class="btn-theme-toggle me-3" id="themeToggleBtn"><i class="fa-solid fa-moon"></i></button>
            <a href="index.php" class="btn btn-outline-light btn-sm rounded-pill px-3">Volver al Inicio</a>
        </div>
    </div>
</nav>

<div class="container mt-5">
    <div class="category-header" data-aos="fade-right">
        <h1 class="display-5 fw-bold text-main"><?= htmlspecialchars($categoria['nombre']) ?></h1>
        <p class="text-muted mb-0">Explorando <?= count($libros) ?> títulos disponibles en esta área.</p>
    </div>

    <div class="netflix-row">
        <?php if (count($libros) > 0): ?>
            <?php foreach ($libros as $libro): ?>
                <div class="netflix-card" data-aos="zoom-in" onclick="window.location.href='recurso.php?id=<?= $libro['id_recurso'] ?>'">
                    <img src="uploads/portadas/<?= htmlspecialchars($libro['ruta_portada']) ?>" alt="<?= htmlspecialchars($libro['titulo']) ?>">
                    <div class="netflix-overlay">
                        <h6 class="text-white fw-bold mb-1"><?= htmlspecialchars($libro['titulo']) ?></h6>
                        <p class="text-light small mb-3" style="font-size: 0.7rem; opacity: 0.8;">
                            <?= htmlspecialchars($libro['autor'] ?: 'Institucional') ?> • <?= htmlspecialchars($libro['anio'] ?: 'S/A') ?>
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn-play"><i class="fa-solid fa-play me-1"></i> Leer</button>
                            <span class="text-accent-gold small"><i class="fa-solid fa-eye"></i> <?= $libro['vistas'] ?></span>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-box-open fa-4x text-muted opacity-20 mb-3"></i>
                <h3 class="text-muted fw-light">Aún no hay libros en esta sección.</h3>
            </div>
        <?php endif; ?>
    </div>
</div>

<footer class="text-white py-4 mt-5" style="background-color: #080b18;">
    <div class="container text-center small opacity-50">
        &copy; <?= date('Y') ?> Universidad de las Ciencias Policiales y de la Seguridad.
    </div>
</footer>

<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        AOS.init({ once: true });

        // Lógica de Modo Oscuro (Sincronizada con el Index)
        const themeBtn = document.getElementById('themeToggleBtn');
        const themeIcon = themeBtn.querySelector('i');
        const savedTheme = localStorage.getItem('ucips_theme');

        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }

        themeBtn.addEventListener('click', () => {
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('ucips_theme', 'light');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('ucips_theme', 'dark');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            }
        });
    });
</script>
</body>
</html>