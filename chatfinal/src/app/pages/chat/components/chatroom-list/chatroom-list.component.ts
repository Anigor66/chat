import { Component, OnInit } from '@angular/core';
import { ChatroomService } from './../../../../services/chatroom.service';
import { AuthService } from './../../../../services/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.scss']
})
export class ChatroomListComponent implements OnInit {

  public item: Item = {
    id: ' Anigor1729',
    name: 'Arkham'
  }

  public idtemid: string;

  public col: AngularFirestoreCollection<Item>;

  constructor(
    public chatroomService: ChatroomService,
    private auth: AuthService,
    public db: AngularFirestore
  ) { }

  ngOnInit() {
  }

  onSub(){
    console.log("Batman");
    this.item.User1 = this.auth.returnid();
    this.chatroomService.additm(this.item);
    this.col = this.db.collection('chatrooms', ref => ref.where('id', '==', this.item.id));
    this.col.snapshotChanges().map(
      changes => {
        return changes.map(
        a => {
        const data = a.payload.doc.data() as Item;
        data.id = a.payload.doc.id;
        return data;
        });
    }).subscribe(data => {
      this.idtemid = data[0].id;
      this.db.collection('chatrooms').doc(this.idtemid).update({id: this.idtemid, User2: ""});
      console.log(this.idtemid);
    });
  }
}

interface Item{
  User1?:string;
  User2?:string;
  id?:string;
  name?:string;
}