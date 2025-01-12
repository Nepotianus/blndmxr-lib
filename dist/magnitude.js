"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Magnitude {
    static MaxMagnitude = 30;
    static fromPOD(d) {
        if (!Number.isSafeInteger(d) || d < 0 || d > 30) {
            return new Error('magnitude expected an integer between 0 and 0');
        }
        return new Magnitude(d);
    }
    n;
    constructor(n) {
        if (n < 0 || n > 30 || !Number.isInteger(n)) {
            throw new Error('assertion: magnitude must be between 0 and 30');
        }
        this.n = n;
    }
    toAmount() {
        return 2 ** this.n;
    }
    get buffer() {
        return Uint8Array.of(this.n);
    }
    toPOD() {
        return this.n;
    }
}
exports.default = Magnitude;
//# sourceMappingURL=magnitude.js.map