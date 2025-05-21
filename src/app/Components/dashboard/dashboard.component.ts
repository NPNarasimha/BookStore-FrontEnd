import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../Services/search/search.service';
import { SharedService } from '../../Services/Shared/shared.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  searchTerm="";
  cartCount: number = 0;
constructor(private router:Router,private sharedservice:SharedService,private searchService:SearchService){}
  ngOnInit(): void {
   console.log("ngOnInit called for DisplayBooksComponent");
    this.sharedservice.cartCount$.subscribe(count => {
    this.cartCount = count;
  });
  }
goToCart() {
   //this.sharedservice.setCartCount();    
}
onSearchChange(){
  this.searchService.setSearchTerm(this.searchTerm)
}
logout(){
this.router.navigate(['']);
}
wishList(){
  this.router.navigate(['/dashboard/wishlist']);
}
MyOrders(){
  this.router.navigate(['/dashboard/myOrders']);
}
}
