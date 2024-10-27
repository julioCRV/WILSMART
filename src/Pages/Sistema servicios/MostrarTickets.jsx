import { Table, Button, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { useNavigate, Link } from 'react-router-dom';
import './MostrarRepuestos.css';
import { jsPDF } from "jspdf";

const MostrarTicketsAtencion = () => {
    const { confirm } = Modal;
    const navigate = useNavigate();
    const [dataFirebase, setDataFirebase] = useState([]);
    const [dataCliente, setDataClientes] = useState([]);
    const [numeroCliente, setNumeroClientes] = useState([]);

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

    // Registrar metodo
    const verificarRegistrado =  (records) => {
        const aux = dataCliente.some(cliente => cliente.IdCliente === records.id);
        if (aux) {
            return true;
        } else {
            return false;
        }
    }

    // Registrar metodo
    const navegarRegistrarCliente = (record) => {
        // console.log('Editar:', record);
        navigate('/sistema-servicios/registrar-cliente', { state: { objetoProp: record, numeroCliente: numeroCliente } });
        // Aquí puedes implementar la lógica para editar el registro
    };

    const generarTicketPDF = (values) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const marginX = 20;
        const maxLineWidth = pageWidth - marginX * 2; // Define el ancho máximo para el texto

        doc.setFontSize(22);
        doc.text("WilSmart", pageWidth / 2, 20, { align: "center" });
        doc.setFontSize(20);
        doc.text("Ticket de atención", pageWidth / 2, 30, { align: "center" });
        doc.setFontSize(14);

        // Información general
        doc.text(`Nombre del cliente: ${values.NombreCliente}`, marginX, 46);
        doc.text(`C.I.: ${values.CI}`, marginX, 56);
        doc.text(`Teléfono/celular: ${values.TelefonoCelular}`, marginX, 66);
        doc.text(`Nombre del dispositivo: ${values.NombreDispositivo}`, marginX, 76);

        // Para los textos largos
        let yPosition = 86; // Posición inicial para el texto largo

        // Descripción del problema
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

        doc.setFontSize(16);
        doc.text("Gracias por elegir WilSmart", pageWidth / 2, yPosition + 35, { align: "center" });
        doc.setFontSize(12);
        doc.text("Por favor, conserve este ticket para recoger su dispositivo.", pageWidth / 2, yPosition + 40, { align: "center" });

        // Abrir el PDF en el navegador para imprimir
        window.open(doc.output("bloburl"), "_blank").print();
    };

    const handleDelete = async (id) => {
        const docRef = doc(db, "ListaTicketsAtencion", id);
        try {
            await deleteDoc(docRef);
            //console.log("Document deleted");
            actualizarListaTickets();
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    const confirmDelete = (record) => {
        confirm({
            title: '¿Estás seguro de eliminar este ticket de atención?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                //console.log('Eliminar:', record);
                handleDelete(record.id);
            },
            onCancel() { },
        });
    };

    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra);
    };

    const actualizarListaTickets = async () => {
        const querySnapshot = await getDocs(collection(db, "ListaTicketsAtencion"));
        const dataList = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        // console.log(dataList);
        setDataFirebase(dataList);
    };

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaTicketsAtencion"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            // console.log(dataList);
            setDataFirebase(dataList);
        };
        fetchData();

        const fetchData2 = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaTicketsAtencion"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            // console.log(dataList);
            setDataFirebase(dataList);

            const querySnapshot2 = await getDocs(collection(db, "ListaClientes"));
            const dataList2 = querySnapshot2.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setDataClientes(dataList2);
            setNumeroClientes(`2024-${dataList2.length + 1}`);
        };
        fetchData2();
    }, []);

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
