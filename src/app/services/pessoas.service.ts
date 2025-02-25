import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPessoa } from '../interfaces/pessoa';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PessoasService {

  url = environment.url

  constructor(private http: HttpClient) {}

  buscarTodasPessoas(){
    return this.http.get<IPessoa[]>(`${this.url}/pessoas`)
  }

  cadastrarPessoa(pessoa: IPessoa): Observable<IPessoa> {
    return this.http.post<IPessoa>(`${this.url}/pessoas`, pessoa)
  }

  buscarPessoaPorID(id: number){
    return this.http.get<IPessoa>(`${this.url}/pessoas/${id}`)
  }
}
