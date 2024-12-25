USE [shopandgo];

DECLARE @idSucursal1 INT;
DECLARE @idProducto1 INT;
DECLARE @idProducto2 INT;
DECLARE @idProducto3 INT;
DECLARE @idCategoriaLacteos INT;
DECLARE @idCategoriaEnlatados INT;
DECLARE @idCargoAdmin INT;
DECLARE @idCargoEjecutivo INT;
DECLARE @idCargoRepartidor INT;

DELETE FROM Clientes;
DELETE FROM Trabajadores;
DELETE FROM CargosTrabajador;

DELETE FROM Inventarios;
DELETE FROM Productos;
DELETE FROM Sucursales;
DELETE FROM Categorias;

--Llenar la tabla de categorías
INSERT INTO Categorias (nombre, esActiva) VALUES ('Lacteos', 1), ('Enlatados', 1), ('Vinos y licores', 0);

SELECT @idCategoriaLacteos = idCategoria FROM Categorias WHERE nombre = 'Lacteos';
SELECT @idCategoriaEnlatados = idCategoria FROM Categorias WHERE nombre = 'Enlatados';

--Llenar la tabla de productos
INSERT INTO Productos (
	[codigoBarras]
    ,[nombre]
    ,[descripcion]
    ,[urlImagen]
    ,[precioVenta]
    ,[cantidadMaxima]
    ,[esActivo]
    ,[idCategoria]
) VALUES
('3368205723086', 'Leche Lala entera 1L', 'Un vaso de leche entera Lala es la opción que tú y tu familia necesitan para llenarse de energía cada mañana, ya que está adicionada con vitaminas A y D, proteínas y calcio, además es deliciosa y cremosa.', 'https://res.cloudinary.com/dblao5461/image/upload/v1735094047/shopandgo/isgwf9wysh8yektgxgw5.webp', 32, 10, 1, @idCategoriaLacteos),
('1838663396907', 'Leche Lala deslactosada 1L', 'Ya no tienes que sacrificar el sabor de la leche dentro de tu dieta, balancea tu alimentación con un vaso de leche deslactosada Lala en cada desayuno. Aprovecha los beneficios de la leche sin lactosa.', 'https://res.cloudinary.com/dblao5461/image/upload/v1735094116/shopandgo/xxkpmstqlfdu6mspdrtr.webp', 34, 10, 1, @idCategoriaLacteos),
('8778830965493', 'Leche Lala semidescremada 1L', 'Un vaso de leche Lala semidescremada contiene 51% menos grasa que una leche entera, conservando el delicioso sabor de la leche, así como todos sus beneficios. Disfruta tus desayunos en compañía de Leche Lala.', 'https://res.cloudinary.com/dblao5461/image/upload/v1735094117/shopandgo/qhrjgrq3dwgnnqgoae3n.webp', 32.5, 10, 1, @idCategoriaLacteos);

--Llenar las sucursales con sus inventarios
INSERT INTO Sucursales (
	[nombreComercial]
	,[direccionCompleta]
	,[horaApertura]
	,[horaCierre]
	,[latitud]
	,[longitud])
VALUES ('Abarrotera el zorro centro', 'Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Xalapa-Enríquez, Ver.',
'07:00:00', '23:00:00', 19.52854, -96.92230);

SELECT @idSucursal1 = idSucursal FROM Sucursales WHERE nombreComercial = 'Abarrotera el zorro centro';
SELECT @idProducto1 = idProducto FROM Productos WHERE codigoBarras = '3368205723086';
SELECT @idProducto2 = idProducto FROM Productos WHERE codigoBarras = '1838663396907';
SELECT @idProducto3 = idProducto FROM Productos WHERE codigoBarras = '8778830965493';

INSERT INTO Inventarios (
	[cantidad]
	,[fechaCaducidad]
	,[idProducto]
	,[idSucursal]
) VALUES
(14, '2025-01-15', @idProducto1, @idSucursal1),
(28, '2025-01-20', @idProducto2, @idSucursal1),
(0, '2025-02-12', @idProducto3, @idSucursal1);

--Llenar la tabla de clientes
INSERT INTO Clientes ([contrasena],[fechaNacimiento],[nombreCompleto],[numeroTelefono])
VALUES ('$2a$12$Hg2zf5PeoguYwtnAm6lwV.B1zhvCj/4C2BywOsJCFlpeD3caSrsi2', '2001-04-15', 'Ángel de Jesús De la cruz García', '2281645442');

--Llenar la tabla de trabajadores con sus respectivos roles
INSERT INTO CargosTrabajador (nombre) 
VALUES ('Ejecutivo de ventas'), ('Administrador'), ('Repartidor');

SELECT @idCargoEjecutivo = idCargoTrabajador FROM CargosTrabajador WHERE nombre = 'Ejecutivo de ventas';
SELECT @idCargoAdmin = idCargoTrabajador FROM CargosTrabajador WHERE nombre = 'Administrador';
SELECT @idCargoRepartidor = idCargoTrabajador FROM CargosTrabajador WHERE nombre = 'Repartidor';

INSERT INTO Trabajadores(
	[nombreCompleto]
	,[usuario]
	,[contrasena]
	,[fechaIngreso]
	,[disponible]
	,[esActivo]
	,[idSucursal]
	,[idCargoTrabajador]
)
VALUES ('Ángel de Jesús De la cruz García', 'admin', '$2a$12$Hg2zf5PeoguYwtnAm6lwV.B1zhvCj/4C2BywOsJCFlpeD3caSrsi2',
'2023-01-04', 1, 1, @idSucursal1, @idCargoAdmin),
('Ángel de Jesús De la cruz García', 'ejecutivo', '$2a$12$Hg2zf5PeoguYwtnAm6lwV.B1zhvCj/4C2BywOsJCFlpeD3caSrsi2',
'2023-01-04', 1, 1, @idSucursal1, @idCargoEjecutivo),
('Ángel de Jesús De la cruz García', 'repartidor', '$2a$12$Hg2zf5PeoguYwtnAm6lwV.B1zhvCj/4C2BywOsJCFlpeD3caSrsi2',
'2023-01-04', 1, 1, @idSucursal1, @idCargoRepartidor);