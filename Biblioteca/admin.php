<?php

session_start();
require_once 'includes/db.php';

// ==========================================
// 1. SISTEMA DE LOGIN BÁSICO Y RÁPIDO
// ==========================================
$password_secreta = "Ucips2026*";

if (isset($_POST['login'])) {
    if ($_POST['password'] === $password_secreta) {
        $_SESSION['admin_logeado'] = true;
    } else {
        $error_login = "Contraseña incorrecta.";
    }
}

if (isset($_GET['salir'])) {
    session_destroy();
    header("Location: index.php");
    exit;
}

if (!isset($_SESSION['admin_logeado'])) {
?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Administrador UCIPS</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>body{background:#131a2f; display:flex; align-items:center; justify-content:center; height:100vh;} .card{border-radius:20px; border-bottom:5px solid #d4af37; border-top:none; border-left:none; border-right:none;}</style>
    </head>
    <body>
        <div class="card p-5 shadow-lg text-center bg-white" style="max-width: 400px; width: 100%;">
            <div class="mb-4">
                <i class="fa-solid fa-shield-halved fa-3x mb-3" style="color: #d4af37;"></i>
                <h3 class="fw-bold mb-0" style="color:#131a2f;">Acceso UCIPS</h3>
                <p class="text-muted small">Panel de Administración</p>
            </div>
            <?php if(isset($error_login)) echo "<div class='alert alert-danger shadow-sm'>$error_login</div>"; ?>
            <form method="POST">
                <input type="password" name="password" class="form-control form-control-lg mb-4 bg-light" placeholder="Contraseña" required>
                <button type="submit" name="login" class="btn w-100 fw-bold py-2 shadow-sm" style="background:#d4af37; color:#131a2f;">Entrar al Panel</button>
            </form>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
    </body>
    </html>
<?php
    exit; 
}

// ==========================================
// 2. PROCESAMIENTO DE DATOS (Backend)
// ==========================================
$mensaje = ''; $tipo_mensaje = ''; $tab_activa = 'dashboard';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // CREAR CATEGORÍA
    if (isset($_POST['accion']) && $_POST['accion'] == 'crear_categoria') {
        $nombre = trim($_POST['nombre']);
        $icono = trim($_POST['icono']) != '' ? trim($_POST['icono']) : 'fa-folder-closed';
        if (!empty($nombre)) {
            $pdo->prepare("INSERT INTO categorias (nombre, icono) VALUES (?, ?)")->execute([$nombre, $icono]);
            $mensaje = "Categoría '$nombre' creada."; $tipo_mensaje = "success"; $tab_activa = 'categorias';
        }
    }

    // SUBIR LIBRO (CON AUTOR Y AÑO)
    if (isset($_POST['accion']) && $_POST['accion'] == 'subir_libro') {
        $titulo = trim($_POST['titulo']); 
        $autor = trim($_POST['autor']); 
        $anio = trim($_POST['anio']);
        $id_cat = (int)$_POST['id_categoria']; 
        $desc = trim($_POST['descripcion']);
        $nombre_pdf = ''; $nombre_portada = 'default.jpg'; $errores = false;

        if (isset($_FILES['archivo_pdf']) && $_FILES['archivo_pdf']['error'] == 0) {
            $nombre_pdf = 'libro_' . time() . '_' . rand(100, 999) . '.pdf';
            move_uploaded_file($_FILES['archivo_pdf']['tmp_name'], 'uploads/pdfs/' . $nombre_pdf);
        } else { $errores = true; $mensaje = "El Archivo PDF es obligatorio."; }

        if (!$errores && isset($_FILES['archivo_portada']) && $_FILES['archivo_portada']['error'] == 0) {
            $ext = pathinfo($_FILES['archivo_portada']['name'], PATHINFO_EXTENSION);
            $nombre_portada = 'portada_' . time() . '_' . rand(100, 999) . '.' . $ext;
            move_uploaded_file($_FILES['archivo_portada']['tmp_name'], 'uploads/portadas/' . $nombre_portada);
        }

        if (!$errores) {
            $pdo->prepare("INSERT INTO recursos (titulo, autor, anio, descripcion, ruta_pdf, ruta_portada, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?)")
                ->execute([$titulo, $autor, $anio, $desc, $nombre_pdf, $nombre_portada, $id_cat]);
            $mensaje = "Material publicado correctamente."; $tipo_mensaje = "success"; $tab_activa = 'inventario';
        } else { $tipo_mensaje = "danger"; $tab_activa = 'subir'; }
    }

    // EDITAR LIBRO
    if (isset($_POST['accion']) && $_POST['accion'] == 'editar_libro') {
        $id_edit = (int)$_POST['id_recurso'];
        $titulo = trim($_POST['titulo']); 
        $autor = trim($_POST['autor']); 
        $anio = trim($_POST['anio']);
        $id_cat = (int)$_POST['id_categoria']; 
        $desc = trim($_POST['descripcion']);

        $pdo->prepare("UPDATE recursos SET titulo = ?, autor = ?, anio = ?, id_categoria = ?, descripcion = ? WHERE id_recurso = ?")
            ->execute([$titulo, $autor, $anio, $id_cat, $desc, $id_edit]);
        $mensaje = "Información del libro actualizada."; $tipo_mensaje = "success"; $tab_activa = 'inventario';
    }

    // BORRAR LIBRO
    if (isset($_POST['accion']) && $_POST['accion'] == 'borrar_libro') {
        $id_borrar = (int)$_POST['id_recurso'];
        $stmtDel = $pdo->prepare("SELECT ruta_pdf, ruta_portada FROM recursos WHERE id_recurso = ?");
        $stmtDel->execute([$id_borrar]);
        $libroDel = $stmtDel->fetch();
        
        if ($libroDel) {
            @unlink('uploads/pdfs/' . $libroDel['ruta_pdf']);
            if ($libroDel['ruta_portada'] != 'default.jpg') @unlink('uploads/portadas/' . $libroDel['ruta_portada']);
            $pdo->prepare("DELETE FROM recursos WHERE id_recurso = ?")->execute([$id_borrar]);
            $mensaje = "Recurso eliminado del sistema."; $tipo_mensaje = "success"; $tab_activa = 'inventario';
        }
    }
}

// Consultas
$categorias = $pdo->query("SELECT * FROM categorias ORDER BY nombre ASC")->fetchAll(PDO::FETCH_ASSOC);
$recursos = $pdo->query("SELECT r.*, c.nombre as cat_nombre FROM recursos r LEFT JOIN categorias c ON r.id_categoria = c.id_categoria ORDER BY r.id_recurso DESC")->fetchAll(PDO::FETCH_ASSOC);
// TOP 5 Libros Más Leídos
$top_libros = $pdo->query("SELECT titulo, autor, vistas FROM recursos ORDER BY vistas DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);

$total_cat = count($categorias);
$total_rec = count($recursos);

// Íconos
$iconos_sugeridos = ['fa-book', 'fa-book-open', 'fa-scale-balanced', 'fa-gavel', 'fa-building-columns', 'fa-shield-halved', 'fa-fingerprint', 'fa-magnifying-glass', 'fa-user-secret', 'fa-handcuffs', 'fa-computer', 'fa-microchip', 'fa-network-wired', 'fa-globe', 'fa-briefcase', 'fa-users', 'fa-brain', 'fa-heart-pulse', 'fa-microscope', 'fa-car-burst', 'fa-gun', 'fa-person-military-rifle', 'fa-folder-open'];
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Súper Panel - UCIPS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap" rel="stylesheet">
    
    <style>
        body { background: #f4f6f9; color: #131a2f; font-family: 'Poppins', sans-serif; }
        .sidebar { background: #131a2f; min-height: 100vh; padding-top: 20px; border-right: 4px solid #d4af37;}
        .sidebar a { color: rgba(255,255,255,0.7); text-decoration: none; padding: 15px 20px; display: block; transition: 0.3s; font-weight: 500; border-radius: 0 !important;}
        .sidebar a:hover, .sidebar .active { background: rgba(212, 175, 55, 0.2) !important; color: #d4af37 !important; border-left: 4px solid #d4af37; }
        .card-gold { border: none; border-top: 4px solid #d4af37; box-shadow: 0 10px 20px rgba(0,0,0,0.05); border-radius: 10px; }
        .btn-gold { background: #d4af37; color: #131a2f; font-weight: bold; border: none; transition: 0.3s; }
        .btn-gold:hover { background: #c09a2b; color: #131a2f; transform: translateY(-2px); }
        .btn-dark-ucips { background: #131a2f; color: white; border: none; transition: 0.3s;}
        
        /* Modal Catálogo Íconos */
        .icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 15px; padding: 10px; }
        .icon-btn { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 10px; padding: 15px 0; text-align: center; cursor: pointer; transition: all 0.2s; color: #131a2f; }
        .icon-btn.selected { background: #d4af37; color: #131a2f; border-color: #d4af37; transform: scale(1.1); font-weight: bold; }
        #vista-previa-icono { width: 50px; height: 50px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
    </style>
</head>
<body>

<div class="container-fluid">
    <div class="row">
        <div class="col-md-3 col-lg-2 sidebar p-0 d-flex flex-column">
            <div class="text-center mb-4 px-3 mt-3">
                <i class="fa-solid fa-shield-halved fa-3x" style="color: #d4af37;"></i>
                <h5 class="text-white mt-3 fw-bold">Admin Panel</h5>
            </div>
            
            <div class="nav flex-column nav-pills mt-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <a class="nav-link <?= $tab_activa == 'dashboard' ? 'active' : '' ?>" data-bs-toggle="pill" href="#v-pills-dash"><i class="fa-solid fa-chart-line me-3"></i> Resumen</a>
                <a class="nav-link <?= $tab_activa == 'subir' ? 'active' : '' ?>" data-bs-toggle="pill" href="#v-pills-subir"><i class="fa-solid fa-cloud-arrow-up me-3"></i> Subir Material</a>
                <a class="nav-link <?= $tab_activa == 'categorias' ? 'active' : '' ?>" data-bs-toggle="pill" href="#v-pills-cat"><i class="fa-solid fa-tags me-3"></i> Categorías</a>
                <a class="nav-link <?= $tab_activa == 'inventario' ? 'active' : '' ?>" data-bs-toggle="pill" href="#v-pills-inv"><i class="fa-solid fa-boxes-stacked me-3"></i> Inventario</a>
            </div>

            <div class="mt-auto mb-4">
                <a href="index.php" class="text-center text-white opacity-50 small"><i class="fa-solid fa-eye me-2"></i> Ver Biblioteca</a>
                <a href="admin.php?salir=1" class="text-center text-danger d-block mt-3 fw-bold"><i class="fa-solid fa-power-off me-2"></i> Cerrar Sesión</a>
            </div>
        </div>

        <div class="col-md-9 col-lg-10 p-4 p-md-5">
            <?php if ($mensaje): ?>
                <div class="alert alert-<?= $tipo_mensaje ?> alert-dismissible fade show shadow-sm">
                    <i class="fa-solid fa-circle-info me-2"></i> <?= $mensaje ?> 
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            <?php endif; ?>

            <div class="tab-content">
                
                <div class="tab-pane fade <?= $tab_activa == 'dashboard' ? 'show active' : '' ?>" id="v-pills-dash">
                    <h2 class="fw-bold mb-4" style="color: #131a2f;">Bienvenido, Administrador</h2>
                    <div class="row g-4 mb-5">
                        <div class="col-md-6">
                            <div class="card card-gold bg-white p-4 text-center h-100 d-flex justify-content-center">
                                <i class="fa-solid fa-book fa-3x mb-3 text-muted opacity-50"></i>
                                <h1 class="display-3 fw-bolder" style="color:#131a2f;"><?= $total_rec ?></h1>
                                <p class="text-muted text-uppercase fw-bold mb-0">Materiales Totales</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card card-gold bg-white p-4 text-center h-100 d-flex justify-content-center">
                                <i class="fa-solid fa-layer-group fa-3x mb-3 text-muted opacity-50"></i>
                                <h1 class="display-3 fw-bolder" style="color:#131a2f;"><?= $total_cat ?></h1>
                                <p class="text-muted text-uppercase fw-bold mb-0">Áreas de Especialidad</p>
                            </div>
                        </div>
                    </div>

                    <h4 class="fw-bold mb-3"><i class="fa-solid fa-ranking-star me-2" style="color:#d4af37;"></i> Top 5: Materiales Más Consultados</h4>
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <ul class="list-group list-group-flush">
                            <?php $ranking = 1; foreach($top_libros as $top): ?>
                            <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                                <div>
                                    <span class="badge bg-dark rounded-circle me-3"><?= $ranking++ ?></span>
                                    <span class="fw-bold"><?= htmlspecialchars($top['titulo']) ?></span>
                                    <small class="text-muted d-block ms-5"><?= htmlspecialchars($top['autor']) ?></small>
                                </div>
                                <span class="badge rounded-pill" style="background:#d4af37; color:#131a2f;">
                                    <i class="fa-solid fa-eye me-1"></i> <?= $top['vistas'] ?> lecturas
                                </span>
                            </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                </div>

                <div class="tab-pane fade <?= $tab_activa == 'subir' ? 'show active' : '' ?>" id="v-pills-subir">
                    <h3 class="fw-bold mb-4" style="color: #131a2f;"><i class="fa-solid fa-cloud-arrow-up text-muted me-2 opacity-50"></i> Subir Nuevo Documento</h3>
                    <div class="card card-gold">
                        <div class="card-body p-4 p-md-5">
                            <form action="admin.php" method="POST" enctype="multipart/form-data">
                                <input type="hidden" name="accion" value="subir_libro">
                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <label class="form-label fw-bold">Título del Documento *</label>
                                        <input type="text" name="titulo" class="form-control bg-light" required>
                                    </div>
                                    <div class="col-md-5 mb-3">
                                        <label class="form-label fw-bold">Autor / Institución</label>
                                        <input type="text" name="autor" class="form-control bg-light" placeholder="Ej. Juan Pérez / CNDH">
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label class="form-label fw-bold">Año</label>
                                        <input type="number" name="anio" class="form-control bg-light" placeholder="Ej. 2024">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label fw-bold">Categoría *</label>
                                        <select name="id_categoria" class="form-select bg-light" required>
                                            <option value="">Selecciona...</option>
                                            <?php foreach ($categorias as $cat): ?><option value="<?= $cat['id_categoria'] ?>"><?= $cat['nombre'] ?></option><?php endforeach; ?>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-4">
                                    <label class="form-label fw-bold">Sinopsis / Descripción</label>
                                    <textarea name="descripcion" class="form-control bg-light" rows="3"></textarea>
                                </div>
                                <div class="row bg-light p-3 rounded-3 mb-4 border">
                                    <div class="col-md-6 mb-3 mb-md-0">
                                        <label class="form-label fw-bold text-danger"><i class="fa-solid fa-file-pdf me-1"></i> Archivo PDF *</label>
                                        <input type="file" name="archivo_pdf" class="form-control" accept=".pdf" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-success"><i class="fa-solid fa-image me-1"></i> Portada (Opcional)</label>
                                        <input type="file" name="archivo_portada" class="form-control" accept=".jpg,.png,.jpeg">
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-gold w-100 py-3 rounded-pill"><i class="fa-solid fa-upload me-2"></i> Publicar Material</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="tab-pane fade <?= $tab_activa == 'categorias' ? 'show active' : '' ?>" id="v-pills-cat">
                    <h3 class="fw-bold mb-4" style="color: #131a2f;"><i class="fa-solid fa-tags text-muted me-2 opacity-50"></i> Gestor de Áreas</h3>
                    <div class="row g-4">
                        <div class="col-lg-5">
                            <div class="card card-gold p-4">
                                <h5 class="fw-bold mb-4 border-bottom pb-2">Nueva Categoría</h5>
                                <form action="admin.php" method="POST">
                                    <input type="hidden" name="accion" value="crear_categoria">
                                    <div class="mb-3"><label class="fw-bold form-label">Nombre</label><input type="text" name="nombre" class="form-control bg-light" required></div>
                                    
                                    <div class="mb-4">
                                        <label class="form-label fw-bold">Ícono</label>
                                        <div class="d-flex align-items-center gap-3">
                                            <div id="vista-previa-icono"><i class="fa-solid fa-folder-closed" id="icono-actual"></i></div>
                                            <input type="hidden" name="icono" id="input-icono-oculto" value="fa-folder-closed">
                                            <button type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#modalIconos">Elegir Ícono</button>
                                        </div>
                                    </div>

                                    <button type="submit" class="btn btn-dark-ucips w-100"><i class="fa-solid fa-save me-2"></i> Guardar Área</button>
                                </form>
                            </div>
                        </div>
                        <div class="col-lg-7">
                            <ul class="list-group list-group-flush card border-0 shadow-sm" style="max-height:400px; overflow-y:auto;">
                                <?php foreach ($categorias as $cat): ?>
                                    <li class="list-group-item d-flex align-items-center p-3">
                                        <i class="fa-solid <?= $cat['icono'] ?> me-3 fs-5" style="color:#131a2f;"></i><span class="fw-bold"><?= $cat['nombre'] ?></span>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="tab-pane fade <?= $tab_activa == 'inventario' ? 'show active' : '' ?>" id="v-pills-inv">
                    <h3 class="fw-bold mb-4" style="color: #131a2f;"><i class="fa-solid fa-boxes-stacked text-muted me-2 opacity-50"></i> Inventario</h3>
                    <div class="card card-gold">
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover align-middle m-0">
                                    <thead class="bg-light text-secondary">
                                        <tr>
                                            <th class="p-3">Material</th>
                                            <th>Autor / Año</th>
                                            <th>Categoría / Vistas</th>
                                            <th class="text-end p-3">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($recursos as $rec): ?>
                                            <tr>
                                                <td class="p-3">
                                                    <div class="d-flex align-items-center">
                                                        <img src="uploads/portadas/<?= $rec['ruta_portada'] ?>" style="width:40px; height:50px; object-fit:cover;" class="rounded me-3">
                                                        <span class="fw-bold" style="color: #131a2f;"><?= htmlspecialchars($rec['titulo']) ?></span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <small class="d-block fw-bold text-muted"><?= htmlspecialchars($rec['autor'] ?: 'Sin autor') ?></small>
                                                    <span class="badge bg-light text-dark border"><?= htmlspecialchars($rec['anio'] ?: 'S/A') ?></span>
                                                </td>
                                                <td>
                                                    <span class="badge mb-1" style="background-color: #131a2f; color: #d4af37;"><?= $rec['cat_nombre'] ?></span><br>
                                                    <small class="text-muted"><i class="fa-solid fa-eye text-success"></i> <?= $rec['vistas'] ?> vistas</small>
                                                </td>
                                                <td class="text-end p-3">
                                                    <button type="button" class="btn btn-sm btn-outline-primary mb-1" title="Editar Información" onclick="abrirModalEditar(<?= $rec['id_recurso'] ?>, '<?= htmlspecialchars(addslashes($rec['titulo'])) ?>', '<?= htmlspecialchars(addslashes($rec['autor'])) ?>', '<?= $rec['anio'] ?>', <?= $rec['id_categoria'] ?>, '<?= htmlspecialchars(addslashes($rec['descripcion'])) ?>')">
                                                        <i class="fa-solid fa-pen"></i>
                                                    </button>
                                                    
                                                    <form action="admin.php" method="POST" class="d-inline" onsubmit="return confirm('¿Borrar documento?');">
                                                        <input type="hidden" name="accion" value="borrar_libro">
                                                        <input type="hidden" name="id_recurso" value="<?= $rec['id_recurso'] ?>">
                                                        <button type="submit" class="btn btn-sm btn-outline-danger mb-1" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                                                    </form>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modalEditar" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 15px;">
            <div class="modal-header bg-light" style="border-radius: 15px 15px 0 0;">
                <h5 class="modal-title fw-bold" style="color: #131a2f;"><i class="fa-solid fa-pen-to-square text-accent-gold me-2"></i> Editar Información</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="admin.php" method="POST">
                <div class="modal-body p-4">
                    <input type="hidden" name="accion" value="editar_libro">
                    <input type="hidden" name="id_recurso" id="edit_id">
                    
                    <div class="mb-3">
                        <label class="fw-bold">Título</label>
                        <input type="text" name="titulo" id="edit_titulo" class="form-control" required>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="fw-bold">Autor</label>
                            <input type="text" name="autor" id="edit_autor" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label class="fw-bold">Año</label>
                            <input type="number" name="anio" id="edit_anio" class="form-control">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="fw-bold">Categoría</label>
                        <select name="id_categoria" id="edit_cat" class="form-select" required>
                            <?php foreach ($categorias as $cat): ?><option value="<?= $cat['id_categoria'] ?>"><?= $cat['nombre'] ?></option><?php endforeach; ?>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="fw-bold">Descripción</label>
                        <textarea name="descripcion" id="edit_desc" class="form-control" rows="4"></textarea>
                    </div>
                    <div class="alert alert-warning small mb-0"><i class="fa-solid fa-triangle-exclamation"></i> Para actualizar el archivo PDF o Portada, debes borrar el registro y subirlo de nuevo. Aquí solo editas textos.</div>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-gold rounded-pill px-4">Guardar Cambios</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade" id="modalIconos" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
            <div class="modal-header border-bottom-0 bg-light" style="border-radius: 20px 20px 0 0;">
                <h5 class="modal-title fw-bold" style="color: #131a2f;"><i class="fa-solid fa-icons text-accent-gold me-2"></i> Catálogo de Íconos</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4 bg-light">
                <p class="text-muted small mb-4">Selecciona el ícono que mejor represente a la nueva categoría de estudio:</p>
                <div class="icon-grid">
                    <?php foreach ($iconos_sugeridos as $ico): ?>
                        <div class="icon-btn" onclick="seleccionarIcono('<?= $ico ?>', this)">
                            <i class="fa-solid <?= $ico ?> fa-2x"></i>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <div class="modal-footer border-top-0">
                <button type="button" class="btn btn-gold px-4 rounded-pill" data-bs-dismiss="modal">Confirmar Selección</button>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
    // Función para el Modal de Editar
    function abrirModalEditar(id, titulo, autor, anio, cat, desc) {
        document.getElementById('edit_id').value = id;
        document.getElementById('edit_titulo').value = titulo;
        document.getElementById('edit_autor').value = autor;
        document.getElementById('edit_anio').value = anio;
        document.getElementById('edit_cat').value = cat;
        document.getElementById('edit_desc').value = desc;
        new bootstrap.Modal(document.getElementById('modalEditar')).show();
    }
    
    // Función para el Modal de Íconos
    function seleccionarIcono(nombreIcono, elementoClicado) {
        let todosLosIconos = document.querySelectorAll('.icon-btn');
        todosLosIconos.forEach(btn => btn.classList.remove('selected'));
        
        elementoClicado.classList.add('selected');
        
        let iconoVistaPrevia = document.getElementById('icono-actual');
        iconoVistaPrevia.className = ''; 
        iconoVistaPrevia.classList.add('fa-solid', nombreIcono);
        iconoVistaPrevia.classList.remove('text-muted');
        iconoVistaPrevia.style.color = '#131a2f';
        
        document.getElementById('input-icono-oculto').value = nombreIcono;
    }
</script>
</body>
</html>