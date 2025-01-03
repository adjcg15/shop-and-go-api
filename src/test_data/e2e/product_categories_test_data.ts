import db from "../../models";

async function insertE2EGetProductCategoeriesTestData() {
    await db.ProductCategory.create({ name: "Lacteos", isActive: false });
    await db.ProductCategory.create({ name: "Enlatados", isActive: true });
    await db.ProductCategory.create({ name: "Juguetes", isActive: false });
    await db.ProductCategory.create({ name: "Higiene personal", isActive: true });
    await db.ProductCategory.create({ name: "Productos congelados", isActive: true });
}

async function insertE2EUpdateProductCategoryTestData() {
    const category = await db.ProductCategory.create({ name: "Lacteos", isActive: true });
    
    return {
        idCategory: category.id
    };
}

async function insertE2ECreateProductCategoryTestData() {
    const category = await db.ProductCategory.create({ name: "Lacteos", isActive: true });
    
    return {
        categoryName: category.name
    };
}

export {
    insertE2EGetProductCategoeriesTestData,
    insertE2EUpdateProductCategoryTestData,
    insertE2ECreateProductCategoryTestData
};