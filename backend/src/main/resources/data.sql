-- Datos de prueba del CU 28. Se cargan en cada arranque (ddl-auto=create).
-- Usuario logueado: lgomez (Laura Gómez), Encargada de Bolsines de la CM Córdoba.

-- ================= COMISIONES MÉDICAS =================
INSERT INTO comisiones_medicas (codigo, nombre, direccion, email, telefono) VALUES
('CM-CBA', 'Comisión Médica Córdoba',     'Av. Colón 100',  'cordoba@cm.gob.ar', '351-0000000'),
('CM-ROS', 'Comisión Médica Rosario',     'Bv. Oroño 200',  'rosario@cm.gob.ar', '341-0000000'),
('CM-MZA', 'Comisión Médica Mendoza',     'San Martín 300', 'mendoza@cm.gob.ar', '261-0000000'),
('CM-VM',  'Comisión Médica Villa María', 'Bv. España 400', 'vmaria@cm.gob.ar',  '353-0000000');

-- ================= ESTADOS =================
INSERT INTO estados (id, ambito, nombre, descripcion) VALUES
(1,  'Bolsin',        'Creado',                 'Bolsín creado'),
(2,  'Bolsin',        'Cerrado',                'Bolsín cerrado con precinto'),
(3,  'Bolsin',        'Enviado',                'Bolsín enviado por correo'),
(4,  'Bolsin',        'Recibido en CM Destino', 'Bolsín recibido en la CM destino'),
(5,  'Remito',        'Generado',               'Remito generado'),
(6,  'Remito',        'Enviado',                'Remito enviado'),
(7,  'Remito',        'Recibido y Aceptado',    'Remito recibido y aceptado'),
(8,  'Documentacion', 'Registrada',             'Documentación registrada'),
(9,  'Documentacion', 'Remitida',               'Documentación remitida'),
(10, 'Documentacion', 'Recibida y Aceptada',    'Documentación recibida y aceptada');

-- ================= EMPLEADOS / USUARIO / SESIÓN =================
INSERT INTO empleados (id, nombre, apellido, email, comision_medica_codigo) VALUES
(1, 'Laura', 'Gómez', 'lgomez@cm.gob.ar', 'CM-CBA'),
(2, 'Juan',  'Díaz',  'jdiaz@cm.gob.ar',  'CM-ROS');

INSERT INTO usuarios (nombre, password, empleado_id) VALUES ('lgomez', '1234', 1);

INSERT INTO sesiones (fecha_hora_inicio, fecha_hora_fin, usuario_nombre) VALUES ('2026-11-16 08:00:00', NULL, 'lgomez');

-- ================= TIPOS DE DOCUMENTACIÓN =================
INSERT INTO tipos_documentacion (nombre, descripcion) VALUES
('Expediente',     'Expediente administrativo'),
('Dictamen',       'Dictamen médico'),
('Estudio médico', 'Estudio complementario');

-- ================= BOLSINES =================
-- 1, 2 y 3 van a Córdoba (aparecen en la lista). El 4 va de Córdoba a Rosario (lo descarta el IteradorBolsines).
INSERT INTO bolsines (numero_bolsin, fecha, numero_precinto, peso, origen_codigo, destino_codigo) VALUES
(1, '2026-11-15', 50001, 750, 'CM-ROS', 'CM-CBA'),
(2, '2026-11-15', 50002, 500, 'CM-MZA', 'CM-CBA'),
(3, '2026-11-15', 50003, 620, 'CM-VM',  'CM-CBA'),
(4, '2026-11-15', 50004, 410, 'CM-CBA', 'CM-ROS');

-- Estado actual de todos: Enviado (fecha_hora_fin NULL = cambio actual)
INSERT INTO cambios_estado_bolsin (fecha_hora_inicio, fecha_hora_fin, estado_id, responsable_id, bolsin_numero) VALUES
('2026-11-15 09:00:00', NULL, 3, 2, 1),
('2026-11-15 09:00:00', NULL, 3, 2, 2),
('2026-11-15 09:00:00', NULL, 3, 2, 3),
('2026-11-15 09:00:00', NULL, 3, 1, 4);

-- ================= REMITOS =================
INSERT INTO remitos (numero, fecha, estado_id, bolsin_numero) VALUES
(101, '2026-11-15', 6, 1),
(102, '2026-11-15', 6, 1),
(201, '2026-11-15', 6, 2),
(301, '2026-11-15', 6, 3),
(401, '2026-11-15', 6, 4);

-- ================= DOCUMENTACIÓN =================
INSERT INTO documentaciones (numero, asunto, fecha_pase, tipo_documentacion_nombre, cm_origen_codigo) VALUES
(1011, 'Expediente 2026-1450 - Pérez, María',   '2026-11-14', 'Expediente',     'CM-ROS'),
(1012, 'Dictamen de incapacidad - Gómez, Raúl', '2026-11-14', 'Dictamen',       'CM-ROS'),
(1021, 'Resonancia magnética - López, Ana',     '2026-11-14', 'Estudio médico', 'CM-ROS'),
(2011, 'Carta documento - Ruiz, Pablo',         '2026-11-14', 'Expediente',     'CM-MZA'),
(3011, 'Expediente 2026-0991 - Sosa, Elena',    '2026-11-14', 'Expediente',     'CM-VM'),
(3012, 'Estudio audiométrico - Sosa, Elena',    '2026-11-14', 'Estudio médico', 'CM-VM'),
(4011, 'Dictamen - Herrera, Luis',              '2026-11-14', 'Dictamen',       'CM-CBA');

INSERT INTO cambios_estado_documentacion (fecha_hora_inicio, fecha_hora_fin, estado_id, responsable_id, documentacion_numero) VALUES
('2026-11-15 09:00:00', NULL, 9, 2, 1011),
('2026-11-15 09:00:00', NULL, 9, 2, 1012),
('2026-11-15 09:00:00', NULL, 9, 2, 1021),
('2026-11-15 09:00:00', NULL, 9, 2, 2011),
('2026-11-15 09:00:00', NULL, 9, 2, 3011),
('2026-11-15 09:00:00', NULL, 9, 2, 3012),
('2026-11-15 09:00:00', NULL, 9, 1, 4011);

-- ================= DETALLES DE REMITO =================
INSERT INTO detalles_remito (area_cmc_destino, documentacion_numero, remito_numero) VALUES
(NULL, 1011, 101),
(NULL, 1012, 101),
(NULL, 1021, 102),
(NULL, 2011, 201),
(NULL, 3011, 301),
(NULL, 3012, 301),
(NULL, 4011, 401);
