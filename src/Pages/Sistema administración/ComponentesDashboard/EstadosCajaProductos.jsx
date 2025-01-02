import { Col, Card, Table, Select } from 'antd';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import './MostrarDashboard.css';
const { Option } = Select;

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
                return `Bs   ${text}`;
            }
            return `Bs ${record.Cantidad * record.Precio}`;
        },
        sorter: (a, b) => (a.Cantidad * a.PrecioVenta) - (b.Cantidad * b.Precio),
    },
    {
        title: 'Ganancia',
        width: '100px',
        dataIndex: 'TotalGanancias',
        render: (text, record) => {
            if (record.NombreEmpleado === "") {
                return `Bs   ${text}`;
            }
            return `Bs ${((record.Precio - record.PrecioCompra) * record.Cantidad).toFixed(2)}`;
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

const EstadoCajaProductos = ({ dataCajaControlOriginal, dataReporteVentas, dataProductosOriginal }) => {
    const [dataCajaControl, setDataCajaControl] = useState([]);
    const [dataProductos, setDataProductos] = useState([]);

    // #region + + + + + + + + + + + + + + + + + + + + +  [ Métodos ]  + + + + + + + + + + + + + + + + + + + + + + + + + + 

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
        const totalVentasSumado = listaDatos.reduce((acumulador, item) => acumulador + parseFloat(item.Precio) * item.Cantidad, 0);
        const totalGananciasSumado = listaDatos.reduce((acumulador, item) => acumulador + item.Cantidad * (item.Precio - item.PrecioCompra), 0);
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
    const [anioActual, setAnioActual] = useState(new Date().getFullYear());

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

    // - - - - - - - - - - - - - Función para manejar el cambio de " M E S "- - - - - - - - - - - - - - - - - 
    const handleMesChange = (value) => {
        setMes(value); // Asignar el mes seleccionado
        let mesActual = parseInt(value); // Convertir a número entero

        // Filtrar los datos de caja por mes y año actual
        const datosFiltradoMes = dataCajaControlOriginal.filter(item => {
            const mes = dayjs(item.Fecha).month();
            const anio = dayjs(item.Fecha).year();
            return mes === mesActual && anio === anioActual;
        });

        // Filtrar los productos por mes y año 2024
        const datosFiltradoMesProduct = dataReporteVentas.filter(item => {
            const fecha = dayjs(item.Fecha, "YYYY/MM/DD");
            const mes = fecha.month();
            const anio = fecha.year();
            return mes === mesActual && anio === anioActual;
        });

        // Actualizar los estados con los datos filtrados
        setDataProductos(getProductosPorTiempo(datosFiltradoMesProduct));

        datosFiltradoMes.push(getTotalVentas(datosFiltradoMes)); // Agregar total de ventas

        setDataCajaControl(datosFiltradoMes); // Actualizar los datos de caja
    };

    // - - - - - - - - - - - - - Función para manejar el cambio de " T R I M E S T R E "- - - - - - - - - - -
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

        // Filtrar los datos de caja por los meses del trimestre y año actual
        const datosFiltradoCaja = dataCajaControlOriginal.filter(item => {
            const mes = dayjs(item.Fecha).month();
            const anio = dayjs(item.Fecha).year();
            return mesesTrimestre.includes(mes) && anio === anioActual;
        });

        // Filtrar los productos por los meses del trimestre y año actual
        const datosFiltradoProductos = dataReporteVentas.filter(item => {
            const fecha = dayjs(item.Fecha, "YYYY/MM/DD");
            const mes = fecha.month();
            const anio = fecha.year();
            return mesesTrimestre.includes(mes) && anio === anioActual;
        });

        // Actualizar los estados con los datos filtrados
        setDataProductos(getProductosPorTiempo(datosFiltradoProductos));
        datosFiltradoCaja.push(getTotalVentas(datosFiltradoCaja)); // Agregar total de ventas
        setDataCajaControl(datosFiltradoCaja); // Actualizar los datos de caja
    };

    // - - - - - - - - - - - - - Función para manejar el cambio de " S E M E S T R E "- - - - - - - - - - - -
    const handleSemestreChange = (value) => {
        setSemestre(value); // Asignar el semestre seleccionado

        // Definir los rangos de meses para cada semestre
        const semestres = {
            1: [0, 1, 2, 3, 4, 5], // Primer semestre: Enero (0) a Junio (5)
            2: [6, 7, 8, 9, 10, 11], // Segundo semestre: Julio (6) a Diciembre (11)
        };

        // Obtener los meses del semestre seleccionado
        const mesesSemestre = semestres[value];

        // Filtrar los datos de caja por los meses del semestre y año actual
        const datosFiltradoCaja = dataCajaControlOriginal.filter(item => {
            const mes = dayjs(item.Fecha).month();
            const anio = dayjs(item.Fecha).year();
            return mesesSemestre.includes(mes) && anio === anioActual;
        });

        // Filtrar los productos por los meses del semestre y año actual
        const datosFiltradoProductos = dataReporteVentas.filter(item => {
            const fecha = dayjs(item.Fecha, "YYYY/MM/DD");
            const mes = fecha.month();
            const anio = fecha.year();
            return mesesSemestre.includes(mes) && anio === anioActual;
        });

        // Actualizar los estados con los datos filtrados
        setDataProductos(getProductosPorTiempo(datosFiltradoProductos));
        datosFiltradoCaja.push(getTotalVentas(datosFiltradoCaja)); // Agregar total de ventas
        setDataCajaControl(datosFiltradoCaja); // Actualizar los datos de caja
    }

    // - - - - - - - - - - - - - Función para manejar el cambio de " A Ñ O "- - - - - - - - - - - -
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

    const handleAnualChangeActual = (anioSeleccionado) => {
        // Asignar el año seleccionado
        setAnioActual(anioSeleccionado);
        setSemestre(null);
        setMes(null);
        setTrimestre(null);
        setDataCajaControl([]);
        setDataProductos([]);
    };

    // Generación de los años disponibles para seleccionar (del año actual hacia atrás)
    const añosDisponibles = [];
    const añoActual = new Date().getFullYear();
    for (let i = añoActual; i >= 2020; i--) {
        añosDisponibles.push(i); // Agregar cada año al array
    }
    // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

    // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

    return (
        <>
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
                            <>
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
                                <Select
                                    style={{ width: 100, marginTop: 10 }}
                                    onChange={handleAnualChangeActual}
                                    value={anioActual}
                                >
                                    {añosDisponibles.map((year) => (
                                        <Option key={year} value={year}>
                                            {year}
                                        </Option>
                                    ))}
                                </Select>
                            </>
                        )}

                        {/* Mostrar selector de trimestre si la opción es trimestral */}
                        {frecuencia === 'trimestral' && (
                            <>
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
                                <Select
                                    style={{ width: 100, marginTop: 10 }}
                                    onChange={handleAnualChangeActual}
                                    value={anioActual}
                                >
                                    {añosDisponibles.map((year) => (
                                        <Option key={year} value={year}>
                                            {year}
                                        </Option>
                                    ))}
                                </Select>
                            </>
                        )}

                        {/* Mostrar selector de semestre si la opción es semestral */}
                        {frecuencia === 'semestral' && (
                            <>
                                <Select
                                    placeholder="Selecciona el semestre"
                                    style={{ width: 200, marginTop: 10 }}
                                    onChange={handleSemestreChange}
                                    value={semestre}
                                >
                                    <Option value="1">Primer Semestre</Option>
                                    <Option value="2">Segundo Semestre</Option>
                                </Select>
                                <Select
                                    style={{ width: 100, marginTop: 10 }}
                                    onChange={handleAnualChangeActual}
                                    value={anioActual}
                                >
                                    {añosDisponibles.map((year) => (
                                        <Option key={year} value={year}>
                                            {year}
                                        </Option>
                                    ))}
                                </Select>
                            </>
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
        </>

    );
};

export default EstadoCajaProductos;
