import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { MainService } from './main.service';
// import * as io from "socket.io-client";


import { HomeComponent } from './home/home.component';
import { MessageComponent } from './message/message.component';

const routes: Routes = [
  // { path: '', redirectTo:'home',pathMatch:'full' },
  { path: '', component:HomeComponent },
  { path: 'message', component:MessageComponent }
];


@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot( routes, { useHash: false } ),
  ],
  providers: [ MainService ],
  exports: [
    RouterModule
  ],
})

export class AppRoutingModule {}
