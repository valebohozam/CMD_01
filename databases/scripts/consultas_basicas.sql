-- 1. Listar todos los usuarios con su estado actual
SELECT u.id_usuario, u.nombres, u.apellidos, u.correo, e.nombre AS estado
FROM usuarios u
JOIN estados_usuario e ON u.id_estado_usuario = e.id_estado_usuario;

-- 2. Mostrar todas las obras registradas con su estado
SELECT o.id_obra, o.codigo, o.nombre, eo.nombre AS estado
FROM obras o
JOIN estados_obra eo ON o.id_estado_obra = eo.id_estado_obra;

-- 3. Consultar las obras asignadas a cada usuario
SELECT u.nombres, u.apellidos, o.nombre AS obra, uo.vigente
FROM usuarios_obras uo
JOIN usuarios u ON uo.id_usuario = u.id_usuario
JOIN obras o ON uo.id_obra = o.id_obra;

-- 4. Listar los roles de cada usuario
SELECT u.nombres, u.apellidos, r.nombre AS rol
FROM usuarios_roles ur
JOIN usuarios u ON ur.id_usuario = u.id_usuario
JOIN roles r ON ur.id_rol = r.id_rol;

-- 5. Consultar los permisos de cada rol
SELECT r.nombre AS rol, p.codigo AS permiso
FROM roles_permisos rp
JOIN roles r ON rp.id_rol = r.id_rol
JOIN permisos p ON rp.id_permiso = p.id_permiso
ORDER BY r.nombre;

-- 6. Ver los intentos de login (exitosos y fallidos)
SELECT li.id_intento, u.correo, li.exito, li.ip_origen, li.creado_en
FROM login_intentos li
LEFT JOIN usuarios u ON li.id_usuario = u.id_usuario
ORDER BY li.creado_en DESC;

-- 7. Mostrar las sesiones activas de los usuarios
SELECT s.id_sesion, u.nombres, u.apellidos, s.creada_en, s.ultima_actividad
FROM sesiones s
JOIN usuarios u ON s.id_usuario = u.id_usuario;

-- 8. Consultar los tokens de recuperación generados
SELECT pr.id_token, u.correo, pr.expira_en, pr.usado
FROM password_reset_tokens pr
JOIN usuarios u ON pr.id_usuario = u.id_usuario;

-- 9. Ver la bitácora de acciones realizadas
SELECT b.id_bitacora, b.modulo, b.accion, b.id_recurso,
       ua.nombres AS actor, uo.nombres AS objetivo, b.creado_en
FROM bitacora b
LEFT JOIN usuarios ua ON b.id_usuario_actor = ua.id_usuario
LEFT JOIN usuarios uo ON b.id_usuario_objetivo = uo.id_usuario
ORDER BY b.creado_en DESC;

-- 10. Consultar usuarios activos y las obras que tienen asignadas
SELECT u.nombres, u.apellidos, o.nombre AS obra
FROM usuarios u
JOIN usuarios_obras uo ON u.id_usuario = uo.id_usuario
JOIN obras o ON uo.id_obra = o.id_obra
WHERE u.id_estado_usuario = 1 AND uo.vigente = 1;
