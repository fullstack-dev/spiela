import { Injectable } from '@angular/core';
import { RestService } from '../providers/rest-service';
import { AuthService } from "../providers/auth-service";

@Injectable()
export class Support
{
    supporting: any[] = [];
    supportArray: any[] = [];
   // supportingT: string = '';
    constructor( private rest: RestService, private auth: AuthService ) {   }
    private error = '';
    private userId: number = 0;
    private username: string ='';
    getSupporting(userId)
    {
        if (isNaN(userId)) return [];
        else return this.supportArray;
    }
    getUserID() 
    {
        return this.userId;
    }
    resetUserId()
    {
        this.userId = 0;
    }
    setUserId(userid)
    {
        this.userId = userid;
    }
    loadSupporting(userId)
    {
        this.userId = userId;
        if (this.auth.user == '' || this.auth.user == null)
        {
            this.auth.loadUser(userId);
        }
        this.rest.loadSupportings(userId).subscribe(data => {
            this.supporting = data.json().users;
            if (this.supporting)
            {
                var a = 0;
                for (let i of this.supporting)
                {
                   this.supportArray[a] = i.id;
                    a++;
                }
            }
            this.supportArray = [...this.supportArray, userId];
        }, err => this.error = err);
    }
    storeUsername(username)
    {
        this.username = username;
    }
    getUsername()
    {
       return this.username;
    }
}