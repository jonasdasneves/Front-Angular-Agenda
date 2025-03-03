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

  //Chama os campos do formulário
  formGroupPessoas: FormGroup = new FormGroup({
    nome: new FormControl('',[Validators.required]),
    cep: new FormControl('',[Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]),
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

    //Chama o atributo pessoaSelecionada do PessoaService
    const pessoaEditar = this.pessoasService.getPessoaSelecionada();

    //Se o atributo pessoa não for nulo, os campos do formulário são preenchidos com ela pra fazer a edição
    if (pessoaEditar) {

        //Chama a função para procurar o número da pessoa a Editar
        const numero = this.verificarNumero(pessoaEditar);
        this.formGroupPessoas.get('numero')?.setValue(numero);

        //Procura o celular da pessoa a editar
        const celular = this.retornaCelular(pessoaEditar);
        this.formGroupPessoas.get('celular')?.setValue(celular);

        //Preenche o forumário com as informações que não precisam de edição
        this.formGroupPessoas.patchValue(pessoaEditar);

        //Usa o CEP para preencher o endereço
        this.buscarEndereco()
    }

    //Cria uma lista de UFs para preencher o campo UF
    const estados = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

    //Cria um elemento HTML
    const select: HTMLElement | null = document.getElementById("uf") as HTMLSelectElement;

    // Adiciona os estados como opções no select
    estados.forEach(uf => {
      const option = document.createElement("option");
      option.value = uf;
      option.textContent = uf;
      select.appendChild(option);
    })

  }

  //Método para cadastrar ou editar pessoas
  cadastrarPessoa(){

    //Caso algum campo esteja inválido ou vazio (se obrigatório), os campos são marcados como touched, podendo se tornar vermelhos
    if (this.formGroupPessoas.invalid) {
      this.formGroupPessoas.markAllAsTouched(); // Força a exibição dos erros
      return;
    }

    //Se o formulário estiver de acordo, o código segue
    else{

      //Chama o atributo pessoaSelecionada do PessoaService
      const pessoaEditar = this.pessoasService.getPessoaSelecionada();

      //Pega informações do forumlário
      const rua = this.formGroupPessoas.get('rua')?.value;
      const numero = this.formGroupPessoas.get('numero')?.value;
      const bairro = this.formGroupPessoas.get('bairro')?.value;

      //Concatena rua, número e bairro para criar cep
      const endereco = rua + ", " + numero + " " + bairro

      //Caso o pessoaEditar não seja nulo, ele procura o primeiro contato de celular
      const contatoCelular = pessoaEditar?.contatos?.find(contatoCelular => contatoCelular.tipoContato === 'celular');

      //Joga o celular para a const celular
      const celular = this.formGroupPessoas.get('celular')?.value;

      //Nesse projeto o tipo de contato é sempre celular mas podem ser adicionados outros tipos
      const tipoContato = "celular";

      //Cria um objeto IContato para salvar no banco
      const contato: IContato = {

        //Pega o ID de contatoCelular, que será nulo se for um cadastro novo
        id: contatoCelular?.id,
        contato: celular,
        tipoContato: tipoContato,
      }

      //Cria um objeto IPessoa para salvar no banco
      const pessoa: IPessoa = {
          //Pega o ID de pessoaEditar, que será nulo se for um cadastro novo
          id: pessoaEditar?.id,
          nome: this.formGroupPessoas.get('nome')?.value,
          cep: this.formGroupPessoas.get('cep')?.value,
          endereco: endereco,
          cidade: this.formGroupPessoas.get('cidade')?.value,
          uf: this.formGroupPessoas.get('uf')?.value,
          contatos: [contato]
      }

      //Se o ID da pessoa não for nulo (uma edição de contato existente, é chamado o método de edição)
      if(pessoa.id){
        this.pessoasService.editarPessoa(pessoa).subscribe(response => {
          console.log(response);
          Swal.fire('Sucesso', 'Pessoa editada com sucesso!', 'success');
          this.router.navigate([""])
        })
      }
      //Se o ID for nulo (um contato novo), é chamado o método de salvar
      else{
        this.pessoasService.cadastrarPessoa(pessoa).subscribe(response => {
          console.log(response);
          Swal.fire('Sucesso', 'Pessoa cadastrada com sucesso!', 'success');
          this.router.navigate([""])
        })
      }
    }

  }

  //Método para consultar endereço por CEP
  buscarEndereco(){

    //Coleta CEP do formulário
    const cep = this.formGroupPessoas.get('cep');

    //SDe o CEP seguir o padrão da REGEX é realizada a consulta na API
    if (cep?.valid) {
      this.viaCepService.consultarEndereco(cep.value).subscribe(response => {
        console.log(response);

        //A rua é uma concatenação de logradouro, complemento e unidade, mas complemento e unidade são opcionais
        const rua = `${response.logradouro || ''}${response.complemento ? `, ${response.complemento}` : ''}${response.unidade ? `, ${response.unidade}` : ''}`;
        const bairro = response.bairro;
        const cidade = response.localidade;
        const uf = response.uf;

        //Os outros campos  de endereço do formulário são preenchidos de acordo com o CEP
        this.formGroupPessoas.get('rua')?.setValue(rua);
        this.formGroupPessoas.get('bairro')?.setValue(bairro);
        this.formGroupPessoas.get('cidade')?.setValue(cidade);
        this.formGroupPessoas.get('uf')?.setValue(uf);

        //Caso o CEP seja invalido ele ficará vermelho e mostrará uma mensagem de erro
    });
    }
  }

  //método chama método do Service para consultar celular por pessoa, o método foi declarado no service pois é usado em ambos os componentes
  retornaCelular(pessoa: IPessoa){
    return this.pessoasService.retornaCelular(pessoa)
  }

  //Método para verificar número da residência de uma pessoa
  verificarNumero(pessoa: IPessoa){
    const endereco = pessoa.endereco;

    //Para encontrar o número, é procurado na string de endereço por um dúmero após um ", "
    const resultado = endereco.match(/, (\d+)/);

    //Se o número for encontrado ele é retornado
    if (resultado) {
      const numero = parseInt(resultado[1]);
      return numero;
    }
    else{
      return null;
    }
  }
}

