USE [shopandgo];

DECLARE @idSucursal1 INT;
DECLARE @idProductoLecheEntera INT;
DECLARE @idProductoLecheDeslactosada INT;
DECLARE @idProductoLecheSemidescremada INT;
DECLARE @idProductoPiniaEnlatada INT;
DECLARE @idProductoChipotles INT;
DECLARE @idProductoAtun INT;
DECLARE @idCategoriaLacteos INT;
DECLARE @idCategoriaEnlatados INT;
DECLARE @idCargoAdmin INT;
DECLARE @idCargoEjecutivo INT;
DECLARE @idCargoRepartidor INT;
DECLARE @idEmisorBanamex INT;
DECLARE @idEmisorBBVA INT;
DECLARE @idClienteRodrigo INT;

DELETE FROM MetodosPago;
DELETE FROM EmisoresMetodosPago;

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
('8778830965493', 'Leche Lala semidescremada 1L', 'Un vaso de leche Lala semidescremada contiene 51% menos grasa que una leche entera, conservando el delicioso sabor de la leche, así como todos sus beneficios. Disfruta tus desayunos en compañía de Leche Lala.', 'https://res.cloudinary.com/dblao5461/image/upload/v1735094117/shopandgo/qhrjgrq3dwgnnqgoae3n.webp', 32.5, 10, 1, @idCategoriaLacteos),
('9087108267891', 'Piña en almíbar La Costeña en rebanadas 800g', 'La tradicional PIÑA EN ALMÍBAR EN REBANADAS será el aliado perfecto en tus postres, con su delicioso sabor que no puede faltar en tu mesa, podrás prepara el mejor volteado de piña para una fiesta.', 'https://res.cloudinary.com/dblao5461/image/upload/v1735145875/shopandgo/tfxa2vzzrgmvfvu0ydmx.webp', 71, 8, 1, @idCategoriaEnlatados),
('8129172801888', 'Chiles chipotles La Costeña adobados 220g', 'Disfruta de los chiles chipotles adobados con tus comidas, prepara ricas y rápidas recetas en solo unos minutos y aporta ese delicioso sabor picante, ideales para estar siempre en tu alacena.', 'https://res.cloudinary.com/dblao5461/image/upload/v1735145876/shopandgo/mtjjuywlaszqvldi9yq3.webp', 34.5, 12, 1, @idCategoriaEnlatados),
('1612091827291', 'Atún Tuny clásico en agua 140g', '¡Descubre, Nuestro Atún clásico adquiérelo desde la comodidad de tu hogar! Contiene proteínas, ayuda a proteger tu corazón y figura es la opción perfecta para una alimentación saludable, puedes disfrutarlo en desayunos, comidas o cenas, llévalo siempre contigo y no requiere refrigeración', 'https://res.cloudinary.com/dblao5461/image/upload/v1735145876/shopandgo/j6oxvocvqmkref7fpn04.webp', 22, 20, 1, @idCategoriaEnlatados);

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
SELECT @idProductoLecheEntera = idProducto FROM Productos WHERE codigoBarras = '3368205723086';
SELECT @idProductoLecheDeslactosada = idProducto FROM Productos WHERE codigoBarras = '1838663396907';
SELECT @idProductoLecheSemidescremada = idProducto FROM Productos WHERE codigoBarras = '8778830965493';
SELECT @idProductoPiniaEnlatada = idProducto FROM Productos WHERE codigoBarras = '9087108267891';
SELECT @idProductoChipotles = idProducto FROM Productos WHERE codigoBarras = '8129172801888';
SELECT @idProductoAtun = idProducto FROM Productos WHERE codigoBarras = '1612091827291';

INSERT INTO Inventarios (
	[cantidad]
	,[fechaCaducidad]
	,[idProducto]
	,[idSucursal]
) VALUES
(65, '2025-01-15', @idProductoLecheEntera, @idSucursal1),
(45, '2025-01-20', @idProductoLecheDeslactosada, @idSucursal1),
(0, '2025-02-12', @idProductoLecheSemidescremada, @idSucursal1),
(23, '2026-02-12', @idProductoPiniaEnlatada, @idSucursal1),
(35, '2026-06-06', @idProductoChipotles, @idSucursal1),
(134, '2027-04-15', @idProductoAtun, @idSucursal1);

--Llenar la tabla de clientes
INSERT INTO Clientes ([contrasena],[fechaNacimiento],[nombreCompleto],[numeroTelefono])
VALUES 
('$2a$12$Hg2zf5PeoguYwtnAm6lwV.B1zhvCj/4C2BywOsJCFlpeD3caSrsi2', '2001-04-15', 'Ángel de Jesús De la cruz García', '2281645442'),
('$2a$12$Hg2zf5PeoguYwtnAm6lwV.B1zhvCj/4C2BywOsJCFlpeD3caSrsi2', '1990-05-15', 'Rodrigo Aguilar López', '2321983692');

SELECT @idClienteRodrigo = idCliente FROM Clientes WHERE nombreCompleto = 'Rodrigo Aguilar López';

--Llenar la tabla de emisores de métodos de pago
INSERT INTO EmisoresMetodosPago (
	[nombre]
) VALUES
('Banamex'), ('BBVA');

SELECT @idEmisorBanamex = idEmisor FROM EmisoresMetodosPago WHERE nombre = 'Banamex';
SELECT @idEmisorBBVA = idEmisor FROM EmisoresMetodosPago WHERE nombre = 'BBVA';

--Llenar la tabla de metodos de pago
INSERT INTO MetodosPago ([anioVencimiento], [mesVencimiento], [idEmisor], [numeroTarjetaEncriptado], [numeroTarjetaHasheado], [vectorInicializacion], [etiquetaAutenticacion], [nombreTitular], [esActivo], [idCliente])
VALUES 
(26, 8, @idEmisorBanamex, '81cc6aa5a713c62b2868497a696792df', '$2b$10$NRg2g3uSOU3Bkd4UX8CxZuycUhRzanbB5.PXcP2HKMQf.bN.tbaQe', '4d2dff177bef48f549c8825a', '6412bed2347c328599ade48f2c1e3526', 'Rodrigo Aguilar López', 1, @idClienteRodrigo),
(26, 7, @idEmisorBanamex, 'a347cc70fb1d80b5376f1da54a87361a', '$2b$10$EFGHtQ19Jn6jBiKTBCWpN.joSnez14/DGev6pjmVGVFkI50cBqWom', '2115da1fb7311dd68e723037', '5c10aa0884f17e9727347a0ef895e5fc', 'Margarita López Viveros', 1, @idClienteRodrigo),
(29, 3, @idEmisorBBVA, '0b9779953e3bfc06bcee94ef9a813bc8', '$2b$10$mUvA2nwIE7TVDlQ024Wrhe3LeOPBOXO7raa3t2a6PISbNssoemB5e', '18f3889fb4ca2fed5b0cf58d', '726be28dd251784b6a127b485ad4eb89', 'Miguel Aguilar López', 1, @idClienteRodrigo);

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