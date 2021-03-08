import { Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { Subscription } from 'rxjs';
import { Boliche } from 'src/app/model/boliche';
import { BolicheService } from 'src/app/service/boliche.service';
import "leaflet/dist/images/marker-icon-2x.png";

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  map!: Leaflet.Map;
  propertyList = [];
  suscripcion : Subscription;
  mapZoom : number;

  constructor(private _bolicheService : BolicheService) { 
    this.mapZoom = 18;
    this.suscripcion = this._bolicheService.getBoliche().subscribe( data =>{
      this.posicionarBoliche(data);
    })
  }

  ngOnInit(): void {
    if (!this.map){
      this.map = new Leaflet.Map('mapa').setView([-33.00548850020353, -58.52352572286353], this.mapZoom);

      this.map.on('click', function(e : any) {
        console.log('Latitud: ' + e.latlng.lat + ' - Longitud: ' + e.latlng.lng);
      });

      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Boliches'
      }).addTo(this.map);
    };
  }

  ngOnDestroy(): void {
    this.map.remove();
    this.suscripcion.unsubscribe();
  }

  onChange(evento: any){
  //  console.log(evento);
  }

  public posicionarBoliche( boliche : Boliche){
    //console.log(boliche);
    if (boliche) {
      this.map.flyTo([boliche.latitud as number, boliche.longitud as number], this.mapZoom)
      Leaflet.marker([boliche.latitud as number, boliche.longitud as number]).addTo(this.map)
          .bindPopup(boliche.nombre as string)
          .openPopup();
    }
  }

  onMapReady(map: L.Map) {
    setTimeout(() => {
      if(map){
        map.invalidateSize();
      }
    }, 0);
  }

  mostrarLatitudLongitud(e : any){
    console.log(e.latlng.lat,e.latlng.lng);       
  }

}
