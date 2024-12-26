import db from "../../models";

async function insertE2ECreatePaymentMethodTestData() {
    const client = await db.Client.create({
        passwordHash: "$2b$10$MqRHa10Cw5PzHIu2ihG5suOljpAlcw6i1FQKcyj2pRS2pTGa60ycC",
        birthdate: "1990-05-15",
        fullName: "John Doe",
        phoneNumber: "1234567890"
    });
    const banamexIssuer = await db.Issuer.create({ name: "Banamex"});
    await client.createPaymentMethod({
        cardholderName: "Alice Johnson",
        expirationMonth: 8,
        expirationYear: 26,
        encryptedCardNumber: "7ae8d8a3f88222dcc8fe945b92ab8dfa",
        hashedCardNumber: "$2b$10$oS5dLAVHfj.bBBnDos7oauh.6815C8X7cAG6c15uYx/tr/PcAngQC",
        initialVector: "5c64e9d552b075706f31ced9",
        authenticationTag: "31eef85f50b5ee2b5b6e832d06aa94eb",
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
        passwordHash: "$2b$10$MqRHa10Cw5PzHIu2ihG5suOljpAlcw6i1FQKcyj2pRS2pTGa60ycC",
        birthdate: "1990-05-15",
        fullName: "John Doe",
        phoneNumber: "1234567890"
    });
    const banamexIssuer = await db.Issuer.create({ name: "Banamex"});
    const paymentMethod = await client.createPaymentMethod({
        cardholderName: "Alice Johnson",
        expirationMonth: 8,
        expirationYear: 26,
        encryptedCardNumber: "7ae8d8a3f88222dcc8fe945b92ab8dfa",
        hashedCardNumber: "$2b$10$oS5dLAVHfj.bBBnDos7oauh.6815C8X7cAG6c15uYx/tr/PcAngQC",
        initialVector: "5c64e9d552b075706f31ced9",
        authenticationTag: "31eef85f50b5ee2b5b6e832d06aa94eb",
        isActive: true,
        idIssuer: banamexIssuer.id
    });

    return {
        idClient: client.id,
        idPaymentMethod: paymentMethod.id
    }
}

async function insertE2EGetPaymentMethodsTestData() {
    const client = await db.Client.create({
        passwordHash: "$2b$10$MqRHa10Cw5PzHIu2ihG5suOljpAlcw6i1FQKcyj2pRS2pTGa60ycC",
        birthdate: "1990-05-15",
        fullName: "John Doe",
        phoneNumber: "1234567890"
    });
    const banamexIssuer = await db.Issuer.create({ name: "Banamex"});
    await client.createPaymentMethod({
        cardholderName: "Alice Johnson",
        expirationMonth: 8,
        expirationYear: 26,
        encryptedCardNumber: "7ae8d8a3f88222dcc8fe945b92ab8dfa",
        hashedCardNumber: "$2b$10$oS5dLAVHfj.bBBnDos7oauh.6815C8X7cAG6c15uYx/tr/PcAngQC",
        initialVector: "5c64e9d552b075706f31ced9",
        authenticationTag: "31eef85f50b5ee2b5b6e832d06aa94eb",
        isActive: true,
        idIssuer: banamexIssuer.id
    });
    await client.createPaymentMethod({
        cardholderName: "Michael Davis",
        expirationMonth: 7,
        expirationYear: 26,
        encryptedCardNumber: "a347cc70fb1d80b5376f1da54a87361a",
        hashedCardNumber: "$2b$10$EFGHtQ19Jn6jBiKTBCWpN.joSnez14/DGev6pjmVGVFkI50cBqWom",
        initialVector: "2115da1fb7311dd68e723037",
        authenticationTag: "5c10aa0884f17e9727347a0ef895e5fc",
        isActive: true,
        idIssuer: banamexIssuer.id
    });
    await client.createPaymentMethod({
        cardholderName: "Laura Johnson",
        expirationMonth: 12,
        expirationYear: 28,
        encryptedCardNumber: "0b9779953e3bfc06bcee94ef9a813bc8",
        hashedCardNumber: "$2b$10$mUvA2nwIE7TVDlQ024Wrhe3LeOPBOXO7raa3t2a6PISbNssoemB5e",
        initialVector: "18f3889fb4ca2fed5b0cf58d",
        authenticationTag: "726be28dd251784b6a127b485ad4eb89",
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