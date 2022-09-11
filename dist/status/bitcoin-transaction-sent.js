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
class BitcoinTransactionSent extends abstract_status_1.default {
    txid;
    constructor(claimableHash, txid) {
        super(claimableHash);
        this.txid = txid;
    }
    hash() {
        return hash_1.default.fromMessage('BitcoinTransactionSent', this.buffer, this.txid);
    }
    toPOD() {
        return {
            hash: this.hash().toPOD(),
            claimableHash: this.claimableHash.toPOD(),
            txid: buffutils.toHex(this.txid),
        };
    }
    static fromPOD(obj) {
        if (typeof obj !== 'object') {
            return new Error('BitcoinTransactionSent.fromPOD expected an object');
        }
        const claimableHash = hash_1.default.fromPOD(obj.claimableHash);
        if (claimableHash instanceof Error) {
            return claimableHash;
        }
        const txid = buffutils.fromHex(obj.txid, 32);
        if (txid instanceof Error) {
            return txid;
        }
        return new BitcoinTransactionSent(claimableHash, txid);
    }
}
exports.default = BitcoinTransactionSent;
//# sourceMappingURL=bitcoin-transaction-sent.js.map