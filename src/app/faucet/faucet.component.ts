import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputGroupModule} from "primeng/inputgroup";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LocalStorageKeys} from "../models/local-storage-keys.enum";
import {SolanaService} from "../../services/solana.service";
import {MessageService} from "primeng/api";
import {clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";

@Component({
  selector: 'app-faucet',
  standalone: true,
  imports: [
    ButtonModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './faucet.component.html',
  styleUrl: './faucet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaucetComponent implements OnInit {
  public address: string = '';
  public loading = false;

  constructor(private solanaService: SolanaService, private messageService: MessageService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.populateAddressFromLocalStorage();
  }

  public submit() {
    if (!this.address) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Please enter a valid address'});
    } else {
      if (this.solanaService.validateSolAddress(this.address)) {
        this.airdrop();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Provided address is not correct.' });
      }
    }
  }

  private async airdrop(): Promise<void> {
    this.loading = true;
    const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');

    connection.requestAirdrop(new PublicKey(this.address), LAMPORTS_PER_SOL).then((response) => {
      this.loading = false;
      this.cdr.markForCheck();
      this.messageService.add({severity: 'success', summary: 'Success', detail: `Airdrop successful!`});
    }).catch((error) => {
      this.loading = false;
      this.cdr.markForCheck();
      this.messageService.add({severity: 'error', summary: 'Error', detail: `Airdrop failed: ${this.extractDynamicErrorMessage(error.message) || 'Unknown error'}`});
    });
  }

  private populateAddressFromLocalStorage() {
    this.address = localStorage.getItem(LocalStorageKeys.Address) || '';
  }

  private extractDynamicErrorMessage(response: string): string | null {
    const parts = response.split(' : ');

    if (parts.length < 2) {
      return null;
    }

    const jsonPart = parts[1];

    try {
      const obj = JSON.parse(jsonPart);

      if (obj.error && typeof obj.error.message === 'string') {
        return obj.error.message;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
}
