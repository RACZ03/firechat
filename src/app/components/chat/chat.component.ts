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
  public idchat: string = '';
  constructor(
    public _cs: ChatService
  ) { 
    this._cs.uploadUsers().subscribe();
    this.getMessages();
  }

  ngOnInit() {
    this.element = document.getElementById('app-mensajes');
  }

  async getMessages() {
    await this._cs.getChat().subscribe(chat => {
      if (chat) {
        setTimeout(() => {
          const item = chat.find(c => c.uid2 === this.userReceptor.uid);
          if (item) {
            this.idchat = item.idchat;
            this._cs.uploadMessage(item.idchat).subscribe( () => {
              setTimeout(() => {
                this.element.scrollTop = this.element.scrollHeight
                }, 20);
              })
          } else {
            this._cs.textMessages = [];
            this.idchat = '';
          }
        }, 500);
      }
    })
  }

  selectUser(user: UserI) {
    this.userReceptor = user;
    this.getMessages();
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
                this.sendMessage();
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

  sendMessage() {
    console.log(this.idchat);
    this._cs.addMessage( this.message , this.idchat)
            .then( () => { this.message = ''} )
            .catch( (err) => console.log('Error', err) )
  }
}
