-- 1. Crear el usuario para tu app (cambia 'tu_password' por una segura)
-- CREATE USER admin_denuncias WITH ENCRYPTED PASSWORD 'seguridad123';

-- 2. Crear la base de datos
-- CREATE DATABASE sistema_denuncias_db;

-- 3. Darle permisos al usuario sobre la base de datos
-- GRANT ALL PRIVILEGES ON DATABASE sistema_denuncias_db TO admin_denuncias;

-- ========================================================================
-- Esquema de la Base de Datos para el Sistema de Denuncias Ciudadanas
-- ========================================================================


-- 1. Limpieza inicial (Por si necesitas reiniciar la DB localmente)
DROP TABLE IF EXISTS notificaciones CASCADE;
DROP TABLE IF EXISTS derivaciones CASCADE;
DROP TABLE IF EXISTS denuncias_historial CASCADE;
DROP TABLE IF EXISTS denuncias CASCADE;
DROP TABLE IF EXISTS asignaciones CASCADE;
DROP TABLE IF EXISTS autoridades CASCADE;
DROP TABLE IF EXISTS entidades CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

DROP TYPE IF EXISTS estado_denuncia_enum;
DROP TYPE IF EXISTS rol_usuario_enum;

-- 2. Creación de Tipos de Datos (Enums) para mayor control
CREATE TYPE rol_usuario_enum AS ENUM ('CIUDADANO', 'AUTORIDAD', 'ADMIN');
CREATE TYPE estado_denuncia_enum AS ENUM ('RECIBIDA', 'VALIDADA', 'EN_PROCESO', 'RESUELTA', 'RECHAZADA');

-- 3. Tabla USUARIOS
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol rol_usuario_enum DEFAULT 'CIUDADANO',
    fecha_creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla ENTIDADES (Comisarías, Municipalidades)
CREATE TABLE entidades (
    id_entidad SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL, -- Ej: Comisaría Miraflores
    distrito VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    correo_contacto VARCHAR(150)
);

-- 5. Tabla AUTORIDADES (Extensión del perfil de Usuario)
CREATE TABLE autoridades (
    id_autoridad SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE NOT NULL, -- Relación 1 a 1
    id_entidad INT NOT NULL,
    cargo VARCHAR(100), -- Ej: Oficial, Supervisor
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_entidad) REFERENCES entidades(id_entidad)
);

-- 6. Tabla ASIGNACIONES (Reglas para asignar denuncias automáticamente)
CREATE TABLE asignaciones (
    id_asignacion SERIAL PRIMARY KEY,
    id_entidad INT NOT NULL,
    categoria VARCHAR(100) NOT NULL, -- Ej: 'Mal Estacionamiento'
    distrito VARCHAR(100) NOT NULL, -- Ej: 'Miraflores'
    FOREIGN KEY (id_entidad) REFERENCES entidades(id_entidad)
);

-- 7. Tabla DENUNCIAS (El núcleo del sistema)
CREATE TABLE denuncias (
    id_denuncia SERIAL PRIMARY KEY,
    id_usuario INT, -- NULLABLE para permitir ANÓNIMOS
    id_entidad_asignada INT, -- Puede ser NULL al inicio hasta que el sistema asigne
    codigo_seguimiento VARCHAR(50) UNIQUE NOT NULL, -- Para buscar sin login
    categoria VARCHAR(100) NOT NULL,
    subcategoria VARCHAR(100), -- Agregado para mayor detalle
    descripcion TEXT,
    distrito VARCHAR(100) NOT NULL,
    direccion_referencia VARCHAR(255),
    latitud DECIMAL(10, 8), -- Precisión para GPS
    longitud DECIMAL(11, 8),
    estado estado_denuncia_enum DEFAULT 'RECIBIDA',
    imagen_url TEXT, -- Puede guardar URL o JSON con varias URLs
    fecha_creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_entidad_asignada) REFERENCES entidades(id_entidad)
);

-- 8. Tabla DENUNCIAS_HISTORIAL (Auditoría ODS 16)
CREATE TABLE denuncias_historial (
    id_historial SERIAL PRIMARY KEY,
    id_denuncia INT NOT NULL,
    id_autoridad INT, -- Quién hizo el cambio (puede ser NULL si fue el sistema)
    accion VARCHAR(100) NOT NULL, -- Ej: 'Cambio de Estado', 'Asignación Manual'
    estado_anterior estado_denuncia_enum,
    estado_nuevo estado_denuncia_enum,
    observacion TEXT, -- Justificación obligatoria en rechazos
    fecha_historial TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_denuncia) REFERENCES denuncias(id_denuncia) ON DELETE CASCADE,
    FOREIGN KEY (id_autoridad) REFERENCES autoridades(id_autoridad)
);

-- 9. Tabla DERIVACIONES (Manejo de errores de asignación)
CREATE TABLE derivaciones (
    id_derivacion SERIAL PRIMARY KEY,
    id_denuncia INT NOT NULL,
    id_entidad_origen INT NOT NULL,
    id_entidad_destino INT NOT NULL,
    id_autoridad INT NOT NULL, -- Quién realizó la derivación
    motivo TEXT NOT NULL,
    fecha_derivacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_denuncia) REFERENCES denuncias(id_denuncia) ON DELETE CASCADE,
    FOREIGN KEY (id_entidad_origen) REFERENCES entidades(id_entidad),
    FOREIGN KEY (id_entidad_destino) REFERENCES entidades(id_entidad),
    FOREIGN KEY (id_autoridad) REFERENCES autoridades(id_autoridad)
);

-- 10. Tabla NOTIFICACIONES
CREATE TABLE notificaciones (
    id_notificacion SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    fecha_notificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- (OPCIONAL PERO RECOMENDADO) Función para actualizar fecha_actualizado automáticamente
CREATE OR REPLACE FUNCTION update_fecha_actualizado()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizado = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para Usuarios
CREATE TRIGGER trigger_update_usuarios
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION update_fecha_actualizado();

-- Trigger para Denuncias
CREATE TRIGGER trigger_update_denuncias
BEFORE UPDATE ON denuncias
FOR EACH ROW
EXECUTE FUNCTION update_fecha_actualizado();

-- Fin del esquema de la base de datos
-- ========================================================================
-- EJECUTAR SCRIPT: Sintaxis: psql -U [usuario] -d [base_datos] -f [archivo.sql] -h localhost
-- =======================================================================
-- psql -U admin_denuncias -d sistema_denuncias_db -f schema.sql -h localhost

-- verificar con: psql -U admin_denuncias -d sistema_denuncias_db -h localhost
