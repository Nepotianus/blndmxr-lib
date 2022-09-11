import Hash from './hash';
import PrivateKey from './private-key';
import PublicKey from './public-key';

import * as POD from './pod';

import * as buffutils from './util/buffutils';
import AbstractClaimable from './abstract-claimable';

export default class Referral implements AbstractClaimable {
  public static fromPOD(data: any): Referral | Error {
    if (typeof data !== 'object') {
      return new Error('referral expected an object');
    }

    const amount = data.amount;
    if (!POD.isAmount(amount)) {
      return new Error('invalid amount for hookin');
    }


    const claimant = PublicKey.fromPOD(data.claimant);
    if (claimant instanceof Error) {
      return claimant;
    }

    const claimableHash = Hash.fromPOD(data.claimableHash);
    if (claimableHash instanceof Error) {
      return claimableHash;
    }

    const initCreated = data.initCreated;
    if (initCreated) {
      if (typeof initCreated != 'number') {
        throw initCreated;
      }
    }

    return new Referral(amount,  claimant, claimableHash, initCreated);
  }

  // this is the "old" way of building hashes?
  public static hashOf( amount: number, claimant: PublicKey, claimableHash: Hash) {
    const b = Hash.newBuilder('Referral');
    b.update(buffutils.fromUint64(amount));
    b.update(claimant.buffer);
    b.update(claimableHash.buffer);
    return b.digest();
  }

  public amount: number;
  public claimant: PublicKey;
  public claimableHash: Hash;
  public initCreated?: number;

  constructor(

    amount: number,
    claimant: PublicKey,
    claimableHash: Hash,
    initCreated?: number
  ) {

    this.amount = amount;
    this.claimant = claimant;
    this.claimableHash = claimableHash;
    this.initCreated = initCreated;
  }

  public hash(): Hash {
    return Referral.hashOf(this.amount, this.claimant, this.claimableHash);
  }

  get kind(): 'Referral' {
    return 'Referral';
  }

  get claimableAmount() {
    // just this.amount as it is only inserted upon accepting a hookin.
    return this.amount;
  }

  public toPOD(): POD.Referral {
    return {
      hash: this.hash().toPOD(),
      amount: this.amount,
      claimant: this.claimant.toPOD(),
      claimableHash: this.claimableHash.toPOD(),
      initCreated: this.initCreated,
    };
  }
}
