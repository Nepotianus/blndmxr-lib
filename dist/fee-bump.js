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
const assert = __importStar(require("./util/assert"));
const abstract_transfer_1 = __importStar(require("./abstract-transfer"));
class FeeBump extends abstract_transfer_1.default {
    static fromPOD(data) {
        const transferData = (0, abstract_transfer_1.parseTransferData)(data);
        if (transferData instanceof Error) {
            throw transferData;
        }
        const txid = Buffutils.fromHex(data.txid, 32);
        if (txid instanceof Error) {
            return new Error('FeeBump.fromPOD invalid txid');
        }
        const confTarget = data.confTarget;
        if (typeof confTarget !== 'number') {
            return new Error('Feebump.frompod invalid conftarget');
        }
        return new FeeBump(transferData, txid, confTarget);
    }
    txid;
    confTarget;
    get kind() {
        return 'FeeBump';
    }
    constructor(transferData, txid, confTarget) {
        super(transferData);
        this.txid = txid;
        assert.equal(txid.length, 32);
        this.txid = txid;
        this.confTarget = confTarget;
    }
    toPOD() {
        return {
            ...super.toPOD(),
            txid: Buffutils.toHex(this.txid),
            confTarget: this.confTarget
        };
    }
    static hashOf(transferHash, txid, confTarget) {
        return hash_1.default.fromMessage('FeeBump', transferHash.buffer, txid, Buffutils.fromUint64(confTarget));
    }
    hash() {
        return FeeBump.hashOf(abstract_transfer_1.default.transferHash(this), this.txid, this.confTarget);
    }
}
exports.default = FeeBump;
//# sourceMappingURL=fee-bump.js.map