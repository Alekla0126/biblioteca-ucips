<?php
require_once 'includes/db.php';

try {
    // Cargar Categorías
    $stmtCat = $pdo->query("SELECT * FROM categorias");
    $categorias = $stmtCat->fetchAll(PDO::FETCH_ASSOC);

    // Cargar los 4 libros más recientes
    $stmtRecientes = $pdo->query("SELECT r.*, c.nombre as cat_nombre FROM recursos r LEFT JOIN categorias c ON r.id_categoria = c.id_categoria ORDER BY r.id_recurso DESC LIMIT 4");
    $recientes = $stmtRecientes->fetchAll(PDO::FETCH_ASSOC);

    // Obtener Estadísticas
    $total_recursos = $pdo->query("SELECT COUNT(*) FROM recursos")->fetchColumn();
    $total_categorias = count($categorias);
    $total_vistas = $pdo->query("SELECT SUM(vistas) FROM recursos")->fetchColumn() ?: 0;

} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="es" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Biblioteca Virtual UCIPS</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap" rel="stylesheet">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    
    <style>
        /* ========================================= */
        /* VARIABLES DE COLOR (MODO CLARO Y OSCURO)  */
        /* ========================================= */
        :root {
            --bg-body: #f8f9fa;
            --text-main: #131a2f;
            --text-muted: #6c757d;
            --card-bg: #ffffff;
            --card-border: rgba(0,0,0,0.05);
            --icon-wrap-bg: linear-gradient(135deg, rgba(19, 26, 47, 0.05) 0%, rgba(19, 26, 47, 0.1) 100%);
            --search-hover: #f0f2f5;
            --accent-gold: #d4af37;
        }

        [data-theme="dark"] {
            --bg-body: #0a0f1c;
            --text-main: #e2e8f0;
            --text-muted: #94a3b8;
            --card-bg: #121929;
            --card-border: rgba(255,255,255,0.05);
            --icon-wrap-bg: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.15) 100%);
            --search-hover: #1e293b;
        }

        /* ========================================= */
        /* MODAL DE PRIVACIDAD RESPONSIVO            */
        /* ========================================= */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            padding: 15px;
            opacity: 1;
            transition: opacity 0.5s ease;
        }

        .modal-aviso {
            background: var(--card-bg);
            max-width: 550px;
            width: 100%;
            padding: 2.5rem;
            border-radius: 25px;
            border-top: 8px solid var(--accent-gold);
            text-align: left;
            box-shadow: 0 30px 60px rgba(0,0,0,0.6);
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-aviso h3 { 
            color: var(--text-main); 
            font-weight: 800; 
            text-align: center; 
            font-size: 1.4rem; 
            margin-bottom: 1.5rem; 
        }

        .modal-aviso p { 
            font-size: 0.95rem; 
            line-height: 1.6; 
            color: var(--text-main); 
            margin-bottom: 1rem;
        }

        .highlight { color: var(--accent-gold); font-weight: 700; }

        .btn-entendido {
            background-color: var(--accent-gold);
            color: #131a2f;
            border: none;
            padding: 14px;
            border-radius: 50px;
            font-weight: 800;
            width: 100%;
            max-width: 300px;
            display: block;
            margin: 2rem auto 0;
            cursor: pointer;
            transition: 0.3s;
        }

        /* ========================================= */
        /* BOTÓN GUÍA PDF                            */
        /* ========================================= */
        .btn-guia-pdf {
            background-color: transparent;
            color: var(--accent-gold);
            border: 1px solid var(--accent-gold);
            border-radius: 50px;
            padding: 6px 15px;
            font-size: 0.85rem;
            font-weight: 600;
            text-decoration: none;
            transition: 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-guia-pdf:hover {
            background-color: var(--accent-gold);
            color: #131a2f;
        }

        /* ========================================= */
        /* ESTILOS ORIGINALES Y AJUSTES              */
        /* ========================================= */
        body, .card, .stat-box, .welcome-card, .search-results-container, .categoria-card {
            transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease;
        }

        body { 
            font-family: 'Poppins', sans-serif; 
            background-color: var(--bg-body); 
            color: var(--text-main); 
            overflow-x: hidden; 
        }
        
        .navbar { 
            background-color: #131a2f !important; 
            border-bottom: 2px solid #d4af37; 
        }

        .text-accent-gold { color: #d4af37; }

        .btn-theme-toggle {
            background: rgba(255,255,255,0.1); 
            color: #d4af37; 
            border: 1px solid rgba(212, 175, 55, 0.5);
            width: 40px; 
            height: 40px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            border-radius: 50%; 
            transition: 0.3s;
        }

        .btn-theme-toggle:hover { 
            background: #d4af37; 
            color: #131a2f; 
            transform: scale(1.1); 
        }

        .hero-section {
            background: linear-gradient(-45deg, #080b18, #131a2f, #1e2840, #080b18);
            background-size: 400% 400%; 
            animation: gradientBG 15s ease infinite;
            color: white; 
            padding: 6rem 0 8rem 0; 
            border-radius: 0 0 60px 60px; 
            position: relative;
        }

        @keyframes gradientBG { 
            0% { background-position: 0% 50%; } 
            50% { background-position: 100% 50%; } 
            100% { background-position: 0% 50%; } 
        }

        .buscador-blanco { 
            color: #ffffff !important; 
            font-size: 1.1rem;
        }

        .buscador-blanco::placeholder { 
            color: rgba(255, 255, 255, 0.7) !important;
        }

        .search-results-container {
            position: absolute; 
            top: 100%; 
            left: 0; 
            right: 0; 
            background: var(--card-bg);
            border-radius: 20px; 
            margin-top: 10px; 
            box-shadow: 0 15px 35px rgba(0,0,0,0.3);
            display: none; 
            z-index: 9999; 
            text-align: left; 
            border: 1px solid var(--card-border);
        }

        .search-item { 
            display: flex; 
            align-items: center; 
            padding: 12px 20px; 
            color: var(--text-main); 
            text-decoration: none; 
            border-bottom: 1px solid var(--card-border); 
        }

        .search-item:hover { 
            background: var(--search-hover); 
            color: #d4af37; 
        }

        .search-item img { 
            width: 40px; 
            height: 50px; 
            object-fit: cover; 
            border-radius: 5px; 
            margin-right: 15px; 
        }

        .welcome-card { 
            border-radius: 20px; 
            border: none; 
            border-left: 6px solid #d4af37 !important; 
            box-shadow: 0 25px 50px rgba(0,0,0,0.08); 
            background: var(--card-bg); 
        }

        .categoria-card { 
            border-radius: 20px !important; 
            border: 1px solid var(--card-border) !important; 
            background-color: var(--card-bg); 
            transition: 0.4s !important; 
        }

        .categoria-card:hover { 
            transform: translateY(-10px); 
            box-shadow: 0 20px 40px rgba(212, 175, 55, 0.15) !important; 
        }

        .icon-wrap { 
            width: 80px; 
            height: 80px; 
            background: var(--icon-wrap-bg); 
            border-radius: 50%; 
            margin-bottom: 1.5rem; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
        }
        
        .stat-box { 
            background: var(--card-bg); 
            border: 1px solid var(--card-border); 
            border-radius: 20px; 
            padding: 2rem; 
            border-bottom: 4px solid #d4af37; 
        }

        .stat-number { 
            font-size: 3rem; 
            font-weight: 800; 
            color: var(--text-main); 
        }

        .btn-ucips-gold { 
            background-color: #d4af37; 
            color: #131a2f; 
            border-radius: 50px; 
            font-weight: 600; 
            border: none; 
            padding: 10px 25px; 
        }

        .book-cover-wrapper { 
            position: relative; 
            overflow: hidden; 
            border-radius: 10px; 
            box-shadow: 0 10px 20px rgba(0,0,0,0.15); 
        }

        .book-cover { 
            width: 100%; 
            height: 280px; 
            object-fit: cover; 
            transition: 0.5s; 
        }

        .book-card:hover .book-cover { 
            transform: scale(1.08); 
        }
        
        footer { 
            background-color: #080b18 !important; 
            border-top: 1px solid rgba(255,255,255,0.05); 
            color: #d4af37; 
        }

        /* Ocultar texto de guía en celulares muy pequeños */
        @media (max-width: 480px) {
            .btn-guia-pdf span { display: none; }
            .btn-guia-pdf { padding: 10px; }
            .modal-aviso { padding: 1.5rem; }
        }
    </style>
</head>
<body class="d-flex flex-column min-vh-100">

<div id="modalCopyright" class="modal-overlay">
    <div class="modal-aviso" data-aos="zoom-in">
        <div class="text-center mb-3">
            <img src="https://yacdergaming.com/Biblioteca/Imagenes/logo.png?v=3" alt="Logo UCIPS" style="height: 60px; width: auto;">
        </div>
        <h3>Compromiso Estudiantil</h3>
        
        <p><strong>Estimado(a) estudiante:</strong></p>
        <p>Al acceder a la Biblioteca Virtual de la <span class="highlight">UCIPS</span>, te recordamos que toda la información consultada debe ser utilizada de manera responsable conforme a los derechos de autor.</p>
        <p>Es obligatorio citar adecuadamente todas las fuentes empleadas en tus trabajos, utilizando el <span class="highlight">formato APA 7 (séptima edición)</span>.</p>
        <p>El uso correcto de las citas fortalece la calidad de tus trabajos y es un requisito institucional.</p>
        <p class="text-center mb-0"><em>Gracias por tu compromiso con la integridad académica.</em></p>

        <button class="btn-entendido" onclick="cerrarModal()">Aceptar y Entrar</button>
    </div>
</div>

<nav class="navbar navbar-expand-lg navbar-dark sticky-top">
    <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="index.php">
            <img src="https://yacdergaming.com/Biblioteca/Imagenes/logo.png?v=3" alt="Logo UCIPS" style="height: 45px; width: auto;" class="me-3">
            <span class="d-none d-sm-inline">UCIPS <span class="text-accent-gold">Biblioteca</span></span>
        </a>
        <div class="ms-auto d-flex align-items-center gap-2">
            <a href="https://yacdergaming.com/Biblioteca/guia/GUIA.pdf" target="_blank" class="btn-guia-pdf">
                <i class="fa-solid fa-file-pdf"></i>
                <span>Guía Integridad</span>
            </a>

            <button class="btn-theme-toggle" id="themeToggleBtn">
                <i class="fa-solid fa-moon"></i>
            </button>
            
            <a class="btn btn-outline-ucips-gold rounded-pill px-4 shadow-sm d-none d-sm-block" href="admin.php" style="border-color: #d4af37; color: #d4af37; font-weight: 600;">Admin</a>
        </div>
    </div>
</nav>

<div class="hero-section text-center position-relative">
    <div class="container position-relative" style="z-index: 10;" data-aos="zoom-in">
        <img src="https://yacdergaming.com/Biblioteca/Imagenes/logo.png?v=3" alt="Escudo Central UCIPS" style="height: 160px; width: auto; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));" class="mb-4">
        <h1 class="display-4 fw-bolder mb-3 text-white">Biblioteca Virtual Interactiva</h1>
        <h2 class="h5 fw-light mb-5 mx-auto text-light" style="max-width: 800px; opacity: 0.9;">
            Universidad de las Ciencias Policiales y de la Seguridad del Estado de Puebla
        </h2>
        
        <div class="row justify-content-center position-relative">
            <div class="col-md-8 col-lg-6 position-relative">
                <div class="input-group input-group-lg shadow-lg rounded-pill p-1" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
                    <span class="input-group-text bg-transparent border-0 text-white ps-4">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input type="text" id="buscador-input" class="form-control border-0 px-3 shadow-none bg-transparent buscador-blanco" placeholder="Buscar manuales o autores..." autocomplete="off">
                </div>
                <div id="resultados-busqueda" class="search-results-container"></div>
            </div>
        </div>
    </div>
</div>

<div class="container position-relative" style="margin-top: -50px; z-index: 5;" data-aos="fade-up">
    <div class="row justify-content-center g-4">
        <div class="col-md-4 text-center">
            <div class="stat-box">
                <div class="stat-number counter" data-target="<?= $total_recursos ?>">0</div>
                <div class="text-muted fw-bold small">Materiales Activos</div>
            </div>
        </div>
        <div class="col-md-4 text-center">
            <div class="stat-box">
                <div class="stat-number counter" data-target="<?= $total_categorias ?>">0</div>
                <div class="text-muted fw-bold small">Áreas de Especialidad</div>
            </div>
        </div>
        <div class="col-md-4 text-center">
            <div class="stat-box">
                <div class="stat-number counter" data-target="<?= $total_vistas ?>">0</div>
                <div class="text-muted fw-bold small">Consultas Totales</div>
            </div>
        </div>
    </div>
</div>

<div class="container mt-5 pt-4" data-aos="fade-up">
    <div class="card welcome-card">
        <div class="card-body p-4 p-md-5">
            <h3 class="fw-bold mb-4" style="color: var(--text-main);">
                <i class="fa-solid fa-quote-left text-accent-gold me-2 opacity-50"></i>
                Bienvenidas y bienvenidos a la Biblioteca Virtual UCIPS:
            </h3>
            <div class="welcome-text fs-6" style="line-height: 1.8; color: var(--text-muted);">
                <p>Es un honor darles la más cordial bienvenida a este nuevo espacio académico, concebido como un punto de encuentro para el conocimiento, la investigación y el desarrollo intelectual de nuestra comunidad.</p>
                <p>La Biblioteca Virtual UCIPS nace con el propósito de ampliar el acceso a recursos académicos de calidad, facilitar los procesos de aprendizaje y fortalecer la formación integral de nuestros estudiantes, docentes e investigadores.</p>
                <p>Les invitamos a explorar, descubrir y aprovechar al máximo esta herramienta, que es ahora parte esencial de su vida universitaria.</p>
                
                <div class="mt-4 border-top pt-4 text-end">
                    <p class="mb-0 fw-bold" style="color: var(--text-main); font-size: 1.1rem;">Atentamente,</p>
                    <p class="mb-0 text-accent-gold fw-semibold">Vicerrectoría Académica UCIPS</p>
                </div>
            </div>
        </div>
    </div>
</div>

<?php if(count($recientes) > 0): ?>
<div class="container mt-5 pt-5" data-aos="fade-up">
    <h2 class="fw-bolder mb-4" style="color: var(--text-main);">
        <i class="fa-solid fa-fire text-accent-gold me-2"></i>Novedades
    </h2>
    <div class="row g-4">
        <?php foreach($recientes as $rec): ?>
        <div class="col-6 col-md-3">
            <a href="recurso.php?id=<?= $rec['id_recurso'] ?>" class="text-decoration-none book-card">
                <div class="book-cover-wrapper mb-3">
                    <img src="uploads/portadas/<?= htmlspecialchars($rec['ruta_portada']) ?>" class="book-cover">
                </div>
                <h6 class="fw-bold text-center" style="color: var(--text-main);"><?= htmlspecialchars($rec['titulo']) ?></h6>
            </a>
        </div>
        <?php endforeach; ?>
    </div>
</div>
<?php endif; ?>

<div class="container my-5 pt-5">
    <div class="text-center mb-5" data-aos="fade-up">
        <h2 class="fw-bolder" style="color: var(--text-main);">Acervo por Áreas</h2>
        <div class="mx-auto mt-3 rounded-pill" style="width: 60px; height: 5px; background-color: #d4af37;"></div>
    </div>
    <div class="row g-4 justify-content-center">
        <?php foreach ($categorias as $cat): ?>
            <div class="col-md-6 col-lg-3" data-aos="fade-up">
                <div class="card h-100 text-center categoria-card">
                    <div class="card-body d-flex flex-column align-items-center p-5">
                        <div class="icon-wrap">
                            <i class="fa-solid <?= htmlspecialchars($cat['icono']) ?> fa-2x" style="color: var(--text-main);"></i>
                        </div>
                        <h5 class="card-title fw-bold mb-3" style="color: var(--text-main);"><?= htmlspecialchars($cat['nombre']) ?></h5>
                        <a href="categoria.php?id=<?= $cat['id_categoria'] ?>" class="btn btn-ucips-gold mt-auto stretched-link">Consultar</a>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<footer class="text-white py-4 mt-auto">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                <span class="fw-bold fs-5 d-flex align-items-center justify-content-center justify-content-md-start">
                    <img src="https://yacdergaming.com/Biblioteca/Imagenes/logo.png?v=3" alt="Logo UCIPS" style="height: 30px; width: auto;" class="me-2 opacity-75">
                    UCIPS | Biblioteca Virtual
                </span>
            </div>
            <div class="col-md-6 text-center text-md-end small text-light opacity-75">
                &copy; <?= date('Y') ?> Universidad de las Ciencias Policiales y de la Seguridad.<br>
                Desarrollado para la excelencia académica.
            </div>
        </div>
    </div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

<script>
document.addEventListener("DOMContentLoaded", function() {
    AOS.init({ once: true });

    window.cerrarModal = function() {
        const modal = document.getElementById('modalCopyright');
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500);
    };

    const themeBtn = document.getElementById('themeToggleBtn');
    const savedTheme = localStorage.getItem('ucips_theme');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('ucips_theme', next);
        themeBtn.innerHTML = next === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });

    document.querySelectorAll('.counter').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const update = () => {
            const count = +counter.innerText;
            const inc = target / 100;
            if (count < target) { 
                counter.innerText = Math.ceil(count + inc); 
                setTimeout(update, 20); 
            } else { 
                counter.innerText = target; 
            }
        };
        update();
    });

    const input = document.getElementById('buscador-input');
    const res = document.getElementById('resultados-busqueda');
    input.addEventListener('keyup', () => {
        if (input.value.length >= 2) {
            fetch('buscar_ajax.php?q=' + input.value)
                .then(r => r.json())
                .then(data => {
                    res.innerHTML = data.map(l => `
                        <a href="recurso.php?id=${l.id_recurso}" class="search-item">
                            <img src="uploads/portadas/${l.ruta_portada}">${l.titulo}
                        </a>
                    `).join('');
                    res.style.display = 'block';
                });
        } else {
            res.style.display = 'none';
        }
    });
});
</script>
</body>
</html>