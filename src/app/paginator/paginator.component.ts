import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { left } from '@popperjs/core';

@Component({
  selector: 'paginator-nav ',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {
  
  @Input() paginadorH: any;
  paginas: number[];
  desde:number;
  hasta:number;

  constructor(){}
  ngOnInit() {

    this.initPaginator();
  
  }


  ngOnChanges(changes : SimpleChanges){
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    
    let paginadorActualizado = changes['paginadorH'];
    if(paginadorActualizado.previousValue){
     this.initPaginator();
    }
   }
  
  private initPaginator(): void {
    this.desde = Math.min(Math.max(1,this.paginadorH.number-4), this.paginadorH.totalPages-5);
    this.hasta = Math.max(Math.min(this.paginadorH.totalPages,this.paginadorH.number+4),6);

     if(this.paginadorH.totalPages>5){
       this.paginas = new Array(this.hasta - this.desde +1).fill(0).map((_valor, indice) => indice + this.desde);
     }else{
     this.paginas = new Array(this.paginadorH.totalPages).fill(0).map((_valor, indice) => indice +1);
     }//end else
  }
  

}
