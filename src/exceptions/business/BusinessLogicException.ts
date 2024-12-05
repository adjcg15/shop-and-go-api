import TrustedException from "../TrustedException";

class BusinessLogicException extends TrustedException {
    public errorCode?: string;

    constructor(message: string, errorCode?: string) {
        super(message, true);
        this.errorCode = errorCode;

        this.name = "BusinessLogicException";
        Object.setPrototypeOf(this, BusinessLogicException.prototype);
    }
}

export default BusinessLogicException;