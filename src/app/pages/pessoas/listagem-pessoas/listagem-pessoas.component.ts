import { Router } from '@angular/router';
import { CadastrarPessoasComponent } from './../cadastrar-pessoas/cadastrar-pessoas.component';
import { Location } from '@angular/common';
import { PessoasService } from './../../../services/pessoas.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IPessoa } from 'src/app/interfaces/pessoa';

@Component({
  selector: 'app-listagem-pessoas',
  templateUrl: './listagem-pessoas.component.html',
  styleUrls: ['./listagem-pessoas.component.scss']
})
export class ListagemPessoasComponent implements OnInit {

  pessoas: IPessoa[] = [];

  constructor(private pessoasService: PessoasService, private location: Location, private router: Router) { }

  ngOnInit(){
    this.pessoasService.buscarTodasPessoas().subscribe({
      next: (response: IPessoa[]) => {
        this.pessoas = response
      }
    })
    this.pessoasService.setPessoa(null);
  }

  apagarPessoa(id: any){
      return this.pessoasService.apagarPessoaPorID(id).subscribe(response => {
        console.log(response);
        this.location.go(this.location.path())
        window.location.reload();
      });
  }

  editarPessoa(pessoa: IPessoa){
      this.pessoasService.setPessoa(pessoa);
      this.router.navigate(['/cadastrar-pessoa']);
  }

  retornaCelular(pessoa: IPessoa){
    return this.pessoasService.retornaCelular(pessoa)
  }


}
