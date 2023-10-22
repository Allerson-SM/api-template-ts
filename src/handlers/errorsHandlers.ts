class BodyNotProvidedError extends Error {
    constructor() {
        super("Body not provided");
        this.name = "BodyNotProvidedError";
    }
}

export {
    BodyNotProvidedError
}