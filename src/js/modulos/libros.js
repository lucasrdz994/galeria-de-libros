import axios from 'axios';
import Swal from 'sweetalert2';

const libros = document.querySelector('.libros');

if (libros) {
  libros.addEventListener('click', event => {
    // eliminar libro
    if (event.target.classList.contains('eliminar')) {
  
      // id del libro
      const libroId = event.target.parentElement.parentElement.dataset.id;
  
      // creo la url
      const url = `${location.origin}/libro/${libroId}`;
  
      // alerta de confirmacion
      Swal.fire({
        title: 'Estas seguro?',
        text: "Este cambio no puede deshacerse!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar libro!'
      }).then(res => {
        // si se da el ok
        if (res.value) {
          axios.delete(url)
            .then(res => {
              if (res.status === 200) {
                console.log('eliminado correctamente');
                Swal.fire(
                  'Libro eliminado',
                  res.data,
                  'success'
                ).then( _ => {
                  // elimino del dom
                  event.target.parentElement.parentElement.remove();
                });
              }
            }).catch (error => {
              // hubo un error, no se elimino
              Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'El libro no pudo ser eliminado'
              })
            })
        }
      })
    }

    // actualizar estado
    if (event.target.classList.contains('estado')) {
      // id del libro
      const libroId = event.target.parentElement.parentElement.dataset.id;
      // creo la url
      const url = `${location.origin}/libro/${libroId}`
      // peticion patch
      axios.patch(url)
        .then (res => {
          if (res.status === 200) {
            if (res.data === false) {
              event.target.textContent = 'Marcar como leido';
            } else {
              event.target.textContent = 'Marcar como no leido';
            }
            event.target.classList.toggle('noleido');
            event.target.parentElement.parentElement.classList.toggle('leido');
          }
        })
    }

    // editar libro
    if (event.target.classList.contains('editar')) {
      window.location.href = '/editarLibro/' + event.target.parentElement.parentElement.dataset.id;
    }
    
  })
}