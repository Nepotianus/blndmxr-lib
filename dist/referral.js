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
const public_key_1 = __importDefault(require("./public-key"));
const POD = __importStar(require("./pod"));
const buffutils = __importStar(require("./util/buffutils"));
class Referral {
    static fromPOD(data) {
        if (typeof data !== 'object') {
            return new Error('referral expected an object');
        }
        const amount = data.amount;
        if (!POD.isAmount(amount)) {
            return new Error('invalid amount for hookin');
        }
        const claimant = public_key_1.default.fromPOD(data.claimant);
        if (claimant instanceof Error) {
            return claimant;
        }
        const claimableHash = hash_1.default.fromPOD(data.claimableHash);
        if (claimableHash instanceof Error) {
            return claimableHash;
        }
        const initCreated = data.initCreated;
        if (initCreated) {
            if (typeof initCreated != 'number') {
                throw initCreated;
            }
        }
        return new Referral(amount, claimant, claimableHash, initCreated);
    }
    // this is the "old" way of building hashes?
    static hashOf(amount, claimant, claimableHash) {
        const b = hash_1.default.newBuilder('Referral');
        b.update(buffutils.fromUint64(amount));
        b.update(claimant.buffer);
        b.update(claimableHash.buffer);
        return b.digest();
    }
    amount;
    claimant;
    claimableHash;
    initCreated;
    constructor(amount, claimant, claimableHash, initCreated) {
        this.amount = amount;
        this.claimant = claimant;
        this.claimableHash = claimableHash;
        this.initCreated = initCreated;
    }
    hash() {
        return Referral.hashOf(this.amount, this.claimant, this.claimableHash);
    }
    get kind() {
        return 'Referral';
    }
    get claimableAmount() {
        // just this.amount as it is only inserted upon accepting a hookin.
        return this.amount;
    }
    toPOD() {
        return {
            hash: this.hash().toPOD(),
            amount: this.amount,
            claimant: this.claimant.toPOD(),
            claimableHash: this.claimableHash.toPOD(),
            initCreated: this.initCreated,
        };
    }
}
exports.default = Referral;
//# sourceMappingURL=referral.js.map