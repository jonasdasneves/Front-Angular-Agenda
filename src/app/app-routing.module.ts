import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListagemPessoasComponent } from './pages/pessoas/listagem-pessoas/listagem-pessoas.component';
import { CadastrarPessoasComponent } from './pages/pessoas/cadastrar-pessoas/cadastrar-pessoas.component';
import { HeaderComponent } from './components/header/header.component';

//Definição de rotas
const routes: Routes = [

  {
    path: '', component: ListagemPessoasComponent
  },
  {
    path: 'cadastrar-pessoa', component: CadastrarPessoasComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
