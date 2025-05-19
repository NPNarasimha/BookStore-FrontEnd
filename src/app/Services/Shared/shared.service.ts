import { Injectable } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
 private wishlistCountSubject = new Subject<void>();
wishlistCount$ = this.wishlistCountSubject.asObservable();

  updateWishlistCount() {
    this.wishlistCountSubject.next();
  }
private cartCount = new BehaviorSubject<number>(0);
cartCount$ = this.cartCount.asObservable();
  setCartCount(count: number) {
    this.cartCount.next(count);
  }

  incrementCartCount() {
    this.cartCount.next(this.cartCount.value + 1);
  }
}
