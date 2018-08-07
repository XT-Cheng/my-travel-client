import { Injectable } from '@angular/core';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable({ providedIn: 'root' })
export class StartupService {
  constructor(
  ) { }

  private viaHttp(resolve: any, reject: any) {
      resolve({});
  }

  // TODO: Retrieve required information from local storage
  private viaLocalStorage(resolve: any, reject: any) {
    resolve({});
  }

  private viaMock(resolve: any, reject: any) {
    resolve({});
  }

  load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.viaLocalStorage(resolve, reject);
    });
  }
}
