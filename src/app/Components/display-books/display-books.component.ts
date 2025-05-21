import { Component, OnInit } from '@angular/core';
import { BookService } from '../../Services/book/book.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchService } from '../../Services/search/search.service';
import { PageEvent } from '@angular/material/paginator';
import { SharedService } from '../../Services/Shared/shared.service';

@Component({
  selector: 'app-display-books',
  standalone: false,
  templateUrl: './display-books.component.html',
  styleUrl: './display-books.component.scss'
})
export class DisplayBooksComponent implements OnInit {
  sortOption = 'relavence';
  booksArray: any[] = [];
  filterBooks: any[] = [];
  original:any[]=[];
  pagedBooks:any[]=[];
  totalBooks = 0;
  pagesize=8;
  currentPage = 0;
  isLoading: boolean = true;
  constructor(private books: BookService,
     private searchSearch: SearchService,
      private router: Router,
       private snackBar: MatSnackBar,
      
      ) { }
  ngOnInit(): void {
    this.getAllBooks();
    console.log("getAllBooks called");
    this.searchSearch.searchTerm$.subscribe((term: string) => {
      this.filteredBooks(term);
    })
  }
  getAllBooks() {
this.isLoading=true;
    this.books.GetAllBooks().subscribe({
      next: (result: any) => {
         this.isLoading = false;
        const books = Array.isArray(result) ? result : result.data
        this.original = books.reverse();
        console.log("Books received from backend:", books);
        this.booksArray = [...this.original];
      this.filterBooks = [...this.booksArray];
      this.totalBooks = this.booksArray.length;
      this.updatePagedBooks();
      }, error: (error) => {
         this.isLoading = false;
        console.error('Error fetching books:', error);
      },
    })
  }
  filteredBooks(term: string) {
    const lowerTerm = term.toLowerCase();
    this.filterBooks = this.booksArray.filter(book =>
      book.bookName.toLowerCase().includes(lowerTerm) ||
      book.author.toLowerCase().includes(lowerTerm)
    );
    this.currentPage = 0; 
    this.updatePagedBooks();
  }


  sortBooks(){
    if(this.sortOption=="relavence"){
      this.filterBooks = [...this.original];
    }else if(this.sortOption=="pricelow"){
      this.filterBooks.sort((a, b) => a.discountPrice - b.discountPrice);
    }
    else if(this.sortOption=="pricehigh"){
      this.filterBooks.sort((a,b)=>b.discountPrice-a.discountPrice );
    }
    else if(this.sortOption=="newest"){
      this.filterBooks.sort( (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
      this.currentPage = 0; 
    this.updatePagedBooks();
  }
  onPageChange(event:PageEvent){
    this.pagesize = event.pageSize;
    this.currentPage=event.pageIndex
    this.updatePagedBooks();
  }
  updatePagedBooks(){
    const startIndex = this.currentPage * this.pagesize;
    const endIndex = startIndex + this.pagesize;
     this.pagedBooks = this.filterBooks.slice(startIndex, endIndex);

  }
  viewBookDetails(bookId: number) {
    console.log('bookId being passed:', bookId);
  if (!bookId) {
    this.snackBar.open('Invalid book ID!', '', { duration: 3000 });
    return;
  }
    this.router.navigate(['/dashboard/bookdetails', bookId]);
  }
}
