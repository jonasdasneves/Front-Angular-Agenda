import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IViaCep } from '../interfaces/via-cep';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {

  url = environment.urlViaCep;

  constructor(private http: HttpClient) { }

  consultarEndereco(cep: string){
    return this.http.get<IViaCep>(`${this.url}/${cep}/json`)
  }
}
