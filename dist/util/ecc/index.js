"use strict";
// CORE DATA
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
exports.util = exports.muSig = exports.blindVerify = exports.unblind = exports.blindSign = exports.blindMessage = exports.verifyECDSA = exports.verify = exports.sign = exports.Signature = exports.pointAdd = exports.pointMultiply = exports.scalarMultiply = exports.scalarAdd = exports.INFINITE_POINT = exports.Point = exports.Scalar = void 0;
var elliptic_1 = require("./elliptic");
Object.defineProperty(exports, "Scalar", { enumerable: true, get: function () { return elliptic_1.Scalar; } });
Object.defineProperty(exports, "Point", { enumerable: true, get: function () { return elliptic_1.Point; } });
Object.defineProperty(exports, "INFINITE_POINT", { enumerable: true, get: function () { return elliptic_1.INFINITE_POINT; } });
// CURVE MATH
var elliptic_2 = require("./elliptic");
Object.defineProperty(exports, "scalarAdd", { enumerable: true, get: function () { return elliptic_2.scalarAdd; } });
Object.defineProperty(exports, "scalarMultiply", { enumerable: true, get: function () { return elliptic_2.scalarMultiply; } });
Object.defineProperty(exports, "pointMultiply", { enumerable: true, get: function () { return elliptic_2.pointMultiply; } });
Object.defineProperty(exports, "pointAdd", { enumerable: true, get: function () { return elliptic_2.pointAdd; } });
var signature_1 = require("./signature");
Object.defineProperty(exports, "Signature", { enumerable: true, get: function () { return signature_1.Signature; } });
Object.defineProperty(exports, "sign", { enumerable: true, get: function () { return signature_1.sign; } });
Object.defineProperty(exports, "verify", { enumerable: true, get: function () { return signature_1.verify; } });
Object.defineProperty(exports, "verifyECDSA", { enumerable: true, get: function () { return signature_1.verifyECDSA; } });
var blind_1 = require("./blind");
Object.defineProperty(exports, "blindMessage", { enumerable: true, get: function () { return blind_1.blindMessage; } });
Object.defineProperty(exports, "blindSign", { enumerable: true, get: function () { return blind_1.blindSign; } });
Object.defineProperty(exports, "unblind", { enumerable: true, get: function () { return blind_1.unblind; } });
Object.defineProperty(exports, "blindVerify", { enumerable: true, get: function () { return blind_1.blindVerify; } });
// MULTI SIGNATURES
const muSig = __importStar(require("./mu-sig"));
exports.muSig = muSig;
// CONVENIENCE
const util = __importStar(require("./util"));
exports.util = util;
//# sourceMappingURL=index.js.map