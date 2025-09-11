-- =====================================================================
-- CMD_01 - SGPCMD básico
-- SCRIPT 1: Crear base de datos y tablas (SIN llaves foráneas)
-- Requiere: MySQL 8+ / MariaDB 10.4+
-- =====================================================================

DROP DATABASE IF EXISTS CMD_01;
CREATE DATABASE CMD_01
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE CMD_01;

-- =========================
-- Tablas de catálogos/estados
-- =========================

CREATE TABLE estados_usuario (
  id_estado_usuario   TINYINT UNSIGNED PRIMARY KEY,
  nombre              VARCHAR(30) NOT NULL,         -- Activo, Inactivo, Suspendido, Eliminado
  descripcion         VARCHAR(200) NULL,
  creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE estados_obra (
  id_estado_obra      TINYINT UNSIGNED PRIMARY KEY,
  nombre              VARCHAR(30) NOT NULL,         -- Activa, En ejecución, Finalizada
  descripcion         VARCHAR(200) NULL,
  creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================
-- Obras / Proyectos
-- =========================

CREATE TABLE obras (
  id_obra             BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  codigo              VARCHAR(30) NOT NULL,         -- único por obra
  nombre              VARCHAR(120) NOT NULL,
  fecha_inicio        DATE NULL,
  fecha_fin           DATE NULL,
  id_estado_obra      TINYINT UNSIGNED NOT NULL,    -- FK -> estados_obra (SCRIPT 2)
  id_responsable      BIGINT UNSIGNED NULL,         -- FK -> usuarios (SCRIPT 2, se crea después)
  observaciones       TEXT NULL,
  creada_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizada_en      TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  eliminado_en        TIMESTAMP NULL DEFAULT NULL,  -- eliminación lógica (opcional)
  UNIQUE KEY uk_obras_codigo (codigo)
) ENGINE=InnoDB;

-- =========================
-- Usuarios
-- =========================

CREATE TABLE usuarios (
  id_usuario          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  tipo_documento      VARCHAR(10) NOT NULL,         -- CC, CE, etc.
  nro_documento       VARCHAR(30) NOT NULL,
  nombres             VARCHAR(120) NOT NULL,
  apellidos           VARCHAR(120) NOT NULL,
  correo              VARCHAR(150) NOT NULL,
  telefono            VARCHAR(30) NULL,
  hash_password       VARCHAR(255) NOT NULL,
  id_estado_usuario   TINYINT UNSIGNED NOT NULL,    -- FK -> estados_usuario (SCRIPT 2)
  eliminado_logico    BOOLEAN NOT NULL DEFAULT 0,   -- soporte RF012/RF013
  creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en      TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  -- Seguridad básica
  intentos_fallidos   SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  bloqueado_hasta     DATETIME NULL,
  -- Soporte unicidad RF003
  UNIQUE KEY uk_usuario_doc (tipo_documento, nro_documento),
  UNIQUE KEY uk_usuario_correo (correo),
  KEY idx_usuario_estado (id_estado_usuario)
) ENGINE=InnoDB;

-- =========================
-- Asociación Usuario-Obra (RF005)
-- Permite múltiples obras por usuario, con flag de vigencia
-- =========================

CREATE TABLE usuarios_obras (
  id_usuario_obra     BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_usuario          BIGINT UNSIGNED NOT NULL,     -- FK (SCRIPT 2)
  id_obra             BIGINT UNSIGNED NOT NULL,     -- FK (SCRIPT 2)
  vigente             BOOLEAN NOT NULL DEFAULT 1,   -- 1 = asignación actual
  asignado_en         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_usuario_obra_unica (id_usuario, id_obra),
  KEY idx_usuario_vigente (id_usuario, vigente),
  KEY idx_obra (id_obra)
) ENGINE=InnoDB;

-- =========================
-- Roles y Permisos (RBAC)
-- =========================

CREATE TABLE roles (
  id_rol              SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre              VARCHAR(80) NOT NULL,         -- Admin TIC, Supervisor Obra, Residente, etc.
  descripcion         VARCHAR(200) NULL,
  creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_roles_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE permisos (
  id_permiso          SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  codigo              VARCHAR(120) NOT NULL,        -- p.ej. OBRA_CREAR, USUARIO_EDITAR
  descripcion         VARCHAR(200) NULL,
  creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_permisos_codigo (codigo)
) ENGINE=InnoDB;

CREATE TABLE roles_permisos (
  id_rol              SMALLINT UNSIGNED NOT NULL,   -- FK (SCRIPT 2)
  id_permiso          SMALLINT UNSIGNED NOT NULL,   -- FK (SCRIPT 2)
  asignado_en         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_rol, id_permiso)
) ENGINE=InnoDB;

CREATE TABLE usuarios_roles (
  id_usuario          BIGINT UNSIGNED NOT NULL,     -- FK (SCRIPT 2)
  id_rol              SMALLINT UNSIGNED NOT NULL,   -- FK (SCRIPT 2)
  asignado_por        BIGINT UNSIGNED NULL,         -- FK -> usuarios (SCRIPT 2)
  asignado_en         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario, id_rol),
  KEY idx_roles_asignado_por (asignado_por)
) ENGINE=InnoDB;

-- =========================
-- Autenticación / Seguridad
-- =========================

-- Intentos de login (RF018)
CREATE TABLE login_intentos (
  id_intento          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_usuario          BIGINT UNSIGNED NULL,         -- puede ser NULL si no se identifica el usuario
  correo_intento      VARCHAR(150) NULL,            -- para registrar intentos por correo
  exito               BOOLEAN NOT NULL,
  ip_origen           VARCHAR(45) NULL,             -- soporta IPv4/IPv6
  user_agent          VARCHAR(255) NULL,
  creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_intentos_usuario_fecha (id_usuario, creado_en),
  KEY idx_intentos_correo_fecha (correo_intento, creado_en)
) ENGINE=InnoDB;

-- Sesiones (control de inactividad RF020)
CREATE TABLE sesiones (
  id_sesion           CHAR(64) PRIMARY KEY,         -- token/ID de sesión
  id_usuario          BIGINT UNSIGNED NOT NULL,     -- FK (SCRIPT 2)
  creada_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ultima_actividad    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cerrada_por_inactividad BOOLEAN NOT NULL DEFAULT 0,
  KEY idx_sesiones_usuario (id_usuario)
) ENGINE=InnoDB;

-- Tokens de recuperación de contraseña (RF025–RF027)
CREATE TABLE password_reset_tokens (
  id_token            CHAR(64) PRIMARY KEY,         -- token de un solo uso
  id_usuario          BIGINT UNSIGNED NOT NULL,     -- FK (SCRIPT 2)
  creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expira_en           DATETIME NOT NULL,
  usado               BOOLEAN NOT NULL DEFAULT 0,
  KEY idx_reset_usuario (id_usuario),
  KEY idx_reset_expira (expira_en)
) ENGINE=InnoDB;

-- =========================
-- Bitácora (auditoría RF007, RF011, RF048, RF055)
-- =========================

CREATE TABLE bitacora (
  id_bitacora         BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  modulo              VARCHAR(50) NOT NULL,         -- USUARIOS, OBRAS, ROLES, AUTH, PERFIL, etc.
  accion              VARCHAR(50) NOT NULL,         -- CREAR, ACTUALIZAR_ESTADO, ASIGNAR_ROL, LOGIN_OK, LOGIN_FAIL, PERFIL_EDIT, etc.
  id_recurso          VARCHAR(64) NULL,             -- id del recurso afectado (flexible)
  id_usuario_actor    BIGINT UNSIGNED NULL,         -- quién realizó la acción (FK en SCRIPT 2)
  id_usuario_objetivo BIGINT UNSIGNED NULL,         -- usuario afectado (opcional, FK en SCRIPT 2)
  datos_previos       JSON NULL,
  datos_nuevos        JSON NULL,
  creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_bitacora_fecha (creado_en),
  KEY idx_bitacora_modulo_accion (modulo, accion),
  KEY idx_bitacora_actor (id_usuario_actor),
  KEY idx_bitacora_objetivo (id_usuario_objetivo)
) ENGINE=InnoDB;

-- =========================
-- Semillas mínimas sugeridas para catálogos (opcional)
-- =========================

-- Estados de usuario
-- INSERT INTO estados_usuario (id_estado_usuario, nombre, descripcion) VALUES
--  (1, 'Activo', 'Puede autenticarse y operar'),
--   (2, 'Inactivo', 'No puede autenticarse'),
--   (3, 'Suspendido', 'Bloqueado temporalmente'),
--   (4, 'Eliminado', 'Eliminación lógica');

-- -- Estados de obra
-- INSERT INTO estados_obra (id_estado_obra, nombre, descripcion) VALUES
--   (1, 'Activa', 'Registrada y activa'),
--   (2, 'En ejecución', 'Trabajo en curso'),
--   (3, 'Finalizada', 'Cerrada');

