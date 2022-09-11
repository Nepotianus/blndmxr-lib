import Hash from './hash';
import PrivateKey from './private-key';
import PublicKey from './public-key';

import * as POD from './pod';

import * as buffutils from './util/buffutils';
import AbstractClaimable from './abstract-claimable';

export default class Hookin implements AbstractClaimable {
  public static fromPOD(data: any): Hookin | Error {
    if (typeof data !== 'object') {
      return new Error('hookin expected an object');
    }

    const txid = buffutils.fromHex(data.txid, 32);
    if (txid instanceof Error) {
      return txid;
    }

    const vout = data.vout;
    if (!Number.isSafeInteger(vout) || vout < 0 || vout > 65536) {
      return new Error('hookin was given an invalid vout');
    }
    const amount = data.amount;
    if (!POD.isAmount(amount)) {
      return new Error('invalid amount for hookin');
    }

    const claimant = PublicKey.fromPOD(data.claimant);
    if (claimant instanceof Error) {
      return claimant;
    }

    const bitcoinAddress = data.bitcoinAddress;
    if (typeof bitcoinAddress !== 'string') {
      return new Error('hookin expected a bitcoin address');
    }

    let referral = data.referral;
    if (referral) {
      if (typeof referral != 'string') {
        throw referral;
      }
      referral = PublicKey.fromPOD(referral);
      if (referral instanceof Error) {
        return referral;
      } 
    }

    const initCreated = data.initCreated;
    if (initCreated) {
      if (typeof initCreated != 'number') {
        throw initCreated;
      }
    }

    return new Hookin(txid, vout, amount, claimant, bitcoinAddress, referral, initCreated);
  }

  public static hashOf(txid: Uint8Array, vout: number, amount: number, claimant: PublicKey, bitcoinAddress: string, referral?: PublicKey) {
    const b = Hash.newBuilder('Hookin');
    b.update(txid);
    b.update(buffutils.fromUint32(vout));
    b.update(buffutils.fromUint64(amount));
    b.update(claimant.buffer);
    b.update(buffutils.fromString(bitcoinAddress));
    if (referral) { 
      b.update(referral.buffer)
    }
    return b.digest();
  }

  public txid: Uint8Array;
  public vout: number;
  public amount: number;
  public claimant: PublicKey;
  public bitcoinAddress: string;
  public referral?: PublicKey;
  public initCreated?: number;

  constructor(
    txid: Uint8Array,
    vout: number,
    amount: number,
    claimant: PublicKey,
    bitcoinAddress: string,
    referral?: PublicKey,
    initCreated?: number
  ) {
    this.txid = txid;
    this.vout = vout;
    this.amount = amount;
    this.claimant = claimant;
    this.bitcoinAddress = bitcoinAddress;
    this.referral = referral
    this.initCreated = initCreated;
  }

  public hash(): Hash {
    return Hookin.hashOf(this.txid, this.vout, this.amount, this.claimant, this.bitcoinAddress, this.referral);
  }

  get kind(): 'Hookin' {
    return 'Hookin';
  }

  get claimableAmount() {
    // a hookin by itself has no claimable value, it's only after we have some status updates for it being sufficiently confirmed
    return 0;
  }

  getTweak(): PrivateKey {
    const bytes = Hash.fromMessage('tweak', this.claimant.buffer).buffer;
    const pk = PrivateKey.fromBytes(bytes);
    if (pk instanceof Error) {
      throw pk;
    }

    return pk;
  }

  public toPOD(): POD.Hookin {
    return {
      hash: this.hash().toPOD(),
      amount: this.amount,
      claimant: this.claimant.toPOD(),
      txid: buffutils.toHex(this.txid),
      vout: this.vout,
      bitcoinAddress: this.bitcoinAddress,
      referral: this.referral ? this.referral.toPOD() : undefined,
      initCreated: this.initCreated,
    };
  }
}
