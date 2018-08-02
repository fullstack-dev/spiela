import {Pipe, PipeTransform} from '@angular/core';
/*
 * Converts newlines into html breaks
*/
@Pipe({ name: 'newline' })
export class NewlinePipe implements PipeTransform {
    transform(value: string, args: string[]): any {
        if (value == null) return null;
        return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
}