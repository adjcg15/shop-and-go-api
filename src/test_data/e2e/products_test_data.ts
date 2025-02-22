import db from "../../models";
import UserRoles from "../../types/enums/user_roles";

async function insertE2EGetAllProductsTestData() {
    const dairyCategory = await db.ProductCategory.create({
        name: "Lacteos",
        isActive: true,
    });
    const cannedCategory = await db.ProductCategory.create({
        name: "Enlatados",
        isActive: true,
    });
    const milk = await dairyCategory.createProduct({
        barCode: "1234567890",
        name: "Leche Lala entera 1.5L",
        description:
            "Además de ser deliciosa y cremosa, la leche Lala Entera está adicionada con vitaminas A y D, proteínas y calcio que complementarán tu alimentación y la de tu familia. Rinde 6 vasos de 250 ml vs. 4 vasos de 250 ml en 1 L.",
        imageUrl:
            "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
        salePrice: 46,
        maximumAmount: 10,
        isActive: true,
    });
    const cheese = await dairyCategory.createProduct({
        barCode: "0987654321",
        name: "Queso Panela Fud 400 gr",
        description:
            "Es fresco, blanco, suave y tiende a ser duradero. Su textura podría describirse mejor como una ricota firme. No tiende a derretirse por lo que puedes asarlo o colocarlo en la parrilla para comerlo directamente.",
        imageUrl:
            "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
        salePrice: 43.33,
        maximumAmount: 20,
        isActive: true,
    });
    const pineapleCan = await cannedCategory.createProduct({
        barCode: "7778889991",
        name: "Clemente Jacques - Piña en almíbar en rebanadas",
        description:
            "Es un producto mexicano, que puede disfrutar como postre, guarnición o colación, listo para comer.",
        imageUrl:
            "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
        salePrice: 55.5,
        maximumAmount: 15,
        isActive: true,
    });
    const store = await db.Store.create({
        name: "El zorro Xalapa centro",
        address:
            "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Xalapa-Enríquez, Ver.",
        openingTime: "07:00:00.00",
        closingTime: "22:00:00.00",
        latitude: 19.528761,
        longitude: -96.922326,
    });
    await db.Inventory.bulkCreate([
        {
            idProduct: cheese.id,
            stock: 24,
            idStore: store.id,
            expirationDate: "2024-12-24",
        },
        {
            idProduct: milk.id,
            stock: 60,
            idStore: store.id,
            expirationDate: "2024-12-12",
        },
        {
            idProduct: pineapleCan.id,
            stock: 31,
            idStore: store.id,
            expirationDate: "2026-08-05",
        },
    ]);
}

async function insertE2EGetProductTestData() {
    const dairyCategory = await db.ProductCategory.create({
        name: "Lacteos",
        isActive: true,
    });
    const milk = await dairyCategory.createProduct({
        barCode: "1234567890123",
        name: "Leche Lala entera 1.5L",
        description:
            "Además de ser deliciosa y cremosa, la leche Lala Entera está adicionada con vitaminas A y D, proteínas y calcio que complementarán tu alimentación y la de tu familia. Rinde 6 vasos de 250 ml vs. 4 vasos de 250 ml en 1 L.",
        imageUrl:
            "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
        salePrice: 46,
        maximumAmount: 10,
        isActive: true,
    });

    return {
        barCode: milk.barCode,
    };
}

async function insertE2EGetProductInventoriesTestData() {
    const dairyCategory = await db.ProductCategory.create({
        name: "Lacteos",
        isActive: true,
    });
    const cheese = await dairyCategory.createProduct({
        barCode: "0987654321",
        name: "Queso Panela Fud 400 gr",
        description:
            "Es fresco, blanco, suave y tiende a ser duradero. Su textura podría describirse mejor como una ricota firme. No tiende a derretirse por lo que puedes asarlo o colocarlo en la parrilla para comerlo directamente.",
        imageUrl:
            "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
        salePrice: 43.33,
        maximumAmount: 20,
        isActive: true,
    });
    const storeXalapa = await db.Store.create({
        name: "El zorro Xalapa centro",
        address:
            "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Xalapa-Enríquez, Ver.",
        openingTime: "07:00:00.00",
        closingTime: "22:00:00.00",
        latitude: 19.528771,
        longitude: -96.922336,
    });
    const storeMartinez = await db.Store.create({
        name: "El zorro Martínez centro",
        address:
            "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Martínez de la Torre, Ver.",
        openingTime: "07:00:00.00",
        closingTime: "22:00:00.00",
        latitude: 19.528781,
        longitude: -96.922346,
    });
    const storeCarranza = await db.Store.create({
        name: "El zorro carranza centro",
        address:
            "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Carranza, Ver.",
        openingTime: "07:00:00.00",
        closingTime: "22:00:00.00",
        latitude: 19.528761,
        longitude: -96.922356,
    });
    await db.Inventory.bulkCreate([
        {
            idProduct: cheese.id,
            stock: 24,
            idStore: storeXalapa.id,
            expirationDate: "2024-12-24",
        },
        {
            idProduct: cheese.id,
            stock: 60,
            idStore: storeMartinez.id,
            expirationDate: "2024-12-12",
        },
        {
            idProduct: cheese.id,
            stock: 31,
            idStore: storeCarranza.id,
            expirationDate: "2026-08-05",
        },
    ]);

    return {
        idProduct: cheese.id,
    };
}

async function insertE2ECreateProductTestData() {
    const dairyCategory = await db.ProductCategory.create({
        name: "Lacteos",
        isActive: true,
    });
    const storeXalapa = await db.Store.create({
        name: "El zorro Xalapa centro",
        address:
            "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Xalapa-Enríquez, Ver.",
        openingTime: "07:00:00.00",
        closingTime: "22:00:00.00",
        latitude: 19.528771,
        longitude: -96.922336,
    });
    const storeCarranza = await db.Store.create({
        name: "El zorro carranza centro",
        address:
            "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Carranza, Ver.",
        openingTime: "07:00:00.00",
        closingTime: "22:00:00.00",
        latitude: 19.528761,
        longitude: -96.922356,
    });
    const employeePosition = await db.EmployeePosition.create({
        title: UserRoles.ADMINISTRATOR,
    });
    await db.Employee.create({
        fullName: "Maria Lopez Perez",
        user: "mlopez1234",
        passwordHash:
            "$2b$10$MqRHa10Cw5PzHIu2ihG5suOljpAlcw6i1FQKcyj2pRS2pTGa60ycC",
        registrationDate: "2023-01-15",
        isAvailableForWork: true,
        isActive: true,
        idStore: storeCarranza.id,
        idPosition: employeePosition.id,
    });

    return {
        idCategory: dairyCategory.id,
        idStoreXalapa: storeXalapa.id,
        idStoreCarranza: storeCarranza.id,
    };
}

async function insertE2EUpdateProductTestData() {
    const dairyCategory = await db.ProductCategory.create({
        name: "Lacteos",
        isActive: true,
    });
    const cheese = await dairyCategory.createProduct({
        barCode: "0987654321",
        name: "Queso Panela Fud 400 gr",
        description:
            "Es fresco, blanco, suave y tiende a ser duradero. Su textura podría describirse mejor como una ricota firme. No tiende a derretirse por lo que puedes asarlo o colocarlo en la parrilla para comerlo directamente.",
        imageUrl:
            "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
        salePrice: 43.33,
        maximumAmount: 20,
        isActive: true,
    });
    const storeXalapa = await db.Store.create({
        name: "El zorro Xalapa centro",
        address:
            "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Xalapa-Enríquez, Ver.",
        openingTime: "07:00:00.00",
        closingTime: "22:00:00.00",
        latitude: 19.528771,
        longitude: -96.922336,
    });
    const storeCarranza = await db.Store.create({
        name: "El zorro carranza centro",
        address:
            "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Carranza, Ver.",
        openingTime: "07:00:00.00",
        closingTime: "22:00:00.00",
        latitude: 19.528761,
        longitude: -96.922356,
    });
    const storeMartinez = await db.Store.create({
        name: "El zorro Martínez centro",
        address:
            "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Martínez de la Torre, Ver.",
        openingTime: "07:00:00.00",
        closingTime: "22:00:00.00",
        latitude: 19.528781,
        longitude: -96.922346,
    });
    const employeePosition = await db.EmployeePosition.create({
        title: UserRoles.ADMINISTRATOR,
    });
    await db.Employee.create({
        fullName: "Maria Lopez Perez",
        user: "mlopez1234",
        passwordHash:
            "$2b$10$MqRHa10Cw5PzHIu2ihG5suOljpAlcw6i1FQKcyj2pRS2pTGa60ycC",
        registrationDate: "2023-01-15",
        isAvailableForWork: true,
        isActive: true,
        idStore: storeCarranza.id,
        idPosition: employeePosition.id,
    });
    const inventoryXalapa = await db.Inventory.create({
        idProduct: cheese.id,
        stock: 24,
        idStore: storeXalapa.id,
        expirationDate: "2024-12-24",
    });
    const inventoryCarranza = await db.Inventory.create({
        idProduct: cheese.id,
        stock: 31,
        idStore: storeCarranza.id,
        expirationDate: "2026-08-05",
    });

    return {
        idProduct: cheese.id,
        idCategory: dairyCategory.id,
        idStoreXalapa: storeXalapa.id,
        idStoreCarranza: storeCarranza.id,
        idInventoryXalapa: inventoryXalapa.id,
        idInventoryCarranza: inventoryCarranza.id,
        idStoreMartinez: storeMartinez.id,
    };
}

export {
    insertE2EGetAllProductsTestData,
    insertE2EGetProductTestData,
    insertE2EGetProductInventoriesTestData,
    insertE2ECreateProductTestData,
    insertE2EUpdateProductTestData,
};
