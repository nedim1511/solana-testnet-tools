import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {LocalStorageKeys} from "../models/local-storage-keys.enum";
import {CommonModule} from "@angular/common";
import {SolanaService} from "../../services/solana.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ToastModule,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  public address: string = '';

  constructor(private messageService: MessageService, private solanaService: SolanaService) {}

  ngOnInit() {
    this.populateAddressFromLocalStorage();
  }

  save() {
    if (this.solanaService.validateSolAddress(this.address)) {
      localStorage.setItem(LocalStorageKeys.Address, this.address);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Address saved to local storage.' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Provided address is not correct.' });
    }
  }

  private populateAddressFromLocalStorage() {
    this.address = localStorage.getItem(LocalStorageKeys.Address) || '';
  }
}
