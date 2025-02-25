import { IContato } from "./contato";

export interface IPessoa {
  id: string;
  nome: string;
  cep: string;
  endereco: string;
  cidade: string;
  uf: string;
  contatos: IContato[];
}
