import { Component, OnInit } from '@angular/core';
import {MainService} from '../main.service';
import { Router } from '@angular/router';


// import * as io from "socket.io";
// declare var io:any;
import * as io from "socket.io-client";

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private name="";
  private room=0;
  private roomList=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

  constructor(private main:MainService, private router:Router) { }


  ngOnInit() {
    $('#name').focus();
    // $('#signArea').css("background-color","blue");
    // setTimeout(_=>{this.router.navigate(["message"])},1000)
    // setInterval(_=>{if(this.main.done==true){this.router.navigate(['message'])}},2000);
  }
  click(){
    $('#click').prop("disabled",true);
    this.main.sign({name:this.name,room:this.room});
    console.log(this.name);
    // this.main.navi();
  }
}
