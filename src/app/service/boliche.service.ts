import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Boliche } from '../model/boliche';

@Injectable({
  providedIn: 'root'
})
export class BolicheService {
  protected boliche$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private modoEdicion : boolean;
  private modoBorrar : boolean;
  private filtro$ = new Subject<string>();
  private posicionarMapa$ = new Subject<boolean>(); 

  public listadoBoliches : Boliche[];
  suscriptionBoliches : Subscription;

  getBolichesFirestore(): Observable<any>{
    return this.firestore.collection('boliches', ref => ref.orderBy('anioinicio','asc')).snapshotChanges();
  }

  constructor( private firestore: AngularFirestore) { 
    this.modoEdicion = true;
    this.modoBorrar = false;
    this.listadoBoliches = []; //

    this.suscriptionBoliches = this.getBolichesFirestore().subscribe( (data : any) => {
      data.forEach((element : any) => {
        this.listadoBoliches.push({
          id : element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
    })
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
  getModoBorrar(): boolean{
    return this.modoBorrar;
  }

  setModoBorrar(modo : boolean): void{
    this.modoBorrar = modo;
  }

  getFiltro(): Observable<string>{
    return this.filtro$;
  }

  setFiltro(filtro : string){
    this.filtro$.next(filtro);
  }

  setPosicionarMapa(posicionarMapa : boolean){
    this.posicionarMapa$.next(posicionarMapa);
  }

  getPosicionarMapa(): Observable<boolean>{
    return this.posicionarMapa$.asObservable();
  }

}
