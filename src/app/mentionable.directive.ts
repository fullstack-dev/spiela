import {Directive, ElementRef, EventEmitter, Output} from '@angular/core';
import {UserPage} from "../pages/user/user";
import {NavController} from "ionic-angular";
import {AuthHttp} from "angular2-jwt";
import {AuthService} from "../providers/auth-service";

@Directive({
    selector: '[appMentionable]'
})
export class MentionableDirective {

    @Output() tags:EventEmitter<any> = new EventEmitter();

    error: string = '';
    navigateUserUsername(username) {
        this.navCtrl.push(UserPage, {
            userId: username
        });
    }

    loadUserTags(q) {  
        this.http.get(this.auth.API_URL + 'usertags/list.json?q='+q).subscribe(
            data => {
                this.tags.emit({data:data.json(), last:q});
            },
            err => this.error = err)
    }

    constructor(private auth: AuthService, private http: AuthHttp, private elementRef: ElementRef, public navCtrl: NavController) {
        console.log('mentionable component', this.elementRef.nativeElement);
        this.elementRef.nativeElement.onclick = (e) => {
            let href = e.target.getAttribute('href');
            if (href && href.indexOf('/') === 0) {
                var username = href.replace('/', '');
                this.navigateUserUsername(username);
                e.preventDefault();
                console.log(e);
            }
        }
        this.elementRef.nativeElement.onkeyup = (e) => {
            let el = e.target;
            let text = el.value;
            let toProcess = text.substr(0, el.selectionEnd);
            


            let re = /@([^#\s@]*[^.\s])+/ig;
            let match = toProcess.match(re);
            if (!match || !match.length) {
                 if (text.length < 2)
                {
                    var data = [];
                    var q = '';
                    this.tags.emit({data:data, last:q});
                }
                return;
            }
            let last = match.pop().replace('@', '');
            if (last) {
                console.log('match', last);
                this.loadUserTags(last);
                // get list of matched usernames
                ///api/usertags/list

            }

        }
    }

}
