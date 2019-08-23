import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CategoryProvider {

  categories = new BehaviorSubject({ 
    list: []
  });

  constructor() { }

  set(list) {
    this.categories.next({ 
      list: list
    });
  }

}
