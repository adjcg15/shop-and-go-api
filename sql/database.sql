USE [shopandgo];

CREATE TABLE EmisoresMetodosPago (
    idEmisor INT PRIMARY KEY IDENTITY(1,1),
    nombre NVARCHAR(64) NOT NULL
);


CREATE TABLE MetodosPago (
    idMetodoPago INT PRIMARY KEY IDENTITY(1,1),
    anioVencimiento INT NOT NULL,
    mesVencimiento INT NOT NULL,
    idEmisor INT NOT NULL,
    numeroTarjetaEncriptado NCHAR(22) NOT NULL,
    numeroTarjetaHasheado NCHAR(64) NOT NULL,
    vectorInicializacion NCHAR(16) NOT NULL,
    etiquetaAutenticacion NCHAR(22) NOT NULL,
    nombreTitular NVARCHAR(64) NOT NULL,
    esActivo TINYINT NOT NULL,
    idCliente INT NOT NULL
);


CREATE TABLE Clientes (
    idCliente INT PRIMARY KEY IDENTITY(1,1),
    contrasena NCHAR(64) NOT NULL,
    fechaNacimiento DATE NOT NULL,
    nombreCompleto NVARCHAR(64) NOT NULL,
    numeroTelefono NCHAR(10) NOT NULL
);


CREATE TABLE DireccionesEntrega (
    idDireccionEntrega INT PRIMARY KEY IDENTITY(1,1),
    calle NVARCHAR(255) NOT NULL,
    numeroExterior NVARCHAR(5) NOT NULL,
    numeroInterior NVARCHAR(5),
    colonia NVARCHAR(255) NOT NULL,
    municipio NVARCHAR(255) NOT NULL,
    ciudad NVARCHAR(255) NOT NULL,
    codigoPostal NCHAR(5) NOT NULL,
    entidadFederativa NVARCHAR(255) NOT NULL,
    latitud DECIMAL(9,6) NOT NULL,
    longitud DECIMAL(9,6) NOT NULL,
    esActivo TINYINT NOT NULL,
    idCliente INT NOT NULL
);


CREATE TABLE Pedidos (
    idPedido INT PRIMARY KEY IDENTITY(1,1),
    fechaSolicitud DATETIME NOT NULL,
    fechaEntrega DATETIME NULL,
    idCliente INT NOT NULL,
    idDireccionEntrega INT NOT NULL,
    idMetodoPago INT NOT NULL,
    idEstadoPedido INT NOT NULL,
    idTrabajador INT NULL
);


CREATE TABLE Incidencias (
    idIncidencia INT PRIMARY KEY IDENTITY(1,1),
    fechaCreacion DATETIME NOT NULL,
    motivo NVARCHAR(255) NOT NULL,
    idPedido INT NOT NULL
);


CREATE TABLE EstadosPedido (
    idEstadoPedido INT PRIMARY KEY IDENTITY(1,1),
    nombre NVARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE Trabajadores (
    idTrabajador INT PRIMARY KEY IDENTITY(1,1),
    nombreCompleto NVARCHAR(255) NOT NULL,
    usuario NVARCHAR(50) NOT NULL,
    contrasena NCHAR(64) NOT NULL,
    fechaIngreso DATE NOT NULL,
    disponible TINYINT NOT NULL,
    esActivo TINYINT NOT NULL,
    idSucursal INT NULL,
    idCargoTrabajador INT NOT NULL
);


CREATE TABLE CargosTrabajador (
    idCargoTrabajador INT PRIMARY KEY IDENTITY(1,1),
    nombre NVARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE Sucursales (
    idSucursal INT PRIMARY KEY IDENTITY(1,1),
    nombreComercial NVARCHAR(255) NOT NULL UNIQUE,
    direccionCompleta NVARCHAR(255) NOT NULL,
    horaApertura TIME(2) NOT NULL,
    horaCierre TIME(2) NOT NULL,
    latitud DECIMAL(9,6) NOT NULL,
    longitud DECIMAL(9,6) NOT NULL
);


CREATE TABLE Productos (
    idProducto INT PRIMARY KEY IDENTITY(1,1),
    codigoBarras NCHAR(13) NOT NULL UNIQUE,
    nombre NVARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    urlImagen TEXT NOT NULL,
    precioVenta MONEY NOT NULL,
    cantidadMaxima INT NOT NULL,
    idCategoria INT NOT NULL,
);


CREATE TABLE Categorias (
    idCategoria INT PRIMARY KEY IDENTITY(1,1),
    nombre NVARCHAR(255) UNIQUE NOT NULL,
    esActiva TINYINT NOT NULL
);


CREATE TABLE PedidosProductos (
    idPedidoProducto INT PRIMARY KEY IDENTITY(1,1),
    cantidad INT NOT NULL,
    idPedido INT NOT NULL,
    idProducto INT NOT NULL
); 


CREATE TABLE Inventarios ( 
    idInventario INT PRIMARY KEY IDENTITY(1,1),
    cantidad INT NOT NULL,
    fechaCaducidad DATE NOT NULL,
    idProducto INT NOT NULL,
    idSucursal INT NOT NULL
);


ALTER TABLE MetodosPago ADD CONSTRAINT FK_MetodosPago_Emisores FOREIGN KEY (idEmisor) REFERENCES EmisoresMetodosPago (idEmisor) ON DELETE CASCADE;
ALTER TABLE MetodosPago ADD CONSTRAINT FK_MetodosPago_Clientes FOREIGN KEY (idCliente) REFERENCES Clientes (idCliente) ON DELETE CASCADE;

ALTER TABLE DireccionesEntrega ADD CONSTRAINT FK_DireccionesEntrega_Clientes FOREIGN KEY (idCliente) REFERENCES Clientes (idCliente) ON DELETE CASCADE;

ALTER TABLE Pedidos ADD CONSTRAINT FK_Pedidos_Clientes FOREIGN KEY (idCliente) REFERENCES Clientes (idCliente) ON DELETE CASCADE;
ALTER TABLE Pedidos ADD CONSTRAINT FK_Pedidos_DireccionesEntrega FOREIGN KEY (idDireccionEntrega) REFERENCES DireccionesEntrega (idDireccionEntrega);
ALTER TABLE Pedidos ADD CONSTRAINT FK_Pedidos_MetodosPago FOREIGN KEY (idMetodoPago) REFERENCES MetodosPago (idMetodoPago);
ALTER TABLE Pedidos ADD CONSTRAINT FK_Pedidos_EstadosPedido FOREIGN KEY (idEstadoPedido) REFERENCES EstadosPedido (idEstadoPedido);

ALTER TABLE Incidencias ADD CONSTRAINT FK_Incidencias_Pedidos FOREIGN KEY (idPedido) REFERENCES Pedidos (idPedido) ON DELETE CASCADE;

ALTER TABLE Trabajadores ADD CONSTRAINT FK_Trabajadores_Sucursales FOREIGN KEY (idSucursal) REFERENCES Sucursales (idSucursal) ON DELETE CASCADE;
ALTER TABLE Trabajadores ADD CONSTRAINT FK_Trabajadores_CargosTrabajador FOREIGN KEY (idCargoTrabajador) REFERENCES CargosTrabajador (idCargoTrabajador);

ALTER TABLE Productos ADD CONSTRAINT FK_Productos_Categorias FOREIGN KEY (idCategoria) REFERENCES Categorias (idCategoria) ON DELETE CASCADE;

ALTER TABLE PedidosProductos ADD CONSTRAINT FK_PedidosProductos_Pedidos FOREIGN KEY (idPedido) REFERENCES Pedidos (idPedido) ON DELETE CASCADE;
ALTER TABLE PedidosProductos ADD CONSTRAINT FK_PedidosProductos_Productos FOREIGN KEY (idProducto) REFERENCES Productos (idProducto) ON DELETE CASCADE;

ALTER TABLE Inventarios ADD CONSTRAINT FK_Inventarios_Productos FOREIGN KEY (idProducto) REFERENCES Productos (idProducto) ON DELETE CASCADE;
ALTER TABLE Inventarios ADD CONSTRAINT FK_Inventarios_Sucursales FOREIGN KEY (idSucursal) REFERENCES Sucursales (idSucursal) ON DELETE CASCADE;
