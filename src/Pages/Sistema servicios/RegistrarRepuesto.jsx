import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, DatePicker, Select, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './RegistrarRepuesto.css';
import dayjs from 'dayjs';

const { Option } = Select;

const RegistrarRepuesto = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        //console.log('Received values of form: ', values);

        try {
            const docRef = await addDoc(collection(db, "ListaRepuestos"), {
                CodRepuesto: values.codRepuesto,
                NombreRepuesto: values.nombreRepuesto,
                Cantidad: values.cantidad,
                Fecha: formatearFecha(values.fecha.toDate()),
                Categoria: values.categoria,
                Proveedor: values.proveedor,
                Estado: values.estado,
                Descripcion: values.descripcion,
                CostoUnitario: values.costo,
                PrecioRepuesto: values.precio,
                UbicacionAlmacen: values.ubicacion,
            });
            //console.log("Document written with ID: ", docRef.id);
            ModalExito();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
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
            title: 'Registro de repuesto',
            content: 'Los datos del repuesto se han guardado correctamente.',
            onOk: () => { navigate('/sistema-servicios/mostrar-repuestos'); }
        });
    }

    const backHome = () => {
        navigate('/sistema-servicios');
    }

    const initialValues = {
        cantidad: "30",
        estado: "Usado",
        codRepuesto: "2024003",
        costo: "3.50",
        fecha: dayjs("2024-07-10"),
        descripcion: "Batería de reemplazo para MacBook Pro 15 pulgadas",
        nombreRepuesto: "Batería MacBook Pro 15\"",
        precio: "50.00",
        proveedor: "PowerCells Co.",
        ubicacion: "Almacén C3, Estante 2"
    };

    return (
        <div >
            <h2 className="form-title">Registrar repuesto</h2>

            <Form
                name="registro_respuesto"
                layout="horizontal"
                // initialValues={initialValues}
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 22 }}
                onFinish={onFinish}
            // className="form-columns"
            >
                <div className='parent2'>

                    <div className="div11">

                        <Form.Item
                            name="codRepuesto"
                            label="Código"
                            rules={[{ required: true, message: 'Por favor ingrese un código' }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            name="nombreRepuesto"
                            label="Nombre"
                            rules={[{ required: true, message: 'Por favor ingrese el nombre del repuesto' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="cantidad"
                            label="Cantidad"
                            rules={[{ required: true, message: 'Por favor ingrese una cantidad' }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            name="fecha"
                            label="Fecha de ingreso"
                            rules={[{ required: true, message: 'Por favor seleccione la fecha de ingreso' }]}
                        >
                            <DatePicker className='full-width' />
                        </Form.Item>

                        <Form.Item
                            name="categoria"
                            label="Categoria"
                            rules={[{ required: true, message: 'Por favor seleccione una categoria' }]}
                        >
                            <Select placeholder="Seleccione una categoria">
                                <Option value="Repuestos para celulares">Repuestos para celulares</Option>
                                <Option value="Repuestos para laptops">Repuestos para laptops</Option>
                                <Option value="Repuestos para televisores">Repuestos para televisores</Option>
                                <Option value="Repuestos para pc">Repuestos para pc</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="proveedor"
                            label="Proveedor"
                            rules={[{ required: true, message: 'Por favor ingrese un proveedor' }]}
                        >
                            <Input />
                        </Form.Item>

                    </div>

                    <div className="div22">

                        <Form.Item
                            name="estado"
                            label="Estado"
                            rules={[{ required: true, message: 'Por favor ingrese un estado' }]}
                        >
                            <Input />
                        </Form.Item>
                        
                        <Form.Item
                            name="descripcion"
                            label="Descripción"
                            rules={[{ required: true, message: 'Por favor ingrese una descripción' }]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>

                        <Form.Item
                            name="costo"
                            label="Costo unitario"
                            rules={[{ required: true, message: 'Por favor ingrese el costo unitario' }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            name="precio"
                            label="Precio de repusto"
                            rules={[{ required: true, message: 'Por favor ingrese el precio de venta' }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            name="ubicacion"
                            label="Ubicación en almacen"
                            rules={[{ required: true, message: 'Por favor ingrese la ubicación en almacen' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>


                    <div className='div33'>
                        <div className="button-container">
                            <Form.Item>
                                <Button style={{ width: '150px' }} type="default" htmlType="button" onClick={backHome}>
                                    Cancelar
                                </Button>

                            </Form.Item>
                            <Form.Item>
                                <Button style={{ width: '150px' }} type="primary" htmlType="submit">
                                    Registrar
                                </Button>
                            </Form.Item>
                        </div>
                    </div>

                </div>
            </Form >
        </div >
    );
};

export default RegistrarRepuesto;
