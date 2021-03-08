import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Boliche } from '../model/boliche';

@Injectable({
  providedIn: 'root'
})
export class BolicheService {
  private boliche$ = new Subject<Boliche>();
  private modoEdicion : boolean;

  constructor( private firestore: AngularFirestore) { 
    this.modoEdicion = false;
  };

  getBoliches(): Observable<any>{
    return this.firestore.collection('boliches', ref => ref.orderBy('anioinicio','asc')).snapshotChanges();
  }

  getBoliche(): Observable<Boliche>{
    return this.boliche$.asObservable();
  }

  setBoliche(boliche : Boliche){
    this.boliche$.next(boliche);
  }

  guardarBoliche(boliche : Boliche): Promise<any>{
    return this.firestore.collection('boliches').add(boliche);
  }

  editarBoliche(boliche: Boliche): Promise<any>{
    return this.firestore.collection('boliches').doc(boliche.id).update(boliche);
  }

  eliminarBoliche(id : any){
    this.firestore.collection('boliches').doc(id).delete();
  }

  getModoEdicion(): boolean{
    return this.modoEdicion;
  }

  setModoEdicion(modo : boolean): void{
    this.modoEdicion = modo;
  }
}
