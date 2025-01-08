import db from "../../models";

async function insertE2ELoginTestData(){
    await db.Client.create({
        passwordHash: "$2b$10$MqRHa10Cw5PzHIu2ihG5suOljpAlcw6i1FQKcyj2pRS2pTGa60ycC",
        birthdate: "1990-05-15",
        fullName: "John Doe",
        phoneNumber: "1234567890"
    });
    const position = await db.EmployeePosition.create({title: "Repartidor"});
    await position.createEmployee({
        fullName: "Rodrigo Aguilar López",
        user: "jamon12345",
        passwordHash: "$2b$10$MqRHa10Cw5PzHIu2ihG5suOljpAlcw6i1FQKcyj2pRS2pTGa60ycC",
        registrationDate: "2011-07-16",
        isAvailableForWork: true,
        isActive: true
    });
}

async function insertE2EgetUserProfileTestData(){
    await db.Client.create({
        passwordHash: "$2b$10$MqRHa10Cw5PzHIu2ihG5suOljpAlcw6i1FQKcyj2pRS2pTGa60ycC",
        birthdate: "1990-05-15",
        fullName: "John Doe",
        phoneNumber: "1234567890"
    });
    const position = await db.EmployeePosition.create({title: "Repartidor"});
    await position.createEmployee({
        fullName: "Rodrigo Aguilar López",
        user: "jamon12345",
        passwordHash: "$2b$10$MqRHa10Cw5PzHIu2ihG5suOljpAlcw6i1FQKcyj2pRS2pTGa60ycC",
        registrationDate: "2011-07-16",
        isAvailableForWork: true,
        isActive: true
    });
}

export {
    insertE2ELoginTestData,
    insertE2EgetUserProfileTestData
}