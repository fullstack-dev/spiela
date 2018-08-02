import {Pipe, PipeTransform} from '@angular/core';
import linkifyHtml from 'linkifyjs/html';
import mention from 'linkifyjs/plugins/mention';
import * as linkify from 'linkifyjs';
import {DomSanitizer} from "@angular/platform-browser";

mention(linkify);

@Pipe({
    name: 'urlify'
})
export class UrlifyPipe implements PipeTransform {


    constructor(private sanitizer: DomSanitizer) {
    }

    transform(value: any): any {
        value = linkifyHtml(value, {});
        // return value;
        console.log("value", value);
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }

}
