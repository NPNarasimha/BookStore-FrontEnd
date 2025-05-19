import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit{
constructor(private router:Router){}
 orderId: number = 0;
 loading: boolean = true
 displayedColumns: string[] = ['name', 'contact', 'address'];
  dataSource: any[] = [];
  ngOnInit(): void {
    this.orderId = this.generateRandomOrderId();
   setTimeout(() => {
      const state = history.state;
      console.log("history state ", state);
      if (state && state.orderData) {
        this.dataSource = [{
          name: state.orderData.name,
          contact: state.orderData.mobileNumber,
          address: state.orderData.address
        }];
        console.log("Order data received:", this.dataSource);
      }

      this.loading = false; // Hide spinner once data is set
    }, 1000); 
  }
  generateRandomOrderId(): number {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit number
  }
   GotoDisplayBooks(){
    this.router.navigate(['/dashboard/home'])
   }
}
