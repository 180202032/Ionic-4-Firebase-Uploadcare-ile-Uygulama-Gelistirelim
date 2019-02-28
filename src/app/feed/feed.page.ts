import { Component, OnInit } from '@angular/core';

import {AngularFireFunctions} from '@angular/fire/functions';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  posts
  sub
  constructor(private afFunc:AngularFireFunctions) { }

  ngOnInit() {


    const feedFunc=this.afFunc.httpsCallable('FeedGetir')

    this.sub=feedFunc({}).subscribe(data=>{
      //console.log(data)
      this.posts=data
    })

  }

  ngOnDestroy(){
    this.sub.unsubscribe()
  }

}
