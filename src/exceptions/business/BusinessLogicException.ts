import { HttpStatusCodes } from "../../types/enums/http";
import TrustedException from "../TrustedException";

class BusinessLogicException extends TrustedException {
    public errorCode?: string;
    public httpCode?: HttpStatusCodes;

    constructor(message: string, errorCode?: string, httpCode?: HttpStatusCodes) {
        super(message, true);
        this.errorCode = errorCode;
        this.httpCode = httpCode;

        this.name = "BusinessLogicException";
        Object.setPrototypeOf(this, BusinessLogicException.prototype);
    }
}

export default BusinessLogicException;