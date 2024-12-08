import db from "../../models";

async function insertE2ECreatePaymentMethodTestData() {
    const client = await db.Client.create({
        passwordHash: "$2a$10$K.Zod1ZT4A5rzseZo6muBOgDeHdmOMyF3M8o5V6UnKm1VdeQk8l5y1234",
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
        passwordHash: "$2a$10$K.Zod1ZT4A5rzseZo6muBOgDeHdmOMyF3M8o5V6UnKm1VdeQk8l5y1234",
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

async function insertE2EGetPaymentMethodsTestData() {
    try {
        
    } catch (error) {
        console.log(error);
    }
    const client = await db.Client.create({
        passwordHash: "$2a$10$K.Zod1ZT4A5rzseZo6muBOgDeHdmOMyF3M8o5V6UnKm1VdeQk8l5y1234",
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
    await client.createPaymentMethod({
        cardholderName: "Michael Davis",
        expirationMonth: 7,
        expirationYear: 26,
        encryptedCardNumber: "zxcvbnm12345678asdfghj",
        hashedCardNumber: "b28f9e746c3da7b1f72a4ab4e4cb1b438c0d704c557f9b9b7f1e45b8f83d6a26",
        initialVector: "lmn987rst321",
        authenticationTag: "uvw654xyz789",
        isActive: true,
        idIssuer: banamexIssuer.id
    });
    await client.createPaymentMethod({
        cardholderName: "Laura Johnson",
        expirationMonth: 12,
        expirationYear: 28,
        encryptedCardNumber: "qwertyuio1234567hjklzx",
        hashedCardNumber: "5f4dcc3b5aa765d61d8327deb882cf99c4da447df5af96a18b469f7fa9be3b3a",
        initialVector: "abc123def456",
        authenticationTag: "ghi789jkl012",
        isActive: true,
        idIssuer: banamexIssuer.id
    });
    
    return {
        idClient: client.id
    }
}

export { 
    insertE2ECreatePaymentMethodTestData,
    insertE2EDeletePaymentMethodTestData,
    insertE2EGetPaymentMethodsTestData 
};