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
exports.partialSigCombine = exports.partialSigbipVerify = exports.partialSignbipPlusbipGetE = exports.partialSign = exports.sessionNonceCombine = exports.sessionInit = exports.calculateCoefficient = exports.privkeyCombine = exports.bipPubkeyCombine = exports.pubkeyCombine = exports.bipCalculateL = exports.calculateL = void 0;
const assert = __importStar(require("../assert"));
const _1 = require(".");
const check = __importStar(require("./check"));
const sha256_1 = __importDefault(require("../bcrypto/sha256"));
const util_1 = require("./util");
const elliptic_1 = require("./elliptic");
const __1 = require("../..");
// https://blockstream.com/2018/01/23/musig-key-aggregation-schnorr-signatures/
function calculateL(pubkeys) {
    return sha256_1.default.digest((0, util_1.concatBuffers)(...pubkeys.map(util_1.pointToBuffer))); // the hash is made of 33 byte buffers. problem? Not sure.. probably unstandard by now at least for bip340 purposes
}
exports.calculateL = calculateL;
function bipCalculateL(pubKeys) {
    return sha256_1.default.digest((0, util_1.concatBuffers)(...pubKeys));
}
exports.bipCalculateL = bipCalculateL;
function pubkeyCombine(pubkeys) {
    assert.equal(pubkeys.length > 0, true);
    const L = calculateL(pubkeys);
    let X = _1.INFINITE_POINT;
    for (let i = 0; i < pubkeys.length; i++) {
        const Xi = pubkeys[i];
        const coefficient = calculateCoefficient(L, i);
        const summand = (0, _1.pointMultiply)(Xi, coefficient);
        if (X === _1.INFINITE_POINT) {
            X = summand;
        }
        else {
            X = (0, _1.pointAdd)(X, summand);
        }
    }
    return X;
}
exports.pubkeyCombine = pubkeyCombine;
function bipPubkeyCombine(pubkeys) {
    assert.equal(pubkeys.length > 0, true);
    const L = bipCalculateL(pubkeys.map(pk => (0, util_1.buffer32FromBigInt)(pk.x)));
    let X = _1.INFINITE_POINT;
    for (let i = 0; i < pubkeys.length; i++) {
        const Xi = pubkeys[i];
        const coefficient = calculateCoefficient(L, i);
        const summand = (0, _1.pointMultiply)(Xi, coefficient);
        if (X === _1.INFINITE_POINT) {
            X = summand;
        }
        else {
            X = (0, _1.pointAdd)(X, summand);
        }
    }
    return X;
}
exports.bipPubkeyCombine = bipPubkeyCombine;
function privkeyCombine(privkeys) {
    assert.equal(privkeys.length > 0, true);
    check.privkeysAreUnique(privkeys);
    const Xs = [];
    let R = _1.INFINITE_POINT;
    for (const privateKey of privkeys) {
        const Xi = _1.Point.fromPrivKey(privateKey);
        Xs.push(Xi);
        if (R === _1.INFINITE_POINT) {
            R = Xi;
        }
        else {
            R = (0, _1.pointAdd)(R, Xi);
        }
    }
    const L = sha256_1.default.digest((0, util_1.concatBuffers)(...Xs.map(util_1.pointToBuffer)));
    let X = BigInt(0);
    for (let i = 0; i < privkeys.length; i++) {
        const Xi = privkeys[i];
        const coefficient = calculateCoefficient(L, i);
        const summand = (0, elliptic_1.scalarMultiply)(Xi, coefficient);
        if (X === BigInt(0)) {
            X = summand;
        }
        else {
            X = (0, elliptic_1.scalarAdd)(X, summand);
        }
    }
    return X;
}
exports.privkeyCombine = privkeyCombine;
const MUSIG_TAG = sha256_1.default.digest((0, util_1.utf8ToBuffer)('MuSig coefficient'));
function calculateCoefficient(L, idx) {
    const ab = new ArrayBuffer(4);
    const view = new DataView(ab);
    view.setUint32(0, idx, true); // true for LE
    const idxBuf = new Uint8Array(ab);
    const data = sha256_1.default.digest((0, util_1.concatBuffers)(MUSIG_TAG, MUSIG_TAG, L, idxBuf));
    return (0, util_1.bufferToBigInt)(data) % util_1.curve.n;
}
exports.calculateCoefficient = calculateCoefficient;
// TODO: Lazily copied from guggero. there are some conflicts with Y and determining parity that's currently a bit ugly
// TODO: add more constructive and definitive types
// from GUGGERO, we utilize three-round multisig from his library https://github.com/guggero/bip-schnorr
function sessionInit(sessionID, privateKey, message, pubKeyCombined, pkParity, ell, idx) {
    // check variables
    const session = {
        sessionID,
        message,
        pubKeyCombined,
        pkParity,
        ell,
        idx,
    };
    const coefficient = calculateCoefficient(ell, idx);
    let secretSessionKey = (0, elliptic_1.scalarMultiply)(privateKey.scalar, coefficient) % util_1.curve.n;
    const ownKeyParity = (0, util_1.isEven)(privateKey.toPublicKey().y);
    if (ownKeyParity != pkParity) {
        secretSessionKey = (0, elliptic_1.scalarNegate)(secretSessionKey);
    }
    const nonceData = (0, util_1.concatBuffers)(sessionID, message, session.pubKeyCombined, privateKey.buffer);
    const nonceHash = sha256_1.default.digest(nonceData);
    const privKeyNonce = __1.PrivateKey.fromBytes(nonceHash);
    // this already checks
    if (privKeyNonce instanceof Error) {
        throw privKeyNonce;
    }
    const R = privKeyNonce.toPublicKey();
    const nonce = R.x;
    const nonceParity = (0, util_1.isEven)(R.y);
    const commitment = sha256_1.default.digest((0, util_1.buffer32FromBigInt)(nonce));
    return { session, nonce, nonceParity, commitment, privKeyNonce, ownKeyParity, secretSessionKey };
}
exports.sessionInit = sessionInit;
// session is a complex object - are we doing stuff with even Y correct?
function sessionNonceCombine(nonces) {
    check.isValidPubkey(nonces[0]);
    let R = nonces[0];
    for (let i = 1; i < nonces.length; i++) {
        check.isValidPubkey(nonces[i]);
        R = R.tweak(nonces[i]);
    }
    const combinedNonceParity = (0, util_1.isEven)(R.y);
    return { combinedNonceParity, R };
}
exports.sessionNonceCombine = sessionNonceCombine;
function partialSign(message, nonceCombined, pubKeyCombined, secretNonce, secretKey, nonceParity, combinedNonceParity) {
    const e = (0, util_1.getE)(nonceCombined.x, pubKeyCombined, message);
    const sk = secretKey;
    let k = secretNonce;
    if (nonceParity !== combinedNonceParity) {
        k = new __1.PrivateKey((0, elliptic_1.scalarNegate)(k.scalar));
    }
    return (0, elliptic_1.scalarAdd)((0, elliptic_1.scalarMultiply)(sk.scalar, e), k.scalar);
}
exports.partialSign = partialSign;
function partialSignbipPlusbipGetE(message, nonceCombined, pubKeyCombined, secretNonce, secretKey, nonceParity, combinedNonceParity) {
    const eBIP = (0, util_1.standardGetEBIP340)(nonceCombined.x, pubKeyCombined.x, message);
    const sk = secretKey;
    let k = secretNonce.scalar; // delete the type
    if (nonceParity !== combinedNonceParity) {
        k = (0, elliptic_1.scalarNegate)(k);
    }
    return (0, elliptic_1.scalarAdd)((0, elliptic_1.scalarMultiply)(sk.scalar, eBIP), k);
}
exports.partialSignbipPlusbipGetE = partialSignbipPlusbipGetE;
function partialSigbipVerify(message, pubKeyCombined, partialSig, nonceCombined, idx, pubKey, nonce, ell, pkParity, combinedNonceParity) {
    let e = (0, util_1.standardGetEBIP340)(nonceCombined.x, pubKeyCombined, message);
    const coefficient = calculateCoefficient(ell, idx);
    // if Y is odd, we need curve.n - P to get to curve P - Y, makes sense?
    if (!pkParity) {
        e = (0, elliptic_1.scalarNegate)(e);
    }
    let RP = (0, elliptic_1.pointSubtract)((0, _1.pointMultiply)(util_1.curve.g, partialSig), (0, _1.pointMultiply)(pubKey, (0, elliptic_1.scalarMultiply)(e, coefficient)));
    if (combinedNonceParity) {
        RP = (0, elliptic_1.negatePoint)(RP);
    }
    const s = (0, _1.pointAdd)(RP, nonce);
    if (s === _1.INFINITE_POINT) {
        return true;
    }
    else {
        return false;
    }
}
exports.partialSigbipVerify = partialSigbipVerify;
// we can just check this normally
// this is all a bit ugly TODO
function partialSigCombine(nonceCombined, partialSigs) {
    // check.checkArray('partialSigs', partialSigs);
    let s = partialSigs[0];
    for (let i = 1; i < partialSigs.length; i++) {
        s = (0, elliptic_1.scalarAdd)(s, partialSigs[i]);
    }
    return { r: nonceCombined.x, s: s };
}
exports.partialSigCombine = partialSigCombine;
//# sourceMappingURL=mu-sig.js.map