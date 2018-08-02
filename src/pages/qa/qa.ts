// import { NotifyService } from '../../providers/notify-service';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NotifyService } from "../../providers/notify-service";
@Component({
  selector: 'page-qa',
  templateUrl: 'qa.html'
})
export class QaPage implements OnInit {

  constructor(
    // private notify: NotifyService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private notify : NotifyService
  ) {}

  loader = null;

  ngOnInit() {
      this.loader = this.notify.showLoader();
  }

  uploadDone() {  
    this.loader.dismissAll();
  }    
}
