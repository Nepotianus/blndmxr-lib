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
exports.parseTransferData = void 0;
const assert_1 = __importDefault(require("./util/assert"));
const hash_1 = __importDefault(require("./hash"));
const signature_1 = __importDefault(require("./signature"));
const POD = __importStar(require("./pod"));
const coin_1 = __importDefault(require("./coin"));
const public_key_1 = __importDefault(require("./public-key"));
const buffutils = __importStar(require("./util/buffutils"));
class AbstractTransfer {
    amount;
    inputs;
    fee;
    decay; // this is not checked by primitives, custodian should verify like fee and auth of coin
    authorization;
    initCreated;
    constructor({ amount, authorization, fee, decay, inputs, initCreated }) {
        this.amount = amount;
        this.authorization = authorization;
        this.fee = fee;
        this.decay = decay;
        this.initCreated = initCreated;
        (0, assert_1.default)(isHashSorted(inputs));
        this.inputs = inputs;
    }
    static sort(hashable) {
        hashable.sort((a, b) => buffutils.compare(a.hash().buffer, b.hash().buffer));
    }
    static sortHashes(hashes) {
        hashes.sort((a, b) => buffutils.compare(a.buffer, b.buffer));
    }
    static transferHash(td) {
        return hash_1.default.fromMessage('Transfer', buffutils.fromUint64(td.amount), buffutils.fromUint64(td.fee), buffutils.fromUint64(td.decay), buffutils.fromUint64(td.inputs.length), ...td.inputs.map(i => i.buffer));
    }
    toPOD() {
        return {
            hash: this.hash().toPOD(),
            amount: this.amount,
            authorization: this.authorization ? this.authorization.toPOD() : null,
            claimant: this.claimant.toPOD(),
            fee: this.fee,
            decay: this.decay,
            inputs: this.inputs.map(i => i.toPOD()),
            initCreated: this.initCreated,
        };
    }
    get claimableAmount() {
        return this.inputAmount() - this.amount - this.fee - this.decay;
    }
    inputAmount() {
        let amount = 0;
        for (const coin of this.inputs) {
            amount += coin.amount;
        }
        return amount;
    }
    get claimant() {
        return public_key_1.default.combine(this.inputs.map(coin => coin.owner));
    }
    isAuthorized() {
        if (!this.authorization) {
            return false;
        }
        const msg = hash_1.default.fromMessage('authorization', this.hash().buffer).buffer;
        return this.authorization.verify(msg, this.claimant);
    }
    authorize(combinedInputPrivkey) {
        this.authorization = signature_1.default.compute(hash_1.default.fromMessage('authorization', this.hash().buffer).buffer, combinedInputPrivkey);
    }
}
exports.default = AbstractTransfer;
function parseTransferData(data) {
    if (typeof data !== 'object') {
        return new Error('expected an object to deserialize a Transfer');
    }
    const amount = data.amount;
    if (!POD.isAmount(amount)) {
        return new Error('Transfer.fromPOD invalid amount');
    }
    const authorization = data.authorization !== null ? signature_1.default.fromPOD(data.authorization) : undefined;
    if (authorization instanceof Error) {
        return authorization;
    }
    const fee = data.fee;
    if (!POD.isAmount(fee)) {
        return new Error('Transfer.fromPOD invalid fee');
    }
    const decay = data.decay;
    if (!POD.isAmount(decay)) {
        return new Error('Transfer.fromPOD invalid decay');
    }
    let inputAmount = 0;
    const inputs = [];
    for (const i of data.inputs) {
        const input = coin_1.default.fromPOD(i);
        if (input instanceof Error) {
            return input;
        }
        inputAmount += input.amount;
        inputs.push(input);
    }
    if (!isHashSorted(inputs)) {
        return new Error('inputs are not in sorted order');
    }
    if (inputAmount < amount + fee + decay) {
        return new Error('not sourcing enough input for amount and fee and decay');
    }
    const initCreated = data.initCreated;
    if (initCreated) {
        if (typeof initCreated != 'number') {
            throw initCreated;
        }
    }
    return { amount, authorization, fee, decay, inputs, initCreated };
}
exports.parseTransferData = parseTransferData;
function isHashSorted(ts) {
    for (let i = 1; i < ts.length; i++) {
        const c = buffutils.compare(ts[i - 1].hash().buffer, ts[i].hash().buffer);
        if (c > 0) {
            return false;
        }
    }
    return true;
}
function isSorted(ts) {
    for (let i = 1; i < ts.length; i++) {
        const c = buffutils.compare(ts[i - 1].buffer, ts[i].buffer);
        if (c > 0) {
            return false;
        }
    }
    return true;
}
// TODO: these sort can be optimized to check if it's already sorted, if so, just return original
function hashSort(ts) {
    return [...ts].sort((a, b) => buffutils.compare(a.hash().buffer, b.hash().buffer));
}
function sort(ts) {
    return [...ts].sort((a, b) => buffutils.compare(a.buffer, b.buffer));
}
//# sourceMappingURL=abstract-transfer.js.map