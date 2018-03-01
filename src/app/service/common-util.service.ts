import { Injectable } from '@angular/core';

@Injectable()
export class CommonUtilService {

  constructor() { }

  public twoDigitsFormat(value: number): string {
    return (value < 10 ? '0' : '') + value;
  }
}
