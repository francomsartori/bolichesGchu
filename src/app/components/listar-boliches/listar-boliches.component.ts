import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Boliche } from 'src/app/model/boliche';
import { BolicheService } from 'src/app/service/boliche.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-boliches',
  templateUrl: './listar-boliches.component.html',
  styleUrls: ['./listar-boliches.component.scss']
})
export class ListarBolichesComponent implements OnInit, OnDestroy {
  suscription : Subscription;
  listaBoliches : Boliche[] = [];
  modoContador : number;

  constructor(private _bolicheService : BolicheService, private toastr: ToastrService) { 
    this.modoContador = 0;

    this.suscription = this._bolicheService.getBoliches().subscribe( data => {
      data.forEach((element : any) => {
        this.listaBoliches.push({
          id : element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
    }, error => {
      console.log(error);
    })
  }

  ngOnInit(): void {
  }

  posicionarBoliche(boliche : Boliche){
    this._bolicheService.setBoliche(boliche);
  }

  eliminarBoliche(id : any){
    this._bolicheService.eliminarBoliche(id);
    this.toastr.success('Tarjeta eliminada con éxito', 'Tarjetas')
  }

  editarBoliche(boliche : Boliche){
    this._bolicheService.setBoliche(boliche);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  modoEdicion(): boolean{
    return this._bolicheService.getModoEdicion();
  }

  activarModoEdicion(): void{
    this.modoContador++;
    if (this.modoContador == 5){
      this._bolicheService.setModoEdicion(true);
    }
  }
}

