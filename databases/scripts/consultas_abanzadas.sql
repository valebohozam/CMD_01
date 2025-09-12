-- 1) Drill-down de asignaciones actuales por estado de obra y rol (con ROLLUP)

-- Conteo de usuarios con vigente=1, desglosado por estado de la obra y rol. La fila TOTAL resume cada nivel
SELECT
  COALESCE(eo.nombre, 'TOTAL ESTADO OBRA')     AS estado_obra,
  COALESCE(r.nombre,  'TOTAL ROL')             AS rol,
  COUNT(DISTINCT u.id_usuario)                 AS usuarios_asignados
FROM usuarios u
JOIN usuarios_obras uo   ON uo.id_usuario = u.id_usuario AND uo.vigente = 1
JOIN obras o             ON o.id_obra = uo.id_obra
JOIN estados_obra eo     ON eo.id_estado_obra = o.id_estado_obra
LEFT JOIN usuarios_roles ur ON ur.id_usuario = u.id_usuario
LEFT JOIN roles r            ON r.id_rol = ur.id_rol
GROUP BY eo.nombre, r.nombre WITH ROLLUP;



-- 2) Top roles por cantidad de permisos (rank con ventana)

-- Ranking de roles según cuántos permisos tienen asociados.

WITH permisos_por_rol AS (
  SELECT r.id_rol, r.nombre AS rol, COUNT(rp.id_permiso) AS num_permisos
  FROM roles r
  LEFT JOIN roles_permisos rp ON rp.id_rol = r.id_rol
  GROUP BY r.id_rol, r.nombre
)
SELECT
  rol, num_permisos,
  DENSE_RANK() OVER (ORDER BY num_permisos DESC) AS ranking
FROM permisos_por_rol
ORDER BY num_permisos DESC, rol;

-- 3) Usuarios con sesión activa estando Inactivo/Suspendido (alerta de cumplimiento)

-- Cruza sesiones con estado del usuario.

SELECT u.id_usuario, u.nombres, u.apellidos, eu.nombre AS estado, s.id_sesion, s.creada_en
FROM sesiones s
JOIN usuarios u       ON u.id_usuario = s.id_usuario
JOIN estados_usuario eu ON eu.id_estado_usuario = u.id_estado_usuario
WHERE eu.nombre IN ('Inactivo', 'Suspendido');

-- 4) Tasa de fallo de login por usuario (últimos 30 días) con ventana

-- Calcula ratio de fallos vs total.

WITH ultimos AS (
  SELECT li.*
  FROM login_intentos li
  WHERE li.creado_en >= (CURRENT_DATE - INTERVAL 30 DAY)
),
agreg AS (
  SELECT
    u.id_usuario,
    u.correo,
    SUM(CASE WHEN li.exito = 0 THEN 1 ELSE 0 END) AS fallos,
    COUNT(*) AS total
  FROM ultimos li
  LEFT JOIN usuarios u ON u.id_usuario = li.id_usuario
  GROUP BY u.id_usuario, u.correo
)
SELECT
  correo,
  fallos,
  total,
  ROUND(fallos / NULLIF(total,0), 3) AS tasa_fallo
FROM agreg
ORDER BY tasa_fallo DESC, total DESC;

-- 5) “Pivot” de permisos por rol (condicional) — visión de ROLAP

-- Matriz simple rol × permisos clave.

SELECT
  r.nombre AS rol,
  MAX(CASE WHEN p.codigo = 'USUARIO_CREAR' THEN '✔' ELSE '' END) AS USUARIO_CREAR,
  MAX(CASE WHEN p.codigo = 'USUARIO_EDITAR' THEN '✔' ELSE '' END) AS USUARIO_EDITAR,
  MAX(CASE WHEN p.codigo = 'OBRA_CREAR'    THEN '✔' ELSE '' END) AS OBRA_CREAR,
  MAX(CASE WHEN p.codigo = 'OBRA_EDITAR'   THEN '✔' ELSE '' END) AS OBRA_EDITAR,
  MAX(CASE WHEN p.codigo = 'VER_REPORTES'  THEN '✔' ELSE '' END) AS VER_REPORTES
FROM roles r
LEFT JOIN roles_permisos rp ON rp.id_rol = r.id_rol
LEFT JOIN permisos p        ON p.id_permiso = rp.id_permiso
GROUP BY r.nombre
ORDER BY r.nombre;

-- 6) Usuarios con múltiples obras vigentes (anomalía de asignación)

-- Detecta si un usuario quedó con más de una asignación vigente=1.

SELECT u.id_usuario, u.nombres, u.apellidos, COUNT(*) AS obras_vigentes
FROM usuarios_obras uo
JOIN usuarios u ON u.id_usuario = uo.id_usuario
WHERE uo.vigente = 1
GROUP BY u.id_usuario, u.nombres, u.apellidos
HAVING COUNT(*) > 1
ORDER BY obras_vigentes DESC;


-- 7) Último cambio de rol por usuario (bitácora + ventana)

-- Ejemplo de drill-through a auditoría.

WITH cambios_rol AS (
  SELECT
    b.*,
    ROW_NUMBER() OVER (PARTITION BY b.id_usuario_objetivo ORDER BY b.creado_en DESC) AS rn
  FROM bitacora b
  WHERE b.modulo = 'ROLES' AND b.accion IN ('ASIGNAR', 'REMOVER')
)
SELECT
  u.id_usuario,
  u.nombres,
  u.apellidos,
  c.accion      AS ultima_accion_roles,
  c.creado_en   AS fecha_ultima_accion,
  c.datos_previos,
  c.datos_nuevos
FROM cambios_rol c
JOIN usuarios u ON u.id_usuario = c.id_usuario_objetivo
WHERE c.rn = 1
ORDER BY c.creado_en DESC;


-- 8) Tokens de recuperación por expirar (próximos 3 días) y conteo diario

-- Resumen estilo drill-down temporal.

SELECT
  DATE(pr.expira_en) AS dia,
  COUNT(*)           AS tokens_por_expirar
FROM password_reset_tokens pr
WHERE pr.usado = 0
  AND pr.expira_en BETWEEN NOW() AND NOW() + INTERVAL 3 DAY
GROUP BY DATE(pr.expira_en)
ORDER BY dia;


-- 9) “Cubo” simple de intentos de login por estado de usuario y éxito (totales con ROLLUP)

-- Simula una vista MOLAP básica con totales por dimensión.

SELECT
  COALESCE(eu.nombre, 'TOTAL ESTADO USUARIO') AS estado_usuario,
  CASE li.exito WHEN 1 THEN 'Éxito' WHEN 0 THEN 'Fallo' ELSE 'TOTAL EXITO' END AS resultado,
  COUNT(*) AS intentos
FROM login_intentos li
LEFT JOIN usuarios u       ON u.id_usuario = li.id_usuario
LEFT JOIN estados_usuario eu ON eu.id_estado_usuario = u.id_estado_usuario
GROUP BY eu.nombre, li.exito WITH ROLLUP;


-- 10) Idle de sesiones (inactividad) y métricas por usuario

-- Duración inactiva, máximo y promedio con ventana.

WITH sesiones_en_min AS (
  SELECT
    s.id_usuario,
    TIMESTAMPDIFF(MINUTE, s.ultima_actividad, NOW()) AS min_inactivo
  FROM sesiones s
)
SELECT
  u.id_usuario,
  u.nombres,
  u.apellidos,
  COUNT(*)                            AS sesiones,
  MAX(min_inactivo)                   AS max_inactivo_min,
  ROUND(AVG(min_inactivo), 1)         AS avg_inactivo_min,
  DENSE_RANK() OVER (ORDER BY MAX(min_inactivo) DESC) AS riesgo_rank
FROM sesiones_en_min sm
JOIN usuarios u ON u.id_usuario = sm.id_usuario
GROUP BY u.id_usuario, u.nombres, u.apellidos
ORDER BY max_inactivo_min DESC;

