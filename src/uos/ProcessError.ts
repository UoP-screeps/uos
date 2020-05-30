export class ProcessError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ProcessError";
    }
}
