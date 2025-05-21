import { Injectable } from '@angular/core';
import { HttpServiceService } from '../Http-service/http-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private Http:HttpServiceService) { }
  addToCart(bookId:number,quantity:number=1){
    const payload = {
      bookId: bookId,
      quantity: quantity,
    };
     const header=this.Http.getHeaderToken();
   return  this.Http.postApi('/api/carts',payload,header);
  }
  getCart(){
    const header=this.Http.getHeaderToken();
   return this.Http.getApi('/api/carts',header);
  }
  updateCart(cartId:number,bookId:number,quantity:number){
    const header=this.Http.getHeaderToken();
    const payload = {
    bookId: bookId,
    quantity: quantity
  };
  return this.Http.putApi(`/api/carts/${cartId}`, payload, header);
  }
  deleteCart(cartId:number){
 const header=this.Http.getHeaderToken();
    return this.Http.deleteApi(`/api/carts/${cartId}`,header);
  }
}
