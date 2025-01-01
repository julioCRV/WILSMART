import { Row, Col, Card, Statistic, Button, Select } from 'antd';
import { Column, Line, Pie } from '@ant-design/charts';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import './MostrarDashboard.css';
const { Option } = Select;



const DashboardVentas = ({ dataCajaControlOriginal }) => {
    // #region + + + + + + + + + + + + + + + + + + + + +  [ Métodos ]  + + + + + + + + + + + + + + + + + + + + + + + + + + 

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
        <>
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
                    <Card
                        title={
                            <div style={{ wordWrap: 'break-word', whiteSpace: 'normal', paddingTop: '15px' }}>
                                Comparativa de ventas por periodos
                            </div>
                        }
                    >
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
                    <Card title={
                        <div style={{ wordWrap: 'break-word', whiteSpace: 'normal', paddingTop: '15px' }}>
                            Tasa de creminiento de ventas
                        </div>
                    }
                    >
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
                    <Card
                        title={
                            <div style={{ wordWrap: 'break-word', whiteSpace: 'normal', paddingTop: '15px' }}>
                                Comparativa de ganancias por periodos
                            </div>
                        }
                    >
                        <Pie {...configPie} />
                    </Card>

                </Col>
            </Row>
        </>
    );
};

export default DashboardVentas;
