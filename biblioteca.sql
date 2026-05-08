-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 28-04-2026 a las 18:20:14
-- Versión del servidor: 11.8.6-MariaDB-log
-- Versión de PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `u207317217_biblioteca`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `icono` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`, `icono`) VALUES
(1, 'Ciberseguridad', 'fa-shield-halved'),
(2, 'Seguridad Pública', 'fa-building-shield'),
(3, 'Juicios Orales', 'fa-scale-balanced'),
(4, 'Administración y Gestión Policial', 'fa-user-tie'),
(5, 'Actuación Policial', 'fa-person-military-rifle'),
(6, 'Actuación, disciplina e identidad policial', 'fa-person-military-rifle'),
(7, 'Administración', 'fa-scale-balanced'),
(8, 'Armas', 'fa-gun'),
(9, 'Bachillerato', 'fa-book-open'),
(10, 'Bases de Datos Criminalísticos', 'fa-computer'),
(11, 'Búsqueda de personas', 'fa-users'),
(12, 'Caja de Herramientas Uso de la Fuerza', 'fa-handcuffs'),
(13, 'Capacidad física y defensa personal', 'fa-handcuffs'),
(14, 'Conducción de Vehículos Policiales', 'fa-car-burst'),
(15, 'Contratos y Convenios', 'fa-book-open'),
(16, 'Criminalística', 'fa-microscope'),
(17, 'Cultura de la legalidad y Estado de derecho', 'fa-gavel'),
(18, 'Delincuencia Organizada', 'fa-handcuffs'),
(19, 'Deontología', 'fa-book'),
(20, 'Derecho', 'fa-gavel'),
(21, 'Derechos de los grupos vulnerables', 'fa-users'),
(22, 'Derechos humanos', 'fa-users'),
(23, 'Desactivación Verbal', 'fa-users'),
(24, 'Detención y Conducción del Probable Responsable', 'fa-user-secret'),
(25, 'Disturbios civiles', 'fa-person-military-rifle'),
(26, 'Documentos para EGATSUSP', 'fa-folder-open'),
(27, 'EGATSU', 'fa-folder-open'),
(28, 'Ética y Responsabilidades', 'fa-book'),
(29, 'Factores y Tipos de Seguridad', 'fa-handcuffs'),
(30, 'Grados y Funciones Policiales', 'fa-person-military-rifle'),
(31, 'Guía del Sustentante', 'fa-book-open'),
(32, 'Instrucción Policial de Orden Cerrado', 'fa-person-military-rifle'),
(34, 'Inteligencia Policial', 'fa-brain'),
(35, 'Justicia para Adolescentes', 'fa-users'),
(36, 'Legítima Defensa del Policía', 'fa-person-military-rifle'),
(37, 'Leyes, Protocolos, Reglamentos', 'fa-book-open'),
(38, 'LGBTTTI', 'fa-users'),
(39, 'Mando Único', 'fa-person-military-rifle'),
(40, 'Manual Formador V.4.0', 'fa-book'),
(41, 'Manuales para Instructores', 'fa-book'),
(42, 'Normas, delito y falta administrativa', 'fa-gavel'),
(43, 'Personas con discapacidad', 'fa-users'),
(44, 'Perspectiva de Género', 'fa-users'),
(45, 'Plataforma México', 'fa-computer'),
(46, 'Policía de Proximidad', 'fa-person-military-rifle'),
(47, 'Policía Procesal', 'fa-person-military-rifle'),
(48, 'Prevención Social de la Violencia', 'fa-users'),
(49, 'Prevención Social de la Violencia', 'fa-users'),
(50, 'Primer Respondiente IPH', 'fa-book-open'),
(51, 'Primeros Auxilios', 'fa-heart-pulse'),
(52, 'Protección Civil', 'fa-person-military-rifle'),
(53, 'Radiocomunicación', 'fa-network-wired'),
(54, 'Redacción de informes', 'fa-book-open'),
(55, 'Seguridad en Escuelas', 'fa-person-military-rifle'),
(56, 'Seguridad Nacional', 'fa-globe'),
(57, 'Servicio Profesional de Carrera', 'fa-users'),
(58, 'Simbología Vial', 'fa-car-burst'),
(59, 'Símbolos Patrios', 'fa-shield-halved'),
(60, 'Sistema de Justicia Penal Acusatorio', 'fa-building-columns'),
(61, 'Sistema Penitenciario', 'fa-gavel'),
(62, 'Sociología', 'fa-users'),
(63, 'Técnicas y Tácticas', 'fa-handcuffs'),
(64, 'Terrorismo', 'fa-person-military-rifle'),
(65, 'Tiro Policial', 'fa-gun'),
(66, 'Valores y elementos de la doctrina policial', 'fa-person-military-rifle'),
(67, 'Vialidad', 'fa-car-burst'),
(68, 'Inteligencia', 'fa-brain'),
(69, 'Inteligencia', 'fa-folder-closed'),
(70, 'Manual del Formador', 'fa-book-open'),
(71, 'actuación , disciplina', 'fa-folder-closed');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recursos`
--

CREATE TABLE `recursos` (
  `id_recurso` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `autor` varchar(255) DEFAULT NULL,
  `anio` varchar(4) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `ruta_pdf` varchar(255) NOT NULL,
  `ruta_portada` varchar(255) DEFAULT 'default.jpg',
  `id_categoria` int(11) DEFAULT NULL,
  `vistas` int(11) DEFAULT 0,
  `fecha_agregado` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `recursos`
--

INSERT INTO `recursos` (`id_recurso`, `titulo`, `autor`, `anio`, `descripcion`, `ruta_pdf`, `ruta_portada`, `id_categoria`, `vistas`, `fecha_agregado`) VALUES
(2, 'Guía de ciberseguridad', '', '', 'La ciberseguridad al alcance de todos', 'libro_1775708204_742.pdf', 'portada_1775708204_681.png', 1, 4, '2026-04-09 04:16:44'),
(3, 'Hacking Etico Teoria Practicas', '', '', '', 'libro_1775708329_942.pdf', 'portada_1775708329_724.png', 1, 4, '2026-04-09 04:18:49'),
(4, 'Una Estrategia Informático / Militar', 'Alejandro Corletti Estrada', '2017', '', 'libro_1775708901_574.pdf', 'portada_1775708901_920.png', 1, 5, '2026-04-09 04:28:21'),
(5, 'Ciberseguridad y Seguridad Informatica', 'Academia Formacion', '', '', 'libro_1775710513_542.pdf', 'portada_1775710513_343.png', 1, 17, '2026-04-09 04:55:13'),
(6, 'Criterios Jurisprudenciales en Seguridad Pública', 'Consejo', '2017', '', 'libro_1775756428_249.pdf', 'portada_1775756428_835.png', 5, 1, '2026-04-09 17:40:28'),
(7, 'Fuerza policial Principios y procedimientos', 'Alejandro Fontecilla', '2014', '', 'libro_1775756628_483.pdf', 'portada_1775756628_328.png', 5, 0, '2026-04-09 17:43:48'),
(8, 'Fundamentos de actuación policial', 'Secretaría de Seguridad Pública del Gobierno del Distrito Federal.', '2006', '', 'libro_1775757039_946.pdf', 'portada_1775757039_482.png', 5, 1, '2026-04-09 17:50:39'),
(9, 'Manual básico del policía preventivo Tabasco', 'Dirección de la Secretaría de Gobierno', '2009', '', 'libro_1775757581_432.pdf', 'portada_1775757581_111.png', 5, 0, '2026-04-09 17:59:41'),
(10, 'Modelo Óptimo de la Función Policial', 'Secretaría de Gobernación', '2017', '', 'libro_1775757717_631.pdf', 'portada_1775757717_339.png', 5, 0, '2026-04-09 18:01:57'),
(11, 'Handbook on police accountability, oversight and integrity', 'UNITED NATIONS', '2011', '', 'libro_1775757823_872.pdf', 'portada_1775757823_947.png', 5, 1, '2026-04-09 18:03:43'),
(12, 'Búsqueda y localización de personas desaparecidas', '', '2008', '', 'libro_1775758153_577.pdf', 'portada_1775758153_819.png', 11, 0, '2026-04-09 18:09:13'),
(13, 'Modelos de Policía y Seguridad', 'Francesc Guillén Lasierra', '2015', '', 'libro_1775758449_301.pdf', 'portada_1775758449_836.png', 6, 0, '2026-04-09 18:14:09'),
(14, 'El Uso del Tiempo como Arma: Una Descripción Muy Breve del Trabajo de John R. Boyd', 'John R. Boyd', '', '', 'libro_1775758653_223.pdf', 'portada_1775758653_356.png', 6, 0, '2026-04-09 18:17:33'),
(15, 'Movimientos mancipatorios', 'Rubén-A. Benedicto Salmerón', '2013', '', 'libro_1775759862_441.pdf', 'portada_1775759862_585.png', 6, 0, '2026-04-09 18:37:42'),
(16, 'Ooda Manual', '', '2010', '', 'libro_1775760114_520.pdf', 'portada_1775760114_349.png', 6, 1, '2026-04-09 18:41:54'),
(17, 'ACUERDO por el que se da a conocer la declaración de la Coordinación General de Protección Civil', 'Poder Ejecutivo', '2009', '', 'libro_1775760304_686.pdf', 'portada_1775760304_453.png', 52, 0, '2026-04-09 18:45:04'),
(18, 'DECRETO por el que se aprueba el Programa Nacional de Protección Civil 2014-2018', 'Diario Oficial', '2014', '', 'libro_1775760445_243.pdf', 'portada_1775760445_316.png', 52, 0, '2026-04-09 18:47:25'),
(19, 'LEY GENERAL DE PROTECCIÓN CIVIL', 'Poder Ejecutivo', '2012', '', 'libro_1775760595_392.pdf', 'portada_1775760595_457.png', 52, 0, '2026-04-09 18:49:55'),
(20, 'Manual de Organización y Operación del Sistema Nacional de Protección Civil', 'Poder Ejecutivo', '2006', '', 'libro_1775760733_427.pdf', 'portada_1775760733_763.png', 52, 0, '2026-04-09 18:52:13'),
(21, 'Cultura de la Legalidad y el Estado de Derecho', 'Lic. Heron Valadez López', '', '', 'libro_1775760746_200.pdf', 'portada_1775760746_678.png', 17, 1, '2026-04-09 18:52:26'),
(22, 'Mujer Policía PNE, Historia, lucha y vocación', 'Instituto de Estudios Históricos de la Policía Nacional -INEHPOL-', '2019', '', 'libro_1775760797_600.pdf', 'portada_1775760797_585.png', 6, 0, '2026-04-09 18:53:17'),
(23, 'Democracia y (Cultura de la) Legalidad', 'PEDRO SALAZAR UGARTE', '2006', '', 'libro_1775760844_700.pdf', 'portada_1775760844_426.png', 17, 0, '2026-04-09 18:54:04'),
(24, 'Programa Interno de Protección Civil', 'SISTEMA NACIONAL DE PROTECCIÓN CIVIL TECCIÓN CIVIL', '2009', '', 'libro_1775760868_985.pdf', 'portada_1775760868_374.png', 52, 0, '2026-04-09 18:54:28'),
(25, 'REGLAMENTO DE LA LEY GENERAL DE PROTECCIÓN CIVIL', 'Diario Oficial', '2014', '', 'libro_1775761059_359.pdf', 'portada_1775761059_108.png', 52, 0, '2026-04-09 18:57:39'),
(26, 'Aprehensión, detención y flagrancia', 'Julio A. Hernández Barros', '2013', '', 'libro_1775761139_954.pdf', 'portada_1775761139_532.png', 24, 0, '2026-04-09 18:58:59'),
(27, 'El Ministerio Público y el ejercicio de la acción penal', 'José Elías', '', '', 'libro_1775761251_840.pdf', 'portada_1775761251_661.png', 24, 0, '2026-04-09 19:00:51'),
(28, 'Derechos Humanos y Aplicación de la Ley', 'OFICINA DEL ALTO COMISIONADO DE LAS NACIONES UNIDAS  PARA LOS DERECHOS HUMAN', '2004', '', 'libro_1775761291_263.pdf', 'portada_1775761291_756.png', 22, 0, '2026-04-09 19:01:31'),
(29, 'Strengthening crime prevention and criminal justice', 'General Assembly', '2011', '', 'libro_1775761389_166.pdf', 'portada_1775761389_547.png', 22, 0, '2026-04-09 19:03:09'),
(30, 'Personas Privadas de la Libertad', 'Corte Interamericana de Derechos Humanos', '', '', 'libro_1775761474_265.pdf', 'portada_1775761474_539.png', 24, 0, '2026-04-09 19:04:34'),
(31, 'Guía del Sustentante', 'Centro Nacional de Evaluación para la Educación Superior', '2017', '', 'libro_1775761616_744.pdf', 'portada_1775761616_273.png', 31, 0, '2026-04-09 19:06:56'),
(32, 'Protocolo PF situaciones con LGBTTTI', '', '2018', '', 'libro_1775761720_786.pdf', 'portada_1775761720_379.png', 38, 0, '2026-04-09 19:08:40'),
(33, 'Paquete de  capacitación  de refuerzo  para los   oficiales de  inteligencia militar  de las Naciones Unidas', 'Departamento de Operaciones de Paz de las Naciones Unidas', '2020', '', 'libro_1775761741_538.pdf', 'portada_1775761741_455.png', 69, 0, '2026-04-09 19:09:01'),
(34, 'Conferencia Magistral: “Plataforma México”', 'Ing. Francisco Niembro González', '2012', '', 'libro_1775762081_492.pdf', 'portada_1775762081_276.png', 45, 0, '2026-04-09 19:14:41'),
(35, 'Plataforma México', 'Secretaría de Seguridad Pública', '2012', '', 'libro_1775762199_815.pdf', 'portada_1775762199_313.png', 45, 0, '2026-04-09 19:16:39'),
(36, 'Evaluación externa de diseño al programa P011 Operación del Sistema Nacional de Información de Seguridad Pública', 'MIGUEL ÁNGEL GONZÁLEZ GUADARRAMA', '2012', '', 'libro_1775762331_397.pdf', 'portada_1775762331_217.png', 45, 0, '2026-04-09 19:18:51'),
(37, 'Legítima Defensa del Policía', 'EDUARDO DUARTE NOSEI', '', '', 'libro_1775762344_786.pdf', 'portada_1775762344_947.png', 36, 0, '2026-04-09 19:19:04'),
(38, 'Manual de estudio contrainteligencia', '', '', '', 'libro_1775762406_158.pdf', 'portada_1775762406_849.png', 69, 0, '2026-04-09 19:20:06'),
(39, 'Diccionario de Señas y Manos Lenguaje mímico', 'MARÍA ESTHER SERAFÍN DE FLEISCHMANN • RAÚL GONZÁLEZ PÉREZ', '2011', '', 'libro_1775762794_681.pdf', 'portada_1775762794_872.png', 43, 0, '2026-04-09 19:26:34'),
(40, 'Servicio de radiocomunicación para la Policía Federal', '', '', '', 'libro_1775762817_445.pdf', 'portada_1775762817_313.png', 53, 0, '2026-04-09 19:26:57'),
(41, 'Por un modelo policial basado en la inteligencia', 'RAMIRO GONZÁLEZ LÓPEZ', '', '', 'libro_1775762908_936.pdf', 'portada_1775762908_829.png', 69, 0, '2026-04-09 19:28:28'),
(42, 'Vocabulario de Radiocomunicaciones', 'Asamblea de Radiocomunicaciones de la UIT', '', '', 'libro_1775762920_789.pdf', 'portada_1775762920_877.png', 53, 0, '2026-04-09 19:28:40'),
(43, 'Ley General del Sistema Nacional de Seguridad Pública', 'CONGRESO GENERAL DE LOS ESTADOS UNIDOS MEXICANOS', '2009', '', 'libro_1775763032_629.pdf', 'portada_1775763032_913.png', 30, 0, '2026-04-09 19:30:32'),
(44, 'Sistemas de Radiocomunicaciones móviles', 'Juan José Murillo Fuentes', '2008', '', 'libro_1775763071_848.pdf', 'portada_1775763071_581.png', 53, 0, '2026-04-09 19:31:11'),
(45, 'LEY DE PERSONAL DE LA POLICIA NACIONAL', 'CONGRESO NACIONAL', '2009', '', 'libro_1775763141_418.pdf', 'portada_1775763141_644.png', 30, 0, '2026-04-09 19:32:21'),
(46, 'Radiocomunicación', 'Fundamentos de los sistemas de radiocomunicación', '', '', 'libro_1775763166_461.pdf', 'portada_1775763166_423.png', 53, 0, '2026-04-09 19:32:46'),
(47, 'Doctrina de Inteligencia Policial', 'Ministro del Interior, Perú', '2022', '', 'libro_1775763391_505.pdf', 'portada_1775763391_558.png', 69, 1, '2026-04-09 19:36:31'),
(48, 'Reglamento sobre grados policiales y sistema de ascenso de los servidores de la Fuerza Pública N° 30381 SP', '', '', '', 'libro_1775763513_845.pdf', 'portada_1775763513_168.png', 30, 0, '2026-04-09 19:38:33'),
(49, 'Ley sobre el Escudo, la Bandera y el Himno Nacionales', 'Diario Oficial de la Federación el 8 de febrero de 1984 Última reforma publicada en el DOF 27 de enero de 2015', '2015', '', 'libro_1775763516_557.pdf', 'portada_1775763516_708.png', 59, 0, '2026-04-09 19:38:36'),
(50, 'Inteligencia Policial (Simulación y análisis de la información)', 'Aragón Durán A. et al.', '2009', '', 'libro_1775763622_421.pdf', 'portada_1775763622_816.png', 69, 0, '2026-04-09 19:40:22'),
(51, 'Símbolos Patrios', '', '', '', 'libro_1775763675_424.pdf', 'portada_1775763675_446.png', 59, 0, '2026-04-09 19:41:15'),
(52, 'Contrainteligencia', '', '', '', 'libro_1775763787_729.pdf', 'portada_1775763787_289.png', 68, 0, '2026-04-09 19:43:07'),
(53, 'El Ciclo Básico de Inteligencia en la Investigación Policial', 'Esperanza Sandoval Pérez', '2012', '', 'libro_1775763881_125.pdf', 'portada_1775763881_232.png', 66, 0, '2026-04-09 19:44:41'),
(54, 'Manual para la formación de primeros respondientes en primeros auxilios', 'Centro Nacional para la Prevención de Accidentes', '2010', '', 'libro_1775763990_735.pdf', 'portada_1775763990_651.png', 51, 0, '2026-04-09 19:46:30'),
(55, 'Valores éticos y jurídicos', 'José Francisco Blake Mora', '2011', '', 'libro_1775764043_485.pdf', 'portada_1775764043_641.png', 66, 0, '2026-04-09 19:47:23'),
(56, 'Deontología policial: Reflexiones y retos para las policías de la región americana.', 'Arturo Herrera Verdugo', '2006', '', 'libro_1775764148_625.pdf', 'portada_1775764148_985.png', 66, 0, '2026-04-09 19:49:08'),
(57, 'Manual primeros auxilios', 'Universidad de la Rioja', '', '', 'libro_1775764360_189.pdf', 'portada_1775764360_347.png', 51, 0, '2026-04-09 19:52:40'),
(58, 'Curso de formación inicial equivalente para policía preventiva municipal- Manual del Formador 1', 'Organización Internacional de Derechos para el Desarrollo (IDLO)', '2021', '', 'libro_1775764607_602.pdf', 'portada_1775764607_177.png', 40, 0, '2026-04-09 19:56:47'),
(59, 'Reglas para otorgamiento de subsidios', 'Diario Oficial de la Federación', '2014', '', 'libro_1775764639_970.pdf', 'portada_1775764639_448.png', 57, 0, '2026-04-09 19:57:19'),
(60, 'Curso de formación inicial equivalente para policía preventiva municipal- Manual del Formador 2', 'Organización Internacional de Derechos para el Desarrollo (IDLO)', '2021', '', 'libro_1775764746_869.pdf', 'portada_1775764746_891.png', 40, 0, '2026-04-09 19:59:06'),
(61, 'Informe de secretariado 2013', 'SESNSP', '2013', '', 'libro_1775764753_389.pdf', 'portada_1775764753_960.png', 57, 0, '2026-04-09 19:59:13'),
(62, 'LEY GENERAL DEL SISTEMA NACIONAL DE SEGURIDAD PÚBLICA', 'Diario Oficial', '2009', '', 'libro_1775764848_427.pdf', 'portada_1775764848_354.png', 57, 0, '2026-04-09 20:00:48'),
(63, 'Curso de formación inicial equivalente para policía preventiva municipal- Manual del Formador 3', 'Organización Internacional de Derechos para el Desarrollo (IDLO)', '2021', '', 'libro_1775765045_140.pdf', 'portada_1775765045_848.png', 40, 0, '2026-04-09 20:04:05'),
(64, 'Presentación Profesionalización SUBSEMUN1', 'Sistema Nacional de Seguridad Pública', '2011', '', 'libro_1775765126_599.pdf', 'portada_1775765126_408.png', 57, 0, '2026-04-09 20:05:26'),
(65, 'Curso de formación inicial equivalente para policía preventiva municipal- Manual del Formador 4', 'Organización Internacional de Derechos para el Desarrollo (IDLO)', '2021', '', 'libro_1775765161_893.pdf', 'portada_1775765161_585.png', 40, 0, '2026-04-09 20:06:01'),
(66, 'Diez normas básicas de derechos  humanos  para funcionarios encargados de hacer cumplir la ley', 'SECRETARIADO INTERNACIONAL,', '1998', '', 'libro_1775765309_461.pdf', 'portada_1775765309_663.png', 12, 0, '2026-04-09 20:08:29'),
(67, 'Comportamiento Policial y relación en la ciudadanía en el municipio de Nezahualcoyotl', 'Instituto de investigaciones Jurídicas UNAM', '2005', '', 'libro_1775765478_275.pdf', 'portada_1775765478_396.png', 12, 0, '2026-04-09 20:11:18'),
(68, 'USE OF FORCE', 'Amnesty International', '2015', '', 'libro_1775765561_371.pdf', 'portada_1775765561_282.png', 12, 0, '2026-04-09 20:12:41'),
(69, 'Uso de la Fuerza versión corta', 'Amnistía Internacional', '2016', '', 'libro_1775765662_152.pdf', 'portada_1775765662_397.png', 12, 0, '2026-04-09 20:14:22'),
(70, 'Curso de formación inicial equivalente para policía preventiva municipal- Manual del Formador 5', 'Organización Internacional de Derechos para el Desarrollo (IDLO)', '2021', '', 'libro_1775765684_655.pdf', 'portada_1775765684_457.png', 40, 0, '2026-04-09 20:14:44'),
(71, 'Manual actuación lugar hecho escena delito', 'Ministerio de Justicia  y Derechos Humanos', '2017', '', 'libro_1775765696_426.pdf', 'portada_1775765696_227.png', 16, 0, '2026-04-09 20:14:56'),
(72, 'Recopilación de reglas y normas de las Naciones Unidas en la esfera de la prevención del delito y la justicia penal', 'ONU Oficina contra la droga y el delito', '2007', '', 'libro_1775765845_815.pdf', 'portada_1775765845_795.png', 12, 0, '2026-04-09 20:17:25'),
(73, 'Detención y uso de la fuerza', 'GUSTAVO FONDEVILA Y MATTHEW C.INGRAM', '2007', '', 'libro_1775765895_337.pdf', 'portada_1775765895_422.png', 12, 0, '2026-04-09 20:18:15'),
(74, 'MANUAL del Uso de la Fuerza, de aplicación común a las tres Fuerzas Armadas.', 'Secretaría de la Defensa Nacional.', '2009', '', 'libro_1775765971_332.pdf', 'portada_1775765971_524.png', 12, 0, '2026-04-09 20:19:31'),
(75, 'Manual Criminalística', 'Ministerio de Justicia  y Derechos Humanos', '', '', 'libro_1775766088_827.pdf', 'portada_1775766088_442.png', 16, 0, '2026-04-09 20:21:28'),
(76, 'El uso legítimo de la fuerza policial: breve acercamiento al contexto mexicano', 'Universidad de Guanajuato División de Derecho, Política y Gobierno Departamento de Derecho', '', '', 'libro_1775766142_645.pdf', 'portada_1775766142_505.png', 12, 0, '2026-04-09 20:22:22'),
(77, 'Causa Giuliani e Gaggio', 'Grande Camera', '2011', '', 'libro_1775766248_511.pdf', 'portada_1775766248_260.png', 12, 0, '2026-04-09 20:24:08'),
(78, 'Uso de la fuerza policial: un marco para garantizar una buena gobernanza sobre el uso de la fuerza', 'Gary White', '2021', '', 'libro_1775766388_482.pdf', 'portada_1775766388_154.png', 12, 0, '2026-04-09 20:26:28'),
(79, 'Funciones de la policía procesal', 'Secretariado Ejecutivo del Sistema Nacional de Seguridad Pública', '', '', 'libro_1775766528_473.pdf', 'portada_1775766528_540.png', 47, 0, '2026-04-09 20:28:48'),
(80, 'Judo con palabras', 'Barbara Berckhan', '2009', '', 'libro_1775766553_955.pdf', 'portada_1775766553_168.png', 12, 0, '2026-04-09 20:29:13'),
(81, 'Ley España Seguridad - Capítulo III Uso de la Fuerza', 'LEGISLACIÓN CONSOLIDADA', '2015', '', 'libro_1775766741_957.pdf', 'portada_1775766741_999.png', 12, 0, '2026-04-09 20:32:21'),
(82, 'PROCESO DE TRASLADO EN EL LUGAR DE INTERVENCIÓN   (POR TODAS LAS INSTITUCIONES POLICIALES)', 'Secretariado Ejecutivo del Sistema Nacional de Seguridad Pública', '', '', 'libro_1775766904_191.pdf', 'portada_1775766904_447.png', 47, 0, '2026-04-09 20:35:04'),
(83, 'Manual de Uso Progresivo y Diferenciado de la Fuerza Policial', 'Consejo General de Policía', '', '', 'libro_1775766966_597.pdf', 'portada_1775766966_597.png', 12, 0, '2026-04-09 20:36:06'),
(84, 'MODELO NACIONAL DE POLICÍA EN  FUNCIONES DE SEGURIDAD PROCESAL', 'Secretariado Ejecutivo del Sistema Nacional de Seguridad Pública', '2016', '', 'libro_1775767020_588.pdf', 'portada_1775767020_131.png', 47, 0, '2026-04-09 20:37:00'),
(85, 'Manual para uso de la Fuerza', 'Secretaría de Gobernación', '', '', 'libro_1775767088_570.pdf', 'portada_1775767088_723.png', 12, 0, '2026-04-09 20:38:08'),
(86, 'Uso Progresivo y Diferenciado de la Fuerza Policial', 'PEDRO LUIS TANG', '', '', 'libro_1775767176_116.pdf', 'portada_1775767176_979.png', 12, 0, '2026-04-09 20:39:36'),
(87, 'La Guerra de Guerrillas', '', '', '', 'libro_1775767234_830.pdf', 'portada_1775767234_313.png', 25, 0, '2026-04-09 20:40:34'),
(88, 'GUÍA PARA LA TRADUCCIÓN DE CONTRATOS DE ARRENDAMIENTO', 'Isabel Alvarado Moya', '2004', '', 'libro_1775767279_655.pdf', 'portada_1775767279_619.png', 15, 0, '2026-04-09 20:41:19'),
(89, 'Protocolo Uso de la Fuerza SPF', 'Alfonso Ramón Bagur', '', '', 'libro_1775767365_744.pdf', 'portada_1775767365_507.png', 12, 0, '2026-04-09 20:42:45'),
(90, 'Uso de la Fuerza en Intervenciones Policiales', 'ÁNGELA PÉREZ MORAGUES', '2015', '', 'libro_1775767446_709.pdf', 'portada_1775767446_670.png', 12, 0, '2026-04-09 20:44:06'),
(91, 'Minimanual del Guerrillero Urbano', 'Carlos Marighella', '1972', '', 'libro_1775767492_239.pdf', 'portada_1775767492_232.png', 25, 0, '2026-04-09 20:44:52'),
(93, 'Manual del Uso de la Fuerza, de aplicación común a las tres  Fuerzas Armadas', 'Secretaría de la Defensa Nacional.', '2009', '', 'libro_1775767515_354.pdf', 'portada_1775767515_150.png', 12, 0, '2026-04-09 20:45:15'),
(94, 'Cifras Policías abatidos México 2021', 'INEGI', '2020', '', 'libro_1775767518_729.pdf', 'portada_1775767518_864.png', 29, 0, '2026-04-09 20:45:18'),
(95, 'NUEVA METODOLOGÍA PARA LA EVALUACIÓN DE LAS BASES DE DATOS CRIMINALÍSTICAS Y DE PERSONAL DE SEGURIDAD PÚBLICА', 'SECRETARÍA DE GOBERNACIÓN', '', '', 'libro_1775767602_236.pdf', 'portada_1775767602_742.png', 10, 0, '2026-04-09 20:46:42'),
(97, 'Guerra de guerrillas: Un método', 'Formación Política Juventud Guevarista', '', '', 'libro_1775767726_566.pdf', 'portada_1775767726_717.png', 25, 0, '2026-04-09 20:48:46'),
(98, 'MANUAL DE CONOCIMIENTOS BÁSICOS DE TÉCNICAS Y TÁCTICAS PARA EL PERSONAL DE SEGURIDAD PÚBLICA', 'Academia Regional de Seguridad Pública del Centro.', '', '', 'libro_1775767778_294.pdf', 'portada_1775767778_157.png', 63, 0, '2026-04-09 20:49:38'),
(99, 'Sistemas policiales de  información e  inteligencia', 'UNODC', '2010', '', 'libro_1775767781_773.pdf', 'portada_1775767781_759.png', 56, 0, '2026-04-09 20:49:41'),
(100, 'Guía de Seguridad Escolar - Secretaría de Educación de Guanajuato', 'Secretaría de Educación de Guanajuato', '2011', '', 'libro_1775767878_553.pdf', 'portada_1775767878_577.png', 55, 1, '2026-04-09 20:51:18'),
(101, 'ACCESO A LA JUSTICIA - LA FISCALIA', 'UNODC', '2010', '', 'libro_1775767949_359.pdf', 'portada_1775767949_464.png', 56, 0, '2026-04-09 20:52:29'),
(102, 'MANUAL del Uso de la Fuerza, de aplicación común a las tres Fuerzas Armadas.', 'SECRETARIA DE LA DEFENSA NACIONAL', '2014', '', 'libro_1775767952_982.pdf', 'portada_1775767952_702.png', 63, 0, '2026-04-09 20:52:32'),
(103, 'La guerrilla urbana', 'Roberto F. Lamberg', '', '', 'libro_1775767971_446.pdf', 'portada_1775767971_184.png', 25, 0, '2026-04-09 20:52:51'),
(104, 'Índice de Seguridad Escolar', 'UNICEF', '', '', 'libro_1775767979_267.pdf', 'portada_1775767979_914.png', 55, 0, '2026-04-09 20:52:59'),
(105, 'Seguridad pública  y prestación de servicios policiales', '', '2010', '', 'libro_1775768055_291.pdf', 'portada_1775768055_776.png', 56, 0, '2026-04-09 20:54:15'),
(106, 'Manual de Seguridad Escolar', 'Secretaría de Educación Pública', '2011', '', 'libro_1775768066_981.pdf', 'portada_1775768066_587.png', 55, 0, '2026-04-09 20:54:26'),
(108, 'Programa Escuela Segura', 'Secretaría de Educación Pública', '2012', '', 'libro_1775768145_605.pdf', 'portada_1775768145_180.png', 55, 1, '2026-04-09 20:55:45'),
(109, 'Manual Básico De Procedimientos De Defensa Personal Policial', 'José María Benito García', '', '', 'libro_1775768165_450.pdf', 'portada_1775768165_652.png', 63, 0, '2026-04-09 20:56:05'),
(110, 'Reglas de operación del programa Escuela Segura', 'Secretaría de Educación Pública', '2013', '', 'libro_1775768249_430.pdf', 'portada_1775768249_320.png', 55, 0, '2026-04-09 20:57:29'),
(111, 'Manual de ROP', 'Secretaria del Trabajo', '2017', '', 'libro_1775768258_471.pdf', 'portada_1775768258_318.png', 25, 0, '2026-04-09 20:57:38'),
(112, 'Procedimientos Policiales y Derechos del Niño', 'UNICEF', '2012', '', 'libro_1775768259_231.pdf', 'portada_1775768259_115.png', 63, 0, '2026-04-09 20:57:39'),
(113, 'USO TÁCTICO DE LA FUERZA POLICIAL', 'UNES', '2011', '', 'libro_1775768363_937.pdf', 'portada_1775768363_403.png', 63, 0, '2026-04-09 20:59:23'),
(114, 'Un nuevo modelo integral de seguridad GGL', 'Genaro García Luna', '2018', '', 'libro_1775768388_510.pdf', 'portada_1775768388_886.png', 29, 0, '2026-04-09 20:59:48'),
(115, 'LA SEGURIDAD FRENTE  A ARTEFACTOS EXPLOSIVOS', 'CENTRO SUPERIOR DE ESTUDIOS DE LA DEFENSA NACIONAL', '2009', '', 'libro_1775768404_632.pdf', 'portada_1775768404_602.png', 56, 0, '2026-04-09 21:00:04'),
(116, 'PROTECCION PERSONAL', 'Robert F. Herrick', '', '', 'libro_1775768480_133.pdf', 'portada_1775768480_605.png', 63, 0, '2026-04-09 21:01:20'),
(117, 'Manual de Supervivencia Urbana', '', '2002', '', 'libro_1775768529_883.pdf', 'portada_1775768529_797.png', 25, 0, '2026-04-09 21:02:09'),
(118, 'TECNICAS DE LA INTERVENCIÓN POLICIAL', 'SECRETARIA DE SEGURIDAD PUBLICA PREVENCION Y READAPTACION SOCIAL', '', '', 'libro_1775768666_481.pdf', 'portada_1775768666_345.png', 63, 0, '2026-04-09 21:04:26'),
(119, 'Manual de guerrilla y contraguerrilla', 'Universidad Experimental Politecnica de la Fuerza Armada Nacional ivision de instrucción militar', '2006', '', 'libro_1775768893_407.pdf', 'portada_1775768893_187.png', 25, 0, '2026-04-09 21:08:13'),
(120, 'DIAGNÓSTICO SOBRE LA SEGURIDAD PÚBLICA EN MÉXICO', 'Gabriela C. Pérez García', '2004', '', 'libro_1775768939_505.pdf', 'portada_1775768939_510.png', 29, 0, '2026-04-09 21:08:59'),
(121, 'Operaciones Antisubversivas y Especiales', '', '', '', 'libro_1775769007_347.pdf', 'portada_1775769007_690.png', 25, 0, '2026-04-09 21:10:07'),
(122, 'Teoria del guerrillero', 'Carl Schmitt', '1963', '', 'libro_1775769173_476.pdf', 'portada_1775769173_111.png', 25, 0, '2026-04-09 21:12:53'),
(123, 'LEY FEDERAL DE SEGURIDAD PRIVADA', 'Diario Oficial', '2011', '', 'libro_1775769440_707.pdf', 'portada_1775769440_872.png', 29, 0, '2026-04-09 21:17:20'),
(124, 'LAS POLÍTICAS DE SEGURIDAD PÚBLICA', 'Centro Regional de Conocimientos y Servicios para el Desarrollo en América Latina y el Caribe', '2005', '', 'libro_1775769780_440.pdf', 'portada_1775769780_894.png', 29, 0, '2026-04-09 21:23:00'),
(125, 'Radiografía de la ominosa presencia de los carteles mexicanos', 'Pares Fundación Paz & Reconciliación', '', '', 'libro_1775769800_857.pdf', 'portada_1775769800_259.png', 18, 0, '2026-04-09 21:23:20'),
(126, 'Manual de orden cerrado', 'Universidad Experimental Politécnica de la Fuerza Armada División de Instrucción Militar', '2006', '', 'libro_1775770195_606.pdf', 'portada_1775770195_861.png', 32, 0, '2026-04-09 21:29:55'),
(127, 'REGLAMENTO DE LA LEY FEDERAL DE SEGURIDAD PRIVADA', 'Diario Oficial', '2011', '', 'libro_1775770528_661.pdf', 'portada_1775770528_192.png', 29, 0, '2026-04-09 21:35:28'),
(128, 'Manual de Instrucción de Orden Cerrado de Infantería', 'Secretaría de la Defensa Nacional', '2014', '', 'libro_1775770557_843.pdf', 'portada_1775770557_739.png', 32, 0, '2026-04-09 21:35:57'),
(129, 'Manual de Instrucción de Orden Cerrado de Infantería del HCM', 'HCM', '', '', 'libro_1775770775_420.pdf', 'portada_1775770775_709.png', 32, 0, '2026-04-09 21:39:35'),
(130, 'La seguridad humana en las Naciones Unidas', 'Fondo Fiduciario de las Naciones Unidas para la Seguridad Humana', '2015', '', 'libro_1775770925_136.pdf', 'portada_1775770925_933.png', 29, 0, '2026-04-09 21:42:05'),
(131, 'Seguridad ciudadana y la seguridad nacional en México: hacia un marco conceptual', 'José María Ramos García', '2005', '', 'libro_1775771056_159.pdf', 'portada_1775771056_522.png', 29, 0, '2026-04-09 21:44:16'),
(132, 'Orden Cerrado', '', '', '', 'libro_1775771071_459.pdf', 'portada_1775771071_875.png', 32, 0, '2026-04-09 21:44:31'),
(133, 'Reglamento de Orden Cerrado', '', '', '', 'libro_1775771179_504.pdf', 'portada_1775771179_510.png', 32, 0, '2026-04-09 21:46:19'),
(134, 'Servicio Militar Nacional Instrucción', '', '', '', 'libro_1775771332_921.pdf', 'portada_1775771332_722.png', 32, 0, '2026-04-09 21:48:52'),
(136, 'Memoria de la Mesa Redonda: Mando Único Policial', 'CEDIP', '2011', '', 'libro_1775771735_533.pdf', 'portada_1775771735_781.png', 39, 0, '2026-04-09 21:55:35'),
(137, 'La Seguridad Privada en México: Su normatividad', 'Federico Siller Blanco', '', '', 'libro_1775771910_344.pdf', 'portada_1775771910_309.png', 29, 0, '2026-04-09 21:58:30'),
(138, 'La seguridad humana como pilar de desarrollo social en México', 'Pedro Núñez  Mendoza', '2014', '', 'libro_1775772030_462.pdf', 'portada_1775772030_360.png', 29, 0, '2026-04-09 22:00:30'),
(139, 'Guía Código Nacional de Policía y Convivencia', 'CNPC', '', '', 'libro_1775772090_607.pdf', 'portada_1775772090_834.png', 46, 0, '2026-04-09 22:01:30'),
(140, 'CUESTIONES INTERSECTORIALES - Cooperación  internacional', 'UNODC', '2010', '', 'libro_1775772308_382.pdf', 'portada_1775772308_982.png', 56, 0, '2026-04-09 22:05:08'),
(141, 'Tesis: Sistema de Desempeño de la Policía de Proximidad del Distrito Federal', 'Israel González Valdez', '2012', '', 'libro_1775772374_216.pdf', 'portada_1775772374_149.png', 46, 0, '2026-04-09 22:06:14'),
(142, 'SEGURIDAD NACIONAL Y NARCOTRÁFICO:VINCULOS REALES E IMAGINARIOS', 'JORGE CHABAT', '1994', '', 'libro_1775772452_974.pdf', 'portada_1775772452_841.png', 56, 0, '2026-04-09 22:07:32'),
(143, 'LA INTELIGENCIA PARA LA SEGURIDAD NACIONAL EN EL SIGLO XXI', 'GUILLERMO VALDÉS CASTELLANOS', '2009', '', 'libro_1775772557_169.pdf', 'portada_1775772557_346.png', 56, 0, '2026-04-09 22:09:17'),
(144, 'Policía de Proximidad: diseño del modelo y apoyo para su implementación', 'IDEA', '2017', '', 'libro_1775772584_517.pdf', 'portada_1775772584_422.png', 46, 0, '2026-04-09 22:09:44'),
(145, 'LA SEGURIDAD NACIONAL EN MÉXICO DEBATE ACTUAL', 'JOSE LUIS PIÑEYRO', '2004', '', 'libro_1775772626_698.pdf', 'portada_1775772626_698.png', 56, 0, '2026-04-09 22:10:26'),
(146, 'Arquitectura penitenciaria', 'Julio Altmann Smythe', '', '', 'libro_1775772665_385.pdf', 'portada_1775772665_677.png', 61, 0, '2026-04-09 22:11:05'),
(147, 'Modelos de Policía Comunitaria - Proximidad', 'Secretaría de Desarrollo Social', '2009', '', 'libro_1775772742_240.pdf', 'portada_1775772742_209.png', 46, 0, '2026-04-09 22:12:22'),
(148, 'La transformación del Sistema Penitenciario Federal: una visión de Estado', 'Sánchez Galindo A. et al', '2012', '', 'libro_1775772796_745.pdf', 'portada_1775772796_286.png', 61, 0, '2026-04-09 22:13:16'),
(149, 'Seguridad nacional: un  concepto ampliado y  complejo', 'Gabriel Mario Santos Villarreal', '2009', '', 'libro_1775772902_445.pdf', 'portada_1775772902_179.png', 56, 0, '2026-04-09 22:15:02'),
(150, 'Los Derechos de los Internos del sistema penitenciario mexicano', 'Mercedes Peláez Farrusca', '2000', '', 'libro_1775772909_594.pdf', 'portada_1775772909_188.png', 61, 0, '2026-04-09 22:15:09'),
(151, 'EL NUEVO RETO DE LA POLICÍA COMO SERVICIO PÚBLICO', 'M. Teresa Toledo Fernández', '2012', '', 'libro_1775772942_811.pdf', 'portada_1775772942_678.png', 46, 0, '2026-04-09 22:15:42'),
(152, 'Conceptos esenciales de Sociología', 'Anthony Giddens', '2014', '', 'libro_1775773200_522.pdf', 'portada_1775773200_277.png', 62, 0, '2026-04-09 22:20:00'),
(153, 'Informes y Actas Policiales', '', '', '', 'libro_1775773209_950.pdf', 'portada_1775773209_443.png', 54, 0, '2026-04-09 22:20:09'),
(154, 'Manual de Derecho Nuclear Legislación de aplicación', 'Carlton Stoiber Abdelmadjid Cherf Wolfram Tonhauser Maria de Lourdes Vez Carmona', '2012', '', 'libro_1775773228_374.pdf', 'portada_1775773228_784.png', 64, 0, '2026-04-09 22:20:28'),
(155, 'LA COSTITUCION  DE LA SOCIEDAD', 'Anthony giddens.', '1984', '', 'libro_1775773295_921.pdf', 'portada_1775773295_705.png', 62, 0, '2026-04-09 22:21:35'),
(156, 'Manual de Operaciones Especiales', 'POLICÍA NACIONAL DE COLOMBIA', '2009', '', 'libro_1775773340_304.pdf', 'portada_1775773340_721.png', 64, 0, '2026-04-09 22:22:20'),
(157, 'CONSECUENCIAS DE LA MODERNIDAD', 'Anthony Giddens', '1990', '', 'libro_1775773357_196.pdf', 'portada_1775773357_268.png', 62, 0, '2026-04-09 22:22:37'),
(159, 'GUÍA DE ESTUDIO', 'SEGURIDAD PÚBLICA Y POLICÍA DE PROXIMIDAD', '2021', '', 'libro_1775773462_932.pdf', 'portada_1775773462_701.png', 2, 0, '2026-04-09 22:24:22'),
(160, 'LAS NUEVAS REGLAS DEL METODO SOCIOLÓGO', 'Anthony Giddens', '1967', '', 'libro_1775773474_463.pdf', 'portada_1775773474_644.png', 62, 0, '2026-04-09 22:24:34'),
(161, 'Sociología', 'Anthony Giddens', '1991', '', 'libro_1775773527_966.pdf', 'portada_1775773527_258.png', 62, 0, '2026-04-09 22:25:27'),
(162, 'Manual de Terrorismo y Guerrilla Urbana', 'Escuela de las Americas', '', '', 'libro_1775773548_715.pdf', 'portada_1775773548_253.png', 64, 0, '2026-04-09 22:25:48'),
(163, 'Armas de Uso Profesional', 'José Luis Domínguez', '', '', 'libro_1775773615_564.pdf', 'portada_1775773615_836.png', 8, 0, '2026-04-09 22:26:55'),
(164, 'PROGRAMA NACIONAL DE SEGURIDAD  PÚBLICA', 'SECRETARÍA DE SEGURIDAD Y PROTECCIÓN  CIUDADANA', '2024', '', 'libro_1775773643_391.pdf', 'portada_1775773643_227.png', 2, 0, '2026-04-09 22:27:23'),
(165, 'TESIS Terrorismo Moderno como objeto de estudio de la elección pública', 'Yolanda Cotelo Ouréns', '2016', '', 'libro_1775773643_229.pdf', 'portada_1775773643_792.png', 64, 0, '2026-04-09 22:27:23'),
(166, 'MANUAL DE MANEJO Y MANTENIMIENTO DE MOVILES POLICIALES', 'NERY SANABRIA', '1996', '', 'libro_1775773660_401.pdf', 'portada_1775773660_554.png', 14, 1, '2026-04-09 22:27:40'),
(167, 'Armas menos letales en América Latina', 'Naciones Unidas', '2016', '', 'libro_1775773688_489.pdf', 'portada_1775773688_778.png', 8, 0, '2026-04-09 22:28:08'),
(168, '“Las cuatro oleadas del terrorismo moderno”', 'David Rapoport', '2004', '', 'libro_1775773734_584.pdf', 'portada_1775773734_368.png', 64, 0, '2026-04-09 22:28:54'),
(169, 'Participación ciudadana en la gestión y en las políticas públicas', 'Ana Díaz Aldret', '2015', '', 'libro_1775773771_524.pdf', 'portada_1775773771_773.png', 2, 0, '2026-04-09 22:29:31'),
(170, 'Capacitación a los efectivos policiales', '', '', '', 'libro_1775773776_597.pdf', 'portada_1775773776_550.png', 8, 0, '2026-04-09 22:29:36'),
(171, 'Prevención de Actos Terroristas desde la Justicia Penal UNODC', 'Subdivisión de Prevención del Terrorismo', '2006', '', 'libro_1775773822_595.pdf', 'portada_1775773822_749.png', 64, 0, '2026-04-09 22:30:22'),
(172, 'Balísitca Forense-Clasificación de las armas', '', '', '', 'libro_1775773838_929.pdf', 'portada_1775773838_325.png', 8, 0, '2026-04-09 22:30:38'),
(173, 'Nuevo paradigma policial en el sistema penal acusatorio', '', '', '', 'libro_1775773861_411.pdf', 'portada_1775773861_862.png', 60, 0, '2026-04-09 22:31:01'),
(174, 'Ciudades Seguras', 'Enrique Betancourt G.', '2012', '', 'libro_1775773881_928.pdf', 'portada_1775773881_469.png', 26, 0, '2026-04-09 22:31:21'),
(175, '¿NOS ENCONTRAMOS ANTE LA QUINTA OLEADA DEL TERRORISMO INTERNACIONAL?', 'Emilio Sánchez de Rojas Díaz', '2006', '', 'libro_1775773915_517.pdf', 'portada_1775773915_738.png', 64, 0, '2026-04-09 22:31:55'),
(176, 'SEGURIDAD CIUDADANA Y DERECHOS HUMANOS', '', '2009', '', 'libro_1775773935_161.pdf', 'portada_1775773935_814.png', 2, 0, '2026-04-09 22:32:15'),
(177, 'Detención y uso de la fuerza', 'GUSTAVO FONDEVILA Y MATTHEW C.INGRAM', '2007', '', 'libro_1775773937_302.pdf', 'portada_1775773937_401.png', 26, 0, '2026-04-09 22:32:17'),
(178, 'Manual de Identificación y Rastreo   de Armas de Fuego  MIRAF', 'Registro Nacional de Armas - Argentina', '2003', '', 'libro_1775773969_278.pdf', 'portada_1775773969_854.png', 8, 0, '2026-04-09 22:32:49'),
(179, 'TERRORISMO, YIHADISMO Y CRIMEN ORGANIZADO EN LA ESTRATEGIA GLOBAL DE SEGURIDAD DE LA UE.', 'Antonio Alonso', '2016', '', 'libro_1775774002_936.pdf', 'portada_1775774002_859.png', 64, 0, '2026-04-09 22:33:22'),
(180, 'Elementos del Programa Nacional de Seguridad Pública 2104-2018 y su relación con la Seguridad Humana.', 'Gerardo Ballesters de León', '2014', '', 'libro_1775774021_748.pdf', 'portada_1775774021_702.png', 26, 0, '2026-04-09 22:33:41'),
(181, 'Armas y Municiones de Impacto Controlado', 'Armistía Internacional', '2011', '', 'libro_1775774069_798.pdf', 'portada_1775774069_793.png', 8, 1, '2026-04-09 22:34:29'),
(182, 'Centro Nacional de Prevención  del Delito y Participación  Ciudadana', 'Enrique Betancourt Gaona', '2012', '', 'libro_1775774084_183.pdf', 'portada_1775774084_948.png', 26, 0, '2026-04-09 22:34:44'),
(183, 'ESTRATEGIA NACIONAL DE SEGURIDAD PÚBLICA', 'SECRETARÍA DE SEGURIDAD Y PROTECCIÓN CIUDADANA', '2024', '', 'libro_1775774099_714.pdf', 'portada_1775774099_913.png', 2, 0, '2026-04-09 22:34:59'),
(184, 'Secretos del Taser', '', '', '', 'libro_1775774149_379.pdf', 'portada_1775774149_555.png', 8, 0, '2026-04-09 22:35:49'),
(185, 'Revista Nuevo Sistema de Justicia Penal', 'Consejo de Coordinación para la Implementación del Nuevo Sistema de Justicia Penal', '2016', '', 'libro_1775774162_747.pdf', 'portada_1775774162_457.png', 60, 0, '2026-04-09 22:36:02'),
(186, 'Tipos de Armas', '', '', '', 'libro_1775774191_455.pdf', 'portada_1775774191_357.png', 8, 0, '2026-04-09 22:36:31'),
(187, 'Teorías de la seguridad pública y percepción del delito', 'Dr. Javier Carreón Guillén y Mtro. Cruz García Lirios', '2013', '', 'libro_1775774194_603.pdf', 'portada_1775774194_844.png', 2, 0, '2026-04-09 22:36:34'),
(188, 'Guía para la  prevención local hacia políticas de cohesión social y seguridad ciudadana', '©Programa de las Naciones Unidas para los Asentamientos Humanos (ONU-HABITAT)', '2009', '', 'libro_1775774231_288.pdf', 'portada_1775774231_755.png', 26, 0, '2026-04-09 22:37:11'),
(189, 'CONVENCIÓN SOBRE LOS DERECHOS DE LAS PERSONAS CON DISCAPACIDAD', 'ONU', '2006', '', 'libro_1775774283_567.pdf', 'portada_1775774283_962.png', 21, 0, '2026-04-09 22:38:03'),
(190, 'Violencia en México:  realidades y perspectivas', 'Sigrid Arzt y Guillermo Vázquez del Mercado', '', '', 'libro_1775774303_559.pdf', 'portada_1775774303_839.png', 2, 0, '2026-04-09 22:38:23'),
(191, 'Guía de Actuación para la Comunicación Social en el Nuevo Sistema de Justicia Penal Acusatorio', 'PGR', '2016', '', 'libro_1775774337_563.pdf', 'portada_1775774337_497.png', 60, 0, '2026-04-09 22:38:57'),
(192, 'Instrumento Pedagógico para la Reforma Policial Democrática en México', 'Instituto para la Seguridad y la Democracia', '2013', '', 'libro_1775774353_771.pdf', 'portada_1775774353_176.png', 26, 0, '2026-04-09 22:39:13'),
(193, 'DERECHOS DE LOS HOMOSEXUALES', 'MARÍA DE MONSERRAT PÉREZ CONTRERAS', '1991', '', 'libro_1775774366_140.pdf', 'portada_1775774366_572.png', 21, 0, '2026-04-09 22:39:26'),
(194, '¿Qué es la Seguridad Pública para México? Gendarmería y Proximidad Social como estrategias policiales / What is Public Safety for Mexico? Gendarmerie and Social Proximity as police strategies', 'Jesús Muñoz Castellanos', '2017', '', 'libro_1775774406_972.pdf', 'portada_1775774406_688.png', 2, 0, '2026-04-09 22:40:06'),
(195, 'La policía Mexicana dentro del Proceso de Reforma del Sistema Penal', 'Guillermo Zepeda Lecuona', '2010', '', 'libro_1775774432_119.pdf', 'portada_1775774432_432.png', 26, 0, '2026-04-09 22:40:32'),
(196, 'EL DERECHO A DEFENDER LOS DERECHOS HUMANOS EN MÉXICO: ANÁLISIS DESDE LAS OBLIGACIONES INTERNACIONALES', 'JOSÉ RAYMUNDO SANDOVAL BAUISTA', '2008', '', 'libro_1775774489_481.pdf', 'portada_1775774489_645.png', 21, 0, '2026-04-09 22:41:29'),
(197, 'ENCUESTA NACIONAL DE VICTIMIZACIÓN Y PERCEPCIÓN SOBRE SEGURIDAD  PÚBLICA (ENVIPE) 2023', 'INEGI', '2023', '', 'libro_1775774518_221.pdf', 'portada_1775774518_240.png', 2, 0, '2026-04-09 22:41:58'),
(198, 'Defensa personal policial', '', '', '', 'libro_1775774521_828.pdf', 'portada_1775774521_759.png', 13, 0, '2026-04-09 22:42:02'),
(199, 'Manual de sistemas comparados de policía', 'Marcos Pablo Moloeznik', '2010', '', 'libro_1775774531_593.pdf', 'portada_1775774531_671.png', 26, 0, '2026-04-09 22:42:11'),
(200, 'Derechos humanos de los migrantes y otras personas en el contexto de la movilidad humana en México', 'CIDH', '2013', '', 'libro_1775774562_521.pdf', 'portada_1775774562_270.png', 21, 0, '2026-04-09 22:42:42'),
(201, 'Derechos Humanos de los Grupos Vulnerables', 'Jane Felipe Beltrão', '2014', '', 'libro_1775774618_949.pdf', 'portada_1775774618_271.png', 21, 0, '2026-04-09 22:43:38'),
(202, 'Manual Trasparencia Policial', 'Instituto Federal de Acceso a la Información y Protección de Datos  Instituto para la Seguridad y la Democracia, A.C.', '', '', 'libro_1775774626_902.pdf', 'portada_1775774626_185.png', 26, 0, '2026-04-09 22:43:46'),
(203, 'Derechos Humanos y Grupos  Vulnerables', 'Comisión Nacional de los Derechos Humanos', '2003', '', 'libro_1775774700_689.pdf', 'portada_1775774701_743.png', 21, 0, '2026-04-09 22:45:01'),
(204, 'LEY GENERAL DEL SISTEMA NACIONAL DE SEGURIDAD PÚBLICA', '', '2009', '', 'libro_1775774706_161.pdf', 'portada_1775774706_761.png', 2, 0, '2026-04-09 22:45:06'),
(205, 'Función, Fuerza Física y Rendición de Cuentas en la Policía Latinoamericana: Proposiciones para un Nuevo Modelo Policial', 'Luis Gerardo Gabaldón', '', '', 'libro_1775774786_879.pdf', 'portada_1775774786_440.png', 26, 0, '2026-04-09 22:46:26'),
(206, 'LOS DERECHOS HUMANOS DE LAS PERSONAS  CON DISCAPACIDAD', 'Juan Manuel Hernández Licona', '2007', '', 'libro_1775774810_161.pdf', 'portada_1775774810_949.png', 21, 0, '2026-04-09 22:46:50'),
(207, 'Policía Comunitaria', 'Carlos Guillermo Blanco', '', '', 'libro_1775774832_360.pdf', 'portada_1775774832_751.png', 2, 0, '2026-04-09 22:47:12'),
(208, 'DERECHOS HUMANOS DE LAS MUJERES', 'Instituto Nacional de las mujeres', '2002', '', 'libro_1775774857_225.pdf', 'portada_1775774857_848.png', 21, 0, '2026-04-09 22:47:37'),
(209, 'Una alternativa: la policía comunitaria', 'FELIPE ESPINOSA TORRES', '', '', 'libro_1775774905_863.pdf', 'portada_1775774905_882.png', 26, 0, '2026-04-09 22:48:25'),
(210, 'DERECHOS HUMANOS DE LAS PERSONAS MIGRANTES QUE TRANSITAN POR MÉXICO', 'Instituto Nacional de Migración', '2011', '', 'libro_1775774942_644.pdf', 'portada_1775774942_505.png', 21, 0, '2026-04-09 22:49:02'),
(211, 'Manual de seguridad  pública y policía de proximidad', '', '2022', '', 'libro_1775774949_842.pdf', 'portada_1775774949_804.png', 2, 0, '2026-04-09 22:49:09'),
(212, 'Derechos humanos de los pueblos indígenas en México', 'Comisión Nacional de  los Derechos Humanos', '2012', '', 'libro_1775775000_756.pdf', 'portada_1775775000_372.png', 21, 0, '2026-04-09 22:50:00'),
(213, 'Policía de Proximidad EEUU Cambios en la Naturaleza, Estructura y Funciones de la Policía', 'JACK R. GREENE', '', '', 'libro_1775775023_758.pdf', 'portada_1775775023_157.png', 26, 0, '2026-04-09 22:50:23'),
(214, 'Seguridad pública y prestación de servicios policiales', 'Naciones unidas', '2010', '', 'libro_1775775197_308.pdf', 'portada_1775775197_909.png', 26, 0, '2026-04-09 22:53:17'),
(215, 'DIRECCIÓN DED SIMPLIFICACIÓN Y DIGITALIZACIÓN FORMATO DE AGENDA REGULATORIA MUNICIPAL', 'SECRETARÍA DE SEGURIDAD PÚBLICA Y PROTECCIÓN CIUDADANA', '2024', '', 'libro_1775775214_525.pdf', 'portada_1775775214_999.png', 2, 0, '2026-04-09 22:53:34'),
(216, 'Ley General para la Inclusión de las Personas con Discapacidad', 'CONGRESO GENERAL DE LOS ESTADOS UNIDOS MEXICANOS,', '2011', '', 'libro_1775775275_384.pdf', 'portada_1775775275_261.png', 21, 0, '2026-04-09 22:54:35'),
(217, 'Audiencia pública relativa al Mando Único Estatal: Comisiones Unidas de Puntos Constitucionales, de  Justicia y de Estudios Legislativos.', 'José Antonio Caballero', '2015', '', 'libro_1775775319_154.pdf', 'portada_1775775319_825.png', 26, 0, '2026-04-09 22:55:19'),
(218, 'Reflexiones sobre el subsistema policial mexicano', 'Marcos Pablo Moloeznik', '2010', '', 'libro_1775775324_736.pdf', 'portada_1775775324_761.png', 26, 0, '2026-04-09 22:55:24'),
(219, 'GUÍA DE DERECHOS HUMANOS', 'SEDESOL', '2014', '', 'libro_1775775365_704.pdf', 'portada_1775775365_501.png', 21, 0, '2026-04-09 22:56:05'),
(220, 'Capacitación en Modelos Policiales de Orientación Comunitaria con  Énfasis en la Perspectiva de Género', 'Secretaría de Gobernación', '2013', '', 'libro_1775775408_940.pdf', 'portada_1775775408_618.png', 26, 0, '2026-04-09 22:56:48'),
(221, 'LEY DE LOS DERECHOS DE LAS PERSONAS ADULTAS MAYORES', 'CÁMARA DE DIPUTADOS DEL H. CONGRESO DE LA UNIÓN', '2012', '', 'libro_1775775453_332.pdf', 'portada_1775775453_716.png', 21, 0, '2026-04-09 22:57:33'),
(222, 'México: Seguridad Ciudadana y Democracia', 'Universidad Iberoamericana Ciudad de México', '2025', '', 'libro_1775775455_604.pdf', 'portada_1775775455_678.png', 2, 0, '2026-04-09 22:57:35'),
(223, 'EL SNSP y el  Nuevo Modelo Policial', '', '', '', 'libro_1775775471_872.pdf', 'portada_1775775471_710.png', 26, 0, '2026-04-09 22:57:51'),
(224, 'LEY GENERAL DE LOS DERECHOS DE NIÑAS, NIÑOS Y ADOLESCENTES', 'CÁMARA DE DIPUTADOS DEL H. CONGRESO DE LA UNIÓN', '2014', '', 'libro_1775775505_618.pdf', 'portada_1775775505_346.png', 21, 0, '2026-04-09 22:58:25'),
(225, 'LEY SOBRE REFUGIADOS, PROTECCIÓN COMPLEMENTARIA Y ASILO POLÍTICO', 'CÁMARA DE DIPUTADOS DEL H. CONGRESO DE LA UNIÓN', '2014', '', 'libro_1775775571_686.pdf', 'portada_1775775571_518.png', 21, 0, '2026-04-09 22:59:31'),
(226, 'MANUAL DE CAPACITACIÓN POLICIAL EN EL USO RACIONAL DE LA FUERZA', 'Dr. Sergio Berni', '2015', '', 'libro_1775775581_786.pdf', 'portada_1775775581_944.png', 2, 0, '2026-04-09 22:59:41'),
(227, 'Áreas Estratégicas y Prioritarias', 'Samantha López Guardiola', '2012', '', 'libro_1775775592_442.pdf', 'portada_1775775592_610.png', 67, 0, '2026-04-09 22:59:52'),
(228, 'El activismo LGBT en México: nuevos retos... viejas amenazas', 'Rabea Weis', '2014', '', 'libro_1775775633_409.pdf', 'portada_1775775633_589.png', 21, 0, '2026-04-09 23:00:33'),
(229, 'Violencia del crimen organizado relacionada a los sectores económicos en México. Una propuesta de categorización', 'María Vanessa Romero Ortiz, Jorge Loza López y Felipe Machorro Ramos', '2013', '', 'libro_1775775657_793.pdf', 'portada_1775775657_292.png', 2, 0, '2026-04-09 23:00:57'),
(230, 'Los matrimonios entre homosexuales  y los derechos humanos', 'Salvador Abascal Carranza', '2001', '', 'libro_1775775709_925.pdf', 'portada_1775775709_994.png', 21, 0, '2026-04-09 23:01:49'),
(231, 'Programa Sectorial de Seguridad y Protección Ciudadana 2020-2024.', 'Secretaría de Seguridad y Protección Ciudadana', '2020', '', 'libro_1775775750_303.pdf', 'portada_1775775750_365.png', 2, 0, '2026-04-09 23:02:30'),
(232, 'Los Principios Rectores sobre la Extrema Pobreza y los  Derechos Humanos', 'NACIONES UNIDAS DERECHOS HUMANOS', '2012', '', 'libro_1775775806_897.pdf', 'portada_1775775806_919.png', 21, 0, '2026-04-09 23:03:26'),
(233, 'PROGRAMA ESTRATÉGICO 2021 - 2024', 'SECRETARIADO EJECUTIVO DEL SISTEMA NACIONAL DE SEGURIDAD PÚBLICA', '2021', '', 'libro_1775775881_365.pdf', 'portada_1775775881_216.png', 2, 2, '2026-04-09 23:04:41'),
(234, 'Manual de Derechos Humanos y No Discriminación del Adulto Mayor', 'Ernesto Padilla Nieto', '2003', '', 'libro_1775775889_227.pdf', 'portada_1775775889_856.png', 21, 0, '2026-04-09 23:04:49'),
(235, 'El Ciclo Básico de Inteligencia en la Investigación Policial', 'Esperanza Sandoval Pérez', '2012', '', 'libro_1775835522_589.pdf', 'portada_1775835522_398.png', 19, 0, '2026-04-10 15:38:42'),
(236, 'Manual de Ciberseguridad para organizaciones de la sociedad civil', 'National Democratic Institute', '', '', 'libro_1775853852_844.pdf', 'portada_1775853852_381.png', 1, 1, '2026-04-10 20:44:12'),
(237, 'Hacking Ético: Teoría y práctica', 'Haz López L. et al', '2024', '', 'libro_1775854054_883.pdf', 'portada_1775854054_298.png', 1, 0, '2026-04-10 20:47:34');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `recursos`
--
ALTER TABLE `recursos`
  ADD PRIMARY KEY (`id_recurso`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT de la tabla `recursos`
--
ALTER TABLE `recursos`
  MODIFY `id_recurso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=238;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `recursos`
--
ALTER TABLE `recursos`
  ADD CONSTRAINT `recursos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
