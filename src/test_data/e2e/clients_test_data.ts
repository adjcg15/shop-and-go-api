import db from "../../models";

async function insertE2ECreatePaymentMethodTestData() {
    const client = await db.Client.create({
        passwordHash: "$2a$10$K.Zod1ZT4A5rzseZo6muBOgDeHdmOMyF3M8o5V6UnKm1VdeQk8l5y",
        birthdate: "1990-05-15",
        fullName: "John Doe",
        phoneNumber: "1234567890"
    });
    const banamexIssuer = await db.Issuer.create({ name: "Banamex"});
    await client.createPaymentMethod({
        cardholderName: "Alice Johnson",
        expirationMonth: 8,
        expirationYear: 26,
        encryptedCardNumber: "zxcvbnm12345678asdfghi",
        hashedCardNumber: "a38b7c1f94d0a2e9f8c482ae6cbd34e16e8e91f14a5c9e30b2b3f724d047f34b",
        initialVector: "pqr123lmn456",
        authenticationTag: "ghi789klm456",
        isActive: true,
        idIssuer: banamexIssuer.id
    });

    return {
        idClient: client.id,
        idIssuer: banamexIssuer.id
    }
}

async function insertE2EDeletePaymentMethodTestData() {
    const client = await db.Client.create({
        passwordHash: "$2a$10$K.Zod1ZT4A5rzseZo6muBOgDeHdmOMyF3M8o5V6UnKm1VdeQk8l5y",
        birthdate: "1990-05-15",
        fullName: "John Doe",
        phoneNumber: "1234567890"
    });
    const banamexIssuer = await db.Issuer.create({ name: "Banamex"});
    const paymentMethod = await client.createPaymentMethod({
        cardholderName: "Alice Johnson",
        expirationMonth: 8,
        expirationYear: 26,
        encryptedCardNumber: "zxcvbnm12345678asdfghi",
        hashedCardNumber: "a38b7c1f94d0a2e9f8c482ae6cbd34e16e8e91f14a5c9e30b2b3f724d047f34b",
        initialVector: "pqr123lmn456",
        authenticationTag: "ghi789klm456",
        isActive: true,
        idIssuer: banamexIssuer.id
    });

    return {
        idClient: client.id,
        idPaymentMethod: paymentMethod.id
    }
}

export { 
    insertE2ECreatePaymentMethodTestData,
    insertE2EDeletePaymentMethodTestData 
};