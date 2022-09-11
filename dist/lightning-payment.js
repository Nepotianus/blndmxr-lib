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
const Buffutils = __importStar(require("./util/buffutils"));
const hash_1 = __importDefault(require("./hash"));
const bolt11 = __importStar(require("./bolt11"));
const abstract_transfer_1 = __importStar(require("./abstract-transfer"));
class LightningPayment extends abstract_transfer_1.default {
    static fromPOD(data) {
        const transferData = (0, abstract_transfer_1.parseTransferData)(data);
        if (transferData instanceof Error) {
            return transferData;
        }
        try {
            return new LightningPayment(transferData, data.paymentRequest);
        }
        catch (err) {
            return new Error(err);
        }
    }
    paymentRequest;
    get kind() {
        return 'LightningPayment';
    }
    constructor(transferData, paymentRequest) {
        super(transferData);
        this.paymentRequest = paymentRequest;
        let pro = bolt11.decodeBolt11(paymentRequest);
        if (pro instanceof Error) {
            throw 'invalid bolt11 invoice: ' + pro.message;
        }
        if (pro.satoshis && pro.satoshis !== transferData.amount) {
            throw 'amount does not match invoice amount';
        }
    }
    toPOD() {
        return {
            ...super.toPOD(),
            paymentRequest: this.paymentRequest,
        };
    }
    static hashOf(transferDataHash, paymentRequest) {
        return hash_1.default.fromMessage('LightningPayment', transferDataHash.buffer, Buffutils.fromString(paymentRequest));
    }
    hash() {
        return LightningPayment.hashOf(abstract_transfer_1.default.transferHash(this), this.paymentRequest);
    }
}
exports.default = LightningPayment;
//# sourceMappingURL=lightning-payment.js.map