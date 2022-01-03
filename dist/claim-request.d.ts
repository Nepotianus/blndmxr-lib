import Hash from './hash';
import PrivateKey from './private-key';
import Signature from './signature';
import * as POD from './pod';
import CoinRequest from './coin-request';
export default class ClaimRequest {
    static newAuthorized(claimableHash: Hash, coinRequests: CoinRequest[], claimantPrivateKey: PrivateKey, fee: number, // TODO: this field is actually not really used 
    coinPeriod: number): ClaimRequest;
    static fromPOD(data: any): ClaimRequest | Error;
    claimableHash: Hash;
    coinRequests: CoinRequest[];
    authorization: Signature;
    fee: number;
    coinPeriod: number;
    constructor(claimableHash: Hash, coinRequests: CoinRequest[], authorization: Signature, fee: number, coinPeriod: number);
    static hashOf(claimableHash: Hash, coinRequests: CoinRequest[], fee: number, coinPeriod: number): Hash;
    hash(): Hash;
    toPOD(): POD.ClaimRequest;
    amount(): number;
}
