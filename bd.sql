-- ============================================================
--  SCRIPT: provinces_db.sql
--  Ejecutar en pgAdmin sobre una base de datos nueva
--  Ejemplo: CREATE DATABASE provinces_db;  (y luego conectarse)
-- ============================================================

-- Crear tabla
CREATE TABLE IF NOT EXISTS provinces (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100)   NOT NULL,
    full_name     VARCHAR(200)   NOT NULL,
    latitude      DECIMAL(15, 10),
    longitude     DECIMAL(15, 10),
    display_order INTEGER
);

-- ============================================================
--  INSERTAR las 24 provincias argentinas
-- ============================================================
INSERT INTO provinces (name, full_name, latitude, longitude, display_order) VALUES
('Buenos Aires',                   'Provincia de Buenos Aires',                                                       -36.6769415,  -60.5588319,   1),
('Ciudad Autónoma de Buenos Aires','Ciudad Autónoma de Buenos Aires',                                                 -34.6144409,  -58.4458877,   2),
('Catamarca',                      'Provincia de Catamarca',                                                          -28.4696000,  -65.7795000,   3),
('Chaco',                          'Provincia del Chaco',                                                             -27.4257000,  -59.9242000,   4),
('Chubut',                         'Provincia del Chubut',                                                            -43.2932000,  -65.1084000,   5),
('Córdoba',                        'Provincia de Córdoba',                                                            -32.1427000,  -64.1821000,   6),
('Corrientes',                     'Provincia de Corrientes',                                                         -29.4152000,  -58.9960000,   7),
('Entre Ríos',                     'Provincia de Entre Ríos',                                                         -31.7746000,  -60.4956000,   8),
('Formosa',                        'Provincia de Formosa',                                                            -24.8948000,  -59.9317000,   9),
('Jujuy',                          'Provincia de Jujuy',                                                             -23.3691000,  -65.0957000,  10),
('La Pampa',                       'Provincia de La Pampa',                                                           -37.1315000,  -65.4467000,  11),
('La Rioja',                       'Provincia de La Rioja',                                                           -29.4137000,  -66.8557000,  12),
('Mendoza',                        'Provincia de Mendoza',                                                            -34.6297000,  -68.5293000,  13),
('Misiones',                       'Provincia de Misiones',                                                           -27.0000000,  -55.0000000,  14),
('Neuquén',                        'Provincia del Neuquén',                                                           -38.9516000,  -68.0591000,  15),
('Río Negro',                      'Provincia de Río Negro',                                                          -40.8261000,  -67.0243000,  16),
('Salta',                          'Provincia de Salta',                                                             -24.7821000,  -65.4232000,  17),
('San Juan',                       'Provincia de San Juan',                                                           -30.8653000,  -68.8894000,  18),
('San Luis',                       'Provincia de San Luis',                                                           -33.2833000,  -66.3500000,  19),
('Santa Cruz',                     'Provincia de Santa Cruz',                                                         -51.6352000,  -69.2473000,  20),
('Santa Fe',                       'Provincia de Santa Fe',                                                           -31.6107000,  -60.6972000,  21),
('Santiago del Estero',            'Provincia de Santiago del Estero',                                                -27.7834000,  -64.2672000,  22),
('Tierra del Fuego',               'Provincia de Tierra del Fuego, Antártida e Islas del Atlántico Sur',             -54.8019000,  -68.3030000,  23),
('Tucumán',                        'Provincia de Tucumán',                                                            -26.9478000,  -65.3647000,  24);