import { Table, Button, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate, Link } from 'react-router-dom';
import './MostrarRepuestos.css';
import { jsPDF } from "jspdf";

const MostrarTicketsAtencion = () => {
    // Modal y navegación
    const { confirm } = Modal; // Desestructura el método confirm de Modal para usarlo en confirmaciones
    const navigate = useNavigate(); // Utiliza el hook useNavigate de React Router para la navegación

    // Estados para almacenar datos
    const [dataFirebase, setDataFirebase] = useState([]); // Estado para almacenar los datos obtenidos de Firebase (general)
    const [dataCliente, setDataClientes] = useState([]); // Estado para almacenar los datos de clientes obtenidos de Firebase
    const [numeroCliente, setNumeroClientes] = useState([]); // Estado para almacenar el número de cliente generado dinámicamente

    //Definir datos para la tabla de repuestos
    const columns = [
        {
            title: 'Nombre del cliente',
            dataIndex: 'NombreCliente',
            defaultSortOrder: 'descend',
            width: '180px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Nombre del dispositivo',
            dataIndex: 'NombreDispositivo',
            defaultSortOrder: 'descend',
            width: '120px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Descripción del problema',
            dataIndex: 'DescripcionProblema',
            defaultSortOrder: 'descend',
            width: '200px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Teléfono/celular',
            dataIndex: 'TelefonoCelular',
            defaultSortOrder: 'descend',
            width: '10px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Fecha ingreso',
            dataIndex: 'FechaIngreso',
            defaultSortOrder: 'descend',
            width: '140px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Fecha entrega',
            dataIndex: 'FechaEntrega',
            defaultSortOrder: 'descend',
            width: '140px'
            // sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Costo del servicio',
            dataIndex: 'CostoServicio',
            defaultSortOrder: 'descend',
            render: (text) => `Bs.  ${text}`,
            // sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (text, record) => (
                <Space>
                    <Button disabled={verificarRegistrado(record)} onClick={() => navegarRegistrarCliente(record)}>Registrar cliente</Button>
                    <Button onClick={() => generarTicketPDF(record)}>Imprimir ticket</Button>
                    {/* <Button onClick={() => editRecord(record)}>Editar</Button> */}
                    <Button onClick={() => confirmDelete(record)}>Eliminar</Button>
                </Space>
            ),
        },
    ];

    // useEffect para cargar los datos de los tickets y clientes desde Firebase cuando el componente se monta
    useEffect(() => {
        // Función para obtener los datos de los tickets
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaTicketsAtencion")); // Obtiene los documentos de la colección 'ListaTicketsAtencion'
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(), // Extrae los datos de cada documento
                id: doc.id // Añade el ID del documento
            }));
            setDataFirebase(dataList); // Actualiza el estado con la lista de tickets obtenidos
        };
        fetchData(); // Llama a la función para cargar los tickets

        // Función para obtener los datos de los tickets y los clientes
        const fetchData2 = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaTicketsAtencion")); // Obtiene los documentos de los tickets
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(), // Extrae los datos de cada documento
                id: doc.id // Añade el ID del documento
            }));
            setDataFirebase(dataList); // Actualiza el estado con los tickets

            const querySnapshot2 = await getDocs(collection(db, "ListaClientes")); // Obtiene los documentos de los clientes
            const dataList2 = querySnapshot2.docs.map(doc => ({
                ...doc.data(), // Extrae los datos de cada documento de cliente
                id: doc.id // Añade el ID del documento
            }));
            setDataClientes(dataList2); // Actualiza el estado con los clientes
            setNumeroClientes(`2024-${dataList2.length + 1}`); // Establece el número de cliente con un formato específico
        };
        fetchData2(); // Llama a la función para cargar los tickets y clientes
    }, []);


    // Función para verificar si un cliente ya está registrado
    const verificarRegistrado = (records) => {
        // Busca si el cliente ya existe en la lista de clientes
        const aux = dataCliente.some(cliente => cliente.IdCliente === records.id);
        if (aux) {
            return true; // Si está registrado, devuelve true
        } else {
            return false; // Si no está registrado, devuelve false
        }
    };

    // Función para navegar a la página de registro de un cliente
    const navegarRegistrarCliente = (record) => {
        // Redirige a la página de registro de cliente con el objeto del cliente y el número generado
        navigate('/sistema-servicios/registrar-cliente', { state: { objetoProp: record, numeroCliente: numeroCliente } });
    };

    // Función para generar un ticket en formato PDF
    const generarTicketPDF = (values) => {
        const doc = new jsPDF(); // Crea una nueva instancia de jsPDF
        const pageWidth = doc.internal.pageSize.width; // Obtiene el ancho de la página
        const marginX = 20; // Define el margen a la izquierda y derecha del PDF
        const maxLineWidth = pageWidth - marginX * 2; // Calcula el ancho máximo de una línea para el texto

        // Define el título y el subtítulo del ticket
        doc.setFontSize(22);
        doc.text("WilSmart", pageWidth / 2, 20, { align: "center" });
        doc.setFontSize(20);
        doc.text("Ticket de atención", pageWidth / 2, 30, { align: "center" });
        doc.setFontSize(14);

        // Información del cliente y del dispositivo
        doc.text(`Nombre del cliente: ${values.NombreCliente}`, marginX, 46);
        doc.text(`C.I.: ${values.CI}`, marginX, 56);
        doc.text(`Teléfono/celular: ${values.TelefonoCelular}`, marginX, 66);
        doc.text(`Nombre del dispositivo: ${values.NombreDispositivo}`, marginX, 76);

        // Para los textos largos (Descripción del problema)
        let yPosition = 86; // Posición inicial para el texto largo

        const descripcion = doc.splitTextToSize(`Descripción del problema: ${values.DescripcionProblema}`, maxLineWidth);
        doc.text(descripcion, marginX, yPosition);
        yPosition += descripcion.length * 10; // Ajuste de posición en base a las líneas generadas

        // Notas adicionales
        const notas = doc.splitTextToSize(`Notas adicionales: ${values.NotasAdicionales}`, maxLineWidth);
        doc.text(notas, marginX, yPosition);
        yPosition += notas.length * 7; // Ajuste de posición en base a las líneas generadas

        // Resto del contenido
        doc.text(`Fecha de ingreso: ${values.FechaIngreso}`, marginX, yPosition + 0);
        doc.text(`Fecha de entrega: ${values.FechaEntrega}`, marginX, yPosition + 10);
        doc.text(`Costo del servicio: Bs ${parseInt(values.CostoServicio).toFixed(2)}`, marginX, yPosition + 20);

        // Mensaje final y agradecimiento
        doc.setFontSize(16);
        doc.text("Gracias por elegir WilSmart", pageWidth / 2, yPosition + 35, { align: "center" });
        doc.setFontSize(12);
        doc.text("Por favor, conserve este ticket para recoger su dispositivo.", pageWidth / 2, yPosition + 40, { align: "center" });

        // Abre el PDF en el navegador para imprimir
        window.open(doc.output("bloburl"), "_blank").print();
    };

    // Función para eliminar un ticket de atención
    const handleDelete = async (id) => {
        const docRef = doc(db, "ListaTicketsAtencion", id); // Referencia al documento de Firebase
        try {
            await deleteDoc(docRef); // Elimina el documento de la base de datos
            actualizarListaTickets(); // Actualiza la lista de tickets después de eliminar
        } catch (e) {
            console.error("Error deleting document: ", e); // Maneja el error si ocurre
        }
    };

    // Función para mostrar la confirmación de eliminación
    const confirmDelete = (record) => {
        confirm({
            title: '¿Estás seguro de eliminar este ticket de atención?', // Título de la confirmación
            content: 'Esta acción no se puede deshacer.', // Mensaje informando que no es reversible
            okText: 'Eliminar', // Texto del botón de confirmación
            okType: 'danger', // Tipo de botón para resaltar la acción peligrosa
            cancelText: 'Cancelar', // Texto del botón de cancelación
            onOk() {
                handleDelete(record.id); // Llama a la función handleDelete para eliminar el ticket
            },
            onCancel() { },
        });
    };

    // Función para manejar los cambios en la tabla (paginación, filtros, ordenación)
    const onChange = (pagination, filters, sorter, extra) => {
        // Aquí puedes realizar alguna acción cuando los parámetros de la tabla cambian
        // Ejemplo: console.log('params', pagination, filters, sorter, extra);
    };

    // Función para actualizar la lista de tickets desde Firebase
    const actualizarListaTickets = async () => {
        const querySnapshot = await getDocs(collection(db, "ListaTicketsAtencion")); // Obtiene los documentos de la colección 'ListaTicketsAtencion' de Firebase
        const dataList = querySnapshot.docs.map(doc => ({
            ...doc.data(), // Extrae los datos de cada documento
            id: doc.id // Añade el ID del documento
        }));
        setDataFirebase(dataList); // Actualiza el estado con la lista de tickets obtenidos
    };

    return (
        <>
            <div>
                <h2 className="form-titleRepuestos">Mostrar tickets de atención</h2>
                <div style={{ textAlign: 'right', paddingRight: '2.5%', paddingBottom: '1%' }}>
                    <Link to="/sistema-servicios/registrar-ticket">
                        <Button>Registrar nuevo ticket</Button>
                    </Link>
                </div>
                <div className='parentMostrarRepuestos'>
                    <Table
                        columns={columns}
                        dataSource={dataFirebase}
                        pagination={false}
                        onChange={onChange}
                        showSorterTooltip={{
                            target: 'sorter-icon',
                        }}
                        scroll={{ x: true }}
                    />
                </div>
            </div>
        </>
    );
};

export default MostrarTicketsAtencion;
