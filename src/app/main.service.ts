import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import * as Rx from 'rxjs';
import {Observable} from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { ReplaySubject } from "rxjs";

// import { PublishSubject }    from 'rxjs/PublishSubject';

// import 'rxjs/add/operator/map';
import * as io from "socket.io-client";
declare var $: any;

@Injectable()
export class MainService {
  // private port='http://localhost:8080';
  private socket;
  // public userList;
  initUser;

  mySock;
  myUsername;
  myRoom;
  // userList: Subject<any> = new Subject<any>();
  userList: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  userList$ = this.userList.asObservable();

  messageList: Subject<any> = new Subject<any>();
  // messageList: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  // messageList: ReplaySubject<any> = new ReplaySubject<any>();
  messageList$ = this.messageList.asObservable();

  chatList: Subject<any> = new Subject<any>();
  chatList$ = this.chatList.asObservable();

  constructor(private router: Router) {
    // this.socket= io(this.port);
    this.socket = io();
    this.start();
  }

//Sign In
  sign(dat){
    console.log('attempting to sign in');
    this.socket.emit('new user', dat, (data)=>{
      if(data==true){
          this.myUsername=dat.name; this.myRoom=dat.room
          this.router.navigate(["message"],{skipLocationChange:true});
        }
    });
}
 first=true;
  start(){
    var socket=this.socket;

        // Message Area
        socket.on('get users',(data:any)=>{
            console.log('Got the pack: '+data);
          // this.userList= data;
             this.userList.next(data);
        });

        socket.on('new message', (data:any)=>{
          console.log("Messages Received");
          this.messageList.next(data);
          // this.messageList.push(data);
          // console.log(this.messageList);
        });

        socket.on('receive chat', (data:any)=>{
          console.log("Chat Received");
          this.chatList.next(data);
          // console.log(this.chatList);
        });
      }

  sendMessage(data){
    this.socket.emit('send message', data);
    console.log("Message Sent");
  }

  chat(data){
      console.log("Sending Chat Message")
      this.socket.emit('chat message', data);
  }

}
