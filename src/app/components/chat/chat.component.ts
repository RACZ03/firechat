import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatI, UserI, Chat_userI } from '../../interfaces/messageI';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {

  public message: string = '';
  public nameGroup: string = '';
  public textSearch: string = '';

  public element: any;
  public userReceptor: UserI = {};
  public chat: ChatI = {};
  public idchat: string = '';
  public btnGroup: boolean = false;
  public btnNewChat: boolean = false;
  public btnAlert: boolean = false;
  public listTemporal: UserI[] = [];
  public alert: string = '';
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
      if (chat) { console.log(chat)
        setTimeout(() => {
          const item = chat.find(c => c.uid2 === this.userReceptor.uid);
          if (item) {
            this.idchat = item.idchat;
            this._cs.uploadMessage(item.idchat).subscribe( () => {
              setTimeout(() => {
                this.element.scrollTop = this.element.scrollHeight
                }, 40);
              })
          } else {
            this._cs.textMessages = [];
            this.idchat = '';
          }
        }, 500);
      }
    })
  }

  onNew(user: UserI) {
    this.btnNewChat = !this.btnNewChat;
    this.userReceptor.uid = user.uid;
    this.userReceptor.displayName = user.displayName;
    this.getMessages();
  }

  selectUser(chatu?: Chat_userI) {
    if(chatu) {
      this.userReceptor.uid = chatu.uid2;
      this.userReceptor.displayName = chatu.displayName;
      this.getMessages();
    } else {
      this.userReceptor = {};
      this._cs.textMessages = [];
    }
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
                this.idchat = resp.id;
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
    this._cs.addMessage(this._cs.user.displayName, this.message , this.idchat)
            .then( () => { this.message = ''} )
            .catch( (err) => console.log('Error', err) )
  }

  addItem(user: UserI) {
    // validar si existe el usuario
    if(this.listTemporal.length === 0 ) {
      this.listTemporal.push(user)
    }
    const item = this.listTemporal.find( i => i.uid === user.uid);

    if(item) return;
    
    this.listTemporal.push(user)
  };

  async createGroup() {
    const validated = this.validate()
    if (validated) {
      // await this.listTemporal.forEach( async item => {
      //   console.log(item.uid)
      // });
      await this._cs.createChat(this.nameGroup, true)
        .then( async resp => {
          this.idchat = resp.id;
          let user: UserI = { displayName: this.nameGroup };
          this.nameGroup = '';
          // Ingresar al user autenticado
          await this.addUserChat(resp.id);
          // Ingresar lo users seleccionados
          await this.listTemporal.forEach( async item => {
            await this.addUserChat(resp.id, item.uid);
          });
        this.btnGroup = false;
        this.selectUser(user);
      });
    }
  }

  validate() {
    if (this.nameGroup === '' ) {
      this.btnAlert =true;
      this.alert = 'Group name is required';
      setTimeout(() => {
        this.btnAlert = false;
      }, 1000);
      return false;
    }
    if (this.listTemporal.length === 0 ) {
      this.btnAlert =true;
      this.alert = 'At least select one contact';
      setTimeout(() => {
        this.btnAlert = false;
      }, 1000);
      return false;
    }
    return true
  }


  remove(i: number) {
    this.listTemporal.splice(i, 1)
  }
}
