import { Association, CreationOptional, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import PaymentMethod from "./PaymentMethod";
import { IDB } from "../types/interfaces/db";

export default class Issuer extends Model<InferAttributes<Issuer>, InferCreationAttributes<Issuer>> {
    declare id: CreationOptional<number>;
    declare name: string;

    declare paymentMethods?: NonAttribute<PaymentMethod[]>;

    declare getPaymentMethods: HasManyGetAssociationsMixin<PaymentMethod>;
    declare addPaymentMethod: HasManyAddAssociationMixin<PaymentMethod, number>;
    declare addPaymentMethods: HasManyAddAssociationsMixin<PaymentMethod, number>;
    declare setPaymentMethods: HasManySetAssociationsMixin<PaymentMethod, number>;
    declare removePaymentMethod: HasManyRemoveAssociationMixin<PaymentMethod, number>;
    declare removePaymentMethods: HasManyRemoveAssociationsMixin<PaymentMethod, number>;
    declare hasPaymentMethod: HasManyHasAssociationMixin<PaymentMethod, number>;
    declare hasPaymentMethods: HasManyHasAssociationsMixin<PaymentMethod, number>;
    declare countPaymentMethods: HasManyCountAssociationsMixin;
    declare createPaymentMethod: HasManyCreateAssociationMixin<PaymentMethod, "idIssuer">;

    declare static associations: {
        paymentMethods: Association<Issuer, PaymentMethod>;
    };

    static associate(models: IDB) {
        Issuer.hasMany(models.PaymentMethod, {
            foreignKey: "idEmisor",
            as: "paymentMethods"
        });
    }
}