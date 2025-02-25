import { Component, OnInit, Input } from '@angular/core';
import { IPessoa } from 'src/app/interfaces/pessoa';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent{

  @Input()
  pessoa: any = {}

  ngOnInit() {
  }

}
