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
exports.decrypt = exports.encrypt = void 0;
const crypto = __importStar(require("crypto"));
const random_1 = __importDefault(require("./random"));
const Buffutils = __importStar(require("./buffutils"));
function encrypt(plainText, key) {
    const iv = (0, random_1.default)(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const start = cipher.update(plainText);
    const end = cipher.final();
    const encrypted = Buffutils.concat(start, end);
    const tag = cipher.getAuthTag();
    return {
        iv,
        tag,
        encrypted,
    };
}
exports.encrypt = encrypt;
function decrypt(payload, key) {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, payload.iv);
    decipher.setAuthTag(payload.tag);
    // encrypt the given text
    const start = decipher.update(payload.encrypted);
    const end = decipher.final();
    return Buffutils.concat(start, end);
}
exports.decrypt = decrypt;
//# sourceMappingURL=aes-gcm.js.map