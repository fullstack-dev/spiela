import { Component, ViewChild } from '@angular/core';

import { HomePage } from '../home/home';
import { ExplorerPage } from '../explorer/explorer';
import { Tabs } from "ionic-angular";
import { AuthService } from "../../providers/auth-service";
import { QaPage } from "../qa/qa";
import { UserPage } from "../user/user";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    tab1Root: any = HomePage;
    tab2Root: any = ExplorerPage;
    tab3Root: any = QaPage;
    profilePage: any = UserPage;

    constructor(public auth: AuthService) { }
}
