Problemas encontrados
1. cantidad de ventas, en explorar.js  hay ventas[4].producto cuando solamente hay 3 registros
2. en las ciudades estan mal escritas, les falta la tilde
3. ID de ventas, todos tienen ID 1 en vez de 1,2,3 

plan en pseudocodigo:
Iniciar totalvendido = 0
Para cada venta en ventas: 
subtotal = venta.cantidad * venta.precio
totalvendido = totalvendido + subtotal
Mostrar totalvendido

Indicadores con métodos de arreglos y agrupaciones:

totalVendidoM()
- ¿Qué recorro? El arreglo de ventas.
- ¿Qué filtro? No filtro ningún registro.
- ¿Qué transformo? Calculo el valor de cada venta con valorVenta().
- ¿Qué acumulo? El dinero generado por todas las ventas.
- ¿Cómo agrupo? No agrupo; utilizo reduce() para sumar.

unidadesVendidasM()
- ¿Qué recorro? El arreglo de ventas.
- ¿Qué filtro? No filtro ningún registro.
- ¿Qué transformo? No transformo los registros.
- ¿Qué acumulo? Las cantidades vendidas.
- ¿Cómo agrupo? No agrupo; utilizo reduce() para sumar.

ventasPorCiudadM()
- ¿Qué recorro? El arreglo de ventas.
- ¿Qué filtro? Las ventas que pertenecen a la ciudad solicitada.
- ¿Qué transformo? Normalizo los nombres de las ciudades con trim() y toLowerCase().
- ¿Qué acumulo? El dinero generado por las ventas filtradas.
- ¿Cómo agrupo? No agrupo; utilizo filter() y reduce().

totalPorCiudad()
- ¿Qué recorro? El arreglo de ventas.
- ¿Qué filtro? No filtro ningún registro.
- ¿Qué transformo? Normalizo los nombres de las ciudades.
- ¿Qué acumulo? El valor vendido por ciudad.
- ¿Cómo agrupo? Utilizo un objeto como diccionario, donde cada ciudad es una propiedad.

unidadesPorProducto()
- ¿Qué recorro? El arreglo de ventas.
- ¿Qué filtro? No filtro ningún registro.
- ¿Qué transformo? Identifico el nombre de cada producto.
- ¿Qué acumulo? Las unidades vendidas de cada producto.
- ¿Cómo agrupo? Utilizo un objeto como diccionario, donde cada producto es una propiedad.

topProductosPorValor()
- ¿Qué recorro? El arreglo de ventas.
- ¿Qué filtro? No filtro ningún registro.
- ¿Qué transformo? Convierto los resultados del objeto en un arreglo con map().
- ¿Qué acumulo? El dinero generado por cada producto.
- ¿Cómo agrupo? Utilizo reduce() para agrupar las ventas por producto.
- ¿Cómo ordeno? Utilizo sort() de mayor a menor y slice() para obtener los primeros k productos.
- ¿Modifico el arreglo original? No, ordeno un arreglo nuevo creado con Object.entries() y map().


