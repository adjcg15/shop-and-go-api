import db from "../../models";

async function insertE2EGetProductsByStoreTestData() {
    const dairyCategory = await db.ProductCategory.create({ name: "Lacteos", isActive: true });
    const cannedCategory = await db.ProductCategory.create({ name: "Enlatados", isActive: true });
    const milk = await dairyCategory.createProduct({ 
        barCode: "1234567890", 
        name: "Leche Lala entera 1.5L",
        description: "Además de ser deliciosa y cremosa, la leche Lala Entera está adicionada con vitaminas A y D, proteínas y calcio que complementarán tu alimentación y la de tu familia. Rinde 6 vasos de 250 ml vs. 4 vasos de 250 ml en 1 L.",
        salePrice: 46,
        maximumAmount: 10
    });
    const cheese = await dairyCategory.createProduct({ 
        barCode: "0987654321", 
        name: "Queso Panela Fud 400 gr",
        description: "Es fresco, blanco, suave y tiende a ser duradero. Su textura podría describirse mejor como una ricota firme. No tiende a derretirse por lo que puedes asarlo o colocarlo en la parrilla para comerlo directamente.",
        salePrice: 43.33,
        maximumAmount: 20
    });
    const pineapleCan = await cannedCategory.createProduct({ 
        barCode: "7778889991", 
        name: "Clemente Jacques - Piña en almíbar en rebanadas",
        description: "Es un producto mexicano, que puede disfrutar como postre, guarnición o colación, listo para comer.",
        salePrice: 55.5,
        maximumAmount: 15
    });
    const store = await db.Store.create({ 
        name: "El zorro Xalapa centro",
        address: "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Xalapa-Enríquez, Ver.",
        openingTime: "07:00:00.00",
        closingTime: "22:00:00.00",
        latitude: 19.528761,
        longitude: -96.922326
    });
    await db.Inventory.bulkCreate([
        { idProduct: cheese.id, stock: 24, idStore: store.id, expirationDate: "2024-12-24" },
        { idProduct: milk.id, stock: 60, idStore: store.id, expirationDate: "2024-12-12" },
        { idProduct: pineapleCan.id, stock: 31, idStore: store.id, expirationDate: "2026-08-05" },
    ]);

    return {
        idStore: store.id
    };
}

async function insertE2EGetProductCategoeriesTestData() {
    await db.ProductCategory.create({ name: "Lacteos", isActive: true });
    await db.ProductCategory.create({ name: "Enlatados", isActive: true });
    await db.ProductCategory.create({ name: "Juguetes", isActive: true });
}

async function insertE2EGetIssuingBanksTestData() {
    await db.Issuer.create({ name: "Banamex" });
    await db.Issuer.create({ name: "Santander" });
    await db.Issuer.create({ name: "Inbursa" });
}

export {
    insertE2EGetProductsByStoreTestData,
    insertE2EGetProductCategoeriesTestData,
    insertE2EGetIssuingBanksTestData
};