import { Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { Subscription } from 'rxjs';
import { Boliche } from 'src/app/model/boliche';
import { BolicheService } from 'src/app/service/boliche.service';
import "leaflet/dist/images/marker-icon-2x.png";
import "leaflet/dist/images/marker-shadow.png";

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  map!: Leaflet.Map;
  propertyList = [];
  suscripcionBoliche : Subscription;
  suscripcionBoliches : Subscription;
  mapZoom : number;
  marker : Leaflet.Marker<any> | undefined;
  listaMarkers : Leaflet.Marker<any>[];

  constructor(private _bolicheService : BolicheService) { 
    this.mapZoom = 18;
    this.listaMarkers = [];

    this.suscripcionBoliche = this._bolicheService.getBoliche().subscribe( data =>{
      this.posicionarBoliche(data);
    })

    this.suscripcionBoliches = this._bolicheService.getPosicionarMapa().subscribe( data =>{
      if(data === true){
        this.map.flyTo([-33.0102829532752 as number, -58.51353683086252 as number], this.mapZoom-3);
        this.posicionarBoliches(this._bolicheService.listadoBoliches);
      } else {
        this.borrarMarcadores();
      }
    })
  }

  ngOnInit(): void {
    if (!this.map){
      this.map = new Leaflet.Map('mapa').setView([-33.00502860122597, -58.51366119395184], this.mapZoom-3);

      if(this._bolicheService.getModoEdicion()){
        this.map.on('click', function(e : any) {
          console.log('Latitud: ' + e.latlng.lat + ' - Longitud: ' + e.latlng.lng);
        });
      }
      
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: 'Boliches'}).addTo(this.map);

      Leaflet.Icon.Default.imagePath = "/assets/leaflet/"
    };
  }

  public posicionarBoliche( boliche : Boliche, flyTo : boolean = true){
    let texto : string;

    if (boliche && this.map) {
      if (flyTo){
        this.map.flyTo([boliche.latitud as number, boliche.longitud as number], this.mapZoom);
      }

      this.marker = Leaflet.marker([boliche.latitud as number, boliche.longitud as number]);

      if(boliche.tipo=='boliche'){
        texto = boliche.nombre + ' <i class="far fa-cocktail"></i>';
      } else {
        texto = boliche.nombre + ' <i class="far fa-beer"></i>';   
      }
              
      this.marker.addTo(this.map).bindPopup(texto as string);

      if (flyTo){
        this.marker.openPopup();
      }

      //this.marker.addTo(this.map).bindPopup(texto as string).openPopup();

      this.listaMarkers.push(this.marker);
    }
  }

  posicionarBoliches(boliches : Boliche[]){
    boliches.forEach(boliche => {
      this.posicionarBoliche(boliche, false);
    });
  }

  onMapReady(map: L.Map) {
    setTimeout(() => {
      if(map && map != undefined){
        map.invalidateSize();
      }
    }, 0);
  }

  mostrarLatitudLongitud(e : any){
    console.log(e.latlng.lat,e.latlng.lng);       
  }

  borrarMarcadores(){
    this.listaMarkers.forEach( marker => {
      marker.remove();
    })
  }

  ngOnDestroy(): void {
    this.map.remove();
    this.suscripcionBoliche.unsubscribe();
  }
}
