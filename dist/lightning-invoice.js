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
const buffutils = __importStar(require("./util/buffutils"));
class LightningInvoice {
    claimant;
    paymentRequest;
    initCreated;
    constructor(claimant, paymentRequest, initCreated) {
        this.claimant = claimant;
        this.paymentRequest = paymentRequest;
        this.initCreated = initCreated;
    }
    hash() {
        return hash_1.default.fromMessage('LightningInvoice', this.claimant.buffer, buffutils.fromString(this.paymentRequest));
    }
    toPOD() {
        return {
            hash: this.hash().toPOD(),
            claimant: this.claimant.toPOD(),
            paymentRequest: this.paymentRequest,
            initCreated: this.initCreated,
        };
    }
    get fee() {
        return 0;
    }
    get amount() {
        return 0;
    }
    get claimableAmount() {
        return 0;
    }
    get kind() {
        return 'LightningInvoice';
    }
    static fromPOD(data) {
        if (typeof data !== 'object') {
            return new Error('LightningInvoice.fromPOD expected an object');
        }
        // should we use bolt11 to validate the payment request?
        const claimant = public_key_1.default.fromPOD(data.claimant);
        if (claimant instanceof Error) {
            return new Error('lightninginvoice needs a publickey claimant');
        }
        const paymentRequest = data.paymentRequest;
        if (typeof paymentRequest !== 'string' || !paymentRequest.startsWith('ln')) {
            return new Error('expected valid payment request for lightninginvoice');
        }
        const initCreated = data.initCreated;
        if (initCreated) {
            if (typeof initCreated != 'number') {
                throw initCreated;
            }
        }
        return new LightningInvoice(claimant, paymentRequest, initCreated);
    }
}
exports.default = LightningInvoice;
//# sourceMappingURL=lightning-invoice.js.map