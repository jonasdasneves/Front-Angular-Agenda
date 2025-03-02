import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PessoasService } from './../../../services/pessoas.service';
import { Component, Input, OnInit } from '@angular/core';
import { IPessoa } from 'src/app/interfaces/pessoa';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listagem-pessoas',
  templateUrl: './listagem-pessoas.component.html',
  styleUrls: ['./listagem-pessoas.component.scss']
})
export class ListagemPessoasComponent implements OnInit {

  @Input() pessoas: IPessoa[] = [];

  constructor(
    private readonly pessoasService: PessoasService,
    private readonly location: Location,
    private readonly router: Router
  ) { }

  ngOnInit(){
    this.pessoasService.buscarTodasPessoas().subscribe({
      next: (response: IPessoa[]) => {
        this.pessoas = response
      }
    })
    this.pessoasService.setPessoa(null);
  }

  apagarPessoa(id: number){
    Swal.fire({
      title: "Você tem certeza de quer apagar o registro?",
      showDenyButton: true,
      confirmButtonText: "Sim",
      denyButtonText: `Cancelar`
    }).then((result) => {

      if (result.isConfirmed) {
        return this.pessoasService.apagarPessoaPorID(id).subscribe(response => {
          Swal.fire("Registro deletado com sucesso!", "", "success");
          console.log(response);

          this.pessoas = this.pessoas.filter(pessoa => pessoa.id !== id);



        });
      }
      else{
          return null;
      }
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
