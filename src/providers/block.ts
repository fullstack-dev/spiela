import { Injectable } from '@angular/core';
import { RestService } from '../providers/rest-service';

@Injectable()
export class Block
{
    blocked: any[] = [];
    constructor( private rest: RestService ) {  }
    getBlocked(userId)
    {
        if (isNaN(userId)) return [];
        else return this.blocked;
    }
    loadBlocked(userid)
    {
        this.rest.getAllHidden().subscribe(
            data => this.blocked = data.json().data,
            
        );
    }
}