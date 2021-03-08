export class Boliche {
    id?:            string;
    nombre:         string;
    anioinicio:     string;
    aniofin:     string;
    direccion:      string;
    latitud:        number;
    longitud:       number;
    tipo:           string;

    constructor(nombre: string, anioinicio: string, aniofin: string, direccion: string, latitud: number, longitud: number, tipo: string ){
        this.nombre     = nombre;
        this.anioinicio = anioinicio;
        this.aniofin    = aniofin;
        this.direccion  = direccion;
        this.latitud    = latitud;
        this.longitud   = longitud;
        this.tipo       = tipo;
    }
}