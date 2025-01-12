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
const blinded_message_1 = __importDefault(require("./blinded-message"));
const hash_1 = __importDefault(require("./hash"));
const public_key_1 = __importDefault(require("./public-key"));
const signature_1 = __importDefault(require("./signature"));
const POD = __importStar(require("./pod"));
const magnitude_1 = __importDefault(require("./magnitude"));
const buffutils = __importStar(require("./util/buffutils"));
class ClaimRequest {
    static newAuthorized(claimableHash, coinRequests, claimantPrivateKey, fee, // TODO: this field is actually not really used 
    coinPeriod) {
        const hash = ClaimRequest.hashOf(claimableHash, coinRequests, fee, coinPeriod);
        const authorization = signature_1.default.compute(hash.buffer, claimantPrivateKey);
        return new ClaimRequest(claimableHash, coinRequests, authorization, fee, coinPeriod);
    }
    static fromPOD(data) {
        if (typeof data !== 'object') {
            return new Error('ClaimRequest.fromPOD expected an object');
        }
        const claimableHash = hash_1.default.fromPOD(data.claimableHash);
        if (claimableHash instanceof Error) {
            return claimableHash;
        }
        if (!Array.isArray(data.coinRequests)) {
            return new Error('ClaimRequest.fromPOD expected an array for coinRequests');
        }
        const coinRequests = [];
        for (const coin of data.coinRequests) {
            const blindingNonce = public_key_1.default.fromPOD(coin.blindingNonce);
            if (blindingNonce instanceof Error) {
                return blindingNonce;
            }
            const blindedOwner = blinded_message_1.default.fromPOD(coin.blindedOwner);
            if (blindedOwner instanceof Error) {
                return blindedOwner;
            }
            const magnitude = magnitude_1.default.fromPOD(coin.magnitude);
            if (magnitude instanceof Error) {
                return magnitude;
            }
            coinRequests.push({ blindingNonce, blindedOwner, magnitude });
        }
        const authorization = signature_1.default.fromPOD(data.authorization);
        if (authorization instanceof Error) {
            return authorization;
        }
        const fee = data.fee;
        if (!POD.isAmount(fee)) {
            return new Error(`${fee} is not a number.`);
        }
        const coinPeriod = data.coinPeriod;
        if (!POD.isAmount(coinPeriod)) {
            return new Error(`${coinPeriod} is not a number.`);
        }
        return new ClaimRequest(claimableHash, coinRequests, authorization, fee, coinPeriod);
    }
    claimableHash;
    coinRequests;
    authorization;
    fee;
    coinPeriod;
    constructor(claimableHash, coinRequests, authorization, fee, coinPeriod) {
        this.claimableHash = claimableHash;
        this.coinRequests = coinRequests;
        this.authorization = authorization;
        this.fee = fee;
        this.coinPeriod = coinPeriod;
    }
    static hashOf(claimableHash, coinRequests, fee, coinPeriod) {
        const h = hash_1.default.newBuilder('ClaimRequest');
        h.update(claimableHash.buffer);
        for (const cc of coinRequests) {
            h.update(cc.blindedOwner.buffer);
            h.update(cc.blindingNonce.buffer);
            h.update(cc.magnitude.buffer);
        }
        h.update(buffutils.fromUint64(coinPeriod));
        h.update(buffutils.fromUint64(fee));
        return h.digest();
    }
    hash() {
        return ClaimRequest.hashOf(this.claimableHash, this.coinRequests, this.fee, this.coinPeriod);
    }
    toPOD() {
        return {
            hash: this.hash().toPOD(),
            authorization: this.authorization.toPOD(),
            claimableHash: this.claimableHash.toPOD(),
            coinRequests: this.coinRequests.map(cr => ({
                blindedOwner: cr.blindedOwner.toPOD(),
                blindingNonce: cr.blindingNonce.toPOD(),
                magnitude: cr.magnitude.toPOD(),
            })),
            fee: this.fee,
            coinPeriod: this.coinPeriod
        };
    }
    // how much is being claimed
    amount() {
        let n = this.fee;
        for (const coinRequest of this.coinRequests) {
            n += coinRequest.magnitude.toAmount();
        }
        return n;
    }
}
exports.default = ClaimRequest;
//# sourceMappingURL=claim-request.js.map