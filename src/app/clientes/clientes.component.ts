import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  paginadorP: any;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.clientes=this.clienteService.getCliente();
   
    this.activatedRoute.paramMap.subscribe(
      (params) => { let page: number = +params.get("page"); //el + conbierte el string(page) a entero
       if(!page){page=0}; 
       this.clienteService.getClientes(page).pipe(
            //este pipe solo es para demostrar la funcion de un tap no es necesario para el metodo get clientes
            tap((Response) => {
              console.log('ClienteComponent TAP3');
              (Response.content as Cliente[]).forEach(
                (clienteForEach) => {
                  console.log(clienteForEach.nombre);
                } //end flecha ForEach
              ); //end forEach
            }) //end tap
          ).subscribe(
            (Response) => {
              this.clientes = Response.content as Cliente[];
              this.paginadorP= Response; 
              }  /*Creamos un observador(client) que tiene la 
                informacion del metodo get clientes de cliente service, este observador a su vez 
                es un parameotro que retorna getClientes(CLIENTE) por eso tiene la informacion  */
                /*client tambies es una funcion anonima por eso  la flecha (funcion flecha)
                se usa la funcion para tambien hacer la asignacion del flujo de datos(los datos 
                que  guarda client)*/
          ); //subscribe Response
      } //end params
    ); //end subscribe activatedRoute
  }

  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success m-2 ',
        cancelButton: 'btn btn-danger m-2',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: '¿Estas seguro?',
        text: `Se eliminara al cliente ${cliente.nombre} ${cliente.apellido}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, Eliminar',
        cancelButtonText: 'No, Cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          //aqui al dar si llamaremos a la funcion delete de nuestro clientes.service.ts
          this.clienteService.delete(cliente.id).subscribe(
            (Response) => {
              //quitamos del listado al objeto  cliente eliminado para que se actualiza en automatico
              this.clientes = this.clientes.filter((cli) => cli !== cliente);
              //alerta para confirmar la eliminacion
              swalWithBootstrapButtons.fire({
                title: 'Eliminacion Exitosa',
                text: `El cliente ${cliente.nombre} ${cliente.apellido} fue eliminado.`,
                icon: 'success',
              }); //end  swalWithBootstrapButtons (alerta)
            } //end response
          ); //end subscribe
        }
      });
  } //end delete
}
