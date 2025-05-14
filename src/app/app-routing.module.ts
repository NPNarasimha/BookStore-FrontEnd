import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './Components/login-register/login-register.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AuthGuardService } from './Services/auth-gaurd-folder/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'registerlogin', pathMatch: 'full' },
  { path: 'registerlogin', component:LoginRegisterComponent },
  {path:'dashboard',component:DashboardComponent,canActivate:[AuthGuardService],},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
