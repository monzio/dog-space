import { Injectable } from '@angular/core';
import { AreaCani } from '../model/AreaCani';

@Injectable({
  providedIn: 'root'
})
export class AreaCaniDataService {

  areeCani: [];
  areaCani: AreaCani;

  constructor() {}

  setAreecani(data) {
    this.areeCani = data;
  }

  getMuseums() {
    return this.areeCani;
  }

  setAreaCani(data) {
    this.areaCani = data;
  }

  getAreaCani() {
    return this.areaCani;
  }
}
