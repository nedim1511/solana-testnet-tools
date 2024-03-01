import {Component, OnInit} from '@angular/core';
import {TabMenuModule} from "primeng/tabmenu";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TabMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  constructor() {
  }

  ngOnInit() {
    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: 'home' },
      { label: 'Balance', icon: 'pi pi-fw pi-dollar', routerLink: 'balance' },
      { label: 'Faucet', icon: 'pi pi-fw pi-filter', routerLink: 'faucet' },
    ];
    this.activeItem = this.items[0];
  }
}
