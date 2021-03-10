import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Boliche } from 'src/app/model/boliche';
import { BolicheService } from 'src/app/service/boliche.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-boliches',
  templateUrl: './listar-boliches.component.html',
  styleUrls: ['./listar-boliches.component.scss']
})
export class ListarBolichesComponent implements OnInit {
 // suscription : Subscription;
  listaBoliches : Boliche[] = [];
  modoContador : number;
  suscripcionFiltro : Subscription;
  filtro : string;
  cantidad : number;

  constructor(private _bolicheService : BolicheService, private toastr: ToastrService) { 
    this.modoContador = 0;
    this.filtro = '';
    this.cantidad = 10;

    this.suscripcionFiltro = this._bolicheService.getFiltro().subscribe( data => {
      this.filtro = data;
    })
  }

  ngOnInit(): void {
    this.listaBoliches = this._bolicheService.listadoBoliches;
  }

  posicionarBoliche(boliche : Boliche){
    this._bolicheService.setBoliche(boliche);
  }

  eliminarBoliche(id : any){
    this._bolicheService.eliminarBoliche(id);
    this.toastr.success('Boliche eliminado con éxito', 'Boliches')
  }

  editarBoliche(boliche : Boliche){
    this._bolicheService.setBoliche(boliche);
  }

  modoEdicion(): boolean{
    return this._bolicheService.getModoEdicion();
  }

  modoBorrar(): boolean{
    return this._bolicheService.getModoBorrar();
  }

  activarModoEdicion(): void{
    if(this.modoContador<this.cantidad){
      this.modoContador++;
      if (this.modoContador == this.cantidad){
        this._bolicheService.setModoEdicion(true);
      }
    } else {
        this.modoContador--;
        this._bolicheService.setModoEdicion(false);
      }    
  }

  activarModoBorrar(): void{
    /*if(this.modoContador<this.cantidad){
      this.modoContador++;
      if (this.modoContador == this.cantidad){
        this._bolicheService.setModoBorrar(true);
      }
    } else {
        this.modoContador--;
        this._bolicheService.setModoBorrar(false);
      }  */
  }
  
  bolicheOK(boliche: Boliche): boolean{
    return (this.filtro=="" || boliche.nombre.toLowerCase().indexOf(this.filtro.toLowerCase(),0)>=0);
  }

}

