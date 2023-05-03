import { Injectable } from '@angular/core';
import { LOCAL_STORAGE_CONST } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  getToken() {
    if (localStorage.getItem(LOCAL_STORAGE_CONST.JWT_TOKEN)) {
      return localStorage.getItem(LOCAL_STORAGE_CONST.JWT_TOKEN);
    }
    return '';
  }
}
