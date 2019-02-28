import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { Http } from '@angular/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  @ViewChild('filebtn') fileBtn:{
    nativeElement:HTMLInputElement
  }

  profilKullanici:AngularFirestoreDocument
  sub
  kullanici:string
  profilFoto:string

  busy:boolean=false

  eskiParola:string
  yeniParola:string

  constructor(private afStore:AngularFirestore,
    private user:UserService,
    private http:Http,
    private alert:AlertController,
    private router:Router) { 
    this.profilKullanici=afStore.doc(`users/${user.getUID()}`)

    this.sub=this.profilKullanici.valueChanges().subscribe(event=>{

      this.kullanici=event.username
      this.profilFoto=event.profilFoto
    })
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.sub.unsubscribe()
  }

  profilFotoSec(){
    this.fileBtn.nativeElement.click()
  }

  profilFotoGuncelle(event){
    const files=event.target.files

    const data=new FormData()
    data.append('file',files[0])
    data.append('UPLOADCARE_STORE','1')
    data.append('UPLOADCARE_PUB_KEY','e8d70db5e2bdfc77e9e5')

    this.http.post('https://upload.uploadcare.com/base/',data).subscribe(event=>{

    const uuid=event.json().file

    this.profilKullanici.update({
      profilFoto:uuid
    })

    })

  }

  async MesajGoster(baslik:string,icerik:string){

    const mesaj=await this.alert.create({
      header:baslik,
      message:icerik,
      buttons:['Tamam']
    })

    return mesaj.present()
  }

  async bilgileriGuncelle(){
    this.busy=true

    if(!this.eskiParola){
      this.busy=false
      
      return this.MesajGoster("Hata","Parola Alanı Boş Geçilemez")
    }

    try {

      this.busy=false
      await this.user.reAuth(this.user.getUsername(),this.eskiParola)
      
    } catch (error) {
      this.busy=false
      return this.MesajGoster("Hata","Yanlış Parola")
    }

    if(this.yeniParola){
      this.busy=false
      await this.user.updatePassword(this.yeniParola)
    }

    if(this.kullanici!==this.user.getUsername()){
      await this.user.updateUsername(this.kullanici)
      this.profilKullanici.update({
        username:this.kullanici
      })

    }

    this.eskiParola=""
    this.yeniParola=""
    this.busy=false

    this.MesajGoster("Başarılı","Profil Bilgileriniz Güncellendi")

    this.router.navigate(['/tabs/feed'])
  }

}
