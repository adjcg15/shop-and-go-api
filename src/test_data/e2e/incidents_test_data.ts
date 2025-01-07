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

export {
    insertE2EGetIncidentsListTestData
};