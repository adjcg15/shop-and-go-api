import db from "../../models";
import { OrderStatus } from "../../types/enums/order_status";
import UserRoles from "../../types/enums/user_roles";

async function insertE2ECreateOrderTestData() {
    const client = await db.Client.create({
        passwordHash: "$2b$10$MqRHa10Cw5PzHIu2ihG5suOljpAlcw6i1FQKcyj2pRS2pTGa60ycC",
        birthdate: "1990-05-15",
        fullName: "John Doe",
        phoneNumber: "1234567890"
    });
    const deliveryAddress = await db.Address.create({
        street: "Avenida Reforma",               
        streetNumber: "100",                     
        apartmentNumber: "1",                    
        neighborhood: "Centro",                  
        municipality: "Municipio de Cuauhtémoc", 
        city: "Ciudad de México",                
        postalCode: "06000",                     
        state: "CDMX",                           
        latitude: 19.432608,                     
        longitude: -99.133209,                   
        isActive: true,
        idClient: client.id                 
    });
    const banamexIssuer = await db.Issuer.create({ name: "Banamex"});
    const paymentMethod = await client.createPaymentMethod({
        cardholderName: "Alice Johnson",
        expirationMonth: 8,
        expirationYear: 26,
        encryptedCardNumber: "81cc6aa5a713c62b2868497a696792df",
        hashedCardNumber: "$2b$10$NRg2g3uSOU3Bkd4UX8CxZuycUhRzanbB5.PXcP2HKMQf.bN.tbaQe",
        initialVector: "4d2dff177bef48f549c8825a",
        authenticationTag: "6412bed2347c328599ade48f2c1e3526",
        isActive: true,
        idIssuer: banamexIssuer.id
    });
    const dairyCategory = await db.ProductCategory.create({ name: "Lacteos", isActive: true });
    const cannedCategory = await db.ProductCategory.create({ name: "Enlatados", isActive: true });
    const milk = await dairyCategory.createProduct({ 
        barCode: "1234567890", 
        name: "Leche Lala entera 1.5L",
        description: "Además de ser deliciosa y cremosa, la leche Lala Entera está adicionada con vitaminas A y D, proteínas y calcio que complementarán tu alimentación y la de tu familia. Rinde 6 vasos de 250 ml vs. 4 vasos de 250 ml en 1 L.",
        imageUrl: "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
        salePrice: 46,
        maximumAmount: 10,
        isActive: true
    });
    const cheese = await dairyCategory.createProduct({ 
        barCode: "0987654321", 
        name: "Queso Panela Fud 400 gr",
        description: "Es fresco, blanco, suave y tiende a ser duradero. Su textura podría describirse mejor como una ricota firme. No tiende a derretirse por lo que puedes asarlo o colocarlo en la parrilla para comerlo directamente.",
        imageUrl: "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
        salePrice: 43.33,
        maximumAmount: 20,
        isActive: true
    });
    const pineapleCan = await cannedCategory.createProduct({ 
        barCode: "7778889991", 
        name: "Clemente Jacques - Piña en almíbar en rebanadas",
        description: "Es un producto mexicano, que puede disfrutar como postre, guarnición o colación, listo para comer.",
        imageUrl: "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
        salePrice: 55.5,
        maximumAmount: 15,
        isActive: true
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
    await db.OrderStatus.create({
        title: OrderStatus.CREATED
    });

    return {
        idClient: client.id,
        idPaymentMethod: paymentMethod.id,
        idDeliveryAddress: deliveryAddress.id,
        idStore: store.id,
        idCheese: cheese.id,
        idMilk: milk.id
    }
}

async function insertE2EGetOrdersToDeliverTestData() {
    const store = await db.Store.create({
        name: "El zorro Xalapa centro",
            address: "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Xalapa-Enríquez, Ver.",
            openingTime: "07:00:00.00",
            closingTime: "22:00:00.00",
            latitude: 19.528761,
            longitude: -96.922326
    });

    const deliveryManPosition = await db.EmployeePosition.create({
        title: UserRoles.DELIVERY_MAN,
    });
    
    const deliveryMan = await db.Employee.create({
        fullName: "José Lopez Perez",
        user: "jlopez123",
        passwordHash:
            "$2a$12$Hg2zf5PeoguYwtnAm6lwV.B1zhvCj/4C2BywOsJCFlpeD3caSrsi2",
        registrationDate: "2023-01-29",
        isAvailableForWork: true,
        isActive: true,
        idStore: store.id,
        idPosition: deliveryManPosition.id,
    });

    const client = await db.Client.create({
        passwordHash: "$2b$10$MqRHa10Cw5PzHIu2ihG5suOljpAlcw6i1FQKcyj2pRS2pTGa60ycC",
        birthdate: "1990-05-15",
        fullName: "John Doe",
        phoneNumber: "1234567890"
    });

    const deliveryAddress = await db.Address.create({
        street: "Avenida Reforma",               
        streetNumber: "100",                     
        apartmentNumber: "1",                    
        neighborhood: "Centro",                  
        municipality: "Municipio de Cuauhtémoc", 
        city: "Ciudad de México",                
        postalCode: "06000",                     
        state: "CDMX",                           
        latitude: 19.432608,                     
        longitude: -99.133209,                   
        isActive: true,
        idClient: client.id                 
    });
    const banamexIssuer = await db.Issuer.create({ name: "Banamex"});
    const paymentMethod = await client.createPaymentMethod({
        cardholderName: "Alice Johnson",
        expirationMonth: 8,
        expirationYear: 26,
        encryptedCardNumber: "81cc6aa5a713c62b2868497a696792df",
        hashedCardNumber: "$2b$10$NRg2g3uSOU3Bkd4UX8CxZuycUhRzanbB5.PXcP2HKMQf.bN.tbaQe",
        initialVector: "4d2dff177bef48f549c8825a",
        authenticationTag: "6412bed2347c328599ade48f2c1e3526",
        isActive: true,
        idIssuer: banamexIssuer.id
    });

    const dairyCategory = await db.ProductCategory.create({ name: "Lacteos", isActive: true });
    const cannedCategory = await db.ProductCategory.create({ name: "Enlatados", isActive: true });

    const milk = await dairyCategory.createProduct({ 
        barCode: "1234567890", 
        name: "Leche Lala entera 1.5L",
        description: "Además de ser deliciosa y cremosa, la leche Lala Entera está adicionada con vitaminas A y D, proteínas y calcio que complementarán tu alimentación y la de tu familia. Rinde 6 vasos de 250 ml vs. 4 vasos de 250 ml en 1 L.",
        imageUrl: "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
        salePrice: 46,
        maximumAmount: 10,
        isActive: true
    });
    const cheese = await dairyCategory.createProduct({ 
        barCode: "0987654321", 
        name: "Queso Panela Fud 400 gr",
        description: "Es fresco, blanco, suave y tiende a ser duradero. Su textura podría describirse mejor como una ricota firme. No tiende a derretirse por lo que puedes asarlo o colocarlo en la parrilla para comerlo directamente.",
        imageUrl: "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
        salePrice: 43.33,
        maximumAmount: 20,
        isActive: true
    });
    const pineapleCan = await cannedCategory.createProduct({ 
        barCode: "7778889991", 
        name: "Clemente Jacques - Piña en almíbar en rebanadas",
        description: "Es un producto mexicano, que puede disfrutar como postre, guarnición o colación, listo para comer.",
        imageUrl: "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
        salePrice: 55.5,
        maximumAmount: 15,
        isActive: true
    });

    await db.Inventory.bulkCreate([
        { idProduct: cheese.id, stock: 24, idStore: store.id, expirationDate: "2024-12-24" },
        { idProduct: milk.id, stock: 60, idStore: store.id, expirationDate: "2024-12-12" },
        { idProduct: pineapleCan.id, stock: 31, idStore: store.id, expirationDate: "2026-08-05" },
    ]);

    const orderStatusSent = await db.OrderStatus.create({
        title: OrderStatus.SENT
    });

    const order = await db.Order.create({
        dateOfPurchase: "2025-01-02", 
        idClient: client.id, 
        idDeliveryAddress: deliveryAddress.id, 
        idPaymentMethod: paymentMethod.id, 
        idStatus: orderStatusSent.id, 
        idDeliveryMan: deliveryMan.id, 
        idStore: store.id
    });

    await db.OrderProduct.bulkCreate([
        { amount: 2, idOrder: order.id, idProduct: cheese.id },
        { amount: 1, idOrder: order.id, idProduct: milk.id },
        { amount: 2, idOrder: order.id, idProduct: pineapleCan.id }
    ]);

    return {
        idSentStatus: orderStatusSent.id
    }
}

async function insertE2EDeliverOrderTestData() {
    const store = await db.Store.create({
        name: "El zorro Xalapa centro",
            address: "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Xalapa-Enríquez, Ver.",
            openingTime: "07:00:00.00",
            closingTime: "22:00:00.00",
            latitude: 19.528761,
            longitude: -96.922326
    });

    const deliveryManPosition = await db.EmployeePosition.create({
        title: UserRoles.DELIVERY_MAN,
    });
    
    const deliveryMan = await db.Employee.create({
        fullName: "José Lopez Perez",
        user: "jlopez123",
        passwordHash:
            "$2a$12$Hg2zf5PeoguYwtnAm6lwV.B1zhvCj/4C2BywOsJCFlpeD3caSrsi2",
        registrationDate: "2023-01-29",
        isAvailableForWork: false,
        isActive: true,
        idStore: store.id,
        idPosition: deliveryManPosition.id,
    });

    const administrator = await db.Employee.create({
        fullName: "Juan Lopez Perez",
        user: "admin123",
        passwordHash:
            "$2a$12$Hg2zf5PeoguYwtnAm6lwV.B1zhvCj/4C2BywOsJCFlpeD3caSrsi2",
        registrationDate: "2023-01-19",
        isAvailableForWork: true,
        isActive: true,
        idStore: store.id,
        idPosition: deliveryManPosition.id,
    });

    const client = await db.Client.create({
        passwordHash: "$2b$10$MqRHa10Cw5PzHIu2ihG5suOljpAlcw6i1FQKcyj2pRS2pTGa60ycC",
        birthdate: "1990-05-15",
        fullName: "John Doe",
        phoneNumber: "1234567890"
    });

    const deliveryAddress = await db.Address.create({
        street: "Avenida Reforma",               
        streetNumber: "100",                     
        apartmentNumber: "1",                    
        neighborhood: "Centro",                  
        municipality: "Municipio de Cuauhtémoc", 
        city: "Ciudad de México",                
        postalCode: "06000",                     
        state: "CDMX",                           
        latitude: 19.432608,                     
        longitude: -99.133209,                   
        isActive: true,
        idClient: client.id                 
    });
    const banamexIssuer = await db.Issuer.create({ name: "Banamex"});
    const paymentMethod = await client.createPaymentMethod({
        cardholderName: "Alice Johnson",
        expirationMonth: 8,
        expirationYear: 26,
        encryptedCardNumber: "81cc6aa5a713c62b2868497a696792df",
        hashedCardNumber: "$2b$10$NRg2g3uSOU3Bkd4UX8CxZuycUhRzanbB5.PXcP2HKMQf.bN.tbaQe",
        initialVector: "4d2dff177bef48f549c8825a",
        authenticationTag: "6412bed2347c328599ade48f2c1e3526",
        isActive: true,
        idIssuer: banamexIssuer.id
    });

    const dairyCategory = await db.ProductCategory.create({ name: "Lacteos", isActive: true });
    const cannedCategory = await db.ProductCategory.create({ name: "Enlatados", isActive: true });

    const milk = await dairyCategory.createProduct({ 
        barCode: "1234567890", 
        name: "Leche Lala entera 1.5L",
        description: "Además de ser deliciosa y cremosa, la leche Lala Entera está adicionada con vitaminas A y D, proteínas y calcio que complementarán tu alimentación y la de tu familia. Rinde 6 vasos de 250 ml vs. 4 vasos de 250 ml en 1 L.",
        imageUrl: "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
        salePrice: 46,
        maximumAmount: 10,
        isActive: true
    });
    const cheese = await dairyCategory.createProduct({ 
        barCode: "0987654321", 
        name: "Queso Panela Fud 400 gr",
        description: "Es fresco, blanco, suave y tiende a ser duradero. Su textura podría describirse mejor como una ricota firme. No tiende a derretirse por lo que puedes asarlo o colocarlo en la parrilla para comerlo directamente.",
        imageUrl: "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
        salePrice: 43.33,
        maximumAmount: 20,
        isActive: true
    });
    const pineapleCan = await cannedCategory.createProduct({ 
        barCode: "7778889991", 
        name: "Clemente Jacques - Piña en almíbar en rebanadas",
        description: "Es un producto mexicano, que puede disfrutar como postre, guarnición o colación, listo para comer.",
        imageUrl: "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png",
        salePrice: 55.5,
        maximumAmount: 15,
        isActive: true
    });

    await db.Inventory.bulkCreate([
        { idProduct: cheese.id, stock: 24, idStore: store.id, expirationDate: "2024-12-24" },
        { idProduct: milk.id, stock: 60, idStore: store.id, expirationDate: "2024-12-12" },
        { idProduct: pineapleCan.id, stock: 31, idStore: store.id, expirationDate: "2026-08-05" },
    ]);

    const orderStatusSent = await db.OrderStatus.create({
        title: OrderStatus.SENT
    });

    const orderStatusDelivered = await db.OrderStatus.create({
        title: OrderStatus.DELIVERED
    });

    const order = await db.Order.create({
        dateOfPurchase: "2025-01-02", 
        idClient: client.id, 
        idDeliveryAddress: deliveryAddress.id, 
        idPaymentMethod: paymentMethod.id, 
        idStatus: orderStatusSent.id, 
        idDeliveryMan: deliveryMan.id, 
        idStore: store.id
    });

    await db.OrderProduct.bulkCreate([
        { amount: 2, idOrder: order.id, idProduct: cheese.id },
        { amount: 1, idOrder: order.id, idProduct: milk.id },
        { amount: 2, idOrder: order.id, idProduct: pineapleCan.id }
    ]);

    return {
        idDeliveredStatus: orderStatusDelivered.id,
        idOrder: order.id,
        idAdministrator: administrator.id
    }
}

export {
    insertE2ECreateOrderTestData,
    insertE2EGetOrdersToDeliverTestData,
    insertE2EDeliverOrderTestData
}