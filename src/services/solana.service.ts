import {Injectable} from "@angular/core";
import {PublicKey} from "@solana/web3.js";

@Injectable({
  providedIn: 'root'
})
export class SolanaService {
  constructor() {
  }

  public validateSolAddress(address: string): boolean {
    try {
      let pubKey = new PublicKey(address)
      return PublicKey.isOnCurve(pubKey.toBuffer());
    } catch (error) {
      return false;
    }
  }
}
