class TrustedException extends Error {
    public isTrusted = true;
    public businessLogicError: boolean;

    constructor(message: string, businessLogicError: boolean) {
        super(message);
        this.businessLogicError = businessLogicError;

        this.name = "TrustedException";
        Object.setPrototypeOf(this, TrustedException.prototype);
    }
}

export default TrustedException;