import { Component, OnInit,ViewChild } from '@angular/core';
import {Http} from '@angular/http';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserService} from '../user.service';
import {firestore} from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
export class UploaderPage implements OnInit {

  imageURL:string
  aciklama:string

  busy:boolean=false

  scaleCrop:string="-/scale_crop/200x200"

  efektDizisi={
    efekt1:'',
    efekt2:'-/exposure/50/-/saturation/50/-/warmth/-30/',
    efekt3:'-/filter/vevera/150/',
    efekt4:'-/filter/carris/150/',
    efekt5:'-/filter/misiara/150/'
  }

  aktifEfekt=this.efektDizisi.efekt1

  yuzYok:boolean=false

  @ViewChild('filebtn') filebtn
  constructor(public http:Http,
    public afStore:AngularFirestore,
    public service:UserService,
    public alert:AlertController,
    public router:Router) { }

  ngOnInit() {
  }

  secileniAyarla(efekt:string){

    this.aktifEfekt=this.efektDizisi[efekt]

  }

  resimYukle(){
    this.filebtn.nativeElement.click()
  }

  async postOlustur(){
    this.busy=true
    const resim=this.imageURL
    const aciklama=this.aciklama
    const aktifEfekt=this.aktifEfekt

    this.afStore.doc(`users/${this.service.getUID()}`).update({
      posts:firestore.FieldValue.arrayUnion({
        posts:`${resim}/${aktifEfekt}`,
      })
    })

    this.afStore.doc(`posts/${resim}`).set({
      aciklama,
      yazar:this.service.getUsername(),
      begeniler:[],
      efekt:aktifEfekt
    })

    this.busy=false
    this.imageURL=""
    this.aciklama=""

    const mesaj=await this.alert.create({
      header:"Başarılı",
      message:"Ekleme İşlemi Başarılı",
      buttons:["Tamam"]
    })

    await mesaj.present()

    this.router.navigate(['/tabs/feed'])
  }

  fileChanged(event){
    this.busy=true
    const files=event.target.files
    //console.log(files)

    const data=new FormData()
    data.append('file',files[0])
    data.append('UPLOADCARE_STORE','1')
    data.append('UPLOADCARE_PUB_KEY','e8d70db5e2bdfc77e9e5')

    this.http.post('https://upload.uploadcare.com/base/',data).subscribe(event=>{
      //console.log(event)
      this.imageURL=event.json().file
      this.busy=false
      this.http.get(`https://ucarecdn.com/${this.imageURL}/detect_faces/`).subscribe(event=>{
        this.yuzYok=event.json().faces==0
      })
    })
  }

}
