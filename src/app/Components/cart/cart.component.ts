import { Component, OnInit } from '@angular/core';
import { CartService } from '../../Services/cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../Services/Customer/customer.service';
import { OrderService } from '../../Services/order/order.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SharedService } from '../../Services/Shared/shared.service';


@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  bookdetails: any;
  customerForm!: FormGroup;
  isLoading: boolean = false;
  constructor(private router:Router ,private cartService: CartService, private snackBar: MatSnackBar
    , private fb: FormBuilder, private customerservice: CustomerService,
  private orderservice:OrderService,private sharedservice:SharedService) {

    this.customerForm = this.fb.group({
      fullName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      Type: [''] 
    })
  }
  ngOnInit(): void {
    this.GetCartItems();
  }
  quantity: number = 0;
  cartItems: any[] = [];
  GetCartItems() {
      this.isLoading = true;
    this.cartService.getCart().subscribe(
      (result: any) => {
        console.log("items received from backend:", result);
        this.cartItems = result.data.cartItems
        this.cartId = result.data.cartItems[0]?.cartId;
        console.log("cartId", this.cartId);
        this.quantity = this.cartItems.length;
        this.calculateTotals();
         this.isLoading = false;
      }, (error) => {
        console.error('Error fetching cart:', error);
         this.isLoading = false;
      }
    )
  }
  cartId: number = 0;
  increaseQuantity(item: any) {
    if (item.quantity < item.book.quantity) {
      item.quantity++;
      this.cartService.updateCart(item.cartId, item.book.bookId, item.quantity).subscribe({
        next: (res) => {
          console.log('Cart updated successfully');
          this.GetCartItems();
        },
        error: (err) => {
          console.error('Failed to update cart:', err);
          this.snackBar.open('Failed to update cart', '', { duration: 2000 });
        }
      });
    }
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCart(item.cartId, item.book.bookId, item.quantity).subscribe({
        next: (res) => {
          console.log('Cart updated successfully');
          this.GetCartItems();
        },
        error: (err) => {
          console.error('Failed to update cart:', err);
          this.snackBar.open('Failed to update cart', '', { duration: 2000 });
        }
      });
    } else {

      this.removeItem(item);
    }
  }

  updateCartQuantity(item: any) {
    if (this.cartId && item.book?.bookId) {
      this.cartService.updateCart(item.cartId, item.book.bookId, item.quantity).subscribe({
        next: (res) => {
          console.log('Cart updated successfully');
          this.GetCartItems();
        },
        error: (err) => {
          console.error('Failed to update cart:', err);
          this.snackBar.open('Failed to update cart', '', { duration: 2000 });
        }
      });
    }
  }
  removeItem(item: any) {
    // Optional feature if you want to support removal when quantity is 1 and user decrements
    this.cartService.deleteCart(item.cartId).subscribe({
      next: (res) => {
        this.cartItems = this.cartItems.filter(ci => ci.book.bookId !== item.book.bookId);
        this.quantity = this.cartItems.length;
        this.GetCartItems();
        this.sharedservice.decrementCartCount();
        this.snackBar.open('Item removed from cart', '', { duration: 2000 });
        
      },
      error: (err) => {
        console.error('Failed to remove item:', err);
      }
    });
  }
  showCustomerDetails: boolean = false;
onPlaceOrderClick() {
  console.log("Place Order clicked");
  this.showCustomerDetails = true;
  this.showSummary = false;
}
  customerForOrders: any[] = [];
  onContinue() {
    this.isLoading = true;
    if (this.customerForm.valid) {
      const payload = this.customerForm.value;
      console.log("customer ",payload);
      this.customerForOrders.push(payload);
      this.customerservice.addCustomerDetails(payload).subscribe({
        next: (result: any) => {
          console.log("customer details are added", result);
          this.showCustomerDetails = false;
           this.showSummary = true;
           this.calculateTotals();
           this.isLoading = false;
        }, error: (error) => {
          console.error('Error submitting customer details:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.customerForm.markAllAsTouched();
    }

  }

showSummary: boolean = false;
totalDiscountPrice: number = 0;
totalOriginalPrice: number = 0;
calculateTotals() {
  this.totalDiscountPrice = 0;
  this.totalOriginalPrice = 0;

  for (let item of this.cartItems) {
    const quantity = item.quantity || 1;
    this.totalDiscountPrice += item.book?.discountPrice * quantity;
    this.totalOriginalPrice += item.book?.price * quantity;
  }
}
checkout() {
    if (this.cartItems.length === 0) return;
      this.isLoading = true;
    //showing the table in the order success 
  const customerInfo = this.customerForOrders[0]; 
  const fullAddress = `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state}, ${customerInfo.Type}`;

  const orderData = {
    name: customerInfo.fullName,
    mobileNumber: customerInfo.mobileNumber,
    address: fullAddress
  };

  const orderRequests = this.cartItems.map(item =>
    this.orderservice.addToOrder(item.cartId)
  );

  forkJoin(orderRequests).subscribe({
    next: (responses) => {
       this.isLoading = false;
      console.log('All orders placed successfully');
      this.router.navigate(['/dashboard/order'], { state: { orderData } });
    },
    error: (err) => {
       this.isLoading = false;
      console.error('Error in orders:', err);
    }
  });

  }
}

