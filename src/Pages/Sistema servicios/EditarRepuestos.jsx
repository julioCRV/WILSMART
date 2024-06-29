import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, DatePicker, Select, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../FireBase/fireBase';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './RegistrarRepuesto.css';

const { Option } = Select;

const EditarRepuesto = () => {
    const location = useLocation();
    const dataRepuesto = location.state && location.state.objetoProp;
    const navigate = useNavigate();




    const onFinish = async (values) => {
        const docRef = doc(db, "ListaRepuestos", dataRepuesto.id);
        try {
            await updateDoc(docRef, {
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
            //console.log("Document updated");
            ModalExito();
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString);

        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son base 0, por lo que sumamos 1
        const año = fecha.getFullYear();

        return `${año}/${mes}/${dia}`;
    }

    const ModalExito = () => {
        Modal.success({
            title: 'Actualizar datos del repuesto',
            content: 'Los datos del repuesto se han actualizado correctamente.',
            onOk: () => { navigate('/sistema-servicios/mostrar-repuestos'); }
        });
    }

    const backList = () => {
        navigate('/sistema-servicios/mostra-repuestos');
    }

    //console.log(dataRepuesto);
    const initialValues = {
        codRepuesto: dataRepuesto.CodRepuesto,
        nombreRepuesto: dataRepuesto.NombreRepuesto,
        cantidad: dataRepuesto.Cantidad,
        fecha: dayjs(dataRepuesto.Fecha),
        categoria: dataRepuesto.Categoria,
        proveedor: dataRepuesto.Proveedor,

        estado: dataRepuesto.Estado,
        descripcion: dataRepuesto.Descripcion,
        costo: dataRepuesto.CostoUnitario,
        precio: dataRepuesto.PrecioRepuesto,
        proveedor: dataRepuesto.Proveedor,
        ubicacion: dataRepuesto.UbicacionAlmacen,
    };

    return (
        <div >
            <h2 className="form-title">Editar repuesto</h2>

            <Form
                name="editar_producto"
                layout="horizontal"
                initialValues={initialValues}
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
                            <DatePicker className='full-width'/>
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
                                <Button style={{ width: '150px' }} type="default" htmlType="button" onClick={backList}>
                                    Cancelar
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button style={{ width: '150px' }} type="primary" htmlType="submit">
                                    Actualizar
                                </Button>
                            </Form.Item>
                        </div>
                    </div>

                </div>
            </Form >
        </div >
    );
};

export default EditarRepuesto;
