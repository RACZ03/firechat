import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatI, UserI } from '../../interfaces/messageI';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {

  public message: string = '';
  public element: any;
  public userReceptor: UserI = {};
  public chat: ChatI = {};
  constructor(
    public _cs: ChatService
  ) { 
    // this._cs.uploadUsers().subscribe();
    this.getMessages();
    
  }

  ngOnInit() {
    this.element = document.getElementById('app-mensajes');
  }

  getMessages() {
    this._cs.getChat().subscribe(chat => { console.log(chat)
      // if (chat) {
      //   this.chat = chat;
      //   this._cs.uploadMessage(chat.idchat).subscribe( () => {
      //     setTimeout(() => {
      //       this.element.scrollTop = this.element.scrollHeight
            
      //     }, 20);
      //   })
      // } else {
      //   this._cs.textMessages = [];
      // }
    })
  }

  selectUser(user: UserI) {
    this.userReceptor = user;
  }

  async onSubmit() {
    if (this.message.length === 0) {
      return;
    }

    if (this._cs.textMessages.length === 0) {
      await this._cs.createChat()
              .then( async resp => {
                await this.addUserChat(resp.id);
                await this.addUserChat(resp.id, this.userReceptor.uid);
                this.sendMessage(resp.id)
              } )
    } else {
      await this.sendMessage();
    }
    
  }

  addUserChat(idchat, iduser?: string) {
    this._cs.addUserChat(idchat, iduser)
            .then( resp => console.log(resp) )
            .catch( (err) => console.log('Error', err) )
  }

  sendMessage(idchat?: string) {
    this._cs.addMessage( this.message , idchat)
            .then( () => { this.message = ''} )
            .catch( (err) => console.log('Error', err) )
  }
}
