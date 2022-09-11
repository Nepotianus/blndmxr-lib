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
const abstract_status_1 = __importDefault(require("./abstract-status"));
const hash_1 = __importDefault(require("../hash"));
const buffutils = __importStar(require("../util/buffutils"));
const POD = __importStar(require("../pod"));
class InvoiceSettled extends abstract_status_1.default {
    amount; // settlement amount
    rPreimage; // hex
    time; // settlement time
    constructor(claimableHash, amount, rPreimage, time) {
        super(claimableHash);
        this.amount = amount;
        this.rPreimage = rPreimage;
        this.time = time;
    }
    hash() {
        return hash_1.default.fromMessage('InvoiceSettled', this.buffer, buffutils.fromUint64(this.amount), this.rPreimage, buffutils.fromUint64(this.time.getTime()));
    }
    toPOD() {
        return {
            hash: this.hash().toPOD(),
            claimableHash: this.claimableHash.toPOD(),
            amount: this.amount,
            rPreimage: buffutils.toHex(this.rPreimage),
            time: this.time.toISOString(),
        };
    }
    static fromPOD(obj) {
        if (typeof obj !== 'object') {
            return new Error('InvoiceSettled.fromPOD expected an object');
        }
        const claimableHash = hash_1.default.fromPOD(obj.claimableHash);
        if (claimableHash instanceof Error) {
            return claimableHash;
        }
        const amount = obj.amount;
        if (!POD.isAmount(amount)) {
            return new Error('InvoiceSettled.fromPOD expected a valid amount');
        }
        const rPreimage = buffutils.fromHex(obj.rPreimage, 32);
        if (rPreimage instanceof Error) {
            return rPreimage;
        }
        const ms = Date.parse(obj.time);
        if (!Number.isFinite(ms)) {
            return new Error('InvoiceSettled.fromPOD expected a valid time');
        }
        const time = new Date(ms);
        if (time.toISOString() !== obj.time) {
            // canonical check...
            return new Error('InvoiceSettled.fromPOD got a strangely formatted time');
        }
        return new InvoiceSettled(claimableHash, amount, rPreimage, time);
    }
}
exports.default = InvoiceSettled;
//# sourceMappingURL=invoice-settled.js.map