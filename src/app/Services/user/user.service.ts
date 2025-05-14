import { Injectable } from '@angular/core';
import { HttpServiceService } from '../Http-service/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private Http:HttpServiceService) { }
  login(payload:any){
    return this.Http.postApi("/api/user/login",payload)
  }
  register(payload:any){
    return this.Http.postApi("/api/user/register",payload)
  }
}
