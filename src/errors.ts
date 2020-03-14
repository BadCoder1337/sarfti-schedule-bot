export class NamedError extends Error {
    constructor(msg?: string) {
        super(msg);
        this.name = this.constructor.name;
    }
}

export class UnknownError extends NamedError {}

export class IncorrectHTMLError extends NamedError {}
