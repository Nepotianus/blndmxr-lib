import Hash from './hash';
import PrivateKey from './private-key';
import PublicKey from './public-key';
import * as POD from './pod';
import AbstractClaimable from './abstract-claimable';
export default class Hookin implements AbstractClaimable {
    static fromPOD(data: any): Hookin | Error;
    static hashOf(txid: Uint8Array, vout: number, amount: number, claimant: PublicKey, bitcoinAddress: string, referral?: PublicKey): Hash;
    txid: Uint8Array;
    vout: number;
    amount: number;
    claimant: PublicKey;
    bitcoinAddress: string;
    referral?: PublicKey;
    initCreated?: number;
    constructor(txid: Uint8Array, vout: number, amount: number, claimant: PublicKey, bitcoinAddress: string, referral?: PublicKey, initCreated?: number);
    hash(): Hash;
    get kind(): 'Hookin';
    get claimableAmount(): number;
    getTweak(): PrivateKey;
    toPOD(): POD.Hookin;
}
