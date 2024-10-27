import React from 'react';
import { Form, Input, Button, DatePicker, Select, Modal, message } from 'antd';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { useNavigate, useLocation } from 'react-router-dom';
import './RegistrarTicketAtencion.css';
import dayjs from 'dayjs';
import { jsPDF } from "jspdf";

const { Option } = Select;

const RegistrarTicketAtencion = () => {
    const location = useLocation();
    const dataCliente = location.state && location.state.objetoProp;
    // console.log(dataCliente);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values, action) => {
        if (action === 'generate') {
            imprimirTicket(values);
        } else if (action === 'save') {
            const hide = message.loading('Registrando ticket de atención...', 0);
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
                hide();
                ModalExito();
            } catch (error) {
                hide();
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

    const imprimirTicket = (values) => {
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
        doc.text(`Nombre del cliente: ${values.nombreCliente}`, marginX, 46);
        doc.text(`C.I.: ${values.ci}`, marginX, 56);
        doc.text(`Teléfono/celular: ${values.telefonoCelular}`, marginX, 66);
        doc.text(`Nombre del dispositivo: ${values.NombreDispositivo}`, marginX, 76);
    
        // Para los textos largos
        let yPosition = 86; // Posición inicial para el texto largo
    
        // Descripción del problema
        const descripcion = doc.splitTextToSize(`Descripción del problema: ${values.descripcionProblema}`, maxLineWidth);
        doc.text(descripcion, marginX, yPosition);
        yPosition += descripcion.length * 10; // Ajuste de posición en base a las líneas generadas
    
        // Notas adicionales
        const notas = doc.splitTextToSize(`Notas adicionales: ${values.notasAdicionales}`, maxLineWidth);
        doc.text(notas, marginX, yPosition);
        yPosition += notas.length * 7; // Ajuste de posición en base a las líneas generadas
    
        // Resto del contenido
        doc.text(`Fecha de ingreso: ${new Date(values.fechaIngreso).toLocaleDateString("es-ES")}`, marginX, yPosition + 0);
        doc.text(`Fecha de entrega: ${new Date(values.fechaEntrega).toLocaleDateString("es-ES")}`, marginX, yPosition + 10);        
        doc.text(`Costo del servicio: Bs ${parseInt(values.costoServicio).toFixed(2)}`, marginX, yPosition + 20);
    
        doc.setFontSize(16);
        doc.text("Gracias por elegir WilSmart", pageWidth / 2, yPosition + 35, { align: "center" });
        doc.setFontSize(12);
        doc.text("Por favor, conserve este ticket para recoger su dispositivo.", pageWidth / 2, yPosition + 40, { align: "center" });
    
        // Abrir el PDF en el navegador para imprimir
        window.open(doc.output("bloburl"), "_blank").print();
    };

    let initialValues = {};

    if (dataCliente) {
        initialValues = {
            nombreCliente: dataCliente.NombreCliente,
            ci: dataCliente.CI,
            telefonoCelular: dataCliente.TelefonoCelular,
            NombreDispositivo: dataCliente.NombreDispositivo,
            descripcionProblema: dataCliente.DescripcionProblema,
            notasAdicionales: dataCliente.NotasAdicionales,
            fechaIngreso: dayjs(dataCliente.FechaIngreso),
            fechaEntrega: dayjs(dataCliente.FechaEntrega),
            // costoServicio: dataCliente.CostoServicio
        };
    }
    

    return (
        <div >
            <div className='formTitulo'>
                <h2 >Registrar ticket de atención</h2>
            </div>
            <Form
                name="generarTicket"
                layout="horizontal"
                initialValues={dataCliente !== null && initialValues}
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
                                Imprimir ticket
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



