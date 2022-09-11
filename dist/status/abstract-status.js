"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractStatus {
    claimableHash;
    constructor(claimableHash) {
        this.claimableHash = claimableHash;
    }
    get buffer() {
        return this.claimableHash.buffer;
    }
}
exports.default = AbstractStatus;
//# sourceMappingURL=abstract-status.js.map