import { Component, OnInit } from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {UserService} from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  profilKullanici:AngularFirestoreDocument
  sub
  posts
  kullanici:string
  profilFoto:string

  userPosts
  constructor(public afStore:AngularFirestore,public service:UserService,public router:Router) {
    this.profilKullanici=this.afStore.doc(`users/${this.service.getUID()}`)
    this.sub=this.profilKullanici.valueChanges().subscribe(event=>{

      this.posts=event.posts
      this.kullanici=event.username
      this.profilFoto=event.profilFoto
    })
    
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.sub.unsubscribe()
  }

  posttaGit(postID:string){
      this.router.navigate(['/tabs/post/'+postID.split('/')[0]])
  }

}
