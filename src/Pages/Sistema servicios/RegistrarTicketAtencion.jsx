import React from 'react';
import { Form, Input, Button, DatePicker, Modal, message } from 'antd';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate, useLocation } from 'react-router-dom';
import './RegistrarTicketAtencion.css';
import dayjs from 'dayjs';
import { jsPDF } from "jspdf";

const RegistrarTicketAtencion = () => {
    // Hook que obtiene la ubicación actual de la ruta (por ejemplo, parámetros pasados en la navegación).
    const location = useLocation();

    // Obtiene los datos del cliente desde la ubicación si están presentes en la ruta.
    const dataCliente = location.state && location.state.objetoProp;

    // Hook para la gestión del formulario de Ant Design.
    const [form] = Form.useForm();

    // Hook de navegación de React Router para redirigir a otras rutas de la aplicación.
    const navigate = useNavigate();

    // Función que maneja el envío del formulario dependiendo de la acción (generar ticket o guardar).
    const onFinish = async (values, action) => {
        // Si la acción es 'generate', se llama a la función para imprimir el ticket.
        if (action === 'generate') {
            imprimirTicket(values);
        } else if (action === 'save') {
            // Si la acción es 'save', se guarda un nuevo ticket de atención en la base de datos.
            const hide = message.loading('Registrando ticket de atención...', 0);
            try {
                // Intenta agregar un nuevo documento en la colección "ListaTicketsAtencion" de Firestore.
                const docRef = await addDoc(collection(db, "ListaTicketsAtencion"), {
                    NombreCliente: values.nombreCliente, // Nombre del cliente.
                    CI: values.ci,                       // Cédula de identidad del cliente.
                    TelefonoCelular: values.telefonoCelular, // Teléfono celular del cliente.
                    NombreDispositivo: values.NombreDispositivo, // Nombre del dispositivo.
                    DescripcionProblema: values.descripcionProblema, // Descripción del problema.
                    NotasAdicionales: values.notasAdicionales, // Notas adicionales si las hay.
                    FechaIngreso: formatearFecha(values.fechaIngreso.toDate()), // Fecha de ingreso formateada.
                    FechaEntrega: formatearFecha(values.fechaEntrega.toDate()), // Fecha de entrega formateada.
                    CostoServicio: values.costoServicio, // Costo del servicio.
                });
                hide();
                // Si el registro es exitoso, muestra el modal de éxito.
                ModalExito();
            } catch (error) {
                hide();
                console.error("Error adding document: ", error); // En caso de error, lo muestra en la consola.
            }
        }
    };

    // Función que se llama cuando el formulario no pasa la validación, mostrando un mensaje de error.
    const onFinishFailed = () => {
        message.error('Por favor complete el formulario correctamente.');
    };

    // Función que formatea la fecha a un formato estándar (YYYY-MM-DD).
    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString);
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son base 0, por lo que sumamos 1
        const año = fecha.getFullYear();

        return `${año}-${mes}-${dia}`;
    }

    // Función que muestra un modal de éxito al guardar el ticket de atención en la base de datos.
    const ModalExito = () => {
        Modal.success({
            title: 'Registro de ticket de atención',
            content: 'Los datos del ticket de atención se han guardado correctamente.',
            onOk: () => { navigate('/sistema-servicios/mostrar-tickets'); } // Redirige al listado de tickets.
        });
    }

    //Metodo que se ejecuta para imprimir el ticket
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

    // Inicialización de los valores por defecto para el formulario.
    let initialValues = {};

    // Si existen datos del cliente (dataCliente), se asignan esos datos a initialValues.
    if (dataCliente) {
        initialValues = {
            nombreCliente: dataCliente.NombreCliente, // Nombre del cliente.
            ci: dataCliente.CI,                       // Cédula de identidad del cliente.
            telefonoCelular: dataCliente.TelefonoCelular, // Teléfono celular del cliente.
            NombreDispositivo: dataCliente.NombreDispositivo, // Nombre del dispositivo.
            descripcionProblema: dataCliente.DescripcionProblema, // Descripción del problema.
            notasAdicionales: dataCliente.NotasAdicionales, // Notas adicionales si las hay.
            fechaIngreso: dayjs(dataCliente.FechaIngreso), // Fecha de ingreso, formateada con dayjs.
            fechaEntrega: dayjs(dataCliente.FechaEntrega), // Fecha de entrega, formateada con dayjs.
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



