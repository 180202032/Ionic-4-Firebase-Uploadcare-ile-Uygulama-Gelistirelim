import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {first} from 'rxjs/operators';
import {auth} from 'firebase/app'

interface user{
    kullanici:string,
    id:string
}

@Injectable()
export class UserService{
    private user:user

    constructor(private afAuth:AngularFireAuth){

    }

    setUser(user:user){
        this.user=user
    }

    async isAuthenticated(){
        if(this.user) return true

        const user=await this.afAuth.authState.pipe(first()).toPromise()

        if(user){
            this.setUser({
                kullanici:user.email,
                id:user.uid
            })

            return true
        }

        return false

    }

    getUsername(){
        return this.user.kullanici
    }

    getUID(){

        return this.user.id
    }

    reAuth(kullanici:string,parola:string){
        return this.afAuth.auth.currentUser.reauthenticateWithCredential(auth.EmailAuthProvider.credential(kullanici,parola))
    }

    updatePassword(parola:string){
        return this.afAuth.auth.currentUser.updatePassword(parola)
    }

    updateUsername(kullanici:string){
        return this.afAuth.auth.currentUser.updateEmail(kullanici)
    }
}