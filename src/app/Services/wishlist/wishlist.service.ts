import { Injectable } from '@angular/core';
import { HttpServiceService } from '../Http-service/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {


  constructor(private Http:HttpServiceService) { }

  AddToWishList(bookId:number){
    const header=this.Http.getHeaderToken();
    const payload = { bookId };
    return this.Http.postApi('/api/wishlist',payload,header);
  }
  GetAllWishList(){
    const header=this.Http.getHeaderToken();
    return this.Http.getApi('/api/wishlist',header);
  }
  removeWishList(wishListId:number){
    const header=this.Http.getHeaderToken();
    return this.Http.deleteApi(`/api/wishlist/${wishListId}`,header); 
  }
 
}
