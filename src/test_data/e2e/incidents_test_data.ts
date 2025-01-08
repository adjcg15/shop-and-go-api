import db from "../../models";
import { OrderStatus } from "../../types/enums/order_status";
import UserRoles from "../../types/enums/user_roles";

async function insertE2EGetIncidentsListTestData() {
    const client = await db.Client.create({
        passwordHash: "$2a$12$Hg2zf5PeoguYwtnAm6lwV.B1zhvCj/4C2BywOsJCFlpeD3caSrsi2", 
        birthdate: "1990-05-15", 
        fullName: "Rodrigo Aguilar López", 
        phoneNumber: "2321983692"
    });

    const bank = await db.Issuer.create({ name: "Banamex" });

    const paymentMethod = await db.PaymentMethod.create({
        expirationYear: 27,
        expirationMonth: 9,
        idIssuer: bank.id,
        encryptedCardNumber: "81cc6aa5a713c62b2868497a696792df",
        hashedCardNumber: "$2b$10$NRg2g3uSOU3Bkd4UX8CxZuycUhRzanbB5.PXcP2HKMQf.bN.tbaQe",
        initialVector: "4d2dff177bef48f549c8825a",
        authenticationTag: "6412bed2347c328599ade48f2c1e3526",
        cardholderName: "Juan Carlos Pérez Pérez",
        isActive: true,
        idClient: client.id
    });

    const address = await db.Address.create({
        street: "C Adalberto Tejeda", 
        streetNumber: "403", 
        apartmentNumber: "A",
        neighborhood: "Salvador Díaz Miron", 
        municipality: "Xalapa-Enríquez", 
        city: "Xalapa", 
        postalCode: "91090", 
        state: "Veracruz", 
        latitude: 19.540103, 
        longitude: -96.904000, 
        isActive: true, 
        idClient: client.id
    });

    const store = await db.Store.create({ 
        name: "El zorro Xalapa centro",
        address: "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Xalapa-Enríquez, Ver.",
        openingTime: "07:00:00.00",
        closingTime: "22:00:00.00",
        latitude: 19.528761,
        longitude: -96.922326
    });

    const canceledOrderStatus = await db.OrderStatus.create({
        title: OrderStatus.CANCELED
    });

    const deliveryManPosition = await db.EmployeePosition.create({
        title: UserRoles.DELIVERY_MAN,
    });
    
    await db.Employee.create({
        fullName: "Maria Lopez Perez",
        user: "mlopez1234",
        passwordHash:
            "$2a$12$Hg2zf5PeoguYwtnAm6lwV.B1zhvCj/4C2BywOsJCFlpeD3caSrsi2",
        registrationDate: "2023-01-15",
        isAvailableForWork: true,
        isActive: true,
        idStore: store.id,
        idPosition: deliveryManPosition.id,
    });

    const orders = await db.Order.bulkCreate([
        { dateOfPurchase: "2025-01-06 14:30:00", deliveryDate: null, idClient: client.id, idPaymentMethod: paymentMethod.id, idDeliveryAddress: address.id, idStatus: canceledOrderStatus.id, idStore: store.id, idDeliveryMan: deliveryManPosition.id },
        { dateOfPurchase: "2025-01-05 10:12:00", deliveryDate: null, idClient: client.id, idPaymentMethod: paymentMethod.id, idDeliveryAddress: address.id, idStatus: canceledOrderStatus.id, idStore: store.id, idDeliveryMan: deliveryManPosition.id },
        { dateOfPurchase: "2025-01-02 15:21:00", deliveryDate: null, idClient: client.id, idPaymentMethod: paymentMethod.id, idDeliveryAddress: address.id, idStatus: canceledOrderStatus.id, idStore: store.id, idDeliveryMan: deliveryManPosition.id }
    ]);

    await db.Incident.bulkCreate([
        { creationDate: "2025-01-06 14:54:00", reason: "La espera supero el tiempo límite estipulado", idOrder: orders[0].id },
        { creationDate: "2025-01-05 10:27:00", reason: "Uno de los productos del pedido se dañó", idOrder: orders[1].id },
        { creationDate: "2025-01-02 16:21:00", reason: "No se logró encontrar la dirección de entrega", idOrder: orders[2].id }
    ]);
}

async function insertE2ECreateIncidentTestData() {
    const sentOrderStatus = await db.OrderStatus.create({
        title: OrderStatus.SENT
    });
    await db.OrderStatus.create({
        title: OrderStatus.CANCELED
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

    const deliveryManOwner = await db.Employee.create({
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
    const deliveryMan = await db.Employee.create({
        fullName: "Carlos Torres Perez",
        user: "ctorres",
        passwordHash:
            "$2a$12$Hg2zf5PeoguYwtnAm6lwV.B1zhvCj/4C2BywOsJCFlpeD3caSrsi2",
        registrationDate: "2023-01-29",
        isAvailableForWork: true,
        isActive: true,
        idStore: store.id,
        idPosition: deliveryManPosition.id,
    });

    const order = await db.Order.create({
        dateOfPurchase: "2025-01-02", 
        idClient: client.id, 
        idDeliveryAddress: deliveryAddress.id, 
        idPaymentMethod: paymentMethod.id, 
        idStatus: sentOrderStatus.id, 
        idDeliveryMan: deliveryManOwner.id, 
        idStore: store.id
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

    return {
        idOrder: order.id,
        idDeliveryManOwner: deliveryManOwner.id,
        idDeliveryMan: deliveryMan.id
    }
}

export {
    insertE2EGetIncidentsListTestData,
    insertE2ECreateIncidentTestData
};