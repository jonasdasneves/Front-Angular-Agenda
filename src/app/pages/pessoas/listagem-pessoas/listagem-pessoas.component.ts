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

  //O Input do componente é definido
  @Input() pessoas: IPessoa[] = [];

  constructor(
    private readonly pessoasService: PessoasService,
    private readonly location: Location,
    private readonly router: Router
  ) { }

  ngOnInit(){
    //Sempre que a tela é chamada todas as pessoas são listadas na tabela
    this.pessoasService.buscarTodasPessoas().subscribe({
      next: (response: IPessoa[]) => {
        this.pessoas = response
      }
    })
    //Quando essa tela é chamada, o atributo pessoaSelecionada de pessoaService vira null, pois não há nenhuma edição ocorrendo
    this.pessoasService.setPessoaSelecionada(null);
  }

  apagarPessoa(id: number){

    //Prompt para confirmar se registro deve ser apagado
    Swal.fire({
      title: "Você tem certeza de quer apagar o registro?",
      showDenyButton: true,
      confirmButtonText: "Sim",
      denyButtonText: `Cancelar`
    }).then((result) => {

      //Se confirmado, é chmado o método apagar pessoa
      if (result.isConfirmed) {
        return this.pessoasService.apagarPessoaPorID(id).subscribe(response => {
          Swal.fire("Registro deletado com sucesso!", "", "success");

          //A página filtra por pessoas com ID diferente do deletado, evitando loadings desnecessários e atualizando automaticamente
          this.pessoas = this.pessoas.filter(pessoa => pessoa.id !== id);
        });
      }
      else{
          return null;
      }
    });
  }

  //Método para edifinir que haverá uma edição de pessoas
  editarPessoa(pessoa: IPessoa){

      //O atrbuto pessoaSelecionada de pessoaService é definido com a pessoa a ser editada, para ser feita a atualização
      this.pessoasService.setPessoaSelecionada(pessoa);

      //A página de cadastro e atualização é chamada
      this.router.navigate(['/cadastrar-pessoa']);
  }

  //método chama método do Service para consultar celular por pessoa, o método foi declarado no service pois é usado em ambos os componentes
  retornaCelular(pessoa: IPessoa){
    return this.pessoasService.retornaCelular(pessoa)
  }


}
