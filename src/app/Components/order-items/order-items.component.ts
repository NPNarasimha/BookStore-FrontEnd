import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../Services/order/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Console } from 'console';

@Component({
  selector: 'app-order-items',
  standalone: false,
  templateUrl: './order-items.component.html',
  styleUrl: './order-items.component.scss'
})
export class OrderItemsComponent implements OnInit{
  loading: boolean = false;
  constructor(private orderservices:OrderService,private snackbar:MatSnackBar){}
  ngOnInit(): void {
    this.GetAllOrders();
  }
  orderItems:any[]=[];
  quantity:number=0;
  GetAllOrders(){
     this.loading = true;
    this.orderservices.GetAllOrders().subscribe(
      (result:any)=>{
         this.loading = false;
        console.log("order items recevied",result);
        this.orderItems=result.data||[];
        this.quantity=this.orderItems.length;
        this.snackbar.open("Get all Orders","",{ duration: 3000 })
      }, (error) => {
         this.loading = false;
        console.error('Error fetching orders:', error);
      }
    )
  }

}
