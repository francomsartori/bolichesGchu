import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'aniocierre'
})
export class AniocierrePipe implements PipeTransform {

  transform(value: string): string {
      if (value == '0'){
        value = '';
      }
      return value;
  }
}
