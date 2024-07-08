export class DataNotFoundError extends Error {
    constructor() {
        super("data not found");
    }
}