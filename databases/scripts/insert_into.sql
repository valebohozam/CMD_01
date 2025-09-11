USE CMD_01;

-- ===============================
-- 1. ESTADOS
-- ===============================
INSERT INTO estados_usuario (id_estado_usuario, nombre, descripcion) VALUES
(1, 'Activo', 'Puede autenticarse y operar'),
(2, 'Inactivo', 'No puede autenticarse'),
(3, 'Suspendido', 'Bloqueado temporalmente'),
(4, 'Eliminado', 'Eliminación lógica'),
(5, 'Pendiente', 'En espera de activación');

INSERT INTO estados_obra (id_estado_obra, nombre, descripcion) VALUES
(1, 'Activa', 'Registrada y activa'),
(2, 'En ejecución', 'Trabajo en curso'),
(3, 'Finalizada', 'Cerrada'),
(4, 'En diseño', 'Etapa de planificación'),
(5, 'Cancelada', 'Obra cancelada');

-- ===============================
-- 2. OBRAS
-- ===============================
INSERT INTO obras (codigo, nombre, fecha_inicio, fecha_fin, id_estado_obra) VALUES
('OBR-001', 'Puente Río Negro', '2025-01-10', NULL, 1),
('OBR-002', 'Edificio Central CMD', '2025-02-01', '2026-08-15', 2),
('OBR-003', 'Vía Bogotá – Tunja', '2024-11-01', NULL, 2),
('OBR-004', 'Parque Industrial Norte', '2025-03-20', NULL, 4),
('OBR-005', 'Colegio San Martín', '2024-09-05', '2025-12-31', 3);

-- ===============================
-- 3. USUARIOS
-- ===============================
INSERT INTO usuarios (tipo_documento, nro_documento, nombres, apellidos, correo, telefono, hash_password, id_estado_usuario) VALUES
('CC', '100000001', 'Carlos', 'Ramírez', 'carlos.ramirez@cmd.com', '3001111111', 'hash1', 1),
('CC', '100000002', 'Laura', 'Martínez', 'laura.martinez@cmd.com', '3002222222', 'hash2', 1),
('CC', '100000003', 'Andrés', 'Pérez', 'andres.perez@cmd.com', '3003333333', 'hash3', 2),
('CC', '100000004', 'María', 'Gómez', 'maria.gomez@cmd.com', '3004444444', 'hash4', 3),
('CC', '100000005', 'José', 'Hernández', 'jose.hernandez@cmd.com', '3005555555', 'hash5', 1);

-- ===============================
-- 4. USUARIOS_OBRAS
-- ===============================
INSERT INTO usuarios_obras (id_usuario, id_obra, vigente) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 0),
(5, 5, 1);

-- ===============================
-- 5. ROLES
-- ===============================
INSERT INTO roles (nombre, descripcion) VALUES
('Administrador TIC', 'Administra todo el sistema'),
('Supervisor Obra', 'Supervisa la ejecución de obras'),
('Residente de Obra', 'Gestiona avances de obra'),
('Auditor', 'Valida trazabilidad y seguridad'),
('Usuario Básico', 'Acceso limitado');

-- ===============================
-- 6. PERMISOS
-- ===============================
INSERT INTO permisos (codigo, descripcion) VALUES
('USUARIO_CREAR', 'Permite crear usuarios'),
('USUARIO_EDITAR', 'Permite editar usuarios'),
('OBRA_CREAR', 'Permite crear obras'),
('OBRA_EDITAR', 'Permite editar obras'),
('VER_REPORTES', 'Permite ver reportes');

-- ===============================
-- 7. ROLES_PERMISOS
-- ===============================
INSERT INTO roles_permisos (id_rol, id_permiso) VALUES
(1, 1), -- Admin TIC → USUARIO_CREAR
(1, 2), -- Admin TIC → USUARIO_EDITAR
(1, 3), -- Admin TIC → OBRA_CREAR
(1, 4), -- Admin TIC → OBRA_EDITAR
(1, 5); -- Admin TIC → VER_REPORTES

-- ===============================
-- 8. USUARIOS_ROLES
-- ===============================
INSERT INTO usuarios_roles (id_usuario, id_rol, asignado_por) VALUES
(1, 1, NULL), -- Carlos Admin TIC
(2, 2, 1),    -- Laura Supervisor, asignado por Carlos
(3, 3, 1),    -- Andrés Residente
(4, 5, 2),    -- María Usuario Básico
(5, 4, 1);    -- José Auditor

-- ===============================
-- 9. LOGIN_INTENTOS
-- ===============================
INSERT INTO login_intentos (id_usuario, correo_intento, exito, ip_origen, user_agent) VALUES
(1, 'carlos.ramirez@cmd.com', 1, '192.168.1.10', 'Chrome'),
(2, 'laura.martinez@cmd.com', 1, '192.168.1.11', 'Firefox'),
(3, 'andres.perez@cmd.com', 0, '192.168.1.12', 'Edge'),
(NULL, 'fake@cmd.com', 0, '192.168.1.15', 'Bot'),
(5, 'jose.hernandez@cmd.com', 1, '192.168.1.14', 'Safari');

-- ===============================
-- 10. SESIONES
-- ===============================
INSERT INTO sesiones (id_sesion, id_usuario) VALUES
('sess1', 1),
('sess2', 2),
('sess3', 3),
('sess4', 4),
('sess5', 5);

-- ===============================
-- 11. PASSWORD_RESET_TOKENS
-- ===============================
INSERT INTO password_reset_tokens (id_token, id_usuario, expira_en) VALUES
('token1', 1, '2025-09-30 23:59:59'),
('token2', 2, '2025-09-30 23:59:59'),
('token3', 3, '2025-09-30 23:59:59'),
('token4', 4, '2025-09-30 23:59:59'),
('token5', 5, '2025-09-30 23:59:59');

-- ===============================
-- 12. BITACORA
-- ===============================
INSERT INTO bitacora (modulo, accion, id_recurso, id_usuario_actor, id_usuario_objetivo) VALUES
('USUARIOS', 'CREAR', '1', 1, 1),
('USUARIOS', 'EDITAR', '2', 1, 2),
('OBRAS', 'CREAR', '1', 2, NULL),
('ROLES', 'ASIGNAR', '1-1', 1, 1),
('AUTH', 'LOGIN_FAIL', NULL, NULL, 3);
