import { Layout, Row, Col, Card, Statistic, Table, Button, Select } from 'antd';
import { Column, Line, Pie } from '@ant-design/charts';
import { DollarOutlined, ShoppingCartOutlined, BarChartOutlined, RiseOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import dayjs from 'dayjs';
import './MostrarDashboard.css';
const { Option } = Select;

const { Header, Content, Footer } = Layout;

const columns = [
  {
    title: 'Nombres de productos',
    dataIndex: 'NombreProducto',
    key: 'name',
    width: '120px'
  },
  {
    title: 'Cantidad vendida',
    dataIndex: 'cantidad',
    key: 'category',
    width: '120px'
  },
  {
    title: 'Ventas',
    dataIndex: 'PrecioUnitario',
    render: (text) => `Bs   ${text}`,
    key: 'sales',
    width: '120px'
  },
];

const columnsCaja = [
  {
    title: 'Numero caja',
    dataIndex: 'id',
    key: 'numCaja',
    width: '100px',
    render: (text, record, index) => {
      if (record.NombreEmpleado === "") {
        return "";
      }
      return `${index + 1}`;
    },
  },
  {
    title: 'Nombre encargado',
    dataIndex: 'NombreEmpleado',
    key: 'nombreEmpleado',
  },
  {
    title: 'Fecha',
    dataIndex: 'Fecha',
    key: 'fecha',
    defaultSortOrder: 'descend',
    sorter: (a, b) => dayjs(a.Fecha).unix() - dayjs(b.Fecha).unix(),
  },
  {
    title: 'Hora',
    dataIndex: 'Hora',
    key: 'hora',
  },
  {
    title: 'Monto caja inicial',
    dataIndex: 'MontoInicialCaja',
    width: '100px',
    render: (text, record, index) => {
      if (record.NombreEmpleado === "") {
        return text;
      }
      return `Bs ${text}`;
    },
    key: 'montoInicialCaja',
  },
  {
    title: 'Monto caja final',
    dataIndex: 'MontoActualCaja',
    width: '100px',
    render: (text, record, index) => {
      if (record.NombreEmpleado === "") {
        return text;
      }
      return `Bs ${text}`;
    },
    key: 'montoActualCaja',
  },
  {
    title: 'Total retiros',
    dataIndex: 'TotalRetiroCaja',
    width: '100px',
    render: (text, record, index) => {
      if (record.NombreEmpleado === "") {
        return text;
      }
      return `Bs ${text}`;
    },
    key: 'totalRetiroCaja',
  },
  {
    title: 'Total ingresos',
    dataIndex: 'TotalIngresoCaja',
    width: '100px',
    render: (text, record, index) => {
      if (record.NombreEmpleado === "") {
        return text;
      }
      return `Bs ${text}`;
    },
    key: 'totalIngresoCaja',
  },
  {
    title: 'Total ventas',
    dataIndex: 'TotalVentas',
    width: '100px',
    render: (text) => `Bs   ${text}`,
    key: 'totalVentas',
  },
];

const columnsProducto = [
  {
    title: 'Fecha',
    dataIndex: 'Fecha',
    defaultSortOrder: 'descend',
    width: '120px',
    sorter: (a, b) => dayjs(a.Fecha).unix() - dayjs(b.Fecha).unix(),
  },
  {
    title: 'Hora',
    dataIndex: 'Hora',
    key: 'hora',
  },
  {
    title: 'Nombre del producto',
    dataIndex: 'NombreProducto',
    width: '150px',
    sorter: (a, b) => a.NombreProducto.localeCompare(b.NombreProducto),
  },
  {
    title: 'Cantidad',
    dataIndex: 'Cantidad',
    width: '100px',
    width: '100px',
    sorter: (a, b) => a.Cantidad - b.Cantidad,
  },
  {
    title: 'Precio de compra unitario',
    dataIndex: 'PrecioCompra',
    width: '150px',
    render: (text, record) => {      
    if (record.NombreEmpleado === "") {
      return text;
    }
    return `Bs ${text}`;
  },
    sorter: (a, b) => a.PrecioCompra - b.PrecioCompra,
  },
  // {
  //   title: 'Total de compra',
  //   width: '100px',
  //   render: (text, record) => `Bs ${(record.Cantidad * record.PrecioCompra).toFixed(2)}`,
  //   sorter: (a, b) => (a.Cantidad * a.PrecioCompra) - (b.Cantidad * b.PrecioCompra),
  // },
  {
    title: 'Precio de venta unitario',
    dataIndex: 'Precio',
    width: '150px',
    render: (text, record) => {      
      if (record.NombreEmpleado === "") {
        return text;
      }
      return `Bs ${text}`;
    },
    sorter: (a, b) => a.PrecioVenta - b.PrecioVenta,
  },
  {
    title: 'Total de venta',
    width: '100px',
    dataIndex: 'TotalVentas',
    render: (text, record) => {      
      if (record.NombreEmpleado === "") {
        return text;
      }
      return  `Bs ${record.Cantidad * record.Precio}`;
    },
    sorter: (a, b) => (a.Cantidad * a.PrecioVenta) - (b.Cantidad * b.Precio),
  },
  {
    title: 'Ganancia',
    width: '100px',
    dataIndex: 'TotalGanancias',
    render: (text, record) => {      
      if (record.NombreEmpleado === "") {
        return text;
      }
      return  `Bs ${((record.Precio - record.PrecioCompra) * record.Cantidad).toFixed(2)}`;
    },
    sorter: (a, b) =>
      ((a.Precio - a.PrecioCompra) * a.Cantidad) - ((b.Precio - b.PrecioCompra) * b.Cantidad),
  },

  // {
  //   title: 'Proveedor',
  //   dataIndex: 'Proveedor',
  //   // Agregar lógica de proveedor si es relevante
  // },
];

const DashboardVentas = () => {
  const [dataCaja, setDataCaja] = useState([]);
  const [dataCajaControl, setDataCajaControl] = useState([]);
  const [dataCajaControlOriginal, setDataCajaControlOriginal] = useState([]);
  const [dataRankingProductos, setDataRankingProductos] = useState([]);
  const [data, setData] = useState([]);
  const [dataReporteVentas, setDataReporteVentas] = useState([]);
  const [numeroVentas, setNumeroVentas] = useState(0);
  const [numeroProductosVendidos, setNumeroProductosVendidods] = useState(0);
  const [dataProductos, setDataProductos] = useState([]);
  const [dataProductosOriginal, setDataProductosOriginal] = useState([]);

  // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - 
  useEffect(() => {
    // --> Define una función asíncrona para obtener los datos del historial de apertura de caja.
    const fetchCaja = async () => {
      // Obtiene todos los documentos de la colección "HistorialAperturaCaja".
      const querySnapshot = await getDocs(collection(db, "HistorialAperturaCaja"));
      // Mapea los documentos para obtener los datos y su ID.
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      // Calcula los montos sumatorios para las ventas y las ganancias.
      const cajaDinero = {
        TotalVentas: dataList.reduce((total, item) => total + item.TotalVentas, 0), // Suma total de ventas.
        TotalGanancias: dataList.reduce((total, item) => total + item.TotalGanancias, 0) // Suma total de ganancias.
      };

      // Actualiza el estado con los totales calculados.
      setDataCaja(cajaDinero);

      // Añade un total de ventas global al final de la lista de datos.
      dataList.push(getTotalVentas(dataList));

      // Actualiza el estado con los datos de control de caja (incluyendo los totales).
      // setDataCajaControl(dataList);
      setDataCajaControlOriginal(dataList);
    };


    // --> Define una función asíncrona para obtener los reportes de ventas.
    const fetchReportesVentas = async () => {
      // Obtiene todos los documentos de la colección "ReportesVentas".
      const querySnapshot = await getDocs(collection(db, "ReportesVentas"));
      // Mapea los documentos de "ReportesVentas" y extrae los datos.
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      //Almacena la infroamción del reporte de ventas
      setDataReporteVentas(dataList);

      // Actualiza el estado con el número total de ventas.
      setNumeroVentas(dataList.length);

      // Crea un array de productos combinando los productos de todos los reportes de ventas.
      const productosArray = dataList.map(item =>
        item.productos.map(producto => ({
          ...producto,
          Fecha: item.Fecha // Añade la fecha de la venta a cada producto.
        }))
      ).flat();

      // Actualiza el estado con el array de productos.
      setData(productosArray);

      // Calcula el total de productos vendidos sumando la cantidad de todos los productos.
      const totalProductosVendidos = productosArray.reduce((total, item) => total + item.CantidadVendida, 0);
      setNumeroProductosVendidods(totalProductosVendidos);

      // Contabiliza la cantidad de cada producto vendido y agrega el precio unitario.
      const productCount = productosArray.reduce((acc, producto) => {
        if (!acc[producto.NombreProducto]) {
          acc[producto.NombreProducto] = {
            cantidad: 0,
            PrecioUnitario: producto.PrecioUnitario // Guarda el precio unitario para cada producto.
          };
        }
        // Suma la cantidad vendida de cada producto.
        acc[producto.NombreProducto].cantidad += producto.CantidadVendida;
        return acc;
      }, {});

      // Convierte el objeto en un array de objetos y los ordena según la cantidad vendida.
      const ranking = Object.entries(productCount)
        .map(([NombreProducto, data]) => ({
          NombreProducto,
          cantidad: data.cantidad,
          PrecioUnitario: parseInt(data.PrecioUnitario) * data.cantidad // Calcula el precio total por cantidad.
        }))
        .sort((a, b) => b.cantidad - a.cantidad); // Ordena los productos de mayor a menor cantidad vendida.

      // Actualiza el estado con el ranking de productos.
      setDataRankingProductos(ranking);
    };


    // Define una función asíncrona para obtener los productos de la base de datos.
    const fetchProductos = async () => {
      // Obtiene todos los documentos de la colección "ListaProductos".
      const querySnapshot = await getDocs(collection(db, "ListaProductos"));

      // Mapea los documentos de "ListaProductos" y extrae los datos.
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id // Agrega el id del documento a cada producto.
      }));

      // Actualiza el estado con los datos de los productos obtenidos.
      // setDataProductos(dataList);

      // Guarda una copia original de los productos.
      setDataProductosOriginal(dataList);
    };

    // Llama a las funciones para obtener productos, caja y reportes de ventas.
    fetchProductos();
    fetchCaja();
    fetchReportesVentas();
  }, []);
  // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // #region + + + + + + + + + + + + + + + + + + + + +  [ Métodos ]  + + + + + + + + + + + + + + + + + + + + + + + + + + 
  // Procesa los datos para crear el gráfico de línea
  const lineData = data.reduce((acc, producto) => {
    // Busca si ya existe una entrada con la misma fecha
    const existingEntry = acc.find(entry => entry.Fecha === producto.Fecha);
    if (existingEntry) {
      // Si existe, suma la cantidad vendida
      existingEntry.CantidadVendida += producto.CantidadVendida;
    } else {
      // Si no existe, agrega una nueva entrada con la fecha y cantidad vendida
      acc.push({
        Fecha: producto.Fecha,
        CantidadVendida: producto.CantidadVendida
      });
    }
    return acc;
  }, []);

  // Ordena los datos por fecha ascendente
  lineData.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));

  // Configura las opciones del gráfico de línea
  const config = {
    data: lineData, // Datos a mostrar en el gráfico
    xField: 'Fecha', // Campo para el eje X (fecha)
    yField: 'CantidadVendida', // Campo para el eje Y (cantidad vendida)
    smooth: true, // Hace que la línea sea suave
    meta: {
      CantidadVendida: {
        alias: 'Cantidad Vendida', // Nombre personalizado para el eje Y
      },
    },
    // Configuración de responsividad
    responsive: true,
    autoFit: true, // Ajusta el tamaño automáticamente en diferentes dispositivos
    height: 400, // Altura inicial del gráfico
    padding: 'auto', // Espaciado automático para el gráfico
  };

  // Función para obtener el total de ventas
  const getTotalVentas = (listaDatos) => {
    // Suma el total de ventas de todos los elementos en listaDatos
    const totalVentasSumado = listaDatos.reduce((acumulador, item) => acumulador + item.TotalVentas, 0);

    // Crea una fila con los totales, dejando los demás campos vacíos
    const filaTotal = {
      Estado: "",
      Fecha: "",
      Hora: "",
      MontoActualCaja: "",
      MontoFinalCaja: "",
      MontoInicialCaja: "",
      NombreEmpleado: "",
      TotalCambio: "",
      TotalGanancias: "",
      TotalIngresoCaja: "",
      TotalPagado: "",
      TotalRetiroCaja: "",
      TotalVentas: totalVentasSumado, // Asigna el total calculado
      id: "total" // Id personalizado para identificar esta fila como total
    };

    // Devuelve la fila con los totales
    return filaTotal;
  }

  // Función para obtener el total de ventas
  const getTotalVentasProducto = (listaDatos) => {
    // Suma el total de ventas de todos los elementos en listaDatos
    const totalVentasSumado = listaDatos.reduce((acumulador, item) => acumulador + parseFloat(item.Precio)*item.Cantidad, 0);
    const totalGananciasSumado = listaDatos.reduce((acumulador, item) => acumulador + item.Cantidad*(item.Precio - item.PrecioCompra), 0);
    // Crea una fila con los totales, dejando los demás campos vacíos
    const filaTotal = {
      Estado: "",
      Fecha: "",
      Hora: "",
      MontoActualCaja: "",
      MontoFinalCaja: "",
      MontoInicialCaja: "",
      NombreEmpleado: "",
      TotalCambio: "",
      TotalIngresoCaja: "",
      TotalPagado: "",
      TotalGanancias: totalGananciasSumado,
      TotalVentas: totalVentasSumado, // Asigna el total calculado
      id: "total" // Id personalizado para identificar esta fila como total
    };

    // Devuelve la fila con los totales
    return filaTotal;
  }

  // #region + + + + + + + + + + + + + + + + + + + + +  ANALISIS DE DATOS DE CAJA Y PRODUCTOS   + + + + + + + + + + + + + + + + + + + + + + + + + + 

  // Estados para controlar la frecuencia y los valores de filtrado
  const [frecuencia, setFrecuencia] = useState('mensual'); // Frecuencia seleccionada: mensual, trimestral, etc.
  const [mes, setMes] = useState(null); // Estado para el mes
  const [trimestre, setTrimestre] = useState(null); // Estado para el trimestre
  const [semestre, setSemestre] = useState(null); // Estado para el semestre
  const [anio, setAnio] = useState(null); // Estado para el año

  const getProductosPorTiempo = (dataActual) => {
    const transformedData = dataActual.flatMap(item => {
      // Verificar si 'productos' existe y tiene datos
      if (Array.isArray(item.productos) && item.productos.length > 0) {
        return item.productos.map(producto => ({
          ...item, // Copiar las propiedades del objeto principal
          ...producto, // Fusionar las propiedades del producto actual
          productos: undefined, // Eliminar 'productos' del resultado
        }));
      }
      // Si no hay productos, devolver el objeto original
      return item;
    });

    // Opcional: eliminar completamente la propiedad 'productos'
    const cleanedData = transformedData.map(({ productos, ...rest }) => rest);

    const datosActualizados = cleanedData.map((item) => {
      // Busca en otroData el objeto con el mismo NombreProducto
      const productoEncontrado = dataProductosOriginal.find(
        (otro) => otro.NombreProducto === item.NombreProducto
      );

      // Si se encuentra el producto, actualiza Precio y PrecioCompra
      if (productoEncontrado) {
        return {
          ...item,
          Precio: productoEncontrado.Precio,
          PrecioCompra: productoEncontrado.PrecioCompra,
        };
      }

      // Si no se encuentra, devuelve el objeto original
      return item;
    });

    const datosActualizados2 = datosActualizados.map(obj => ({
      ...obj,
      Cantidad: obj.CantidadVendida,
    }));

    datosActualizados2.push(getTotalVentasProducto(datosActualizados2));

    return datosActualizados2; // Agregar total de ventas;
  }

  // Función para manejar el cambio de frecuencia de filtrado
  const handleFrecuenciaChange = (value) => {
    setFrecuencia(value); // Actualiza la frecuencia
    setMes(null); // Limpiar valores relacionados
    setTrimestre(null);
    setSemestre(null);
    setAnio(null);
  };

  // Función para manejar el cambio de mes
  const handleMesChange = (value) => {
    setMes(value); // Asignar el mes seleccionado
    let mesActual = parseInt(value); // Convertir a número entero

    // Filtrar los datos de caja por mes y año 2024
    const datosFiltradoMes = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mes === mesActual && anio === 2024;
    });

    // Filtrar los productos por mes y año 2024
    const datosFiltradoMesProduct = dataReporteVentas.filter(item => {
      const fecha = dayjs(item.Fecha, "YYYY/MM/DD");
      const mes = fecha.month();
      const anio = fecha.year();
      return mes === mesActual && anio === 2024;
    });

    // Actualizar los estados con los datos filtrados
    setDataProductos(getProductosPorTiempo(datosFiltradoMesProduct));

    datosFiltradoMes.push(getTotalVentas(datosFiltradoMes)); // Agregar total de ventas

    setDataCajaControl(datosFiltradoMes); // Actualizar los datos de caja
  };

  // Función para manejar el cambio de trimestre
  const handleTrimestreChange = (value) => {
    setTrimestre(value); // Asignar el trimestre seleccionado

    // Definir los rangos de meses para cada trimestre
    const trimestres = {
      1: [0, 1, 2], // Primer trimestre: Enero (0), Febrero (1), Marzo (2)
      2: [3, 4, 5], // Segundo trimestre: Abril (3), Mayo (4), Junio (5)
      3: [6, 7, 8], // Tercer trimestre: Julio (6), Agosto (7), Septiembre (8)
      4: [9, 10, 11], // Cuarto trimestre: Octubre (9), Noviembre (10), Diciembre (11)
    };

    // Obtener los meses del trimestre seleccionado
    const mesesTrimestre = trimestres[value];

    // Filtrar los datos de caja por los meses del trimestre y año 2024
    const datosFiltradoCaja = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mesesTrimestre.includes(mes) && anio === 2024;
    });

    // Filtrar los productos por los meses del trimestre y año 2024
    const datosFiltradoProductos = dataReporteVentas.filter(item => {
      const fecha = dayjs(item.Fecha, "YYYY/MM/DD");
      const mes = fecha.month();
      const anio = fecha.year();
      return mesesTrimestre.includes(mes) && anio === 2024;
    });

    // Actualizar los estados con los datos filtrados
    setDataProductos(getProductosPorTiempo(datosFiltradoProductos));
    datosFiltradoCaja.push(getTotalVentas(datosFiltradoCaja)); // Agregar total de ventas
    setDataCajaControl(datosFiltradoCaja); // Actualizar los datos de caja
  };

  // Función para manejar el cambio de semestre
  const handleSemestreChange = (value) => {
    setSemestre(value); // Asignar el semestre seleccionado

    // Definir los rangos de meses para cada semestre
    const semestres = {
      1: [0, 1, 2, 3, 4, 5], // Primer semestre: Enero (0) a Junio (5)
      2: [6, 7, 8, 9, 10, 11], // Segundo semestre: Julio (6) a Diciembre (11)
    };

    // Obtener los meses del semestre seleccionado
    const mesesSemestre = semestres[value];

    // Filtrar los datos de caja por los meses del semestre y año 2024
    const datosFiltradoCaja = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mesesSemestre.includes(mes) && anio === 2024;
    });

    // Filtrar los productos por los meses del semestre y año 2024
    const datosFiltradoProductos = dataReporteVentas.filter(item => {
      const fecha = dayjs(item.Fecha, "YYYY/MM/DD");
      const mes = fecha.month();
      const anio = fecha.year();
      return mesesSemestre.includes(mes) && anio === 2024;
    });

    // Actualizar los estados con los datos filtrados
    setDataProductos(getProductosPorTiempo(datosFiltradoProductos));
    datosFiltradoCaja.push(getTotalVentas(datosFiltradoCaja)); // Agregar total de ventas
    setDataCajaControl(datosFiltradoCaja); // Actualizar los datos de caja
  }

  // Función para manejar el cambio de año
  const handleAnualChange = (anioSeleccionado) => {
    setAnio(anioSeleccionado); // Asignar el año seleccionado

    // Filtrar los datos de caja por el año seleccionado
    const datosFiltradoCajaAnual = dataCajaControlOriginal.filter(item => {
      const anio = dayjs(item.Fecha).year();
      return anio === anioSeleccionado;
    });

    // Filtrar los productos por el año seleccionado
    const datosFiltradoProductosAnual = dataReporteVentas.filter(item => {
      const anio = dayjs(item.Fecha, "YYYY/MM/DD").year();
      return anio === anioSeleccionado;
    });

    // Actualizar los estados con los datos filtrados
    setDataProductos(getProductosPorTiempo(datosFiltradoProductosAnual));
    datosFiltradoCajaAnual.push(getTotalVentas(datosFiltradoCajaAnual)); // Agregar total de ventas
    setDataCajaControl(datosFiltradoCajaAnual); // Actualizar los datos de caja
  };

  // Generación de los años disponibles para seleccionar (del año actual hacia atrás)
  const añosDisponibles = [];
  const añoActual = new Date().getFullYear();
  for (let i = añoActual; i >= 2020; i--) {
    añosDisponibles.push(i); // Agregar cada año al array
  }
  // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

  // #region + + + + + + + + + + + + + + + + + + + + +  COMPARATIVAS DE PERIODOS   + + + + + + + + + + + + + + + + + + + + + + + + + + 

  // Datos de ventas por semestre
  const [ventasPeriodo, setVentasPeriodo] = useState(0);
  const [ventas2periodo, setVentas2periodo] = useState(0);
  const [nombre1, setNombre1] = useState(" ");
  const [nombre2, setNombre2] = useState(" ");

  const [ganancia1, setGanancia1] = useState(" ");
  const [ganancia2, setGanancia2] = useState("  ");

  // Cálculo de la diferencia en ventas
  const diferenciaVentas = ventas2periodo - ventasPeriodo;

  // Tasa de crecimiento en porcentaje
  const tasaCrecimiento = (() => {
    if (ventasPeriodo === 0 || ventas2periodo === 0) {
      return 0;
    }
    const growth = ((ventas2periodo - ventasPeriodo) / ventasPeriodo) * 100;
    if (isNaN(growth) || !isFinite(growth)) {
      return 0;
    }

    return growth;
  })();

  // Configuración del gráfico de barras de comparación de ventas
  const configColumn = {
    data: [
      { semestre: nombre1, ventas: ventasPeriodo },
      { semestre: nombre2, ventas: ventas2periodo },
    ],
    xField: 'semestre',
    yField: 'ventas',
    // label: { visible: true, position: 'middle' },
    // Configuración de responsividad
    responsive: true,
    autoFit: true,
    height: 300,
    padding: 'auto',
  };

  // Configuración del gráfico de tasa de crecimiento
  const configLine = {
    data: [
      { periodo: nombre1, tasa: 0 },
      { periodo: nombre2, tasa: tasaCrecimiento },
    ],
    xField: 'periodo',
    yField: 'tasa',
    label: { visible: true, position: 'top' },
    point: { size: 5, shape: 'diamond' },
    // Configuración de responsividad
    responsive: true,
    autoFit: true,
    height: 300,
    padding: 'auto',
  };

  // Configuración del gráfico de ganancias
  const configPie = {
    data: [
      { type: nombre1, value: ganancia1 },
      { type: nombre2, value: ganancia2 },
    ],
    angleField: 'value',
    colorField: 'type',
    label: {
      visible: true,
      type: 'spider',
      content: (data) => `Ganancias: Bs ${data.value}`, // Cambiamos `formatter` a `content`
    },
    responsive: true,
    autoFit: true,
    height: 300,
    padding: 'auto',
  };

  // Estado para almacenar la frecuencia, mes, trimestre, semestre y año del segundo conjunto de filtros.
  const [frecuencia2, setFrecuencia2] = useState('mensual');
  const [mes2, setMes2] = useState(null);
  const [trimestre2, setTrimestre2] = useState(null);
  const [semestre2, setSemestre2] = useState(null);
  const [anio2, setAnio2] = useState(null);

  // Estado para almacenar la frecuencia, mes, trimestre, semestre y año del tercer conjunto de filtros.
  const [frecuencia3, setFrecuencia3] = useState('mensual');
  const [mes3, setMes3] = useState(null);
  const [trimestre3, setTrimestre3] = useState(null);
  const [semestre3, setSemestre3] = useState(null);
  const [anio3, setAnio3] = useState(null);


  // handleFrecuenciaChange2: Actualiza la frecuencia seleccionada y restablece los valores de mes, trimestre, semestre y año para el segundo conjunto de filtros.
  const handleFrecuenciaChange2 = (value) => {
    setFrecuencia2(value);
    setMes2(null);
    setTrimestre2(null);
    setSemestre2(null);
    setAnio2(null);
  };

  // handleFrecuenciaChange3: Similar al anterior, pero para el tercer conjunto de filtros. Restablece los valores de mes, trimestre, semestre y año.
  const handleFrecuenciaChange3 = (value) => {
    setFrecuencia3(value);
    setMes3(null);
    setTrimestre3(null);
    setSemestre3(null);
    setAnio3(null);
  };

  // Maneja el cambio de mes para el segundo conjunto de filtros
  const handleMesChange2 = (value, option) => {
    let mesActual = parseInt(value);
    // Filtra los datos por el mes y año seleccionados
    const datosFiltradoMes = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mes === mesActual && anio === 2024;
    });

    // Actualiza el nombre del mes, el valor de ventas y ganancias para el primer periodo
    setNombre1(option.children);
    setMes2(value);
    const sumaVentas = datosFiltradoMes.reduce((acumulado, item) => acumulado + item.TotalVentas, 0);
    const sumaGanacias = datosFiltradoMes.reduce((acumulado, item) => acumulado + item.TotalGanancias, 0);
    setVentasPeriodo(sumaVentas);
    setGanancia1(sumaGanacias);
  };

  // Maneja el cambio de mes para el tercer conjunto de filtros
  const handleMesChange3 = (value, option) => {
    let mesActual = parseInt(value);
    // Filtra los datos por el mes y año seleccionados
    const datosFiltradoMes = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mes === mesActual && anio === 2024;
    });

    // Actualiza el nombre del mes, el valor de ventas y ganancias para el segundo periodo
    setNombre2(option.children);
    setMes3(value);
    const sumaVentas = datosFiltradoMes.reduce((acumulado, item) => acumulado + item.TotalVentas, 0);
    const sumaGanacias = datosFiltradoMes.reduce((acumulado, item) => acumulado + item.TotalGanancias, 0);
    setGanancia2(sumaGanacias);
    setVentas2periodo(sumaVentas);
  };

  // Maneja el cambio de trimestre para el segundo conjunto de filtros
  const handleTrimestreChange2 = (value, option) => {
    // Definir los rangos de meses para cada trimestre
    const trimestres = {
      1: [0, 1, 2], // Primer trimestre: Enero (0), Febrero (1), Marzo (2)
      2: [3, 4, 5], // Segundo trimestre: Abril (3), Mayo (4), Junio (5)
      3: [6, 7, 8], // Tercer trimestre: Julio (6), Agosto (7), Septiembre (8)
      4: [9, 10, 11], // Cuarto trimestre: Octubre (9), Noviembre (10), Diciembre (11)
    };

    // Obtener los meses del trimestre seleccionado
    const mesesTrimestre = trimestres[value];

    // Filtra los datos por los meses del trimestre y año seleccionado
    const datosFiltradoCaja = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mesesTrimestre.includes(mes) && anio === 2024;
    });

    // Actualiza el nombre del trimestre, el valor de ventas y ganancias para el primer periodo
    setNombre1(option.children);
    setTrimestre2(value);
    const sumaVentas = datosFiltradoCaja.reduce((acumulado, item) => acumulado + item.TotalVentas, 0);
    const sumaGanacias = datosFiltradoCaja.reduce((acumulado, item) => acumulado + item.TotalGanancias, 0);
    setVentasPeriodo(sumaVentas);
    setGanancia1(sumaGanacias);
  };

  // Maneja el cambio de trimestre para el tercer conjunto de filtros
  const handleTrimestreChange3 = (value, option) => {
    // Definir los rangos de meses para cada trimestre
    const trimestres = {
      1: [0, 1, 2], // Primer trimestre: Enero (0), Febrero (1), Marzo (2)
      2: [3, 4, 5], // Segundo trimestre: Abril (3), Mayo (4), Junio (5)
      3: [6, 7, 8], // Tercer trimestre: Julio (6), Agosto (7), Septiembre (8)
      4: [9, 10, 11], // Cuarto trimestre: Octubre (9), Noviembre (10), Diciembre (11)
    };

    // Obtener los meses del trimestre seleccionado
    const mesesTrimestre = trimestres[value];

    // Filtra los datos por los meses del trimestre y año seleccionado
    const datosFiltradoCaja = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mesesTrimestre.includes(mes) && anio === 2024;
    });

    // Actualiza el nombre del trimestre, el valor de ventas y ganancias para el segundo periodo
    setNombre2(option.children);
    setTrimestre3(value);
    const sumaVentas = datosFiltradoCaja.reduce((acumulado, item) => acumulado + item.TotalVentas, 0);
    const sumaGanacias = datosFiltradoCaja.reduce((acumulado, item) => acumulado + item.TotalGanancias, 0);
    setGanancia2(sumaGanacias);
    setVentas2periodo(sumaVentas);
  };

  // Maneja el cambio de semestre para el segundo conjunto de filtros
  const handleSemestreChange2 = (value, option) => {
    // Definir los rangos de meses para cada semestre
    const semestres = {
      1: [0, 1, 2, 3, 4, 5], // Primer semestre: Enero (0), Febrero (1), Marzo (2), Abril (3), Mayo (4), Junio (5)
      2: [6, 7, 8, 9, 10, 11], // Segundo semestre: Julio (6), Agosto (7), Septiembre (8), Octubre (9), Noviembre (10), Diciembre (11)
    };

    // Obtener los meses del semestre seleccionado
    const mesesSemestre = semestres[value];

    // Filtra los datos por los meses del semestre y año seleccionado
    const datosFiltradoCaja = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mesesSemestre.includes(mes) && anio === 2024;
    });

    // Actualiza el nombre del semestre, el valor de ventas y ganancias para el primer periodo
    setNombre1(option.children);
    setSemestre2(value);
    const sumaVentas = datosFiltradoCaja.reduce((acumulado, item) => acumulado + item.TotalVentas, 0);
    const sumaGanacias = datosFiltradoCaja.reduce((acumulado, item) => acumulado + item.TotalGanancias, 0);
    setGanancia1(sumaGanacias);
    setVentasPeriodo(sumaVentas);
  };

  // Maneja el cambio de semestre para el tercer conjunto de filtros
  const handleSemestreChange3 = (value, option) => {
    // Definir los rangos de meses para cada semestre
    const semestres = {
      1: [0, 1, 2, 3, 4, 5], // Primer semestre: Enero (0), Febrero (1), Marzo (2), Abril (3), Mayo (4), Junio (5)
      2: [6, 7, 8, 9, 10, 11], // Segundo semestre: Julio (6), Agosto (7), Septiembre (8), Octubre (9), Noviembre (10), Diciembre (11)
    };

    // Obtener los meses del semestre seleccionado
    const mesesSemestre = semestres[value];

    // Filtra los datos por los meses del semestre y año seleccionado
    const datosFiltradoCaja = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mesesSemestre.includes(mes) && anio === 2024;
    });

    // Actualiza el nombre del semestre, el valor de ventas y ganancias para el segundo periodo
    setNombre2(option.children);
    setSemestre3(value);
    const sumaVentas = datosFiltradoCaja.reduce((acumulado, item) => acumulado + item.TotalVentas, 0);
    const sumaGanacias = datosFiltradoCaja.reduce((acumulado, item) => acumulado + item.TotalGanancias, 0);
    setGanancia2(sumaGanacias);
    setVentas2periodo(sumaVentas);
  };

  // Maneja el cambio de año para el segundo conjunto de filtros
  const handleAnualChange2 = (anioSeleccionado, option) => {
    // Filtra los datos para el año seleccionado
    const datosFiltradoCajaAnual = dataCajaControlOriginal.filter(item => {
      const anio = dayjs(item.Fecha).year();
      return anio === anioSeleccionado;
    });

    // Actualiza el nombre del año y los valores de ventas y ganancias para el primer periodo
    setNombre1(option.children);
    setAnio2(anioSeleccionado);
    const sumaVentas = datosFiltradoCajaAnual.reduce((acumulado, item) => acumulado + item.TotalVentas, 0);
    const sumaGanacias = datosFiltradoCajaAnual.reduce((acumulado, item) => acumulado + item.TotalGanancias, 0);
    setGanancia1(sumaGanacias);
    setVentasPeriodo(sumaVentas);
  };

  // Maneja el cambio de año para el tercer conjunto de filtros
  const handleAnualChange3 = (anioSeleccionado, option) => {
    // Filtra los datos para el año seleccionado
    const datosFiltradoCajaAnual = dataCajaControlOriginal.filter(item => {
      const anio = dayjs(item.Fecha).year();
      return anio === anioSeleccionado;
    });

    // Actualiza el nombre del año y los valores de ventas y ganancias para el segundo periodo
    setNombre2(option.children);
    setAnio3(anioSeleccionado);
    const sumaVentas = datosFiltradoCajaAnual.reduce((acumulado, item) => acumulado + item.TotalVentas, 0);
    const sumaGanacias = datosFiltradoCajaAnual.reduce((acumulado, item) => acumulado + item.TotalGanancias, 0);
    setGanancia2(sumaGanacias);
    setVentas2periodo(sumaVentas);
  };

  // Limpia las comparaciones y restablece los valores de los filtros
  const LimpiarComparaciones = () => {
    // Restaura las frecuencias a "mensual" para ambos periodos
    handleFrecuenciaChange2("mensual");
    handleFrecuenciaChange3("mensual");

    // Restaura las ventas y ganancias a 0
    setVentasPeriodo(0);
    setVentas2periodo(0);

    // Restaura los nombres y las ganancias a un valor vacío
    setNombre1(" ");
    setNombre2(" ");
    setGanancia1(" ");
    setGanancia2(" ");
  };
  // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

  // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

  return (
    <Layout>
      <Content style={{
        display: 'flex',
        justifyContent: 'center', // Centrado horizontal
        alignItems: 'center', // Centrado vertical
        minHeight: '100vh', // Asegura que el contenedor tenga la altura completa de la ventana
      }}>
        <div className="site-layout-content">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Ventas totales"
                  value={dataCaja.TotalVentas}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<DollarOutlined />}
                  suffix="Bs"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Ganancias totales"
                  value={dataCaja.TotalGanancias}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<RiseOutlined />}
                  suffix="Bs"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Ventas realizadas"
                  value={numeroVentas}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Productos vendidos"
                  value={numeroProductosVendidos}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Producto más vendido"
                  value={`${(dataRankingProductos.length > 0 && dataRankingProductos[0]?.NombreProducto && dataRankingProductos[0]?.cantidad !== undefined)
                    ? `${dataRankingProductos[0].NombreProducto} `
                    : '0'
                    }`}
                  valueStyle={{ color: '#faad14', fontSize: '1.2rem' }}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Col>
          </Row>


          <Col xs={24} sm={24} md={24} lg={24}>
            <Card title="Tendencias de ventas">
              {/* Contenedor con scroll similar al de la tabla */}
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <div style={{ minWidth: '800px' }}>
                  {/* Aseguramos que el gráfico tiene un ancho mínimo para activar el scroll */}
                  <Line {...config} />
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24}>
            <Card title="Ventas por producto">
              <Table columns={columns} dataSource={dataRankingProductos} pagination={false} scroll={{ x: 'max-content', y: '200px' }} />
            </Card>
          </Col>

          <h2> Estados de caja y productos</h2>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Card >
              <div style={{ margin: '10px 0', alignContent: 'right', textAlign: 'center' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Seleccione el periodo del reporte:</label>
                <Select
                  placeholder="Selecciona una opción"
                  style={{ width: 200 }}
                  onChange={handleFrecuenciaChange}
                  defaultValue="mensual"
                >
                  <Option value="mensual">Mensual</Option>
                  <Option value="trimestral">Trimestral</Option>
                  <Option value="semestral">Semestral</Option>
                  <Option value="anual">Anual</Option>
                </Select>

                {/* Mostrar selector de mes si la opción es mensual */}
                {frecuencia === 'mensual' && (
                  <Select
                    placeholder="Selecciona el mes"
                    style={{ width: 200, marginTop: 10 }}
                    onChange={handleMesChange}
                    value={mes}
                  >
                    <Option value="0">Enero</Option>
                    <Option value="1">Febrero</Option>
                    <Option value="2">Marzo</Option>
                    <Option value="3">Abril</Option>
                    <Option value="4">Mayo</Option>
                    <Option value="5">Junio</Option>
                    <Option value="6">Julio</Option>
                    <Option value="7">Agosto</Option>
                    <Option value="8">Septiembre</Option>
                    <Option value="9">Octubre</Option>
                    <Option value="10">Noviembre</Option>
                    <Option value="11">Diciembre</Option>
                  </Select>
                )}

                {/* Mostrar selector de trimestre si la opción es trimestral */}
                {frecuencia === 'trimestral' && (
                  <Select
                    placeholder="Selecciona el trimestre"
                    style={{ width: 200, marginTop: 10 }}
                    onChange={handleTrimestreChange}
                    value={trimestre}
                  >
                    <Option value="1">Primer Trimestre</Option>
                    <Option value="2">Segundo Trimestre</Option>
                    <Option value="3">Tercer Trimestre</Option>
                    <Option value="4">Cuarto Trimestre</Option>
                  </Select>
                )}

                {/* Mostrar selector de semestre si la opción es semestral */}
                {frecuencia === 'semestral' && (
                  <Select
                    placeholder="Selecciona el semestre"
                    style={{ width: 200, marginTop: 10 }}
                    onChange={handleSemestreChange}
                    value={semestre}
                  >
                    <Option value="1">Primer Semestre</Option>
                    <Option value="2">Segundo Semestre</Option>
                  </Select>
                )}

                {/* Mostrar selector de año si la opción es anual */}
                {frecuencia === 'anual' && (
                  <Select
                    placeholder="Selecciona el año"
                    style={{ width: 200, marginTop: 10 }}
                    onChange={handleAnualChange}
                    value={anio}
                  >
                    {añosDisponibles.map((year) => (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    ))}
                  </Select>
                )}
              </div>
              <Table columns={columnsCaja} dataSource={dataCajaControl} pagination={false} scroll={{ x: 'max-content', y: '300px' }} />
              <h1> </h1>
              <Table columns={columnsProducto} dataSource={dataProductos} pagination={false} scroll={{ x: 'max-content', y: '300px' }} />
            </Card>
          </Col>

          <h2> Comparativa de ventas y ganancias</h2>
          <Row gutter={16}>

            <Col xs={24} sm={24} md={24} lg={12}>
              <Card>
                <div style={{ margin: '10px 0', alignContent: 'right', textAlign: 'center' }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Seleccione el periodo de tiempo:</label>
                  <Select
                    placeholder="Selecciona una opción"
                    style={{ width: 200 }}
                    onChange={handleFrecuenciaChange2}
                    defaultValue="mensual"
                  >
                    <Option value="mensual">Mensual</Option>
                    <Option value="trimestral">Trimestral</Option>
                    <Option value="semestral">Semestral</Option>
                    <Option value="anual">Anual</Option>
                  </Select>

                  {/* Mostrar selector de mes si la opción es mensual */}
                  {frecuencia2 === 'mensual' && (
                    <Select
                      id="primero"
                      placeholder="Selecciona el mes"
                      style={{ width: 200, marginTop: 10 }}
                      onChange={handleMesChange2}
                      value={mes2}
                    >
                      <Option value="0">Enero</Option>
                      <Option value="1">Febrero</Option>
                      <Option value="2">Marzo</Option>
                      <Option value="3">Abril</Option>
                      <Option value="4">Mayo</Option>
                      <Option value="5">Junio</Option>
                      <Option value="6">Julio</Option>
                      <Option value="7">Agosto</Option>
                      <Option value="8">Septiembre</Option>
                      <Option value="9">Octubre</Option>
                      <Option value="10">Noviembre</Option>
                      <Option value="11">Diciembre</Option>
                    </Select>
                  )}

                  {/* Mostrar selector de trimestre si la opción es trimestral */}
                  {frecuencia2 === 'trimestral' && (
                    <Select
                      placeholder="Selecciona el trimestre"
                      style={{ width: 200, marginTop: 10 }}
                      onChange={handleTrimestreChange2}
                      value={trimestre2}
                    >
                      <Option value="1">Primer Trimestre</Option>
                      <Option value="2">Segundo Trimestre</Option>
                      <Option value="3">Tercer Trimestre</Option>
                      <Option value="4">Cuarto Trimestre</Option>
                    </Select>
                  )}

                  {/* Mostrar selector de semestre si la opción es semestral */}
                  {frecuencia2 === 'semestral' && (
                    <Select
                      placeholder="Selecciona el semestre"
                      style={{ width: 200, marginTop: 10 }}
                      onChange={handleSemestreChange2}
                      value={semestre2}
                    >
                      <Option value="1">Primer Semestre</Option>
                      <Option value="2">Segundo Semestre</Option>
                    </Select>
                  )}

                  {/* Mostrar selector de año si la opción es anual */}
                  {frecuencia2 === 'anual' && (
                    <Select
                      placeholder="Selecciona el año"
                      style={{ width: 200, marginTop: 10 }}
                      onChange={handleAnualChange2}
                      value={anio2}
                    >
                      {añosDisponibles.map((year) => (
                        <Option key={year} value={year}>
                          {year}
                        </Option>
                      ))}
                    </Select>
                  )}
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12}>
              <Card>
                <div style={{ margin: '10px 0', alignContent: 'right', textAlign: 'center' }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Seleccione el periodo de tiempo:</label>
                  <Select
                    placeholder="Selecciona una opción"
                    style={{ width: 200 }}
                    onChange={handleFrecuenciaChange3}
                    defaultValue="mensual"
                  >
                    <Option value="mensual">Mensual</Option>
                    <Option value="trimestral">Trimestral</Option>
                    <Option value="semestral">Semestral</Option>
                    <Option value="anual">Anual</Option>
                  </Select>

                  {/* Mostrar selector de mes si la opción es mensual */}
                  {frecuencia3 === 'mensual' && (
                    <Select
                      placeholder="Selecciona el mes"
                      style={{ width: 200, marginTop: 10 }}
                      onChange={handleMesChange3}
                      value={mes3}
                      key="1"
                    >
                      <Option value="0">Enero</Option>
                      <Option value="1">Febrero</Option>
                      <Option value="2">Marzo</Option>
                      <Option value="3">Abril</Option>
                      <Option value="4">Mayo</Option>
                      <Option value="5">Junio</Option>
                      <Option value="6">Julio</Option>
                      <Option value="7">Agosto</Option>
                      <Option value="8">Septiembre</Option>
                      <Option value="9">Octubre</Option>
                      <Option value="10">Noviembre</Option>
                      <Option value="11">Diciembre</Option>
                    </Select>
                  )}

                  {/* Mostrar selector de trimestre si la opción es trimestral */}
                  {frecuencia3 === 'trimestral' && (
                    <Select
                      placeholder="Selecciona el trimestre"
                      style={{ width: 200, marginTop: 10 }}
                      onChange={handleTrimestreChange3}
                      value={trimestre3}
                    >
                      <Option value="1">Primer Trimestre</Option>
                      <Option value="2">Segundo Trimestre</Option>
                      <Option value="3">Tercer Trimestre</Option>
                      <Option value="4">Cuarto Trimestre</Option>
                    </Select>
                  )}

                  {/* Mostrar selector de semestre si la opción es semestral */}
                  {frecuencia3 === 'semestral' && (
                    <Select
                      placeholder="Selecciona el semestre"
                      style={{ width: 200, marginTop: 10 }}
                      onChange={handleSemestreChange3}
                      value={semestre3}
                    >
                      <Option value="1">Primer Semestre</Option>
                      <Option value="2">Segundo Semestre</Option>
                    </Select>
                  )}

                  {/* Mostrar selector de año si la opción es anual */}
                  {frecuencia3 === 'anual' && (
                    <Select
                      placeholder="Selecciona el año"
                      style={{ width: 200, marginTop: 10 }}
                      onChange={handleAnualChange3}
                      value={anio3}
                    >
                      {añosDisponibles.map((year) => (
                        <Option key={year} value={year}>
                          {year}
                        </Option>
                      ))}
                    </Select>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
          <Button type='primary' onClick={LimpiarComparaciones}>Limpiar</Button>
          <Row gutter={16}>
            {/* Comparativa de ventas por semestre */}
            <Col xs={24} sm={24} md={8} lg={8}>
              <Card title="Comparativa de ventas por semestre">
                <Column {...configColumn} />
                <Statistic
                  title="Diferencia en ventas"
                  value={`Bs ${Math.abs(diferenciaVentas)}`}
                  valueStyle={{ color: diferenciaVentas > 0 ? '#3f8600' : '#cf1322' }}
                  prefix={diferenciaVentas > 0 ? '+' : '-'}
                />
              </Card>
            </Col>

            {/* Tasa de crecimiento de ventas */}
            <Col xs={24} sm={24} md={8} lg={8}>
              <Card title="Tasa de crecimiento de Ventas">
                <Line {...configLine} />
                <Statistic
                  title="Tasa de crecimiento"
                  value={`${Math.abs(tasaCrecimiento.toFixed(2))}%`}
                  valueStyle={{ color: tasaCrecimiento > 0 ? '#3f8600' : '#cf1322' }}
                  prefix={tasaCrecimiento > 0 ? '+' : '-'}
                />
              </Card>
            </Col>

            {/* Ganancias por semestre */}

            <Col xs={24} sm={24} md={8} lg={8}>
              <Card title="Comparativa de Ganancias por Semestre">
                <Pie {...configPie} />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default DashboardVentas;
