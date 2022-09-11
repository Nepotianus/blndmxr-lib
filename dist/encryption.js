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
exports.decrypt = exports.encryptToPublicKey = void 0;
const hash_1 = __importDefault(require("./hash"));
const ecc = __importStar(require("./util/ecc"));
const aes = __importStar(require("./util/aes-gcm"));
function encryptToPublicKey(message, ourPriv, theirPub) {
    const sharedPoint = ecc.pointMultiply(theirPub, ourPriv.scalar);
    const sharedSecret = hash_1.default.fromMessage('sharedSecret', ecc.Point.toBytes(sharedPoint)).buffer;
    return aes.encrypt(message, sharedSecret);
}
exports.encryptToPublicKey = encryptToPublicKey;
function decrypt(payload, ourPriv, theirPub) {
    const sharedPoint = ecc.pointMultiply(theirPub, ourPriv.scalar);
    const sharedSecret = hash_1.default.fromMessage('sharedSecret', ecc.Point.toBytes(sharedPoint)).buffer;
    return aes.decrypt(payload, sharedSecret);
}
exports.decrypt = decrypt;
//# sourceMappingURL=encryption.js.map