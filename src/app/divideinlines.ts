import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'divideInLines'})
export class divideInLinesPipe implements PipeTransform {
  transform(value: string): string {
    let x= String(value);
    let a= x.split(" "); 
    let str='';
    for(var i=0;i<a.length;i++)
    {
      if((i+1)% 5==0)str+='<br />';
      str+=" "+a[i];
    }
    return str;
  }
}