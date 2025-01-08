import { Association, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize"
import Order from "./Order";
import { IDB } from "../types/interfaces/db";

export default class Incident extends Model<InferAttributes<Incident>, InferCreationAttributes<Incident>> {
    declare id: CreationOptional<number>;
    declare creationDate: string;
    declare reason: string;

    declare idOrder: ForeignKey<Order["id"]>;
    declare order?: NonAttribute<Order>;

    declare static associations: {
        order: Association<Incident, Order>;
    };

    static associate(models: IDB) {
        Incident.belongsTo(models.Order, {
            foreignKey: "idPedido",
            as: "order"
        });
    }
}