import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from './../servies/loading.service';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/map'


@Injectable()
export class ChatroomService {

  public chatrooms: Observable<any>;
  public chatrooms1: Observable<any>;
  public changeChatroom: BehaviorSubject<string | null> = new BehaviorSubject(null);
  public selectedChatroom: Observable<any>;
  public selectedChatroomMessages: Observable<any>;
  public itmcol: AngularFirestoreCollection<Item>;
  public col: AngularFirestoreCollection<Item>;
  public user1: string;

  constructor(
    private db: AngularFirestore,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {

    this.itmcol = this.db.collection('chatrooms');
    
    this.selectedChatroom = this.changeChatroom.switchMap(chatroomId => {
      if (chatroomId) {
        return db.doc(`chatrooms/${chatroomId}`).valueChanges();
      }
      return Observable.of(null);
    });

    this.selectedChatroomMessages = this.changeChatroom.switchMap(chatroomId => {
      if (chatroomId) {
        return db.collection(`chatrooms/${chatroomId}/messages`, ref => {
          return ref.orderBy('createdAt', 'desc').limit(100);
        })
        .valueChanges()
        .map(arr => arr.reverse());
      }
      return Observable.of(null);
    });

    this.user1 = this.authService.returnid();
    console.log("I AM "+ this.user1);
    this.chatrooms = db.collection('chatrooms', ref => ref.where('User1', '==', this.user1)).valueChanges();
    this.chatrooms1 = db.collection('chatrooms', ref => ref.where('User2', '==', this.user1)).valueChanges();
  }

  public createMessage(text: string): void {
    const chatroomId = this.changeChatroom.value;
    const message = {
      message: text,
      createdAt: new Date(),
      sender: this.authService.currentUserSnapshot
    };

    this.db.collection(`chatrooms/${chatroomId}/messages`).add(message);
  }

  public additm(it: Item){
    this.itmcol.add(it);
    console.log(this.itmcol);
  }

}


interface Item{
  User1?:string;
  User2?:string;
  id?:string;
  name?:string;
}