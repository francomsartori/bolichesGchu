import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BolicheService } from 'src/app/service/boliche.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  titulo : string;
  suscription : Subscription
  textoBuscar : string;
  posicionar : boolean;
  tituloPosicionarMapa : string;

  constructor(private _bolicheService : BolicheService) {
    this.titulo = 'Crear';
    this.textoBuscar = '';
    this.posicionar = true;
    this. tituloPosicionarMapa = 'Mostrar todos en mapa';

    this.suscription = this._bolicheService.getBoliche().subscribe(data => {
      if(data && data != null){
        if(data.id === ''){
          this.titulo = 'Crear';
        } else {
          this.titulo = 'Editar ' + data.nombre;
        }
      }
    })
  }
  
  ngOnInit(): void {
  }

  modoEdicion(): boolean{
    return this._bolicheService.getModoEdicion();
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  buscarBoliche(){
    this._bolicheService.setFiltro(this.textoBuscar);
  }

  buscarBolicheChange(e : any){  
    this._bolicheService.setFiltro(this.textoBuscar);
  }

  posicionarBoliches(){
    this._bolicheService.setPosicionarMapa(this.posicionar);
    this.posicionar = !this.posicionar;
    if(this.posicionar){
      this. tituloPosicionarMapa = 'Mostrar todos en mapa';
    } else {
      this. tituloPosicionarMapa = 'Ocultar todos en mapa';    
    }
  }
}