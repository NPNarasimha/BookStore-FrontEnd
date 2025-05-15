import { Injectable } from '@angular/core';
import { HttpServiceService } from '../Http-service/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
token:any
  constructor(private Http:HttpServiceService) {
this.token=this.Http.getHeader();
   }

  GetAllBooks(){
    const header=this.Http.getHeaderToken();
    return this.Http.getApi('/api/books',header);
  }
  

}
