import TrustedException from "../TrustedException";

class BusinessLogicException extends TrustedException {
    constructor(message: string) {
        super(message, true);

        this.name = "BusinessLogicException";
        Object.setPrototypeOf(this, BusinessLogicException.prototype);
    }
}

export default BusinessLogicException;