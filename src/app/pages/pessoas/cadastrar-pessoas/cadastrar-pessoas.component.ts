import { ViaCepService } from './../../../services/via-cep.service';
import { ListagemPessoasComponent } from './../listagem-pessoas/listagem-pessoas.component';
import { ContatoService } from './../../../services/contato.service';
import { PessoasService } from './../../../services/pessoas.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IContato } from 'src/app/interfaces/contato';
import { IPessoa } from 'src/app/interfaces/pessoa';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastrar-pessoas',
  templateUrl: './cadastrar-pessoas.component.html',
  styleUrls: ['./cadastrar-pessoas.component.scss']
})
export class CadastrarPessoasComponent implements OnInit {
  @ViewChild(ListagemPessoasComponent) listagemPessoasComponent!: ListagemPessoasComponent
  formGroupPessoas: FormGroup = new FormGroup({
    nome: new FormControl('',[Validators.required]),
    cep: new FormControl('',[Validators.required]),
    rua: new FormControl('',[Validators.required]),
    numero: new FormControl('',[Validators.required]),
    bairro: new FormControl('',[Validators.required]),
    cidade: new FormControl('',[Validators.required]),
    uf: new FormControl('',[Validators.required]),
    celular: new FormControl('')
  })

  constructor(
    private readonly route: ActivatedRoute,
    private readonly pessoasService: PessoasService,
    private readonly contatosService: ContatoService,
    private readonly router: Router,
    private readonly viaCepService: ViaCepService,
  ) { }

  ngOnInit(): void {

    const pessoaEditar = this.pessoasService.getPessoa();

    if (pessoaEditar) {

        const numero = this.verificarNumero(pessoaEditar);
        this.formGroupPessoas.get('numero')?.setValue(numero);

        const celular = this.retornaCelular(pessoaEditar);
        this.formGroupPessoas.get('celular')?.setValue(celular);


        this.formGroupPessoas.patchValue(pessoaEditar);
        this.buscarEndereco()
    }

    const estados = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

    const select: HTMLElement | null = document.getElementById("uf") as HTMLSelectElement;

    // Adiciona os estados como opções no select
    estados.forEach(uf => {
      const option = document.createElement("option");
      option.value = uf;
      option.textContent = uf;
      select.appendChild(option);
    })

  }

  cadastrarPessoa(){

      const pessoaEditar = this.pessoasService.getPessoa();

      console.log(this.formGroupPessoas.value);

      const rua = this.formGroupPessoas.get('rua')?.value;
      const numero = this.formGroupPessoas.get('numero')?.value;
      const bairro = this.formGroupPessoas.get('bairro')?.value;

      const endereco = rua + ", " + numero + " " + bairro

      const contatoCelular = pessoaEditar?.contatos?.find(contatoCelular => contatoCelular.tipoContato === 'celular');
      const celular = this.formGroupPessoas.get('celular')?.value;
      const tipoContato = "celular";



      const contato: IContato = {
        id: contatoCelular?.id,
        contato: celular,
        tipoContato: tipoContato,
      }

      const pessoa: IPessoa = {
          id: pessoaEditar?.id,
          nome: this.formGroupPessoas.get('nome')?.value,
          cep: this.formGroupPessoas.get('cep')?.value,
          endereco: endereco,
          cidade: this.formGroupPessoas.get('cidade')?.value,
          uf: this.formGroupPessoas.get('uf')?.value,
          contatos: [contato]
      }

      if(pessoa.id){
        this.pessoasService.editarPessoa(pessoa).subscribe(response => {
          console.log(response);
          Swal.fire('Sucesso', 'Pessoa editada com sucesso!', 'success');
          this.router.navigate([""])
        })
      }
      else{
        this.pessoasService.cadastrarPessoa(pessoa).subscribe(response => {
          console.log(response);
          Swal.fire('Sucesso', 'Pessoa cadastrada com sucesso!', 'success');
          this.router.navigate([""])
        })
      }

  }

  buscarEndereco(){

    const cep = this.formGroupPessoas.get('cep');

    if (cep) {
      this.viaCepService.consultarEndereco(cep.value).subscribe(response => {
        console.log(response);
        const rua = `${response.logradouro || ''}${response.complemento ? `, ${response.complemento}` : ''}${response.unidade ? `, ${response.unidade}` : ''}`;
        const bairro = response.bairro;
        const cidade = response.localidade;
        const uf = response.uf;

        this.formGroupPessoas.get('rua')?.setValue(rua);
        this.formGroupPessoas.get('bairro')?.setValue(bairro);
        this.formGroupPessoas.get('cidade')?.setValue(cidade);
        this.formGroupPessoas.get('uf')?.setValue(uf);
    });
    }
    else{
      console.log("Tá errado isso ae")
    }
  }

  retornaCelular(pessoa: IPessoa){
    return this.pessoasService.retornaCelular(pessoa)
  }

  verificarNumero(pessoa: IPessoa){
    const endereco = pessoa.endereco;

    const resultado = endereco.match(/, (\d+)/);

    if (resultado) {
      const numero = parseInt(resultado[1]);
      return numero;
    }
    else{
      return null;
    }
  }
}

