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
const private_key_1 = __importDefault(require("./private-key"));
const public_key_1 = __importDefault(require("./public-key"));
const POD = __importStar(require("./pod"));
const buffutils = __importStar(require("./util/buffutils"));
class Hookin {
    static fromPOD(data) {
        if (typeof data !== 'object') {
            return new Error('hookin expected an object');
        }
        const txid = buffutils.fromHex(data.txid, 32);
        if (txid instanceof Error) {
            return txid;
        }
        const vout = data.vout;
        if (!Number.isSafeInteger(vout) || vout < 0 || vout > 65536) {
            return new Error('hookin was given an invalid vout');
        }
        const amount = data.amount;
        if (!POD.isAmount(amount)) {
            return new Error('invalid amount for hookin');
        }
        const claimant = public_key_1.default.fromPOD(data.claimant);
        if (claimant instanceof Error) {
            return claimant;
        }
        const bitcoinAddress = data.bitcoinAddress;
        if (typeof bitcoinAddress !== 'string') {
            return new Error('hookin expected a bitcoin address');
        }
        let referral = data.referral;
        if (referral) {
            if (typeof referral != 'string') {
                throw referral;
            }
            referral = public_key_1.default.fromPOD(referral);
            if (referral instanceof Error) {
                return referral;
            }
        }
        const initCreated = data.initCreated;
        if (initCreated) {
            if (typeof initCreated != 'number') {
                throw initCreated;
            }
        }
        return new Hookin(txid, vout, amount, claimant, bitcoinAddress, referral, initCreated);
    }
    static hashOf(txid, vout, amount, claimant, bitcoinAddress, referral) {
        const b = hash_1.default.newBuilder('Hookin');
        b.update(txid);
        b.update(buffutils.fromUint32(vout));
        b.update(buffutils.fromUint64(amount));
        b.update(claimant.buffer);
        b.update(buffutils.fromString(bitcoinAddress));
        if (referral) {
            b.update(referral.buffer);
        }
        return b.digest();
    }
    txid;
    vout;
    amount;
    claimant;
    bitcoinAddress;
    referral;
    initCreated;
    constructor(txid, vout, amount, claimant, bitcoinAddress, referral, initCreated) {
        this.txid = txid;
        this.vout = vout;
        this.amount = amount;
        this.claimant = claimant;
        this.bitcoinAddress = bitcoinAddress;
        this.referral = referral;
        this.initCreated = initCreated;
    }
    hash() {
        return Hookin.hashOf(this.txid, this.vout, this.amount, this.claimant, this.bitcoinAddress, this.referral);
    }
    get kind() {
        return 'Hookin';
    }
    get claimableAmount() {
        // a hookin by itself has no claimable value, it's only after we have some status updates for it being sufficiently confirmed
        return 0;
    }
    getTweak() {
        const bytes = hash_1.default.fromMessage('tweak', this.claimant.buffer).buffer;
        const pk = private_key_1.default.fromBytes(bytes);
        if (pk instanceof Error) {
            throw pk;
        }
        return pk;
    }
    toPOD() {
        return {
            hash: this.hash().toPOD(),
            amount: this.amount,
            claimant: this.claimant.toPOD(),
            txid: buffutils.toHex(this.txid),
            vout: this.vout,
            bitcoinAddress: this.bitcoinAddress,
            referral: this.referral ? this.referral.toPOD() : undefined,
            initCreated: this.initCreated,
        };
    }
}
exports.default = Hookin;
//# sourceMappingURL=hookin.js.map