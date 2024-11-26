import TrustedException from "../trusted_exception";

class BusinessLogicException extends TrustedException {
    constructor(message: string) {
        super(message, true);

        this.name = "BusinessLogicException";
        Object.setPrototypeOf(this, BusinessLogicException.prototype);
    }
}

export default BusinessLogicException;