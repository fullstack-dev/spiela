import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Injectable } from '@angular/core';
import config from "../app/config.json";


@Injectable()
export class RestService {
    constructor(
        private http: AuthHttp,
        private rawHttp: Http
    ) { }

    fbLogin(fbAccessToken) {
        let url = `${config.API_URL}auth/facebook/${fbAccessToken}`;
        return this.rawHttp.get(url);
    }
    nextButton()
    {
        
    }
    // Collibration related methods

    loadCollibration(collId) {
        let url = `${config.API_URL}collaborations/${collId}`;
        return this.http.get(url);
    }

    loadCollibrations(all, offset, max, query, asearch, keywords = '') {
        var url = `${config.API_URL}collaborations`;
        
        if (asearch) 
        {    
            url = url + `?offset=${offset}&max=${max}&q=${query}&keywords=${keywords}&thetime=` + Date.now();
        }
        else
        {
            url = url + `?offset=${offset}&max=${max}&keywords=${keywords}`;
        }
        return this.http.get(url).map(data => data.json());
    }

    voteCollibration(collId, value) {
        let url = `${config.API_URL}collaboration/${collId}/collaboration/like?value=" + ${value}`;
        return this.http.post(url, {});
    }

    hideCollibration(collId) {
        let url = `${config.API_URL}collaborations/${collId}/hide`;
        return this.http.post(url, { id: collId })
    }

    deleteCollibration(collId) {
        let url = `${config.API_URL}collaborations/${collId}`;
        return this.http.delete(url)
    }

    /*uploadCollImg(photo, callback) {
        this.http.post(
            `${config.API_URL}collaborations/create`,
            {photo}
        ).subscribe(
            data => callback(null, data),
            err => callback(err, null)
        );
    }*/

    addCollaboration(data) {  
        let url = `${config.API_URL}collaborations/create`;
        return this.http.post(url, data).map(data => data.json());
    }

    addCollaborationImg(collId, content, photo) {
        let body = { content, photo };
        let url = `${config.API_URL}collaborations/${collId}/add-spiel`;
        return this.http.post(url, body).map(data => data.json());
    }

    // Commenting related methods
    addCommentOnCollibration(collId, comment) {
        let url = `${config.API_URL}collaboration/${collId}/comment/create`;
        return this.http.post(url, { content: comment });
    }

    deleteComment(id) {
        let url = `${config.API_URL}comments/${id}`;
        return this.http.delete(url);
    }

    voteCommentOnCollibrartion(collId, value) {
        let url = `${config.API_URL}item/${collId}/comment/like?value="${value}`;
        return this.http.post(url, {});
    }

    // spiel related methods
    voteSpielaOnCollibrartion(collId, value) {
        let url = `${config.API_URL}item/${collId}/spiel/like?value="${value}`;
        return this.http.post(url, {});
    }

    deleteSpiel(id) {
        let url = `${config.API_URL}spiels/${id}`;
        return this.http.delete(url);
    }

    uploadAvata(photo, callback) {
        this.http.post(
            `${config.API_URL}user/upload`,
            { photo }
        ).subscribe(
            data => callback(null, data),
            err => callback(err, null)
            );
    }

    // User Related Methods.
    loadUser(idOrName) {
        let url = `${config.API_URL}users/${idOrName}`;
        return this.http.get(url).map(data => data.json());
    }

    loadUserProfile(userId) {
        
        let url = userId ?
            `${config.API_URL}users/${userId}/profile.json` :
            `${config.API_URL}user-profile.json`;
             
        return this.http.get(url).map(data => data.json());
    }
    editUserProfile(user) {
        
        let url = `${config.API_URL}add/user/editprofile`;
        return this.http.post(url, { user });
    }
    addUserType(type) {
        let url = `${config.API_URL}add/user/type`;
        return this.http.post(url, { type });
    }

    getAllHidden() {
        let url = `${config.API_URL}hidden-content/all`;
        return this.http.get(url);
    }

    loadSupporters(userId) {
        //userId= 1;
        let url = `${config.API_URL}users/${userId}/likes/supporters`;
        return this.http.get(url);
    }

    loadSupportings(userId) {
        //userId = 1;
        let url = `${config.API_URL}users/${userId}/likes/supporting`;
        return this.http.get(url);
    }

    blockUser(userId) {
        let url = `${config.API_URL}users/${userId}/hide`;
        return this.http.post(url, {});
    }

    unblockItem(itemId) {
        let url = `${config.API_URL}hidden-content/${itemId}/unblock`;
        return this.http.delete(url);
    }

    supportItem(itemId) {
        let url = `${config.API_URL}collaboration/${itemId}/userSupported/like.json`;
        return this.http.get(url).map(data => data.json());
    }

    // Bulletin board
    loadBulletins() {
        let url = `${config.API_URL}bulletin-board`;
        return this.http.get(url).map(data => data.json());
    }

    checkSeenBulletins() {
        let url = `${config.API_URL}check/seen`;
        return this.http.get(url).map(data => data.json().count);
    }
}
