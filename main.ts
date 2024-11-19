const arr: number[] = [2, 6, 1, 5, 9, 3, 10, 8, 7, 4];

const quicksort = (arr: number[], izq: number, dcha: number): number[] => {
  let i = izq;
  let d = dcha;
  const pivote = arr[Math.floor((i + d) / 2)]; //calculamos el pivote y truncamos el valor de pos
  let aux = 0;

  while (i <= d) {
    //Busqueda del elemento mayor que el pivote a su izq
    while (arr[i] < pivote) {
      i++;
    }
    //Busqueda del elemeto menor que el pivote a su derecha
    while (pivote < arr[d]) {
      d--;
    }
    //Intercambio de elementos dentro del array
    if (i <= d) {
      aux = arr[i];
      arr[i] = arr[d];
      arr[d] = aux;
      i++;
      d--;
    }
  }
  if (izq < i) quicksort(arr, izq, d);
  if (i < dcha) quicksort(arr, i, dcha);
  return arr;
};
