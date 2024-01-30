import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { left } from '@popperjs/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})


export class FormComponent implements OnInit{
  public  title: string = "Crear Cliente";
  public cliente: Cliente = new Cliente;

  public errores: string[];

  //para poder usar las funciones de clientes. services debemos inyectarlo en el constructor
  //inyectamos el  router de @angula/router en el constructor 
  //inyectamos el ActivatedRoute
  constructor (private clienteService:ClienteService, private router:Router,
    private activatedRoute:ActivatedRoute){
    
  }

  ngOnInit(): void {
    this.cargarCliente()
  }

  cargarCliente(): void{
    this.activatedRoute.params.subscribe(params => {let id = params['id']
      if(id){
          this.clienteService.getCliente(id).subscribe((cliente)=> this.cliente=cliente)
        }
      })
  }

  public create(): void{
    /*console.log("CLIKED");
    console.log(this.cliente); se uso para verificar que el metodo se ejecuta correctamente*/
  
    //usanos el metodo(funcion) de cliente.service

    this.clienteService.create(this.cliente).subscribe(
      cliente => {
                  this.router.navigate(['/clientes'])
                  Swal.fire('Cliente Guardado', `El cliente ${cliente.nombre} fue creado con éxito!`, 'success')
                },
                err=>{this.errores=err.error.errors as string[];
                  console.error('codigo del error desde el backend: '+err.status );
                  console.error(err.error.errors );
                }
    );
  }
  

  update(): void{
    this.clienteService.update(this.cliente).subscribe(
      cliente => {
                  this.router.navigate(['/clientes'])
                  Swal.fire('Cliente Actualizado', `El cliente ${cliente.nombre} fue actulizado con éxito!`, 'success')
                },
                err=>{this.errores=err.error.errors as string[];
                  console.error('codigo del error desde el backend: '+err.status );
                  console.error(err.error.errors );
                }
  )
}
   

}
