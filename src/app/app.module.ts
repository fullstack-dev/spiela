import { SignupPage } from './../pages/signup/signup';
import { BrowserModule } from '@angular/platform-browser';
import { Http, RequestOptions, HttpModule } from '@angular/http';
import { ReportPage } from '../pages/shared-report-modal/report-modal';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ExplorerPage } from '../pages/explorer/explorer';
import { FeedbackPage } from '../pages/feedback/feedback';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TermsPage } from '../pages/home/terms';
import { PolicyPage } from '../pages/home/policy';
import { CommunityPage } from '../pages/home/community';
import { MyCollaborationPage } from '../pages/my-collaboration/my-collaboration';
import { StartCollaborationPage } from '../pages/start-collaboration/start-collaboration';
import { CanvasPage } from '../pages/canvas/canvas';
import { InvitePage } from '../pages/invite/invite';
import { TabsPage } from '../pages/tabs/tabs';
import { BulletinBoardPage } from '../pages/bulletin-board/bulletin-board';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { ProfilePage } from "../pages/profile/profile";
import { CollaborationPage } from "../pages/collaboration/collaboration";
import { EditPicturePage } from "../pages/editpicture/editpicture";
import { MomentModule } from 'angular2-moment';
import { UserPage } from "../pages/user/user";
import { QaPage } from "../pages/qa/qa";
import { File } from "@ionic-native/file";
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { ShareMenuComponent } from "../components/share-menu/share-menu";
import { ContextMenuComponent } from "../components/context-menu/context-menu";
import { MyBookmarksPage } from '../pages/my-bookmarks/my-bookmarks';
import { ComponentsModule } from "../components/components.module";
import { UrlifyPipe } from './urlify.pipe';
import { MentionableDirective } from './mentionable.directive';
import { Autoresize } from './autoresize';
import { AboutPagePage } from '../pages/about-page/about-page';
import { IntroPage } from '../pages/intro/intro';
import { Base64 } from '@ionic-native/base64';
import { Facebook } from '@ionic-native/facebook';
import { AuthService } from "../providers/auth-service";
import { RestService } from "../providers/rest-service";
import { CameraService } from "../providers/camera-service";
import { NotifyService } from "../providers/notify-service";
import { Block } from "../providers/block";
import { Support } from "../providers/support";
import { PushNoti } from "../providers/pushnoti";
import { Bookmarks } from "../providers/bookmarks";
import { LoginPage } from '../pages/login/login';
import { EditProfilePage } from '../pages/editprofile/editprofile';
import { SearchresultsPage } from '../pages/searchresults/searchresults';
import { ViewPicturePage } from '../pages/view-picture/view-picture';
import { divideInLinesPipe } from './divideinlines';
import { CapitalizeFirstPipe } from './capitalizer.pipe';
import { ProfileMenuComponent } from "../components/profile-menu/profile-menu";
import { TutorialsComponent } from "../components/tutorials/tutorials";
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { IonicStorageModule } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';
import { TooltipsModule } from 'ionic-tooltips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { SocialSharing } from '@ionic-native/social-sharing';

import { IonicImageViewerModule } from 'ionic-img-viewer';
import { NewlinePipe } from './newline.pipe';

export function provideStorage() {
    return new Storage({
        name: '_ionicstorage',
        storeName: '_ionickv',
        driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
    });
}

export function authHttpServiceFactory(storage: Storage, http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
        // tokenName: 'id_token',
        // tokenGetter: () => storage.get('id_token'),
        globalHeaders: [{ 'Content-Type': 'application/json' }],
    }), http, options);
}

var config = {
    apiKey: "AIzaSyBJCqeQIYdD4brQTqcxrLkoxBcndbd18hs",
    authDomain: "cobalt-abacus-125119.firebaseapp.com",
    databaseURL: "https://cobalt-abacus-125119.firebaseio.com",
    projectId: "cobalt-abacus-125119",
    storageBucket: "cobalt-abacus-125119.appspot.com",
    messagingSenderId: "172797515074"
  };

@NgModule({
    declarations: [
        MyApp,
        ExplorerPage,
        ContactPage,
        FeedbackPage,
        HomePage,
        TabsPage,
        ProfilePage,
        CollaborationPage,
        UserPage,
        QaPage,
        BulletinBoardPage,
        ReportPage,
        TermsPage,
        PolicyPage,
        CommunityPage,
        EditPicturePage,
        MyCollaborationPage,
        StartCollaborationPage,
        CanvasPage,
        InvitePage,
        // ContextMenuComponent,
        UrlifyPipe,
        MentionableDirective,
        Autoresize,
        AboutPagePage,
        LoginPage,
        SignupPage,
        SearchresultsPage,
        divideInLinesPipe,
        CapitalizeFirstPipe,
        MyBookmarksPage,
        EditProfilePage,
        IntroPage,
        ViewPicturePage,
        NewlinePipe,
     ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        MomentModule,
        ComponentsModule,
        IonicImageViewerModule,
        
        AngularFireModule.initializeApp(config),
        AngularFireDatabaseModule,
        IonicStorageModule.forRoot({
            name: 'spielaMain',
            driverOrder: ['sqlite', 'websql']
          }),
          BrowserAnimationsModule,
          TooltipsModule,
        // Nl2BrPipeModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ExplorerPage,
        ContactPage,
        FeedbackPage,
        HomePage,
        TabsPage,
        ProfilePage,
        EditPicturePage,
        CollaborationPage,
        UserPage,
        QaPage,
        BulletinBoardPage,
        ReportPage,
        TermsPage,
        PolicyPage,
        CommunityPage,
        MyCollaborationPage,
        StartCollaborationPage,
        CanvasPage,
        InvitePage,
        ShareMenuComponent,
        ContextMenuComponent,
        ProfileMenuComponent,
        TutorialsComponent,
        AboutPagePage,
        LoginPage,
        SignupPage,
        MyBookmarksPage,
        SearchresultsPage,
        EditProfilePage,
        IntroPage,
        ViewPicturePage,
    ],
    providers: [
        File,
        FileTransfer,
        Camera,
        FilePath,
        StatusBar,
        SplashScreen,
        Base64,
        Facebook,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        {
            provide: Storage,
            useFactory: provideStorage
        }, {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Storage, Http, RequestOptions]
        },
        SocialSharing,
        AuthService,
        RestService,
        CameraService,
        NotifyService,
        PushNoti,
        FCM,
        Bookmarks,
        Block,
        Support
    ]
})
export class AppModule {
    constructor() {
    }
}
