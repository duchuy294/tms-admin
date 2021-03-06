import { Injectable } from '@angular/core';

@Injectable()
export class BaImageLoaderService {

  public load(src): Promise<any> {

    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = function () {
        resolve(`Image with src ${src} loaded successfully.`);
      };
    });
  }
}
