import { Component, OnInit } from '@angular/core';
import {MainService} from '../main.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


declare var $: any;

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  private userList;
  private messageList=[];
  private myMessage;

  private chatList=[];
  private chatSock:any;
  private chatMsg="";

  private chatOpen;

  constructor(private main:MainService) {
    this.chatOpen=false;
    this.subscribe();
    // this.chatSock={username:""};
  }

  updateScroll(){
    $("#msgDisp").animate({ scrollTop: $('#msgDisp').prop("scrollHeight")}, 500);
}
  updateChatScroll(){
    $("#chatDisp").animate({ scrollTop: $('#chatDisp').prop("scrollHeight")}, 200);
}

  subscribe(){
    console.log("subscribe started");
    this.main.userList$.subscribe((data) => {
        this.userList=data;
        // $('#'+this.main.myUsername).disable();
        // console.log("My data "+data);
    });
    this.main.messageList$.subscribe((data)=>{
      this.messageList.push(data);
      this.main.play("main");
      this.updateScroll();
    });


    this.main.chatList$.subscribe((data)=>{
      var pack={senderName:data.chatSock.username,msg:data.msg};
      if(this.chatOpen){
        //Handles chat open and correct user
        if(data.chatSock.username==this.chatSock.username){
           this.chatList.push(pack);
          this.main.play("chatMsg");
           this.updateChatScroll();
        }
        //Handles chat open, but diff user
        else{
          this.wrongChat(data);
        }
    }
      // Handles chat closed
      else{
        this.chatList.push(pack);
        this.main.play("chatMsg");
        this.updateChatScroll();
        this.chat(data.chatSock);
      }
    });

  }

  wrongChat(data){
    this.closeChat();

    this.chatSock=data.chatSock;
    console.log(`starting chat with ${this.chatSock.username} ${this.chatSock.sock}`);
    this.chatList.push({senderName:data.chatSock.username,msg:data.msg});
    this.main.play("chatMsg");
    $('#chatContain').slideDown(600);
    this.chatOpen=true;
  }

  send(){
    this.main.sendMessage(this.myMessage);
    this.myMessage="";
  }


  chat(sock){
    if(!this.chatOpen){
      this.chatSock=sock;
      console.log(`starting chat with ${this.chatSock.username} ${this.chatSock.sock}`);
      this.chatOpen=true;
      $('#chatContain').slideDown(600);
      this.main.play("chatOpen");
      $('#chat').focus();
    }
    else
      this.switchChat(sock);
  }

  sendChat(){
    if(this.chatMsg!="" && this.chatSock!=null){
      var pack={senderName:this.main.myUsername, chatSock:this.chatSock, msg:this.chatMsg};
      this.chatList.push({senderName:this.main.myUsername,msg:pack.msg});
      this.main.play("submit");
      this.updateChatScroll();
      this.main.chat(pack);
      $('#chatContain').slideDown(600);
      this.chatMsg="";
    }
    else
      this.chatMsg="";
  }

  switchChat(sock){
    this.closeChat();
    setTimeout(_=>{ this.chat(sock)},300);
  }

  closeChat(){
    $('#chatContain').slideUp(200);
    this.chatOpen=false;
    this.chatList=[];
    this.chatSock="";
    this.chatMsg="";
  }

  onSide=false;

  clickSide(){
    if(!this.onSide){
      $('#sideContain').css({"display":"inline","position":"absolute","top":"0","right":"0"});
      $('#fullMenu').css("opacity",".5");
    }
    else{
       $('#sideContain').css("display","none");
       $('#fullMenu').css("opacity","1");
    }
  }

  ngOnInit() {
    console.log("My username is "+this.main.myUsername + " In room "+this.main.myRoom);
    $('#message').focus();
        // $('#chatContain').slideUp(10);
    // setTimeout(_=>{$('#'+this.main.myUsername).hide()},10);
    
  }

}
