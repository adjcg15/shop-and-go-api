import db from "../../models";

async function insertE2ELoginTestData(){
    await db.Client.create({
        passwordHash: "e28e706c22b1cbefdf3972ff26db7af92181267e45735b00dbdf805080e61f3e",
        birthdate: "1990-05-15",
        fullName: "John Doe",
        phoneNumber: "1234567890"
    });
    const position = await db.EmployeePosition.create({title: "Repartidor"});
    await position.createEmployee({
        fullName: "Rodrigo Aguilar López",
        user: "jamon12345",
        passwordHash: "e7cf3ef4f17c3999a94f2c6f612e8a888e5b1026878e4e19398b23bd38ec221a",
        registrationDate: "2011-07-16",
        isAvailableForWork: true,
        isActive: true
    });
}

export {
    insertE2ELoginTestData
}