import { Table, Button, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { useNavigate } from 'react-router-dom';
import './MostrarRepuestos.css'

const MostrarTicketsAtencion = () => {
    const { confirm } = Modal;
    const navigate = useNavigate();
    const [dataFirebase, setDataFirebase] = useState([]);

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
            with: '180px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Teléfono/celular',
            dataIndex: 'TelefonoCelular',
            defaultSortOrder: 'descend',
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Fecha ingreso',
            dataIndex: 'FechaIngreso',
            defaultSortOrder: 'descend',
            width: '110px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Fecha entrega',
            dataIndex: 'FechaEntrega',
            defaultSortOrder: 'descend',
            width: '110px'
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
                    {/* <Button onClick={() => showDetails(record)}>Mostrar</Button> */}
                    <Button onClick={() => navegarRegistrarCliente(record)}>Registrar</Button>
                    <Button onClick={() => generarTicket(record)}>Generar</Button>
                    {/* <Button onClick={() => editRecord(record)}>Editar</Button> */}
                    <Button onClick={() => confirmDelete(record)}>Eliminar</Button>
                </Space>
            ),
        },
    ];

    const navegarRegistrarCliente = (record) => {
        // console.log('Editar:', record);
        navigate('/sistema-servicios/registrar-cliente', { state: { objetoProp: record } });
        // Aquí puedes implementar la lógica para editar el registro
    };

    const generarTicket = (values) => {
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "WilSmart",
                                    bold: true,
                                    size: 26,
                                }),
                            ],
                            alignment: "center",
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Ticket de atención",
                                    bold: true,
                                    size: 24,
                                }),
                            ],
                            alignment: "center",
                            spacing: { after: 200 },
                        }),
                        // new Paragraph({
                        //     children: [
                        //         new TextRun({
                        //             text: `Número de Ticket: ${Math.floor(Math.random() * 1000000)}`,
                        //             bold: true,
                        //             size: 20,
                        //         }),
                        //     ],
                        //     alignment: "center",
                        //     spacing: { after: 200 },
                        // }),
                        new Paragraph({
                            text: `Nombre del cliente: ${values.NombreCliente}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `C.I.: ${values.CI}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Teléfono/celular: ${values.TelefonoCelular}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Nombre del dispositivo: ${values.NombreDispositivo}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Descripción del problema: ${values.DescripcionProblema}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Notas adicionales: ${values.NotasAdicionales}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Fecha de ingreso: ${values.FechaIngreso}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Fecha de entrega: ${values.FechaEntrega}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Costo del servicio: Bs ${values.CostoServicio.toFixed(2)}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Gracias por elegir WilSmart",
                                    bold: true,
                                    size: 20,
                                }),
                            ],
                            alignment: "center",
                            spacing: { before: 400 },
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Por favor, conserve este ticket para recoger su dispositivo.",
                                    size: 16,
                                }),
                            ],
                            alignment: "center",
                        }),
                    ],
                },
            ],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, `ticket_servicio_${values.nombreCliente}.docx`);
        });
    };

    const showDetails = (record) => {
        Modal.info({
            title: 'Detalles del repuesto',
            content: (
                <div>
                    {/* <img src={record.FotoEmpleado} alt="Empleado" style={{ width: '200px', marginLeft: '15%' }} /> */}
                    <p><strong>Cod.  </strong>{record.CodRepuesto}</p>
                    <p><strong>Cantidad: </strong>{record.Cantidad}</p>

                    <p style={{ fontSize: "20px" }}><strong>{record.NombreRepuesto}</strong></p>
                    <p><strong>Descripción: </strong> {record.Descripcion}</p>
                    <p><strong>Categoría: </strong> {record.Categoria}</p>
                    <p><strong>Estado: </strong> {record.Estado}</p>
                    <p><strong>Proveedor: </strong> {record.Proveedor}</p>
                    <p><strong>Costo unitario: </strong>{record.CostoUnitario}</p>
                    <p><strong>Precio del repuestos: </strong>{record.PrecioRepuesto}</p>
                    <p><strong>Fecha de ingreso: </strong> {record.Fecha}</p>
                    <p><strong>Ubicación en almacén: </strong> {record.UbicacionAlmacen}</p>
                </div>
            ),
            onOk() { },
        });
    };

    const editRecord = (record) => {
        //console.log('Editar:', record);
        navigate('/sistema-servicios/editar-repuesto', { state: { objetoProp: record } });
        // Aquí puedes implementar la lógica para editar el registro
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
    }, []);

    return (
        <>
            <div>
                <h2 className="form-titleRepuestos">Mostrar tickets de atención</h2>
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
