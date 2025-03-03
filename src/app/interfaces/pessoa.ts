import { IContato } from "./contato";

//Criação de interface IPessoa - ID é opcional pois ao criar um novo registro o ID é definido no Back-End
export interface IPessoa {
  id?: number;
  nome: string;
  cep: string;
  endereco: string;
  cidade: string;
  uf: string;
  contatos: IContato[];
}
