import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions } from "@angular/http";
 
import config from "../app/config.json";

import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class Bookmarks 
{
    bookmarks = [];
   // model: Post = new Post()
    contentHeader: Headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded" });
    constructor( private http: Http, private authHttp: AuthHttp ) { }
    bookmarkCollaboration(username, collaboration)
    {
        if (username == '') return;
        let offset = 0, max = 10;
        var url = `${config.API_URL}addbookmark/${username}`;
        
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let data = this.authHttp.post(url, { id: collaboration.id }).map(data => data.json());
        return data;

       
        /*let data = this.http.post(url, { id: collaboration.id }, options).map(data => data.json());
        data.subscribe(data => {
        }, err => { console.log(err); });*/
    }
    getBookmark(username, collaboration)
    {
         
        if (username == '') return;
        var url = `${config.API_URL}getbookmark/${username}`;
        return this.authHttp.post(url, { id: collaboration.id }).map(data => data.json());
        /*
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(url, { id: collaboration.id }, options).map(data => data.json());*/
    }
    loadCollaborations(username)
    {
        let offset = 0, max = 10;
        var url = `${config.API_URL}bookmarks/${username}`;
        url = url + `?offset=${offset}&max=${max}`;
        //let data = this.http.get(url).map(data => data.json());
        let data = this.authHttp.get(url).map(data => data.json());
        return data;
    }
}