//Criação de interface IViaCep
export interface IViaCep {
  "cep": string,
  "logradouro": string,
  "complemento"?: string,
  "unidade"?: string,
  "bairro": string,
  "localidade": string,
  "uf": string,
  "estado": string,
  "regiao": string,
  "ibge": number,
  "gia": number,
  "ddd": number,
  "siafi": number,
}
