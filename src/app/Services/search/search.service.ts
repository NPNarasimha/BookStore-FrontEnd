import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
private searchSubject = new BehaviorSubject<string>('');
searchTerm$ = this.searchSubject.asObservable();

 setSearchTerm(term: string) {
  this.searchSubject.next(term);
}

}
