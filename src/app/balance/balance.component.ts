import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputGroupModule} from "primeng/inputgroup";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LocalStorageKeys} from "../models/local-storage-keys.enum";
import {clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {SolanaService} from "../../services/solana.service";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [
    ButtonModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule
  ],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
})
export class BalanceComponent implements OnInit {
  public address: string = '';
  public balance = 0;
  public loading = false;

  constructor(private cdr: ChangeDetectorRef, private solanaService: SolanaService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.populateAddressFromLocalStorage();

    if (this.address && this.solanaService.validateSolAddress(this.address)) {
      this.getFaucetBalance().then((balance) => {
        this.balance = balance;
        this.cdr.markForCheck();
      });
    }
  }

  private populateAddressFromLocalStorage() {
    this.address = localStorage.getItem(LocalStorageKeys.Address) || '';
  }

  public refreshClick() {
    this.loading = true;
    this.getFaucetBalance().then((balance) => {
      this.balance = balance;
      this.loading = false;
      this.cdr.markForCheck();
    }).catch(() => {
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  public async getFaucetBalance(): Promise<number> {
    if (this.solanaService.validateSolAddress(this.address)) {
      const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');
      const faucetPublicKey = new PublicKey(this.address);
      const balanceInLamports = await connection.getBalance(faucetPublicKey);
      return balanceInLamports / LAMPORTS_PER_SOL;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Provided address is not correct.' });
      return 0;
    }
  }
}
