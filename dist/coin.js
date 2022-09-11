"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = __importDefault(require("./hash"));
const POD = __importStar(require("./pod"));
const public_key_1 = __importDefault(require("./public-key"));
const signature_1 = __importDefault(require("./signature"));
const magnitude_1 = __importDefault(require("./magnitude"));
const Buffutils = __importStar(require("./util/buffutils"));
class Coin {
    static fromPOD(data) {
        const owner = public_key_1.default.fromPOD(data.owner);
        if (owner instanceof Error) {
            return owner;
        }
        const magnitude = magnitude_1.default.fromPOD(data.magnitude);
        if (magnitude instanceof Error) {
            return magnitude;
        }
        const receipt = signature_1.default.fromPOD(data.receipt);
        if (receipt instanceof Error) {
            return receipt;
        }
        const period = data.period;
        if (!POD.isAmount(data.period)) {
            return new Error('Coin.fromPOD invalid number');
        }
        const c = new Coin(owner, magnitude, receipt, period);
        if (c.hash().toPOD() !== data.hash) {
            return new Error('hash did not match');
        }
        return c;
    }
    owner;
    magnitude;
    receipt;
    period;
    constructor(owner, magnitude, receipt, period) {
        this.owner = owner;
        this.magnitude = magnitude;
        this.receipt = receipt;
        this.period = period;
    }
    get buffer() {
        return Buffutils.concat(this.owner.buffer, this.magnitude.buffer, this.receipt.buffer, Buffutils.fromUint64(this.period));
    }
    hash() {
        return hash_1.default.fromMessage('Coin', this.buffer);
    }
    toPOD() {
        return {
            hash: this.hash().toPOD(),
            receipt: this.receipt.toPOD(),
            magnitude: this.magnitude.toPOD(),
            owner: this.owner.toPOD(),
            period: this.period
        };
    }
    get amount() {
        return this.magnitude.toAmount();
    }
}
exports.default = Coin;
//# sourceMappingURL=coin.js.map