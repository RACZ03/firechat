import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { MessageI, UserI, ChatI, Chat_userI } from '../interfaces/messageI';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<MessageI>;
  
  private chatCollection: AngularFirestoreCollection<ChatI>;
  private chat_user: Chat_userI = {};

  private chat_UserCollection: AngularFirestoreCollection<Chat_userI>;

  private usersCollection: AngularFirestoreCollection<UserI>;
  public textMessages: MessageI[] = [];
  public users: UserI[] = [];

  public user: UserI = {};

  constructor(
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) { 
    this.itemsCollection = afs.collection<MessageI>('message');
    this.chatCollection = afs.collection<ChatI>('chats');
    this.chat_UserCollection = afs.collection<Chat_userI>('chat_user');

    this.afAuth.authState.subscribe( user => {
      // console.log('Estado del usuario: ', user);
      if( !user ){
        return;
      } else {
        this.user.displayName = user.displayName;
        this.user.uid = user.uid;
      }
    })
  }

  login( provider: string) {
    if (provider === 'google') {
      this.afAuth.signInWithPopup( new firebase.default.auth.GoogleAuthProvider())
                 .then(credential => this.updateUserData(credential.user) );
    } else {
      this.afAuth.signInWithPopup( new firebase.default.auth.TwitterAuthProvider())
                 .then(credential => this.updateUserData(credential.user) );
    }
  }

  async updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: UserI = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoUrl: user.providerData[0].photoURL
    };
    return userRef.set(data, {merge: true});
  }


  logout() {
    this.user = {};
    this.afAuth.signOut();
  }
  
  getChat() {
    this.chat_UserCollection = this.afs.collection<MessageI>('chat_user', 
                                                          ref => ref.where('uid', '==', this.user.uid));
    return this.chat_UserCollection.valueChanges()
                                   .pipe(
                                     map( (chat_user: Chat_userI[]) => { 
                                       console.log(chat_user)
                                        this.chat_user = chat_user[0];
                                        return chat_user[0]
                                      }
                                     )
                                   )
  }

  uploadMessage(idchat: string) {
    this.itemsCollection = this.afs.collection<MessageI>('message', 
                                                          ref => ref.where('idchat', '==', idchat)
                                                                    .orderBy('date', 'desc')
                                                                    .limit(5) );
    
    return this.itemsCollection.valueChanges()
                               .pipe(
                                  map( (messages: MessageI[]) => {
                                    this.textMessages = [];
                                    for ( let message of messages) {
                                      this.textMessages.unshift( message );
                                    }
                                  })
                               )
  }

  uploadUsers() {
    this.usersCollection = this.afs.collection<UserI>('users');
    
    return this.usersCollection.valueChanges()
                               .pipe(
                                  map( (users: UserI[]) => {
                                    this.users = [];
                                    for ( let user of users) {
                                      if (this.user.uid != user.uid) {
                                        this.users.unshift( user );
                                      }
                                    }
                                  })
                               )
  }

  async createChat() {
    let chat: ChatI = {
      date: new Date().getTime(),
      tipo: false
    }
    return await this.chatCollection.add(chat);
  }

  async addUserChat(idchat: string, uid?: string) {
    console.log(uid)
    let uchat: Chat_userI = {
      uid: uid === undefined ? this.user.uid : uid,
      idchat: idchat
    }

    return await this.chat_UserCollection.add(uchat);
  }

  addMessage( text: string, idchat?: string) {
    let message: MessageI = {
      idchat: idchat === undefined ? this.chat_user.idchat: idchat,
      message: text,
      date: new Date().getTime(),
      uid: this.user.uid
    }

    return this.itemsCollection.add( message );
  }

}
