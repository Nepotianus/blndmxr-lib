import Hash from './hash';
import PublicKey from './public-key';
import * as POD from './pod';
import AbstractClaimable from './abstract-claimable';
export default class Referral implements AbstractClaimable {
    static fromPOD(data: any): Referral | Error;
    static hashOf(amount: number, claimant: PublicKey, claimableHash: Hash): Hash;
    amount: number;
    claimant: PublicKey;
    claimableHash: Hash;
    initCreated?: number;
    constructor(amount: number, claimant: PublicKey, claimableHash: Hash, initCreated?: number);
    hash(): Hash;
    get kind(): 'Referral';
    get claimableAmount(): number;
    toPOD(): POD.Referral;
}
