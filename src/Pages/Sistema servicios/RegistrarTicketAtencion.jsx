import React from 'react';
import { Form, Input, Button, DatePicker, Select, Modal } from 'antd';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { useNavigate } from 'react-router-dom';
import './RegistrarTicketAtencion.css';
import dayjs from 'dayjs';

const { Option } = Select;

const RegistrarTicketAtencion = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values, action) => {
        if (action === 'generate') {
            generarDocumentoWord(values);
        } else if (action === 'save') {
            //console.log('Received values of form: ', values);

            try {
                const docRef = await addDoc(collection(db, "ListaTicketsAtencion"), {
                    NombreCliente: values.nombreCliente,
                    CI: values.ci,
                    TelefonoCelular: values.telefonoCelular,
                    NombreDispositivo: values.NombreDispositivo,
                    DescripcionProblema: values.descripcionProblema,
                    NotasAdicionales: values.notasAdicionales,
                    FechaIngreso: formatearFecha(values.fechaIngreso.toDate()),
                    FechaEntrega: formatearFecha(values.fechaEntrega.toDate()),
                    CostoServicio: values.costoServicio,
                });
                //console.log("Document written with ID: ", docRef.id);
                ModalExito();
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    };

    const onFinishFailed = () => {
        message.error('Por favor complete el formulario correctamente.');
    };

    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString);

        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son base 0, por lo que sumamos 1
        const año = fecha.getFullYear();

        return `${año}-${mes}-${dia}`;
    }

    const ModalExito = () => {
        Modal.success({
            title: 'Registro de ticket de atención',
            content: 'Los datos del ticket de atención se han guardado correctamente.',
            onOk: () => { navigate('/sistema-servicios/mostrar-tickets'); }
        });
    }

    const backHome = () => {
        navigate('/sistema-servicios');
    }

    const generarDocumentoWord = (values) => {
        // console.log(values);
        // se crea una variable doc que almacenara el ticket del formulario de Registro de ticket de atención
        const doc = new Document({
            // al parte de seccions es donde va el titulo del ticket y cada input del formulario
            // del registro del ticket de atención como su tamaño de letra, tipo de letra, estilo de letra,etc.
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
                        new Paragraph({
                            text: `Nombre del cliente: ${values.nombreCliente}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `C.I.: ${values.ci}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Teléfono/celular: ${values.telefonoCelular}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Nombre del dispositivo: ${values.NombreDispositivo}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Descripción del problema: ${values.descripcionProblema}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Notas adicionales: ${values.notasAdicionales}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Fecha de ingreso: ${values.fechaIngreso.format('YYYY-MM-DD')}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Fecha de entrega: ${values.fechaEntrega.format('YYYY-MM-DD')}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Costo del servicio: Bs ${parseInt(values.costoServicio).toFixed(2)}`,
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
        // se convierte el documento a un blob utilizando Packer.toBlob de la biblioteca "docx" de javaSript
        Packer.toBlob(doc)
            // se maneja la promesa devuelta por toBlob
            .then((blob) => {
                // se utiliza la función "saveAs" para guardar el blob como un archivo .docx, que lleva de nombre 
                // el cliente actual que se esta registrando en el formulario
                saveAs(blob, `ticket_servicio_${values.nombreCliente}.docx`);
            });
    };

    const initialValues = {
        nombreCliente: 'Juan Pérez',
        ci: '12345678',
        telefonoCelular: '123-456-7890',
        NombreDispositivo: 'iPhone 12',
        descripcionProblema: 'Pantalla rota',
        notasAdicionales: 'El dispositivo no enciende después de la caída.',
        fechaIngreso: dayjs('2024-05-22'),
        fechaEntrega: dayjs('2024-05-29'),
        costoServicio: 100.00
    };

    return (
        <div >
            <div className='formTitulo'>
                <h2 >Registrar ticket de atención</h2>
            </div>
            <Form
                name="generarTicket"
                layout="horizontal"
                // initialValues={initialValues}
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 22 }}
                form={form}
                onFinish={(values) => onFinish(values, 'save')}
                onFinishFailed={onFinishFailed}
            // className="form-columns"
            >
                <div className='parentTicket'>

                    <div className='divTicket1' >

                        <Form.Item
                            name="nombreCliente"
                            label="Nombre del cliente"
                            rules={[{ required: true, message: 'Por favor, ingrese el nombre del cliente.' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="ci"
                            label="C.I."
                            rules={[{ required: true, message: 'Por favor, ingrese la cédula de identidad.' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="telefonoCelular"
                            label="Teléfono/celular"
                            rules={[{ required: true, message: 'Por favor, ingrese número de teléfono o celular.' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="NombreDispositivo"
                            label="Nombre del dispositivo"
                            rules={[{ required: true, message: 'Por favor, ingrese el nombre del dispostivo.' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="descripcionProblema"
                            label="Descripción del problema"
                            rules={[{ required: true, message: 'Por favor, ingrese una descripción del problema.' }]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>

                        <Form.Item
                            name="notasAdicionales"
                            label="Notas adicionales"
                            rules={[{ required: true, message: 'Por favor, ingrese unas notas adicionales.' }]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>

                        <Form.Item
                            name="fechaIngreso"
                            label="Fecha de ingreso"
                            rules={[{ required: true, message: 'Por favor, seleccione una fecha de ingreso.' }]}
                        >
                            <DatePicker className='full-width' />
                        </Form.Item>

                        <Form.Item
                            name="fechaEntrega"
                            label="Fecha de emtrega"
                            rules={[{ required: true, message: 'Por favor seleccione una fecha de entrega.' }]}
                        >
                            <DatePicker className='full-width' />
                        </Form.Item>

                        <Form.Item
                            name="costoServicio"
                            label="Costo del servicio"
                            rules={[{ required: true, message: 'Por favor ingrese el costo del servicio' }]}
                        >
                            <Input prefix="Bs" type="number" />
                        </Form.Item>
                    </div>

                    <div className='divTicket2'>
                        <Form.Item>
                            <Button style={{ width: '150px' }} type="default" htmlType="button" onClick={() => form.validateFields().then(values => onFinish(values, 'generate'))}>
                                Generar ticket
                            </Button>
                            <Button style={{ width: '150px', marginTop: '10px' }} type="primary" htmlType="submit">
                                Guardar
                            </Button>
                        </Form.Item>
                    </div>

                </div>
            </Form >
        </div >
    );
};

export default RegistrarTicketAtencion;



