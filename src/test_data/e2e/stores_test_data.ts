import db from "../../models";

async function insertE2EGetProductsByStoreTestData() {
    const dairyCategory = await db.ProductCategory.create({
        name: "Lacteos",
        isActive: true,
    });
    const cannedCategory = await db.ProductCategory.create({
        name: "Enlatados",
        isActive: true,
    });
    const products = await db.Product.bulkCreate([
        {
            barCode: "3368205723086",
            name: "Leche Lala entera 1L",
            description:
                "Un vaso de leche entera Lala es la opción que tú y tu familia necesitan para llenarse de energía cada mañana, ya que está adicionada con vitaminas A y D, proteínas y calcio, además es deliciosa y cremosa.",
            imageUrl:
                "https://res.cloudinary.com/dblao5461/image/upload/v1735094047/shopandgo/isgwf9wysh8yektgxgw5.webp",
            salePrice: 32,
            maximumAmount: 10,
            isActive: true,
            idCategory: dairyCategory.id,
        },
        {
            barCode: "1838663396907",
            name: "Leche Lala deslactosada 1L",
            description:
                "Ya no tienes que sacrificar el sabor de la leche dentro de tu dieta, balancea tu alimentación con un vaso de leche deslactosada Lala en cada desayuno. Aprovecha los beneficios de la leche sin lactosa.",
            imageUrl:
                "https://res.cloudinary.com/dblao5461/image/upload/v1735094116/shopandgo/xxkpmstqlfdu6mspdrtr.webp",
            salePrice: 34,
            maximumAmount: 10,
            isActive: true,
            idCategory: dairyCategory.id,
        },
        {
            barCode: "7612712819022",
            name: "Leche UHT Lala Deslactosada 1L 6 Piezas",
            description:
                "Ya no tienes que sacrificar el rico sabor de la leche que tanto te gusta, disfruta de una excelente opción sin lactosa para cuidar de tu cuerpo y figura, manteniendo una mejor alimentación. Aprovecha nuestra entrega a domicilio y haz tu despensa en línea encontrando este y muchos productos más. *Una opción para ayudar a disminuir la incomodidad digestiva provocada por la lactosa.",
            imageUrl:
                "https://res.cloudinary.com/dblao5461/image/upload/v1735170982/shopandgo/mzspjqld0ac6uk8fbegu.jpg",
            salePrice: 177.1,
            maximumAmount: 3,
            isActive: false,
            idCategory: dairyCategory.id,
        },
        {
            barCode: "0178972536471",
            name: "Yoghurt Batido Yoplait Griego Sin Azúcar Natural 1kg",
            description:
                "El Yoghurt Yoplait Griego batido sin azúcar Natural 1 kg, es lo mejor que puedes comer para calmar un antojo o para complementar tu desayuno. Gracias a su empaque, es muy fácil de disfrutar, solo destapa, toma tu cuchara y a disfrutar.",
            imageUrl:
                "https://res.cloudinary.com/dblao5461/image/upload/v1735171484/shopandgo/jehbxhn0yrot5eatw5gp.jpg",
            salePrice: 108,
            maximumAmount: 7,
            isActive: true,
            idCategory: dairyCategory.id,
        },
        {
            barCode: "1612091827291",
            name: "Atún Tuny clásico en agua 140g",
            description:
                "¡Descubre, Nuestro Atún clásico adquiérelo desde la comodidad de tu hogar! Contiene proteínas, ayuda a proteger tu corazón y figura es la opción perfecta para una alimentación saludable, puedes disfrutarlo en desayunos, comidas o cenas, llévalo siempre contigo y no requiere refrigeración",
            imageUrl:
                "https://res.cloudinary.com/dblao5461/image/upload/v1735145876/shopandgo/j6oxvocvqmkref7fpn04.webp",
            salePrice: 22,
            maximumAmount: 20,
            isActive: true,
            idCategory: cannedCategory.id,
        },
        {
            barCode: "8129172801888",
            name: "Chiles chipotles La Costeña adobados 220g",
            description:
                "Disfruta de los chiles chipotles adobados con tus comidas, prepara ricas y rápidas recetas en solo unos minutos y aporta ese delicioso sabor picante, ideales para estar siempre en tu alacena.",
            imageUrl:
                "https://res.cloudinary.com/dblao5461/image/upload/v1735145876/shopandgo/mtjjuywlaszqvldi9yq3.webp",
            salePrice: 34.5,
            maximumAmount: 12,
            isActive: true,
            idCategory: cannedCategory.id,
        },
    ]);
    const store = await db.Store.create({
        name: "El zorro Xalapa centro",
        address:
            "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Xalapa-Enríquez, Ver.",
        openingTime: "07:00:00.00",
        closingTime: "22:00:00.00",
        latitude: 19.528761,
        longitude: -96.922326,
    });

    const expirationDates = ["2024-12-24", "2024-12-12", "2026-08-05"];
    const inventories = products.map((product) => ({
        idProduct: product.id,
        idStore: store.id,
        stock: Math.floor(Math.random() * 50),
        expirationDate:
            expirationDates[Math.floor(Math.random() * expirationDates.length)],
    }));
    await db.Inventory.bulkCreate(inventories);

    return {
        idStore: store.id,
        idDairyCategory: dairyCategory.id,
    };
}

async function insertE2EGetProductsWithStockInStoreTestData() {
    const dairyCategory = await db.ProductCategory.create({
        name: "Lacteos",
        isActive: true,
    });
    const product = await db.Product.create({
        barCode: "3368205723086",
        name: "Leche Lala entera 1L",
        description:
            "Un vaso de leche entera Lala es la opción que tú y tu familia necesitan para llenarse de energía cada mañana, ya que está adicionada con vitaminas A y D, proteínas y calcio, además es deliciosa y cremosa.",
        imageUrl:
            "https://res.cloudinary.com/dblao5461/image/upload/v1735094047/shopandgo/isgwf9wysh8yektgxgw5.webp",
        salePrice: 32,
        maximumAmount: 10,
        isActive: true,
        idCategory: dairyCategory.id,
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

    await db.Inventory.create({
        idProduct: product.id,
        idStore: store.id,
        expirationDate: "2024-12-24",
        stock: 10,
    });

    return {
        idStore: store.id,
        barCode: product.barCode,
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

async function insertE2EGetStoresTestData() {
    await db.Store.create({
        name: "Plaza Crystal",
        address: "Avenida Lázaro Cárdenas",
        openingTime: "08:00:00.00",
        closingTime: "19:00:00.00",
        latitude: 19.432608,
        longitude: -99.133209,
    });
    await db.Store.create({
        name: "Plaza Américas",
        address: "Avenida Xalapa",
        openingTime: "08:00:00.00",
        closingTime: "19:00:00.00",
        latitude: 19.432603,
        longitude: -99.133209,
    });
    await db.Store.create({
        name: "Plaza Ánimas",
        address: "Avenida Principal",
        openingTime: "08:00:00.00",
        closingTime: "19:00:00.00",
        latitude: 19.432603,
        longitude: -99.133209,
    });
}

async function insertE2EGetStoreInventoriesTestData() {
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

    return {
        idStore: store.id,
        idMilk: milk.id,
        idCheese: cheese.id,
        idPineapleCan: pineapleCan.id,
    };
}

async function insertE2EGetNearestStoreTestData() {
    await db.Store.create({
        name: "Chedraui Caram Xalapa",
        address:
            "Antonio Chedraui Caram 102, Francisco Villa, 91173 Xalapa-Enríquez, Ver.",
        openingTime: "08:00:00.00",
        closingTime: "19:00:00.00",
        latitude: 19.539137,
        longitude: -96.904638,
    });

    await db.Store.create({
        name: "Plaza Crystal",
        address: "Avenida Lázaro Cárdenas",
        openingTime: "08:00:00.00",
        closingTime: "19:00:00.00",
        latitude: 19.432608,
        longitude: -99.133209,
    });

    const nearestStore = await db.Store.create({
        name: "El zorro Xalapa centro",
        address:
            "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Xalapa-Enríquez, Ver.",
        openingTime: "07:00:00.00",
        closingTime: "22:00:00.00",
        latitude: 19.528761,
        longitude: -96.922326,
    });

    return nearestStore;
}

export {
    insertE2EGetProductsByStoreTestData,
    insertE2EGetProductsWithStockInStoreTestData,
    insertE2EGetProductCategoeriesTestData,
    insertE2EGetIssuingBanksTestData,
    insertE2EGetStoresTestData,
    insertE2EGetStoreInventoriesTestData,
    insertE2EGetNearestStoreTestData,
};
