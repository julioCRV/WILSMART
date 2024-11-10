import { Layout, Breadcrumb, Row, Col, Card, Statistic, Table, Button, Select } from 'antd';
import { Column, Line, Pie } from '@ant-design/charts';
import { DollarOutlined, ShoppingCartOutlined, UserOutlined, BarChartOutlined, RiseOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import ButtonGenerador from './GeneradorCVS';
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
    render: (text) => `Bs   ${text}`,
    key: 'totalVentas',
  },
];

const columnsProducto = [
  {
    title: 'Fecha',
    dataIndex: 'Fecha',
    defaultSortOrder: 'descend',
    sorter: (a, b) => dayjs(a.Fecha).unix() - dayjs(b.Fecha).unix(),
  },
  {
    title: 'Nombre del producto',
    dataIndex: 'NombreProducto',
    sorter: (a, b) => a.NombreProducto.localeCompare(b.NombreProducto),
  },
  {
    title: 'Cantidad',
    dataIndex: 'Cantidad',
    width: '100px',
    sorter: (a, b) => a.Cantidad - b.Cantidad,
  },
  {
    title: 'Precio de compra unitario',
    dataIndex: 'PrecioCompra',
    width: '150px',
    render: (text) => `Bs ${text}`,
    sorter: (a, b) => a.PrecioCompra - b.PrecioCompra,
  },
  {
    title: 'Total de compra',
    render: (text, record) => `Bs ${(record.Cantidad * record.PrecioCompra).toFixed(2)}`,
    sorter: (a, b) => (a.Cantidad * a.PrecioCompra) - (b.Cantidad * b.PrecioCompra),
  },
  {
    title: 'Precio de venta unitario',
    dataIndex: 'Precio',
    width: '150px',
    render: (text) => `Bs ${text}`,
    sorter: (a, b) => a.PrecioVenta - b.PrecioVenta,
  },
  {
    title: 'Total de venta',
    width: '100px',
    render: (text, record) => `Bs ${record.Cantidad * record.Precio}`,
    sorter: (a, b) => (a.Cantidad * a.PrecioVenta) - (b.Cantidad * b.Precio),
  },
  {
    title: 'Ganancia',
    render: (text, record) => `Bs ${(record.Precio - record.PrecioCompra) * record.Cantidad}`,
    sorter: (a, b) => ((a.Precio - a.PrecioCompra) * a.Cantidad) - ((b.Precio - b.PrecioCompra) * b.Cantidad),
  },
  // {
  //   title: 'Proveedor',
  //   dataIndex: 'Proveedor',
  //   // Agregar lógica de proveedor si es relevante
  // },
];

const columnVentas = [
  {
    title: 'Numero venta',
    dataIndex: 'id',
    key: 'name',
    width: '100px',
    render: (text, record, index) => `${index + 1}`,
  },
  {
    title: 'Nombre encargado',
    dataIndex: 'NombreEmpleado',
    key: 'category',
  },
  {
    title: 'Fecha',
    dataIndex: 'Fecha',
    key: 'category',
    defaultSortOrder: 'descend',
    sorter: (a, b) => dayjs(a.Fecha).unix() - dayjs(b.Fecha).unix(),
  },
  {
    title: 'Hora',
    dataIndex: 'Hora',
    key: 'category',
  },
  {
    title: 'Producto',
    dataIndex: 'MontoInicialCaja',
    render: (text) => `Bs   ${text}`,
    key: 'sales',
  },
  {
    title: 'Total ventas',
    dataIndex: 'TotalVentas',
    render: (text) => `Bs   ${text}`,
    key: 'sales',
  },
];

const DashboardVentas = () => {
  const [dataCaja, setDataCaja] = useState([]);
  const [dataCajaControl, setDataCajaControl] = useState([]);
  const [dataCajaControlOriginal, setDataCajaControlOriginal] = useState([]);
  const [dataRankingProductos, setDataRankingProductos] = useState([]);
  const [dataUsuarios, setDataUsuario] = useState([]);
  const [data, setData] = useState([]);
  const [numeroVentas, setNumeroVentas] = useState(0);
  const [numeroProductosVendidos, setNumeroProductosVendidods] = useState(0);
  const [dataProductos, setDataProductos] = useState([]);
  const [dataProductosOriginal, setDataProductosOriginal] = useState([]);
  const [dataVentas, setDataVentas] = useState([]);

  useEffect(() => {
    const fetchCaja = async () => {
      const querySnapshot = await getDocs(collection(db, "HistorialAperturaCaja"));
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      //Montos sumatorios para totales
      const cajaDinero = {
        TotalVentas: dataList.reduce((total, item) => total + item.TotalVentas, 0),
        TotalGanancias: dataList.reduce((total, item) => total + item.TotalGanancias, 0)
      };
      setDataCaja(cajaDinero);

      dataList.push(getTotalVentas(dataList));

      setDataCajaControl(dataList);
      setDataCajaControlOriginal(dataList);
    };

    const fetchReportesVentas = async () => {
      const querySnapshot = await getDocs(collection(db, "ReportesVentas"));
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setNumeroVentas(dataList.length)
      const productosArray = dataList.map(item =>
        item.productos.map(producto => ({
          ...producto,
          Fecha: item.Fecha
        }))
      ).flat();

      setData(productosArray);

      const totalProductosVendidos = productosArray.reduce((total, item) => total + item.CantidadVendida, 0)
      setNumeroProductosVendidods(totalProductosVendidos)


      // Contar la cantidad vendida de cada producto y agregar el precio unitario
      const productCount = productosArray.reduce((acc, producto) => {
        if (!acc[producto.NombreProducto]) {
          acc[producto.NombreProducto] = {
            cantidad: 0,
            PrecioUnitario: producto.PrecioUnitario
          };
        }
        acc[producto.NombreProducto].cantidad += producto.CantidadVendida;
        return acc;
      }, {});

      // Convertir el objeto en un array de objetos para ordenarlo
      const ranking = Object.entries(productCount)
        .map(([NombreProducto, data]) => ({
          NombreProducto,
          cantidad: data.cantidad,
          PrecioUnitario: parseInt(data.PrecioUnitario) * data.cantidad
        }))
        .sort((a, b) => b.cantidad - a.cantidad);

      setDataRankingProductos(ranking);
    };

    const fetchProductos = async () => {
      const querySnapshot = await getDocs(collection(db, "ListaProductos"));
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setDataProductos(dataList);
      setDataProductosOriginal(dataList);
    };

    fetchProductos();
    fetchCaja();
    fetchReportesVentas();
  }, []);

  // console.log(dataCajaControl);

  // Procesar los datos para el gráfico de línea
  const lineData = data.reduce((acc, producto) => {
    const existingEntry = acc.find(entry => entry.Fecha === producto.Fecha);
    if (existingEntry) {
      existingEntry.CantidadVendida += producto.CantidadVendida;
    } else {
      acc.push({
        Fecha: producto.Fecha,
        CantidadVendida: producto.CantidadVendida
      });
    }
    return acc;
  }, []);

  lineData.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));

  const config = {
    data: lineData,
    xField: 'Fecha',
    yField: 'CantidadVendida',
    smooth: true,
    meta: {
      CantidadVendida: {
        alias: 'Cantidad Vendida', // Nombre personalizado para el eje Y
      },
    },
    // Configuración de responsividad
    responsive: true,
    // Opciones para ajustar el tamaño del gráfico en diferentes dispositivos
    autoFit: true,
    height: 400, // Altura inicial del gráfico
    padding: 'auto', // Espaciado automático para el gráfico
  };

  const getTotalVentas = (listaDatos) => {
    // Calcula el total de ventas
    const totalVentasSumado = listaDatos.reduce((acumulador, item) => acumulador + item.TotalVentas, 0);

    // Crea la fila de totales
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
      TotalVentas: totalVentasSumado,
      id: "total"  // Usamos un id personalizado para identificar esta fila como total
    };

    // Agrega la fila total al final de dataList
    return filaTotal;
  }

  // *** ------- ANALISIS DE DATOS DE CAJA Y PRODUCTOS --------- ****
  const [frecuencia, setFrecuencia] = useState('mensual');
  const [mes, setMes] = useState(null);
  const [trimestre, setTrimestre] = useState(null);
  const [semestre, setSemestre] = useState(null);
  const [anio, setAnio] = useState(null);

  const handleFrecuenciaChange = (value) => {
    setFrecuencia(value);
    setMes(null); // Limpiar otros valores al cambiar la opción
    setTrimestre(null);
    setSemestre(null);
    setAnio(null);
  };

  const handleMesChange = (value) => {
    setMes(value);
    let mesActual = parseInt(value);
    const datosFiltradoMes = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mes === mesActual && anio === 2024;
    });
    const datosFiltradoMesProduct = dataProductosOriginal.filter(item => {
      const fecha = dayjs(item.Fecha, "YYYY/MM/DD");
      const mes = fecha.month();
      const anio = fecha.year();
      return mes === mesActual && anio === 2024;
    });
    setDataProductos(datosFiltradoMesProduct);
    datosFiltradoMes.push(getTotalVentas(datosFiltradoMes))
    setDataCajaControl(datosFiltradoMes)
  };

  const handleTrimestreChange = (value) => {
    setTrimestre(value);

    // Definir los rangos de meses para cada trimestre
    const trimestres = {
      1: [0, 1, 2], // Primer trimestre: Enero (0), Febrero (1), Marzo (2)
      2: [3, 4, 5], // Segundo trimestre: Abril (3), Mayo (4), Junio (5)
      3: [6, 7, 8], // Tercer trimestre: Julio (6), Agosto (7), Septiembre (8)
      4: [9, 10, 11], // Cuarto trimestre: Octubre (9), Noviembre (10), Diciembre (11)
    };

    // Obtener los meses del trimestre seleccionado
    const mesesTrimestre = trimestres[value];

    const datosFiltradoCaja = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mesesTrimestre.includes(mes) && anio === 2024;
    });

    const datosFiltradoProductos = dataProductosOriginal.filter(item => {
      const fecha = dayjs(item.Fecha, "YYYY/MM/DD");
      const mes = fecha.month();
      const anio = fecha.year();
      return mesesTrimestre.includes(mes) && anio === 2024;
    });

    setDataProductos(datosFiltradoProductos);
    datosFiltradoCaja.push(getTotalVentas(datosFiltradoCaja));
    setDataCajaControl(datosFiltradoCaja);
  };

  const handleSemestreChange = (value) => {
    setSemestre(value);

    // Definir los rangos de meses para cada trimestre
    const semestres = {
      1: [0, 1, 2, 3, 4, 5], // Primer semestre: Enero (0), Febrero (1), Marzo (2), Abril (3), Mayo (4), Junio (5)
      2: [6, 7, 8, 9, 10, 11], // Segundo semestre: Julio (6), Agosto (7), Septiembre (8), Octubre (9), Noviembre (10), Diciembre (11)
    };

    // Obtener los meses del trimestre seleccionado
    const mesesSemestre = semestres[value];

    const datosFiltradoCaja = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mesesSemestre.includes(mes) && anio === 2024;
    });

    const datosFiltradoProductos = dataProductosOriginal.filter(item => {
      const fecha = dayjs(item.Fecha, "YYYY/MM/DD");
      const mes = fecha.month();
      const anio = fecha.year();
      return mesesSemestre.includes(mes) && anio === 2024;
    });

    setDataProductos(datosFiltradoProductos);
    datosFiltradoCaja.push(getTotalVentas(datosFiltradoCaja));
    setDataCajaControl(datosFiltradoCaja);
  }

  const handleAnualChange = (anioSeleccionado) => {
    setAnio(anioSeleccionado);

    const datosFiltradoCajaAnual = dataCajaControlOriginal.filter(item => {
      const anio = dayjs(item.Fecha).year();
      return anio === anioSeleccionado;
    });

    const datosFiltradoProductosAnual = dataProductosOriginal.filter(item => {
      const anio = dayjs(item.Fecha, "YYYY/MM/DD").year();
      return anio === anioSeleccionado;
    });

    setDataProductos(datosFiltradoProductosAnual);
    datosFiltradoCajaAnual.push(getTotalVentas(datosFiltradoCajaAnual));
    setDataCajaControl(datosFiltradoCajaAnual);
  };

  // Generar años para seleccionar, por ejemplo desde 2020 hasta el año actual
  const añosDisponibles = [];
  const añoActual = new Date().getFullYear();
  for (let i = añoActual; i >= 2020; i--) {
    añosDisponibles.push(i);
  }

  //////////////// -------- COMPARATIVAS ---------------- \\\\\\\\\\\\\\\\\\\\\\\\
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
    label: { visible: true, position: 'middle' },
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

  const [frecuencia2, setFrecuencia2] = useState('mensual');
  const [mes2, setMes2] = useState(null);
  const [trimestre2, setTrimestre2] = useState(null);
  const [semestre2, setSemestre2] = useState(null);
  const [anio2, setAnio2] = useState(null);

  const [frecuencia3, setFrecuencia3] = useState('mensual');
  const [mes3, setMes3] = useState(null);
  const [trimestre3, setTrimestre3] = useState(null);
  const [semestre3, setSemestre3] = useState(null);
  const [anio3, setAnio3] = useState(null);

  const handleFrecuenciaChange2 = (value) => {
    setFrecuencia2(value);
    setMes2(null); // Limpiar otros valores al cambiar la opción
    setTrimestre2(null);
    setSemestre2(null);
    setAnio2(null);
  };

  const handleFrecuenciaChange3 = (value) => {
    setFrecuencia3(value);
    setMes3(null); // Limpiar otros valores al cambiar la opción
    setTrimestre3(null);
    setSemestre3(null);
    setAnio3(null);
  };

  const handleMesChange2 = (value, option) => {
    let mesActual = parseInt(value);
    const datosFiltradoMes = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mes === mesActual && anio === 2024;
    });

    setNombre1(option.children);
    setMes2(value);
    const sumaVentas = datosFiltradoMes.reduce((acumulado, item) => {
      return acumulado + item.TotalVentas;
    }, 0);
    const sumaGanacias = datosFiltradoMes.reduce((acumulado, item) => {
      return acumulado + item.TotalGanancias;
    }, 0);
    setVentasPeriodo(sumaVentas);
    setGanancia1(sumaGanacias);
  };

  const handleMesChange3 = (value, option) => {
    let mesActual = parseInt(value);
    const datosFiltradoMes = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mes === mesActual && anio === 2024;
    });

    setNombre2(option.children);
    setMes3(value);
    const sumaVentas = datosFiltradoMes.reduce((acumulado, item) => {
      return acumulado + item.TotalVentas;
    }, 0);
    const sumaGanacias = datosFiltradoMes.reduce((acumulado, item) => {
      return acumulado + item.TotalGanancias;
    }, 0);
    setGanancia2(sumaGanacias);
    setVentas2periodo(sumaVentas);
  };

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

    const datosFiltradoCaja = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mesesTrimestre.includes(mes) && anio === 2024;
    });

    setNombre1(option.children);
    setTrimestre2(value);
    const sumaVentas = datosFiltradoCaja.reduce((acumulado, item) => {
      return acumulado + item.TotalVentas;
    }, 0);
    const sumaGanacias = datosFiltradoCaja.reduce((acumulado, item) => {
      return acumulado + item.TotalGanancias;
    }, 0);
    setVentasPeriodo(sumaVentas);
    setGanancia1(sumaGanacias);
  };

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

    const datosFiltradoCaja = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mesesTrimestre.includes(mes) && anio === 2024;
    });

    setNombre2(option.children);
    setTrimestre3(value);
    const sumaVentas = datosFiltradoCaja.reduce((acumulado, item) => {
      return acumulado + item.TotalVentas;
    }, 0);
    const sumaGanacias = datosFiltradoCaja.reduce((acumulado, item) => {
      return acumulado + item.TotalGanancias;
    }, 0);
    setGanancia2(sumaGanacias);
    setVentas2periodo(sumaVentas);
  };

  const handleSemestreChange2 = (value, option) => {
    // Definir los rangos de meses para cada trimestre
    const semestres = {
      1: [0, 1, 2, 3, 4, 5], // Primer semestre: Enero (0), Febrero (1), Marzo (2), Abril (3), Mayo (4), Junio (5)
      2: [6, 7, 8, 9, 10, 11], // Segundo semestre: Julio (6), Agosto (7), Septiembre (8), Octubre (9), Noviembre (10), Diciembre (11)
    };

    // Obtener los meses del trimestre seleccionado
    const mesesSemestre = semestres[value];

    const datosFiltradoCaja = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mesesSemestre.includes(mes) && anio === 2024;
    });

    setNombre1(option.children);
    setSemestre2(value);
    const sumaVentas = datosFiltradoCaja.reduce((acumulado, item) => {
      return acumulado + item.TotalVentas;
    }, 0);
    const sumaGanacias = datosFiltradoCaja.reduce((acumulado, item) => {
      return acumulado + item.TotalGanancias;
    }, 0);
    setGanancia1(sumaGanacias);
    setVentasPeriodo(sumaVentas);
  }

  const handleSemestreChange3 = (value, option) => {
    // Definir los rangos de meses para cada trimestre
    const semestres = {
      1: [0, 1, 2, 3, 4, 5], // Primer semestre: Enero (0), Febrero (1), Marzo (2), Abril (3), Mayo (4), Junio (5)
      2: [6, 7, 8, 9, 10, 11], // Segundo semestre: Julio (6), Agosto (7), Septiembre (8), Octubre (9), Noviembre (10), Diciembre (11)
    };

    // Obtener los meses del trimestre seleccionado
    const mesesSemestre = semestres[value];

    const datosFiltradoCaja = dataCajaControlOriginal.filter(item => {
      const mes = dayjs(item.Fecha).month();
      const anio = dayjs(item.Fecha).year();
      return mesesSemestre.includes(mes) && anio === 2024;
    });

    setNombre2(option.children);
    setSemestre3(value);
    const sumaVentas = datosFiltradoCaja.reduce((acumulado, item) => {
      return acumulado + item.TotalVentas;
    }, 0);
    const sumaGanacias = datosFiltradoCaja.reduce((acumulado, item) => {
      return acumulado + item.TotalGanancias;
    }, 0);
    setGanancia2(sumaGanacias);
    setVentas2periodo(sumaVentas);
  }

  const handleAnualChange2 = (anioSeleccionado, option) => {
    const datosFiltradoCajaAnual = dataCajaControlOriginal.filter(item => {
      const anio = dayjs(item.Fecha).year();
      return anio === anioSeleccionado;
    });

    setNombre1(option.children);
    setAnio2(anioSeleccionado);
    const sumaVentas = datosFiltradoCajaAnual.reduce((acumulado, item) => {
      return acumulado + item.TotalVentas;
    }, 0);
    const sumaGanacias = datosFiltradoCajaAnual.reduce((acumulado, item) => {
      return acumulado + item.TotalGanancias;
    }, 0);
    setGanancia1(sumaGanacias);
    setVentasPeriodo(sumaVentas);
  };

  const handleAnualChange3 = (anioSeleccionado, option) => {
    const datosFiltradoCajaAnual = dataCajaControlOriginal.filter(item => {
      const anio = dayjs(item.Fecha).year();
      return anio === anioSeleccionado;
    });

    setNombre2(option.children);
    setAnio3(anioSeleccionado);
    const sumaVentas = datosFiltradoCajaAnual.reduce((acumulado, item) => {
      return acumulado + item.TotalVentas;
    }, 0);
    const sumaGanacias = datosFiltradoCajaAnual.reduce((acumulado, item) => {
      return acumulado + item.TotalGanancias;
    }, 0);
    setGanancia2(sumaGanacias);
    setVentas2periodo(sumaVentas);
  };
  console.log(nombre2)
  const LimpiarComparaciones = () => {
    handleFrecuenciaChange2("mensual");
    handleFrecuenciaChange3("mensual");
    setVentasPeriodo(0);
    setVentas2periodo(0);
    setNombre1(" ");
    setNombre2(" ");
    setGanancia1(" ");
    setGanancia2(" ");
  }
  console.log(ganancia1);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '0 50px', marginTop: '10px' }}>
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

          {/* <Row gutter={16}> */}
          <Col xs={24} sm={24} md={24} lg={24}>
            <Card title="Tendencias de ventas">
              <Line {...config} />
            </Card>
          </Col>
          {/* </Row> */}

          {/* <Row gutter={16}> */}
          <Col xs={24} sm={24} md={24} lg={24}>
            <Card title="Ventas por producto">
              <Table columns={columns} dataSource={dataRankingProductos} pagination={false} scroll={{ x: 'max-content', y: '200px' }} />
            </Card>
          </Col>

          <h2> Estados de caja y productos</h2>
          {/* </Row> */}
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
