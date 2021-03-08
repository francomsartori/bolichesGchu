import { Component, OnInit } from '@angular/core';
import { BolicheService } from 'src/app/service/boliche.service';

@Component({
  selector: 'app-tabs-boliches',
  templateUrl: './tabs-boliches.component.html',
  styleUrls: ['./tabs-boliches.component.scss']
})
export class TabsBolichesComponent implements OnInit {

  constructor(private _bolicheService : BolicheService ) {}

  ngOnInit(): void {
  }

  modoEdicion(): boolean{
    return this._bolicheService.getModoEdicion();
  }
}
