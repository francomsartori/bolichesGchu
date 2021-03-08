import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Boliche } from 'src/app/model/boliche';
import { BolicheService } from 'src/app/service/boliche.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-boliche',
  templateUrl: './crear-boliche.component.html',
  styleUrls: ['./crear-boliche.component.scss']
})
export class CrearBolicheComponent implements OnInit, OnDestroy {
  form: FormGroup;
  suscription : Subscription;
  id : string | undefined;
  verAlerta : boolean;

  constructor(private fb: FormBuilder, private _bolicheService : BolicheService, private toastr: ToastrService) { 
    this.verAlerta = false;

    this.form = this.fb.group({
      nombre : ['', Validators.required],
      tipo : ['', Validators.required],
      direccion : ['', Validators.required],
      anioinicio : ['', Validators.required],
      aniofin : [''],
      latitud : [''],
      longitud : [''],
    });

    this.suscription = this._bolicheService.getBoliche().subscribe(data => {
      this.id = data.id;
      this.form.patchValue({
        nombre : data.nombre,
        tipo : data.tipo,
        direccion : data.direccion,
        anioinicio : data.anioinicio,
        aniofin : data.aniofin,
        latitud : data.latitud,
        longitud : data.longitud
      })
    }, error => {
      console.log(error);
    })
  }

  ngOnInit(): void {
  }

  guardarDatos(): void{

    if(! this.form.valid){
      this.verAlerta = true;
      return;
    }

    this.verAlerta = false;

    if (this.id == undefined){
      this.crearTarjeta();
    } else {
      this.editarTarjeta();
    }
  }

  crearTarjeta(): void{
    const BOLICHE : Boliche = {
      nombre :        this.form.value.nombre,
      tipo :          this.form.value.tipo,
      direccion :     this.form.value.direccion,
      anioinicio :    this.form.value.anioinicio,
      aniofin :       this.form.value.aniofin,
      latitud :       this.form.value.latitud,
      longitud :      this.form.value.longitud
    }

    this._bolicheService.guardarBoliche(BOLICHE).then( () => {
      this.form.reset();
      this.toastr.success('Boliche creado con éxito', 'Boliches');
    }, error => {
      console.log(error);
    });
  }

  editarTarjeta(): void{
    const BOLICHE : Boliche = {
      id :            this.id,
      nombre :        this.form.value.nombre,
      tipo :          this.form.value.tipo,
      direccion :     this.form.value.direccion,
      anioinicio :    this.form.value.anioinicio,
      aniofin :       this.form.value.aniofin,
      latitud :       this.form.value.latitud,
      longitud :      this.form.value.longitud
    }

    this._bolicheService.editarBoliche(BOLICHE).then( () => {
      this.form.reset();
      this.toastr.success('Boliche editado con éxito', 'Boliches');
    }, error => {
      console.log(error);
    });  
  }

  getClase(valor : string): string{
    if(this.form.get(valor)?.touched){
      if(this.form.get(valor)?.valid){
        return 'green-icon'
      } else {
        return 'red-icon';
      }
    } else {
      return '';
    }
  }

  limpiarFormulario(): void{
    this.form.reset();
    this.id = undefined;
    this.verAlerta = false;
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

}
