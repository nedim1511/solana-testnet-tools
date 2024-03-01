import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {FaucetComponent} from "./faucet/faucet.component";
import {BalanceComponent} from "./balance/balance.component";

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'balance',
    component: BalanceComponent
  },
  {
    path: 'faucet',
    component: FaucetComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];
