import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IContato } from '../interfaces/contato';

@Injectable({
  providedIn: 'root'
})
//Service não é utilizada no momento mas pode ser
export class ContatoService {

  //Url da api CRUD do ambiente
  url = environment.url

  //Chama a classe HttpClient
  constructor(private http: HttpClient) {}

  cadastrarContato(contato: IContato){
    return this.http.post(`${this.url}/contatos`, contato)
  }

}
