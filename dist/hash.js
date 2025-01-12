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
const assert = __importStar(require("./util/assert"));
const bech32 = __importStar(require("./util/bech32"));
const sha256_1 = __importDefault(require("./util/bcrypto/sha256"));
const Buffutil = __importStar(require("./util/buffutils"));
const serializedPrefix = 'hsmp'; // hash blindmixer
class Hash {
    // actually hashes a message(s)
    static fromMessage(prefix, ...message) {
        const buff = sha256_1.default.mac(Buffutil.fromString(prefix), Buffutil.concat(...message));
        return new Hash(buff);
    }
    static newBuilder(prefix) {
        // this can be optimized later:
        const parts = [];
        return new (class {
            update(message) {
                parts.push(message);
            }
            digest() {
                return Hash.fromMessage(prefix, ...parts);
            }
        })();
    }
    static fromPOD(data) {
        if (typeof data !== 'string') {
            return new Error('Hash.fromPOD expected string');
        }
        const { prefix, words } = bech32.decode(data);
        if (prefix !== serializedPrefix) {
            return new Error('hash.fromPOD expected prefix: ' + serializedPrefix + ' but got ' + prefix);
        }
        const bytes = bech32.fromWords(words);
        return new Hash(bytes);
    }
    buffer;
    constructor(buff) {
        assert.equal(buff.length, 32);
        this.buffer = buff;
    }
    toPOD() {
        const words = bech32.toWords(this.buffer);
        return bech32.encode(serializedPrefix, words);
    }
}
exports.default = Hash;
//# sourceMappingURL=hash.js.map