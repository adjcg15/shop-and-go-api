USE [shopandgo];

DECLARE @idSucursal1 INT;

DECLARE @idProductoLecheEntera INT;
DECLARE @idProductoLecheDeslactosada INT;
DECLARE @idProductoLecheSemidescremada INT;
DECLARE @idProductoCajaLecheDeslactosada INT;
DECLARE @idProductoAlpuraDeslactosada INT;
DECLARE @idProductoYoplaitGriego INT;
DECLARE @idProductoYoghurtLalaBebibleFresa INT;
DECLARE @idProductoYoghurtLalaBebibleSurtido INT;
DECLARE @idProductoCremaAcidaAlpura INT;
DECLARE @idProductoCremaLalaEntera INT;
DECLARE @idProductoMediaCremaLala INT;
DECLARE @idProductoBarraMantequillaLala INT;
DECLARE @idProductoMargarinaPrimavera INT;
DECLARE @idProductoFlanVainilla INT;
DECLARE @idProductoArrozConLeche INT;
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
('7612712819022', 'Leche UHT Lala Deslactosada 1L 6 Piezas', 'Ya no tienes que sacrificar el rico sabor de la leche que tanto te gusta, disfruta de una excelente opción sin lactosa para cuidar de tu cuerpo y figura, manteniendo una mejor alimentación. Aprovecha nuestra entrega a domicilio y haz tu despensa en línea encontrando este y muchos productos más. *Una opción para ayudar a disminuir la incomodidad digestiva provocada por la lactosa.', 'https://res.cloudinary.com/dblao5461/image/upload/v1735170982/shopandgo/mzspjqld0ac6uk8fbegu.jpg', 177.1, 3, 1, @idCategoriaLacteos), 
('1287581291299', 'Leche Alpura Deslactosada 1L', '¡Prueba los beneficios de nuestra Leche Alpura Deslactosada 1 Lt! En nuestro Departamento de Lácteos y Huevo encuentra la mejor leche de vaca ahora también para quienes son intolerantes a la lactosa. El sabor y la calidad de siempre para una digestión ligera asegurada. La consistencia cremosa de la leche también disponible para intolerantes a la lactosa es una realidad y ahora está disponible para disfrutar.', 'https://res.cloudinary.com/dblao5461/image/upload/v1735171339/shopandgo/nwhlc1xt8nlfhiaxozlv.jpg', 28.9, 10, 1, @idCategoriaLacteos),
('0178972536471', 'Yoghurt Batido Yoplait Griego Sin Azúcar Natural 1kg', 'El Yoghurt Yoplait Griego batido sin azúcar Natural 1 kg, es lo mejor que puedes comer para calmar un antojo o para complementar tu desayuno. Gracias a su empaque, es muy fácil de disfrutar, solo destapa, toma tu cuchara y a disfrutar.', 'https://res.cloudinary.com/dblao5461/image/upload/v1735171484/shopandgo/jehbxhn0yrot5eatw5gp.jpg', 108, 7, 1, @idCategoriaLacteos),
('2348190765412', 'Yoghurt Lala Bebible Fresa 6 piezas de 220g c/u', 'El sabor que tiene el delicioso yoghurt bebible Lala, hecho con fruta natural y leche, es ideal para ser incluido en la alimentación balanceada de tu familia mientras los consiente con su delicioso sabor fresa. Compra en línea de manera sencilla. Agrega a tu carrito lo que necesites y entregaremos tus productos hasta la puerta de tu hogar.', 'https://res.cloudinary.com/dblao5461/image/upload/v1735171935/shopandgo/hw6f94aui4klbkgr3tzh.jpg', 63.5, 5, 1, @idCategoriaLacteos),
('4589101564378', 'Yoghurt Bebible Lala Surtido 6 pz 220g c/u', 'Disfruta de un Yoghurt Bebible de Lala, al estar hecho con fruta natural y leche, complementará la alimentación de tu familia mientras los delitas con un rico sabor. Prueba los deliciosos y diferentes sabores.', 'https://res.cloudinary.com/dblao5461/image/upload/v1735172276/shopandgo/fug14s8hao07bvdjflbd.jpg', 59.9, 5, 1, @idCategoriaLacteos),
('5619098982718', 'Crema Ácida Alpura 900g', 'La Crema Ácida Alpura de 900 gramos es un producto lácteo versátil y delicioso. Esta crema tiene una textura suave y un sabor ligeramente ácido que complementa una amplia variedad de platillos. Ya sea que la uses como aderezo para tacos, nachos o enchiladas, o como ingrediente para salsas y postres, la Crema Ácida Alpura agrega un toque de cremosidad y un equilibrio perfecto a tus recetas favoritas. Con su presentación de 900 gramos, tendrás suficiente crema ácida para disfrutar en múltiples ocasiones. Aprovecha la calidad y el sabor auténtico de la Crema Ácida Alpura en tus preparaciones culinarias.', 'https://res.cloudinary.com/dblao5461/image/upload/v1735172539/shopandgo/lqoinj2yqfufyzbl6y3l.jpg', 80.5, 3, 1, @idCategoriaLacteos),
('7891546370124', 'Crema Lala Entera 900ml', 'Prepárate para deleitar el paladar de tu familia con recetas que podrás acompañar con el gran sabor de la Crema Entera ácida Lala. Disfruta de su consistencia en sabores dulces y salados, mientras lo saboreas con tus seres queridos.', 'https://res.cloudinary.com/dblao5461/image/upload/v1735172929/shopandgo/cpueprj4xhxxvyqfndtd.jpg', 78.9, 5, 1, @idCategoriaLacteos),
('0981653428912', 'Media Crema UHT Lala 250ml', 'Si buscas una aliada para darle un toque rico y delicioso a tus comidas, prueba Media Crema Lala. Prepara sabrosas recetas dulces o saladas, acompañadas de su sabor y consistencia semilíquida. ¡A tu familia le encantará!', 'https://res.cloudinary.com/dblao5461/image/upload/v1735173003/shopandgo/pjairhqbpqcpvoq6qvab.jpg', 19.3, 20, 1, @idCategoriaLacteos),
('1122668390281', 'Mantequilla Lala Barra Sin Sal 90g', 'Prueba tus platillos favoritos con el rico sabor de la Mantequilla Lala Sin Sal. Te ayudará a crear deliciosas recetas dulces o saladas con un sabor exquisito. ¡Intégrala a tu despensa, conócela!', 'https://res.cloudinary.com/dblao5461/image/upload/v1735173153/shopandgo/hmoh4p3g0oqr6dtyagem.jpg', 24.9, 15, 1, @idCategoriaLacteos),
('5670192834568', 'Margarina Sin Sal Primavera Cocina 775g', 'Porque sabemos que la cocina es lo tuyo, te queremos presentar la Margarina Primavera Cocina sin Sal 775 g. Es ideal para cocinar, hornear y para preparar unos hot cakes, unas galletas, una pasta, y todo lo que se te ocurra para disfrutar su delicioso sabor de siempre. Esta margarina sale directo del Departamento de Alimentos congelados y refrigerados en su formato de 225 g lista para incorporar a tus platillos.', 'https://res.cloudinary.com/dblao5461/image/upload/v1735173568/shopandgo/tsjwytszfzh0xsbjyswv.jpg', 126, 3, 1, @idCategoriaLacteos),
('6456364789101', 'Flan Lala Vainilla 6 pz 100g', 'Si te gustan los sabores tradicionales, el Flan Lala sabor Vainilla será una opción de postre para ti. Su dulzura se podrá volver de tus sabores favoritos. ¡Prepárate para deleitar tu paladar y compartirlo con tu familia!', 'https://res.cloudinary.com/dblao5461/image/upload/v1735173816/shopandgo/ffd5pthptarqxxiqpoiv.jpg', 38.8, 10, 1, @idCategoriaLacteos),
('9890187253346', 'Arroz con Leche Lala 4 pz 125g', 'El postre perfecto para consentir a tu familia, el Arroz con Leche Lala tiene se caracteriza por su sabor casero, apelando a la nostalgia de las recetas tradicionales de familia. Consiente a los que más quieres con este delicioso postre que a todos encantará.', 'https://res.cloudinary.com/dblao5461/image/upload/v1735176910/shopandgo/uebatfpy4im6eshnbanr.jpg', 36.9, 15, 1, @idCategoriaLacteos),
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
SELECT @idProductoCajaLecheDeslactosada = idProducto FROM Productos WHERE codigoBarras = '7612712819022';
SELECT @idProductoAlpuraDeslactosada = idProducto FROM Productos WHERE codigoBarras = '1287581291299';
SELECT @idProductoYoplaitGriego = idProducto FROM Productos WHERE codigoBarras = '0178972536471';
SELECT @idProductoYoghurtLalaBebibleFresa = idProducto FROM Productos WHERE codigoBarras = '2348190765412';
SELECT @idProductoYoghurtLalaBebibleSurtido = idProducto FROM Productos WHERE codigoBarras = '4589101564378';
SELECT @idProductoCremaAcidaAlpura = idProducto FROM Productos WHERE codigoBarras = '5619098982718';
SELECT @idProductoCremaLalaEntera = idProducto FROM Productos WHERE codigoBarras = '7891546370124';
SELECT @idProductoMediaCremaLala = idProducto FROM Productos WHERE codigoBarras = '0981653428912';
SELECT @idProductoBarraMantequillaLala = idProducto FROM Productos WHERE codigoBarras = '1122668390281';
SELECT @idProductoMargarinaPrimavera = idProducto FROM Productos WHERE codigoBarras = '5670192834568';
SELECT @idProductoFlanVainilla = idProducto FROM Productos WHERE codigoBarras = '6456364789101';
SELECT @idProductoArrozConLeche = idProducto FROM Productos WHERE codigoBarras = '9890187253346';
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
(28, '2025-04-24', @idProductoCajaLecheDeslactosada, @idSucursal1),
(76, '2025-08-06', @idProductoAlpuraDeslactosada, @idSucursal1),
(14, '2024-12-30', @idProductoYoplaitGriego, @idSucursal1),
(7, '2025-01-15', @idProductoYoghurtLalaBebibleFresa, @idSucursal1),
(3, '2025-01-17', @idProductoYoghurtLalaBebibleSurtido, @idSucursal1),
(19, '2025-01-15', @idProductoCremaAcidaAlpura, @idSucursal1),
(30, '2025-03-27', @idProductoCremaLalaEntera, @idSucursal1),
(75, '2025-07-14', @idProductoMediaCremaLala, @idSucursal1),
(124, '2025-07-14', @idProductoBarraMantequillaLala, @idSucursal1),
(18, '2025-03-01', @idProductoMargarinaPrimavera, @idSucursal1),
(31, '2025-11-15', @idProductoFlanVainilla, @idSucursal1),
(23, '2025-11-15', @idProductoArrozConLeche, @idSucursal1),
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