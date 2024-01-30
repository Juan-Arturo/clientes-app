import { Injectable } from '@angular/core';
import { formatDate, DatePipe} from '@angular/common';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable, throwError} from 'rxjs';
import { catchError} from 'rxjs/operators';
import { HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import { map,tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string ='http://localhost:8010/api/clientes';
  
  //creamos las cabeceras
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})


  /*Inyectamos el objeto HttpClientModule via contructor */
  constructor(private http: HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any>{
    //return of (CLIENTES);

   /*La forma de hacerlo es con un casqueo del json a el objeto cliente*/
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
       tap((response:any)=>{
        console.log("ClienteService TAP1");
        (response.content as Cliente []).forEach(clienteForEach => 
          { 
            console.log(clienteForEach.nombre)
          }//end flecha ForEach
        );//end forEach
       })/*end tap*/,
       map((response: any) => {
        (response.content as Cliente[]).map(cliente =>{
         cliente.nombre=cliente.nombre.toUpperCase();
         let datePipe= new DatePipe('es');

          //cliente.createAt=datePipe.transform(cliente.createAt,'EEEE dd/MMMM/yyyy'); //hay dos formas de cambiar la fecha una con DatePipe 
         //cliente.createAt=formatDate(cliente.createAt,'dd-MM-yyyy', 'en-us');  //y la otra solo usando formatDate
        //Dato extra se puede modificar el formato  directamente en la vista usando pipe
         return cliente});
       return response
      })//end map
      , tap(response=>{
        console.log("ClienteService TAP2"); 
        (response.content as Cliente[]).forEach(clienteForEach => 
          {
            console.log(clienteForEach.nombre)
          }//end flecha ForEach
        );//end forEach
       })/*end tap*/
    )//end pipe;
       //<Cliente[]>(this.urlEndPoint);
  }
  
  //metodo para crear un nuevo cliente
  create(cliente: Cliente) : Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente,{headers:this.httpHeaders}).pipe(
      /*el operador map tomara el flujo de datos ractivo del backent para conbertirlo o 
      manipular los datos de acuerdo a nuestras nececidades por eso se elimina el casqueo
      (post<Cliente>)y se usa el operador map*/ 
      //dato los operadores se separan por coma por eso map y catchError tienen una coma en medio
      /*Al retomar un map del backen se vuelve un JSON que en su interior tiene la respuesta
      (mensaje) y mi objeto(cliente) */

      //despues responseJSON.cliente lo convertimos en tipo cliente 
    map((responseJSON: any) => responseJSON.cliente as Cliente),//responseJSON es de tipo onjeto por eso lo declaramos como any para que sea flexible 
     catchError(e =>{

         //manipulacion de las validaciones de backend para mostrarlas
        if(e.status==400){
          return throwError( () => e );
        }

        console.error( e.error.Mensaje);
        Swal.fire('Error al crear al cliente', e.error.Error, 'error');
        return throwError( () => e );
      })//end catchError
    );// end pipe
  }

  getCliente(id): Observable<Cliente>{
   
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e =>{
        this.router.navigate(['/clientes']);
        console.error( e.error.Mensaje);
        Swal.fire('Error al editar', e.error.Mensaje, 'error');
        return throwError( () => e );
      })//end catchError
    );//end pipe
  }

  update (cliente: Cliente) : Observable<Cliente>{
    return this.http.put(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers:this.httpHeaders}).pipe(
       //despues responseJSON.cliente lo convertimos en tipo cliente 
    map((responseJSON: any) => responseJSON.cliente as Cliente),//responseJSON es de tipo onjeto por eso lo declaramos como any para que sea flexible 
      catchError(e =>{
        
        //manipulacion de las validaciones de backend para mostrarlas
        if(e.status==400){
          return throwError( () => e );
        }


        console.error( e.error.Mensaje);
        Swal.fire('Error al editar al cliente', e.error.Error, 'error');
        return throwError( () => e );
        
      })//end catchError
    );//end pipe
  } 

  delete (id: number) : Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers:this.httpHeaders}).pipe(
      catchError(e =>{
        console.error( e.error.Mensaje);
        Swal.fire('Error al eliminar al cliente', e.error.Error, 'error');
        return throwError( () => e );
      })//end catchError
    );//end pipe
 }
}
 