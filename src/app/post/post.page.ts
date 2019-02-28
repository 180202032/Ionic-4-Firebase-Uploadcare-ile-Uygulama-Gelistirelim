import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore ,AngularFirestoreDocument} from '@angular/fire/firestore';
import {UserService} from '../user.service';
import {firestore} from 'firebase/app';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  postID:string
  post
  kalpDurum:string="heart-empty"

  postRefence:AngularFirestoreDocument
  sub

  efekt:string=''
  constructor(private route:ActivatedRoute,
    private afStore:AngularFirestore,
    private user:UserService) { }

  ngOnInit() {

    this.postID=this.route.snapshot.paramMap.get('id')
    // this.post=this.afStore.doc(`posts/${this.postID}`).valueChanges()

    this.postRefence=this.afStore.doc(`posts/${this.postID}`)
    this.sub=this.postRefence.valueChanges().subscribe(val=>{
      this.post=val
      this.kalpDurum=val.begeniler.includes(this.user.getUID())?'heart':'heart-empty'
      this.efekt=val.efekt
    })

  }

  ngOnDestroy(){
    this.sub.unsubscribe()
  }

  toogleKalp(){
    // this.kalpDurum=this.kalpDurum=="heart" ? "heart-empty":"heart"
    if(this.kalpDurum=='heart-empty'){
      this.postRefence.update({
        begeniler:firestore.FieldValue.arrayUnion(this.user.getUID())
      })
    }else{
      this.postRefence.update({
        begeniler:firestore.FieldValue.arrayRemove(this.user.getUID())
      })
    }
  }



}
