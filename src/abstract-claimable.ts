import Hash from './hash';
import PublicKey from './public-key';

export default interface AbstractClaimable {
  claimant: PublicKey;

  kind: 'LightningPayment' | 'FeeBump' | 'Hookout' | 'LightningInvoice' | 'Hookin' | 'Referral';

  hash(): Hash;
  claimableAmount: number;
}
