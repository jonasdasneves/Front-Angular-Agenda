import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IViaCep } from '../interfaces/via-cep';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {

  //Chama url da Api ViaCep do ambiente
  url = environment.urlViaCep;

  //Chama o HttpClient
  constructor(private http: HttpClient) { }

  //Método para consulta de endereço por CEP
  consultarEndereco(cep: string){
    return this.http.get<IViaCep>(`${this.url}/${cep}/json`)
  }
}
