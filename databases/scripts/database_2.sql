-- si acaso que se base en esta db :
-- =========================================
-- SGPCMD - ESQUEMA BASE (MySQL 8 / InnoDB)
-- Versión con roles: admin, empleado, director de obra, cliente
-- Clientes eliminados; "cliente" es un usuario con ese rol
-- =========================================
DROP DATABASE IF EXISTS sgpcmd;
CREATE DATABASE sgpcmd
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE sgpcmd;

-- -----------------------------------------
-- 1) Roles del sistema (permisos generales)
-- -----------------------------------------
CREATE TABLE roles_sistema (
  id_rol_sistema INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL UNIQUE,          -- admin, empleado, director de obra, cliente
  descripcion VARCHAR(255)
) ENGINE=InnoDB;

-- --------------------------
-- 2) Usuarios del sistema
-- --------------------------
CREATE TABLE usuarios (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  hash_password VARCHAR(255) NOT NULL,
  id_rol_sistema INT NOT NULL,
  -- Token de recuperación (NULL por defecto). Cuando se use, se debe limpiar desde la app.
  token_recuperacion VARCHAR(255) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuarios_rol
    FOREIGN KEY (id_rol_sistema) REFERENCES roles_sistema(id_rol_sistema)
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_usuarios_token ON usuarios(token_recuperacion);

-- ---------------------------------------
-- 3) Estados de obra (catálogo simple)
-- ---------------------------------------
CREATE TABLE estados_obra (
  id_estado_obra INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(80) NOT NULL UNIQUE,  -- Planeada, En ejecución, Suspendida, Finalizada
  es_final TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- --------------------------
-- 4) Obras (proyectos)
-- --------------------------
CREATE TABLE obras (
  id_obra INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(30) NOT NULL UNIQUE,          -- código interno de obra
  nombre VARCHAR(180) NOT NULL,
  -- El "cliente" ahora es un usuario con rol 'cliente'. No se puede validar el rol por FK (se valida en la app)
  id_cliente INT NULL,
  id_estado_obra INT NOT NULL,
  fecha_inicio DATE,
  fecha_fin_prevista DATE,
  presupuesto DECIMAL(16,2),
  ubicacion VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_obras_cliente_usuario
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CONSTRAINT fk_obras_estado
    FOREIGN KEY (id_estado_obra) REFERENCES estados_obra(id_estado_obra)
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------
-- 5) Roles funcionales dentro de una obra (catálogo)
-- ----------------------------------------------------
CREATE TABLE roles_obra (
  id_rol_obra INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(80) NOT NULL UNIQUE,   -- Residente, Interventor, Maestro, Auxiliar
  descripcion VARCHAR(255)
) ENGINE=InnoDB;

-- ---------------------------------------------------
-- 6) Miembros asignados a una obra (usuarios_obras)
-- ---------------------------------------------------
CREATE TABLE usuarios_obras (
  id_usuario_obra INT PRIMARY KEY AUTO_INCREMENT,
  id_obra INT NOT NULL,
  id_usuario INT NOT NULL,
  id_rol_obra INT NOT NULL,
  UNIQUE KEY uq_usuario_en_obra (id_obra, id_usuario),
  CONSTRAINT fk_uo_obra
    FOREIGN KEY (id_obra) REFERENCES obras(id_obra)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_uo_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_uo_rol
    FOREIGN KEY (id_rol_obra) REFERENCES roles_obra(id_rol_obra)
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- --------------------------
-- 7) Tareas de la obra
-- --------------------------
CREATE TABLE tareas (
  id_tarea INT PRIMARY KEY AUTO_INCREMENT,
  id_obra INT NOT NULL,
  titulo VARCHAR(160) NOT NULL,
  descripcion TEXT,
  estado ENUM('Pendiente','En ejecución','Bloqueada','Finalizada') NOT NULL DEFAULT 'Pendiente',
  fecha_inicio DATE,
  fecha_fin DATE,
  porcentaje_avance TINYINT UNSIGNED NOT NULL DEFAULT 0, -- 0..100
  prioridad ENUM('Baja','Media','Alta') DEFAULT 'Media',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tareas_obra
    FOREIGN KEY (id_obra) REFERENCES obras(id_obra)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 8) Responsables de tarea (muchos a muchos opcional)
-- -----------------------------------------------------
CREATE TABLE tareas_responsables (
  id_tarea INT NOT NULL,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_tarea, id_usuario),
  CONSTRAINT fk_tr_tarea
    FOREIGN KEY (id_tarea) REFERENCES tareas(id_tarea)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_tr_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------
-- 9) Documentos por obra
-- --------------------------
CREATE TABLE documentos (
  id_documento INT PRIMARY KEY AUTO_INCREMENT,
  id_obra INT NOT NULL,
  nombre VARCHAR(180) NOT NULL,             -- ej: Acta_Visita_001.pdf
  tipo VARCHAR(60),                         -- Plano, Acta, Contrato, Foto, Informe
  ruta VARCHAR(255) NOT NULL,               -- path o URL
  version INT NOT NULL DEFAULT 1,
  estado ENUM('Borrador','Revisión','Aprobado','Rechazado') DEFAULT 'Borrador',
  subido_por INT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_doc_obra
    FOREIGN KEY (id_obra) REFERENCES obras(id_obra)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_doc_usuario
    FOREIGN KEY (subido_por) REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- --------------------------
-- 10) Bitácora de obra
-- --------------------------
CREATE TABLE bitacora (
  id_bitacora INT PRIMARY KEY AUTO_INCREMENT,
  id_obra INT NOT NULL,
  id_usuario INT,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  titulo VARCHAR(160) NOT NULL,
  descripcion TEXT,
  adjunto_url VARCHAR(255),
  CONSTRAINT fk_bit_obra
    FOREIGN KEY (id_obra) REFERENCES obras(id_obra)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_bit_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- =======================
-- ÍNDICES RECOMENDADOS
-- =======================
CREATE INDEX idx_obras_estado ON obras(id_estado_obra);
CREATE INDEX idx_obras_cliente ON obras(id_cliente);
CREATE INDEX idx_tareas_obra_estado ON tareas(id_obra, estado);
CREATE INDEX idx_documentos_obra ON documentos(id_obra);
CREATE INDEX idx_bitacora_obra_fecha ON bitacora(id_obra, fecha);

-- =======================
-- SEED BÁSICO 
-- =======================
INSERT INTO roles_sistema (nombre, descripcion) VALUES
  ('admin','Acceso total'),
  ('empleado','Gestión operativa general'),
  ('director de obra','Lidera y aprueba en obra'),
  ('cliente','Interfaz y aprobaciones del cliente');

INSERT INTO estados_obra (nombre, es_final) VALUES
  ('Planeada', 0),
  ('En ejecución', 0),
  ('Suspendida', 0),
  ('Finalizada', 1);

INSERT INTO roles_obra (nombre, descripcion) VALUES
  ('Residente','Responsable operativo'),
  ('Interventor','Supervisión y control'),
  ('Maestro','Ejecución en campo'),
  ('Auxiliar','Apoyo general');