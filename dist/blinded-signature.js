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
const assert = __importStar(require("./util/assert"));
const ecc = __importStar(require("./util/ecc"));
const bech32 = __importStar(require("./util/bech32"));
const serializedPrefix = 'bsmp'; // blinded signature blindmixer
class BlindedSignature {
    static fromPOD(data) {
        if (typeof data !== 'string') {
            return new Error('BlindedSignature.fromPOD expected a string');
        }
        const { prefix, words } = bech32.decode(data);
        if (prefix !== serializedPrefix) {
            return new Error('Got prefix: ' + prefix + ' but expected ' + serializedPrefix);
        }
        return BlindedSignature.fromBytes(bech32.fromWords(words));
    }
    static fromBytes(bytes) {
        assert.equal(bytes.length, 32);
        const s = ecc.Scalar.fromBytes(bytes);
        if (s instanceof Error) {
            return s;
        }
        return new BlindedSignature(s);
    }
    s;
    constructor(s) {
        this.s = s;
    }
    verify(nonce, message, signer) {
        return ecc.blindVerify(this.s, nonce, message, signer);
    }
    get buffer() {
        return ecc.Scalar.toBytes(this.s);
    }
    toPOD() {
        return bech32.encode(serializedPrefix, bech32.toWords(this.buffer));
    }
}
exports.default = BlindedSignature;
//# sourceMappingURL=blinded-signature.js.map