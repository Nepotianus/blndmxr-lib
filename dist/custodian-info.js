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
const public_key_1 = __importDefault(require("./public-key"));
const hash_1 = __importDefault(require("./hash"));
const bech32 = __importStar(require("./util/bech32"));
const Buffutils = __importStar(require("./util/buffutils"));
class CustodianInfo {
    acknowledgementKey;
    currency;
    fundingKey;
    blindCoinKeys; // of 31...
    wipeDate;
    constructor(acknowledgementKey, currency, fundingKey, blindCoinKeys, wipeDate) {
        this.acknowledgementKey = acknowledgementKey;
        this.currency = currency;
        this.fundingKey = fundingKey;
        this.blindCoinKeys = blindCoinKeys;
        this.wipeDate = wipeDate;
    }
    hash() {
        return hash_1.default.fromMessage('Custodian', this.acknowledgementKey.buffer, Buffutils.fromUint32(this.currency.length), Buffutils.fromString(this.currency), ...(this.fundingKey instanceof Array ? this.fundingKey.map(bk => bk.buffer) : [this.fundingKey.buffer]), // can we spread like this?
        ...[].concat(...this.blindCoinKeys.map(bk => bk.map(a => a.buffer))), Buffutils.fromString(this.wipeDate ? this.wipeDate : ''));
    }
    // 4 letter code for using in an Address
    prefix() {
        const hash = this.hash().buffer;
        return (bech32.ALPHABET[hash[0] % 32] +
            bech32.ALPHABET[hash[1] % 32] +
            bech32.ALPHABET[hash[2] % 32] +
            bech32.ALPHABET[hash[3] % 32]);
    }
    // wipeDate now functions as a sort of genesis date
    toPOD() {
        return {
            acknowledgementKey: this.acknowledgementKey.toPOD(),
            currency: this.currency,
            fundingKey: this.fundingKey instanceof Array ? this.fundingKey.map(fk => fk.toPOD()) : this.fundingKey.toPOD(),
            blindCoinKeys: this.blindCoinKeys.map(bk => bk.map(k => k.toPOD())),
            wipeDate: this.wipeDate,
        };
    }
    static fromPOD(d) {
        if (typeof d !== 'object') {
            return new Error('custodian fromPOD expected an object');
        }
        const acknowledgementKey = public_key_1.default.fromPOD(d.acknowledgementKey);
        if (acknowledgementKey instanceof Error) {
            return acknowledgementKey;
        }
        const currency = d.currency;
        if (typeof currency !== 'string') {
            return new Error('custodian expected a stringified currency');
        }
        let fundingKey = [];
        if (Array.isArray(d.fundingKey)) {
            for (const fkstr of d.fundingKey) {
                const fk = public_key_1.default.fromPOD(fkstr);
                if (fk instanceof Error) {
                    return fk;
                }
                fundingKey.push(fk);
            }
        }
        if (!Array.isArray(d.fundingKey)) {
            const fk = public_key_1.default.fromPOD(d.fundingKey);
            if (fk instanceof Error) {
                return fk;
            }
            fundingKey.push(fk);
        }
        if (!Array.isArray(d.blindCoinKeys)) {
            return new Error('needs to be an array');
        }
        const blindCoinKeys = [];
        for (let index = 0; index < d.blindCoinKeys.length; index++) {
            const arr = d.blindCoinKeys[index];
            if (!Array.isArray(arr) || arr.length !== 31) {
                return new Error('custodian expected an 31-length array for blindCoinKeys');
            }
            const bks = [];
            for (const bkstr of arr) {
                const bk = public_key_1.default.fromPOD(bkstr);
                if (bk instanceof Error) {
                    return bk;
                }
                bks.push(bk);
            }
            blindCoinKeys.push(bks);
        }
        // doesn't force a type..
        const wipeDate = d.wipeDate;
        if (wipeDate) {
            if (typeof wipeDate !== 'string') {
                return new Error('Invalid format used for the date.');
            }
        }
        return new CustodianInfo(acknowledgementKey, currency, fundingKey.length > 1 ? fundingKey : fundingKey[0], blindCoinKeys, wipeDate);
    }
}
exports.default = CustodianInfo;
//# sourceMappingURL=custodian-info.js.map