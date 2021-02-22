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
  public btnAddMenbers: boolean = false;
  public btnAlert: boolean = false;
  public bandInput: boolean = false;

  public listTemporal: UserI[] = [];
  public listIntrantes: UserI[] = [];
  public alert: string = '';
  constructor(
    public _cs: ChatService
  ) { 
    this._cs.uploadUsers().subscribe();
    this.getMessages();
  }

  ngOnInit() {
    setTimeout(() => {
      this.element = document.getElementById('app-mensajes');
    }, 100);
  }

  async getMembers(idchat: string) {
    await (await this._cs.getMembers(idchat)).valueChanges().subscribe( data => {

      for (const d of data) {
        this._cs.getUser(d.uid).subscribe( user => {
          if (this.listIntrantes.length === 0 ) {
            this.listIntrantes.push(user)
            this.listTemporal.push(user)
          } else {
            const item = this.listIntrantes.find( item => item.uid === user.uid)
            if (!item) { 
              this.listIntrantes.push(user) 
              this.listTemporal.push(user)

            }
          }
        })
      }
    })
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

            if(item.grupo) {
              this.getMembers(item.idchat);
            }
          } else {
            this._cs.textMessages = [];
          }
        }, 500);
      }
    })
  }

  onNew(user: UserI) {
    this.idchat = '';
    this.btnNewChat = !this.btnNewChat;
    this.userReceptor.uid = user.uid;
    this.userReceptor.displayName = user.displayName;
    this.bandInput = true;
    this.getMessages();
  }

  selectUser(chatu?: any) {
    if(chatu) {
      this.idchat = chatu.idchat;
      this.userReceptor.uid = chatu.uid2;
      this.userReceptor.displayName = chatu.displayName;
      this.userReceptor.grupo = chatu.grupo;
      this.bandInput = true
      // this.userReceptor.photoUrl = chatu.photoUrl;
      this.getMessages();
    } else {
      this.userReceptor = {};
      this._cs.textMessages = [];
    }
  }

  async onSubmit() {
    if (this.userReceptor != {}) {

      if (this.message.length === 0) {
        return;
      }
  
      if (this._cs.textMessages.length === 0) {
        if (this.idchat) { 
          this.sendMessage();
          return;
        }
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
    
  }

  addUserChat(idchat, iduser?: string) {
    this._cs.addUserChat(idchat, iduser)
  }

  sendMessage() {
    this._cs.addMessage(this._cs.user.displayName, this.message , this.idchat)
            .then( () => { 
              this.message = '';
              this.getMessages();
            } )
            .catch( (err) => console.log('Error', err) )
    // this._cs.updateMessage(this.idchat);
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

  onSave() {
    if(this.listTemporal.length > this.listIntrantes.length) {
      this.listTemporal.forEach( item => {
        

        if(obj) { 
          // this._cs.addUserChat(this.idchat, item.uid)
          console.log(obj)
        } 
      })
    }
  }

  async createGroup() {
    const validated = this.validate()
    if (validated) {
      await this._cs.createChat(this.nameGroup, true)
        .then( async resp => {
          let chatu: Chat_userI = { displayName: this.nameGroup, idchat: resp.id };
          this.nameGroup = '';
          // Ingresar al user autenticado
          await this.addUserChat(resp.id);
          // Ingresar lo users seleccionados
          await this.listTemporal.forEach( async item => {
            await this.addUserChat(resp.id, item.uid);
          });
          setTimeout(() => {
            this.selectUser(chatu);
            this.btnGroup = false;
          }, 500);
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
