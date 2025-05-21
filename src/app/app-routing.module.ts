import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './Components/login-register/login-register.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AuthGuardService } from './Services/auth-gaurd-folder/auth-guard.service';
import { DisplayBooksComponent } from './Components/display-books/display-books.component';
import { BookDetailsComponent } from './Components/book-details/book-details.component';
import { CartComponent } from './Components/cart/cart.component';
import { WishlistComponent } from './Components/wishlist/wishlist.component';
import { OrderComponent } from './Components/order/order.component';
import { OrderItemsComponent } from './Components/order-items/order-items.component';

const routes: Routes = [
  { path: '', redirectTo: 'registerlogin', pathMatch: 'full' },
  { path: 'registerlogin', component:LoginRegisterComponent },
  {path:'dashboard',component:DashboardComponent,canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DisplayBooksComponent },
      {path:'bookdetails/:id',component:BookDetailsComponent},
      {path:'cart',component:CartComponent},
      {path:'wishlist',component:WishlistComponent},
      {path:'order',component:OrderComponent},
      {path:'myOrders',component:OrderItemsComponent},

    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
