import db from "../../models";

async function insertE2EGetProductCategoeriesTestData() {
    await db.ProductCategory.create({ name: "Lacteos", isActive: false });
    await db.ProductCategory.create({ name: "Enlatados", isActive: true });
    await db.ProductCategory.create({ name: "Juguetes", isActive: false });
    await db.ProductCategory.create({ name: "Higiene personal", isActive: true });
    await db.ProductCategory.create({ name: "Productos congelados", isActive: true });
}

export {
    insertE2EGetProductCategoeriesTestData
};