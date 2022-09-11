"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blindVerify = exports.unblind = exports.blindSign = exports.blindMessage = void 0;
const elliptic_1 = require("./elliptic");
const sha256_1 = __importDefault(require("../bcrypto/sha256"));
const util_1 = require("./util");
function blindMessage(secret, nonce, signer, message) {
    const R = nonce;
    const P = signer;
    const alpha = (0, util_1.bufferToBigInt)(sha256_1.default.mac((0, util_1.utf8ToBuffer)('alpha'), (0, util_1.concatBuffers)(secret, (0, util_1.pointToBuffer)(nonce), (0, util_1.pointToBuffer)(signer), message)));
    // spin beta until we find quadratic residue
    let retry = 0;
    let beta;
    let RPrime;
    while (true) {
        beta = (0, util_1.bufferToBigInt)(sha256_1.default.mac((0, util_1.utf8ToBuffer)('beta'), (0, util_1.concatBuffers)(secret, (0, util_1.pointToBuffer)(nonce), (0, util_1.pointToBuffer)(signer), message, Uint8Array.of(retry))));
        RPrime = (0, elliptic_1.pointAdd)(R, (0, elliptic_1.pointMultiply)(util_1.curve.g, alpha), (0, elliptic_1.pointMultiply)(P, beta));
        if ((0, util_1.jacobi)(RPrime.y) === BigInt(1)) {
            break;
        }
        else {
            retry++;
        }
    }
    // the challenge
    const cPrime = (0, util_1.getE)(RPrime.x, P, message);
    // the blinded challenge
    const c = (0, elliptic_1.scalarAdd)(cPrime, beta);
    return [{ alpha, r: RPrime.x }, { c }];
}
exports.blindMessage = blindMessage;
function blindSign(signer, nonce, { c }) {
    const x = signer;
    const k = nonce;
    const s = (0, elliptic_1.scalarAdd)(k, (0, elliptic_1.scalarMultiply)(c, x));
    return { s };
}
exports.blindSign = blindSign;
function unblind({ alpha, r }, blindedSig) {
    const s = (0, elliptic_1.scalarAdd)(blindedSig.s, alpha);
    return { r, s };
}
exports.unblind = unblind;
function blindVerify(blindedSig, nonce, message, signer) {
    return (0, elliptic_1.pointAdd)(nonce, (0, elliptic_1.pointMultiply)(signer, message)).x === (0, elliptic_1.pointMultiply)(util_1.curve.g, blindedSig).x;
}
exports.blindVerify = blindVerify;
//# sourceMappingURL=blind.js.map