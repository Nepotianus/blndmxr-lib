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
Object.defineProperty(exports, "__esModule", { value: true });
const bech32 = __importStar(require("./util/bech32"));
const ecc = __importStar(require("./util/ecc/index"));
const serializedPrefix = 'bmmp'; // blinded message blindmixer
class BlindedMessage {
    static fromPOD(data) {
        if (typeof data !== 'string') {
            return new Error('BlindedMessage.fromPOD expected a string');
        }
        const { prefix, words } = bech32.decode(data);
        if (prefix !== serializedPrefix) {
            return new Error('Got prefix: ' + prefix + ' but expected ' + serializedPrefix);
        }
        return BlindedMessage.fromBytes(bech32.fromWords(words));
    }
    static fromBytes(bytes) {
        const c = ecc.Scalar.fromBytes(bytes);
        if (c instanceof Error) {
            return c;
        }
        return new BlindedMessage(c);
    }
    c;
    constructor(challenge) {
        this.c = challenge;
    }
    get buffer() {
        return ecc.Scalar.toBytes(this.c);
    }
    toPOD() {
        return bech32.encode(serializedPrefix, bech32.toWords(this.buffer));
    }
}
exports.default = BlindedMessage;
//# sourceMappingURL=blinded-message.js.map