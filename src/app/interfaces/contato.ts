//Criação de interface IContato - ID é opcional pois ao criar um novo registro o ID é definido no Back-End
export interface IContato {
  id?: number;
  contato: string;
  tipoContato: string;
}
