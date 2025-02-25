import { ContatoService } from './../../../services/contato.service';
import { PessoasService } from './../../../services/pessoas.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IContato } from 'src/app/interfaces/contato';
import { IPessoa } from 'src/app/interfaces/pessoa';

@Component({
  selector: 'app-cadastrar-pessoas',
  templateUrl: './cadastrar-pessoas.component.html',
  styleUrls: ['./cadastrar-pessoas.component.scss']
})
export class CadastrarPessoasComponent implements OnInit {
  formGroupPessoas: FormGroup = new FormGroup({
    nome: new FormControl('',[Validators.required]),
    cep: new FormControl(''),
    rua: new FormControl(''),
    numero: new FormControl(''),
    bairro: new FormControl(''),
    cidade: new FormControl(''),
    uf: new FormControl(''),
    celular: new FormControl('')
  })

  constructor(
    private readonly route: ActivatedRoute,
    private readonly pessoasService: PessoasService,
    private readonly contatosService: ContatoService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {

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

      console.log(this.formGroupPessoas.value);

      const rua = this.formGroupPessoas.get('rua')?.value;
      const numero = this.formGroupPessoas.get('numero')?.value;
      const bairro = this.formGroupPessoas.get('bairro')?.value;

      const endereco = rua + ", " + numero + " " + bairro

      const celular = this.formGroupPessoas.get('celular')?.value;
      const tipoContato = "celular";

      const contato: IContato = {
        id: "",
        contato: celular,
        tipoContato: tipoContato,
      }

      const pessoa: IPessoa = {
          id: "",
          nome: this.formGroupPessoas.get('nome')?.value,
          cep: this.formGroupPessoas.get('cep')?.value,
          endereco: endereco,
          cidade: this.formGroupPessoas.get('cidade')?.value,
          uf: this.formGroupPessoas.get('uf')?.value,
          contatos: [contato]
      }

      this.pessoasService.cadastrarPessoa(pessoa).subscribe(response => {
        console.log(response);
      })
  }

}


