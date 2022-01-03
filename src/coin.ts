import Hash from './hash';
import * as POD from './pod';
import PublicKey from './public-key';
import Signature from './signature';
import Magnitude from './magnitude';
import * as Buffutils from './util/buffutils';

export default class Coin {
  public static fromPOD(data: any): Coin | Error {
    const owner = PublicKey.fromPOD(data.owner);
    if (owner instanceof Error) {
      return owner;
    }

    const magnitude = Magnitude.fromPOD(data.magnitude);
    if (magnitude instanceof Error) {
      return magnitude;
    }

    const receipt = Signature.fromPOD(data.receipt);
    if (receipt instanceof Error) {
      return receipt;
    }

    const period = data.period;
    if (!POD.isAmount(data.period)) {
      return new Error('Coin.fromPOD invalid number');
    }


   const c = new Coin(owner, magnitude, receipt, period);

    if (c.hash().toPOD() !== data.hash) {
      return new Error('hash did not match');
    }

    return c;
  }

  public owner: PublicKey;
  public magnitude: Magnitude;
  public receipt: Signature;
  public period: number;

  constructor(owner: PublicKey, magnitude: Magnitude, receipt: Signature, period: number) {
    this.owner = owner;
    this.magnitude = magnitude;
    this.receipt = receipt;
    this.period = period;
  }

  get buffer() {
    return Buffutils.concat(this.owner.buffer, this.magnitude.buffer, this.receipt.buffer, Buffutils.fromUint64(this.period));
  }

  public hash() {
    return Hash.fromMessage('Coin', this.buffer);
  }

  public toPOD(): POD.Coin {
    return {
      hash: this.hash().toPOD(),
      receipt: this.receipt.toPOD(),
      magnitude: this.magnitude.toPOD(),
      owner: this.owner.toPOD(),
      period: this.period
    };
  }

  public get amount(): number {
    return this.magnitude.toAmount();
  }
}
