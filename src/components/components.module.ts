import { NgModule } from '@angular/core';
import { ShareMenuComponent } from './share-menu/share-menu';
import { ContextMenuComponent } from './context-menu/context-menu';
import { ProfileMenuComponent } from './profile-menu/profile-menu';
import { TutorialsComponent } from './tutorials/tutorials';
import { CommonModule } from '@angular/common';
import {IonicApp, IonicModule} from 'ionic-angular';
 
@NgModule({
	declarations: [ShareMenuComponent, ContextMenuComponent, ProfileMenuComponent, TutorialsComponent],
	imports: [CommonModule, IonicModule],
	exports: [ShareMenuComponent, ContextMenuComponent, ProfileMenuComponent, TutorialsComponent]
})
export class ComponentsModule {}