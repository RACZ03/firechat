import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform( arreglo: any[], texto: string, col1: string): any[] {
    if ( texto === '' || texto === undefined )
    {
      return arreglo;
    }
    else
    {
      texto = texto.toLowerCase();

      const busqueda1 = arreglo.filter(item => {
        return item[col1].toLowerCase()
          .includes(texto);
      });
      if (busqueda1.length > 0)
      {
        return busqueda1;
      }
      
      return busqueda1;
    }
  }

}
