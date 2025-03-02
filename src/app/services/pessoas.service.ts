import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPessoa } from '../interfaces/pessoa';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PessoasService {
  private pessoaSelecionada: IPessoa | null = null;

  url = environment.url

  constructor(private http: HttpClient) {}

  setPessoa(pessoa: IPessoa | null) {
    this.pessoaSelecionada = pessoa;
  }

  getPessoa() {
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
