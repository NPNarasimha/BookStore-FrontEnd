import { Injectable } from '@angular/core';
import { HttpServiceService } from '../Http-service/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private Http:HttpServiceService) { }
  addCustomerDetails(payload:any){
    const header=this.Http.getHeaderToken();
    return this.Http.postApi('/api/Customer',payload,header);
  }
}
