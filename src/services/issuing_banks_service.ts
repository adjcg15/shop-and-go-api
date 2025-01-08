import { InferAttributes } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import Issuer from "../models/Issuer";

async function getIssuingBanks() {
    const issuingBanksList: InferAttributes<Issuer>[] = [];
    try {
        const issuingBanks = await db.Issuer.findAll();

        issuingBanks.forEach(issuingBanks => {
            const issuingBanksInfo = {
                ...issuingBanks!.toJSON()
            }
            issuingBanksList.push(issuingBanksInfo);
        });
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return issuingBanksList;
}

export {
    getIssuingBanks
}