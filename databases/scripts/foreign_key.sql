-- =====================================================================
-- CMD_01 - SGPCMD básico
-- SCRIPT 2: Agregar LLAVES FORÁNEAS y restricciones
-- Debe ejecutarse después del SCRIPT 1
-- =====================================================================

USE CMD_01;

-- =========================
-- FKs en USUARIOS
-- =========================
ALTER TABLE usuarios
  ADD CONSTRAINT fk_usuarios_estado
    FOREIGN KEY (id_estado_usuario) REFERENCES estados_usuario (id_estado_usuario);

-- =========================
-- FKs en OBRAS
-- =========================
ALTER TABLE obras
  ADD CONSTRAINT fk_obras_estado
    FOREIGN KEY (id_estado_obra) REFERENCES estados_obra (id_estado_obra);

-- Responsable de obra (usuario)
ALTER TABLE obras
  ADD CONSTRAINT fk_obras_responsable
    FOREIGN KEY (id_responsable) REFERENCES usuarios (id_usuario);

-- =========================
-- Asociación USUARIOS_OBRAS
-- =========================
ALTER TABLE usuarios_obras
  ADD CONSTRAINT fk_uo_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
  ADD CONSTRAINT fk_uo_obra
    FOREIGN KEY (id_obra) REFERENCES obras (id_obra);

-- =========================
-- RBAC: ROLES_PERMISOS y USUARIOS_ROLES
-- =========================
ALTER TABLE roles_permisos
  ADD CONSTRAINT fk_rp_rol
    FOREIGN KEY (id_rol) REFERENCES roles (id_rol),
  ADD CONSTRAINT fk_rp_permiso
    FOREIGN KEY (id_permiso) REFERENCES permisos (id_permiso);

ALTER TABLE usuarios_roles
  ADD CONSTRAINT fk_ur_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
  ADD CONSTRAINT fk_ur_rol
    FOREIGN KEY (id_rol) REFERENCES roles (id_rol),
  ADD CONSTRAINT fk_ur_asignado_por
    FOREIGN KEY (asignado_por) REFERENCES usuarios (id_usuario);

-- =========================
-- Autenticación / Seguridad
-- =========================
ALTER TABLE login_intentos
  ADD CONSTRAINT fk_login_intentos_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario);

ALTER TABLE sesiones
  ADD CONSTRAINT fk_sesiones_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario);

ALTER TABLE password_reset_tokens
  ADD CONSTRAINT fk_reset_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario);

-- =========================
-- Bitácora (auditoría)
-- =========================
ALTER TABLE bitacora
  ADD CONSTRAINT fk_bitacora_actor
    FOREIGN KEY (id_usuario_actor) REFERENCES usuarios (id_usuario),
  ADD CONSTRAINT fk_bitacora_objetivo
    FOREIGN KEY (id_usuario_objetivo) REFERENCES usuarios (id_usuario);

