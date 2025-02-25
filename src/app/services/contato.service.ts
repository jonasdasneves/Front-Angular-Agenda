import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IContato } from '../interfaces/contato';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  url = environment.url

  constructor(private http: HttpClient) {}

  cadastrarContato(contato: IContato){
    return this.http.post(`${this.url}/contatos`, contato)
  }

}
