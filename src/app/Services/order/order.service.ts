import { Injectable } from '@angular/core';
import { HttpServiceService } from '../Http-service/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private Http:HttpServiceService) { }
  addToOrder(cartdId:number){
const header=this.Http.getHeaderToken();
return this.Http.postApi(`/api/purchese?cartdId=${cartdId}`, cartdId, header);
  }

  GetAllOrders(){
    const header=this.Http.getHeaderToken();
    return this.Http.getApi('/api/purchese',header);
  }
}
