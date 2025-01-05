import db from "../../models";
import UserRoles from "../../types/enums/user_roles";

async function insertE2ECreateEmployeeTestData() {
    const store = await db.Store.create({
        name: "El zorro Xalapa centro",
        address: "Dr. Rafael Lucio 28, Zona Centro, Centro, 91000 Xalapa-Enríquez, Ver.",
        openingTime: "07:00:00.00",
        closingTime: "22:00:00.00",
        latitude: 19.528761,
        longitude: -96.922326
    });

    const administratorPosition = await db.EmployeePosition.create({
        title: UserRoles.ADMINISTRATOR,
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
        idPosition: administratorPosition.id,
    });

    return {
        idStore: store.id,
        idPosition: deliveryManPosition.id,
    };
}

export {
    insertE2ECreateEmployeeTestData,
}