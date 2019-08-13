
export default class Handler {
    constructor(name) {
        this.name = name;
        [
            'newBlock',
            'purgeBlocks',
            'init'
        ].forEach(fn=>this[fn]=this[fn].bind(this))
    }

    async newBlock(ctx, block, next) {
        throw new Error("Must implement a newBlock function")
    }

    async purgeBlocks(ctx, blocks, next) {
        throw new Error("Must implement a purgedBlocks function")
    }

    async init(ctx, next) {
        throw new Error("Must implement an init function");
    }
}