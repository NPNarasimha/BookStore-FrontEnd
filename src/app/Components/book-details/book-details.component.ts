import { Component, OnInit } from '@angular/core';
import { BookService } from '../../Services/book/book.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../Services/cart/cart.service';
import { SharedService } from '../../Services/Shared/shared.service';
import { WishlistService } from '../../Services/wishlist/wishlist.service';

@Component({
  selector: 'app-book-details',
  standalone: false,
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent implements OnInit {
  bookdetails: any
  isLoading: boolean = true;
  constructor(private service: BookService,
    private route: ActivatedRoute, private snackBar: MatSnackBar,
    private cartService: CartService,private sharedservice:SharedService,
  private wishlistservice:WishlistService) { }
  ngOnInit(): void {
    this.getBookDetails();
  }
  getBookDetails() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Navigating to bookId:', id);
    if (!id) {
      this.snackBar.open('Invalid book ID!', '', { duration: 3000 });
      return;
    }
    this.isLoading = true;
    console.log('Navigating to bookId:', id);
    this.service.GetBookById(id).subscribe({
      next: (result: any) => {
        this.isLoading = false;
        this.bookdetails = result?.data || result;

      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching from book ID:', err);
      }

    })
  }
  //feedback
  selectedRating: number = 0;
  feedbackText = '';
  sampleNames: string[] = ['indu', 'Rohit', 'Suresh', 'sai', 'vali', 'Narasimha', 'Krishna', 'Prakowsalya', 'Raj', 'Np'];

  submittedFeedbacks: { name: string; rating: number; text: string }[] = [{
    name: 'Krishna',
    rating: 3,
    text: 'Book is very good'
  },
  {
    name: 'Aarav',
    rating: 5,
    text: 'Amazing quality and quick delivery!'
  }];
  selectRating(star: number): void {
    this.selectedRating = star;
  }
  submitFeedback(): void {
    if (this.selectedRating && this.feedbackText.trim()) {
      const randomName = this.sampleNames[Math.floor(Math.random() * this.sampleNames.length)];

      this.submittedFeedbacks.push({
        name: randomName,
        rating: this.selectedRating,
        text: this.feedbackText.trim()
      });


      this.selectedRating = 0;
      this.feedbackText = '';
    } else {
      alert("Please provide both rating and feedback!");
    }
  }

  addtobag: boolean = false;
  quantity: number = 1;
  cartId:number=0;
  AddCart() {
    if (!this.bookdetails?.bookId) {
      console.error('Book ID is undefined, cannot add to cart.');
      return;
    }
    this.addtobag = true;
    this.quantity = 1;
    this.cartService.addToCart(this.bookdetails.bookId, this.quantity).subscribe({
      next: (result: any) => {
        this.snackBar.open('Book added to cart!', '', { duration: 3000 });
        this.cartId=result?.data?.cartId || result?.cartId;
        console.log("cart Id",this.cartId);
         this.sharedservice.incrementCartCount();
      }, error: (err) => {
        console.error('Error adding to cart:', err);
        this.snackBar.open('Failed to add to cart', '', { duration: 2000 });
      },
    })
  }

  updateCartQuantity() {
  if (this.cartId && this.bookdetails?.bookId) {
    this.cartService.updateCart(this.cartId, this.bookdetails.bookId, this.quantity).subscribe({
      next: (res) => {
        console.log('Cart updated successfully');
      },
      error: (err) => {
        console.error('Failed to update cart:', err);
        this.snackBar.open('Failed to update cart', '', { duration: 2000 });
      }
    });
  }
}
  DecreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.updateCartQuantity();
    }
  }
  IncreaseQuantity() {
    if(this.quantity<=this.bookdetails.quantity){
      this.quantity++;
      this.updateCartQuantity();
    }
  }

  addtowishlist:boolean=false;
  AddToWishlist(){
    if (!this.bookdetails?.bookId) {
      console.error('Book ID is undefined, cannot add to wishlist.');
      return;
    }
    
    this.addtowishlist=true;
   this.wishlistservice.AddToWishList(this.bookdetails.bookId).subscribe({
    next: (result: any) => {
      this.snackBar.open('Book added to WishList!', '', { duration: 3000 }); 
      this.sharedservice.updateWishlistCount();      
    },
    error: (err) => {
      if (err.status === 409) {
        // Conflict from backend
        this.snackBar.open('Already added to the wishlist', '', { duration: 3000 });
      } else {
        console.error('Error adding to WishList:', err);
        this.snackBar.open('Failed to add to WishList', '', { duration: 3000 });
      }
    
    }
  });
  
  }

}
