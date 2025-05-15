import { Component, OnInit } from '@angular/core';
import { BookService } from '../../Services/book/book.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchService } from '../../Services/search/search.service';

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
  totalBooks = 0;
  constructor(private books: BookService, private searchSearch: SearchService, private router: Router, private snackBar: MatSnackBar,) { }
  ngOnInit(): void {
    this.getAllBooks();
    console.log("getAllBooks called");
    this.searchSearch.searchTerm$.subscribe((term: string) => {
      this.filteredBooks(term);
    })
  }
  getAllBooks() {
    this.books.GetAllBooks().subscribe({
      next: (result: any) => {
        const books = Array.isArray(result) ? result : result.data
        this.booksArray = books.reverse();
        this.filterBooks = this.booksArray;
        this.totalBooks = this.booksArray.length;
      }, error: (error) => {
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
  }
}
