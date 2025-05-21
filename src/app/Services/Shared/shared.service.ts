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
 private cartCountSubject = new BehaviorSubject<number>(this.getInitialCartCount());
  cartCount$ = this.cartCountSubject.asObservable();

  private getInitialCartCount(): number {
    const storedCount = localStorage.getItem('cartCount');
    return storedCount ? parseInt(storedCount, 10) : 0;
  }

  setCartCount(count: number) {
    this.cartCountSubject.next(count);
    localStorage.setItem('cartCount', count.toString());
  }

  incrementCartCount() {
    const current = this.cartCountSubject.value;
    const newCount = current + 1;
    this.cartCountSubject.next(newCount);
    localStorage.setItem('cartCount', newCount.toString());
  }

  decrementCartCount() {
    const current = this.cartCountSubject.value;
    const newCount = current > 0 ? current - 1 : 0;
    this.cartCountSubject.next(newCount);
    localStorage.setItem('cartCount', newCount.toString());
  }
}
