import { PessoasService } from './../../../services/pessoas.service';
import { Component, OnInit } from '@angular/core';
import { IPessoa } from 'src/app/interfaces/pessoa';

@Component({
  selector: 'app-listagem-pessoas',
  templateUrl: './listagem-pessoas.component.html',
  styleUrls: ['./listagem-pessoas.component.scss']
})
export class ListagemPessoasComponent implements OnInit {

  pessoas: IPessoa[] = [];

  constructor(private pessoasService: PessoasService) { }

  ngOnInit(){
    this.pessoasService.buscarTodasPessoas().subscribe({
      next: (response: IPessoa[]) => {
        this.pessoas = response
      }
    })
  }

  retornaCelular(pessoa: IPessoa){
      const celular = pessoa.contatos.find(contato => contato.tipoContato === 'celular');
      return celular ? celular.contato : '-';
  }
}
