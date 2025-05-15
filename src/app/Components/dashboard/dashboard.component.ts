import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../Services/search/search.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  searchTerm="";
constructor(private router:Router,private searchService:SearchService){}
  ngOnInit(): void {
   console.log("ngOnInit called for DisplayBooksComponent");
  }

onSearchChange(){
  this.searchService.setSearchTerm(this.searchTerm)
}
logout(){
this.router.navigate(['']);
}
}
