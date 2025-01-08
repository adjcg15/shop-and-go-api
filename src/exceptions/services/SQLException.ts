import TrustedException from "../TrustedException";

class SQLException extends TrustedException {
    constructor(error: any, fallbackMessage?: string) {
        const errorCode = error?.code ? `Error ${error.code}` : "";
        const details = `${error?.message}` || fallbackMessage || "It was not possible to complete an operation in database";
        const message = errorCode ? `${errorCode}: ${details}` : details;

        super(message, false);

        this.name = "SQLException";
        Object.setPrototypeOf(this, SQLException.prototype);
    }
}

export default SQLException;