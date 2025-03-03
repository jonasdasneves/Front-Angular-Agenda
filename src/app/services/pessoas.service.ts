import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPessoa } from '../interfaces/pessoa';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PessoasService {

  //
  private pessoaSelecionada: IPessoa | null = null;

  //Url da api CRUD do ambiente
  url = environment.url

  //Chama a classe HttpClient
  constructor(private http: HttpClient) {}

  setPessoaSelecionada(pessoa: IPessoa | null) {
    this.pessoaSelecionada = pessoa;
  }

  getPessoaSelecionada() {
    return this.pessoaSelecionada;
  }

  buscarTodasPessoas(){
    return this.http.get<IPessoa[]>(`${this.url}/pessoas`)
  }

  cadastrarPessoa(pessoa: IPessoa): Observable<IPessoa> {
    return this.http.post<IPessoa>(`${this.url}/pessoas`, pessoa)
  }

  buscarPessoaPorID(id: number){
    return this.http.get<IPessoa>(`${this.url}/pessoas/${id}`)
  }

  apagarPessoaPorID(id: number){
    return this.http.delete<IPessoa>(`${this.url}/pessoas/${id}`)
  }

  editarPessoa(pessoa: IPessoa){
    return this.http.put<IPessoa>(`${this.url}/pessoas`, pessoa)
  }

  retornaCelular(pessoa: IPessoa){
    const celular = pessoa?.contatos?.find(contato => contato.tipoContato === 'celular');
    return celular?.contato;
  }

}
