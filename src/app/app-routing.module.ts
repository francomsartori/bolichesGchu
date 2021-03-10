import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrearBolicheComponent } from './components/crear-boliche/crear-boliche.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListarBolichesComponent } from './components/listar-boliches/listar-boliches.component';

const routes: Routes = [
  { path : '', redirectTo: 'listado', pathMatch: 'full'},
  { path: 'listado', component: ListarBolichesComponent},
  { path: 'crear', component: CrearBolicheComponent},
  { path : '**', redirectTo : 'listado', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
