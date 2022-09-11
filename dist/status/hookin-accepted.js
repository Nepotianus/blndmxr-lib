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
const POD = __importStar(require("../pod"));
const buffutils = __importStar(require("../util/buffutils"));
class HookinAccepted extends abstract_status_1.default {
    consolidationFee;
    // adversaryFee: number;
    constructor(claimableHash, consolidationFee) {
        super(claimableHash);
        this.consolidationFee = consolidationFee;
        // this.adversaryFee = adversaryFee;
    }
    hash() {
        const h = hash_1.default.newBuilder('HookinAccepted');
        h.update(this.claimableHash.buffer);
        h.update(buffutils.fromUint64(this.consolidationFee));
        // h.update(buffutils.fromUint64(this.adversaryFee))
        return h.digest();
    }
    toPOD() {
        return {
            hash: this.hash().toPOD(),
            claimableHash: this.claimableHash.toPOD(),
            consolidationFee: this.consolidationFee,
            // adversaryFee: this.adversaryFee,
        };
    }
    static fromPOD(data) {
        if (typeof data !== 'object') {
            throw new Error('HookinAccepted.fromPOD must take an object');
        }
        const claimableHash = hash_1.default.fromPOD(data.claimableHash);
        if (claimableHash instanceof Error) {
            return claimableHash;
        }
        const consolidationFee = data.consolidationFee;
        if (!POD.isAmount(consolidationFee)) {
            throw new Error('HookinAccepted.fromPOD expected an amount consolidation fee');
        }
        return new HookinAccepted(claimableHash, consolidationFee);
    }
}
exports.default = HookinAccepted;
//# sourceMappingURL=hookin-accepted.js.map