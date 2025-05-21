import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../Services/wishlist/wishlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../Services/Shared/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  standalone: false,
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit{
  wishlistSub?: Subscription;
  loading: boolean = false; 
  constructor(private wishlistservice:WishlistService,
    private snackBar:MatSnackBar,private sharedservice:SharedService
  ){}
  ngOnInit(): void {
  this.getAllWishList();
  this.wishlistSub = this.sharedservice.wishlistCount$.subscribe(() => {
  this.getAllWishList();
});
  }
  quantity:number=0;
wishListItems:any[]=[];
  getAllWishList(){
    this.loading = true;
     this.wishlistservice.GetAllWishList().subscribe(
    (result:any)=>{
      console.log("WishList items received from backend:", result);
      this.wishListItems=result.data||[];
      this.quantity=this.wishListItems.length;
      this.loading = false;
      }, (error) => {
        this.loading = false;
        console.error('Error fetching cart:', error);
      }
     )
  }

  removeFromWishlist(wishListId: number) {
    console.log('Deleting wishlist ID:', wishListId);
  if (!wishListId) {
    console.error('Invalid WishList ID for removal');
    return;
  }

  this.wishlistservice.removeWishList(wishListId).subscribe({
    next: () => {
      this.snackBar.open('Book removed from WishList', '', { duration: 3000 });
      this.getAllWishList();
    },
    error: (err) => {
      console.error('Error removing from wishlist:', err);
      this.snackBar.open('Failed to remove from WishList', '', { duration: 3000 });
    }
  });
}
ngOnDestroy() {
  this.wishlistSub?.unsubscribe();
}
}
