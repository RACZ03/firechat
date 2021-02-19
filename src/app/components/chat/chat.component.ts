import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
<<<<<<< HEAD
import { ChatI, UserI } from '../../interfaces/messageI';
import { Console } from 'console';
=======
import { ChatI, UserI, Chat_userI } from '../../interfaces/messageI';
>>>>>>> 4b03d4253d6421074ca907cf0126bbb509c45f9a

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
            this._cs.uploadMessage(item.idchat).subscribe( () => {
              setTimeout(() => {
                this.element.scrollTop = this.element.scrollHeight
                }, 20);
              })
          } else {
            this._cs.textMessages = [];
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
