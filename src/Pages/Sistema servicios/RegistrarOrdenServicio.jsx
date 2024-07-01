import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Table, InputNumber, AutoComplete } from 'antd';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import './RegistrarOrdenServicio.css'
import { activate } from 'firebase/remote-config';

const { Option } = Select;

const RegistrarOrdenServicio = ({ nombre, actualizar }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { confirm } = Modal;
    const [dataFirebase, setDataFirebase] = useState([]);
    const [dataEmpleados, setDataEmpleados] = useState([]);
    const [dataOrdenServicio, setDataOrdenServicio] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [costoTotal, setCostoTotal] = useState(0);

    const handleSearch = (value) => {
        if (value) {
            const filtered = dataFirebase
                .filter(item => item.NombreRepuesto.toLowerCase().includes(value.toLowerCase()))
                .map(item => ({ value: item.NombreRepuesto }));
            setOptions(filtered);
        } else {
            setOptions([]);
        }
    };

    const onSelect = (value) => {
        setSelectedOption(value);
    };

    const showModal = () => {
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        form.submit();
    };

    const handleFinish = async (values) => {
        try {
            const docRef = await addDoc(collection(db, "ListaOrdenServicio"), {
                CodOrden: values.codOrden,
                NombreCliente: nombre,
                TecnicoEncargado: values.tecnicoEncargado,
                FechaReparacion: formatearFecha(values.fechaReparacion.toDate()),
                FechaEntrega: formatearFecha(values.fechaEntrega.toDate()),
                MontoServicio: parseInt(values.costoServicio),
                MontoRepuestos: costoTotal,
                Garantia: values.garantia,
            });
            //console.log("Document written with ID: ", docRef.id);

            const subcollectionRef = collection(db, `ListaOrdenServicio/${docRef.id}/ListaRepuestos`);
            await Promise.all(
                dataOrdenServicio.map(async (repuesto) => {
                    await addDoc(subcollectionRef, repuesto);
                })
            );

            ModalExito();
        } catch (error) {
            console.error("Error adding document: ", error);
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

    const agregarLista = () => {
        // if (options.length>0 && selectedOption) {
        //     const filteredData = dataFirebase.filter(item => item.NombreRepuesto === selectedOption);
        //     setDataOrdenServicio([...dataOrdenServicio, ...filteredData]);
        // }
        // setSelectedOption(null)
        if (options.length > 0 && selectedOption) {
            const filteredData = dataFirebase.filter(item => item.NombreRepuesto === selectedOption);
            const newItems = filteredData.filter(item =>
                !dataOrdenServicio.some(existingItem => existingItem.id === item.id)
            );
            if (newItems.length > 0) {
                setDataOrdenServicio([...dataOrdenServicio, ...newItems]);
            }
        }
    };

    const columns = [
        {
            title: 'Código',
            dataIndex: 'CodRepuesto',
            defaultSortOrder: 'descend',
            // width: '250px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Nombre de repuesto',
            dataIndex: 'NombreRepuesto',
            defaultSortOrder: 'descend',
            // sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Precio ',
            dataIndex: 'PrecioRepuesto',
            defaultSortOrder: 'descend',
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Cantidad',
            dataIndex: 'cantidadSeleccionada',
            key: 'incrementar',
            render: (_, record) => (
                <div>
                    <Button onClick={() => handleIncrement(record.id, -1)}>-</Button>
                    <InputNumber
                        min={0}
                        value={record.cantidadSeleccionada}
                        onChange={(value) => handleIncrement(record.id, value - record.cantidadSeleccionada)}
                    />
                    <Button onClick={() => handleIncrement(record.id, 1)}>+</Button>
                </div>
            ),
        },
        {
            title: 'Acción',
            dataIndex: 'accion',
            key: 'accion',
            render: (_, record) => (
                <Button onClick={() => confirmDelete(record)}>Eliminar</Button>
            ),
        },
    ];

    const confirmDelete = (record) => {
        confirm({
            title: '¿Estás seguro de eliminar este respuesto?',
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

    const handleDelete = (id) => {
        const updatedOrdenServicio = dataOrdenServicio.filter(item => item.id !== id);
        const total = updatedOrdenServicio.reduce((acc, repuesto) => {
            return acc + (repuesto.PrecioRepuesto * repuesto.cantidadSeleccionada);
        }, 0);
        setCostoTotal(total);
        setDataOrdenServicio(updatedOrdenServicio);
    };


    const handleIncrement = (key, incrementValue) => {
        const updatedOrdenServicio = dataOrdenServicio.map((repuesto) => {
            if (repuesto.id === key) {
                const newNuevaCantidad = repuesto.cantidadSeleccionada + incrementValue;
                const cantidadFinal = Math.min(Math.max(newNuevaCantidad, 0), repuesto.Cantidad);
                return { ...repuesto, cantidadSeleccionada: cantidadFinal };
            }
            return repuesto;
        });
        setDataOrdenServicio(updatedOrdenServicio);
        const total = updatedOrdenServicio.reduce((acc, repuesto) => {
            return acc + (repuesto.PrecioRepuesto * repuesto.cantidadSeleccionada);
        }, 0);
        setCostoTotal(total);

    };

    useEffect(() => {
        handleIncrement();
    }, [costoTotal]);

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaRepuestos"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                cantidadSeleccionada: 0,
            }));
            // console.log(dataList);
            setDataFirebase(dataList);
        };
        fetchData();
        const fetchDataEmpleados = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaEmpleados"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                // cantidadSeleccionada: 0,
            }));
            // console.log(dataList);
            setDataEmpleados(dataList);
        };
        fetchDataEmpleados();
    }, []);

    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra);
    };

    const ModalExito = () => {
        Modal.success({
            title: 'Registro de orden de servicio',
            content: 'Los datos de la orden de servicio se han guardado correctamente.',
            onOk: () => { actualizar("Si"); setDataOrdenServicio([]); setIsModalVisible(false); }
        });
    }

    return (
        <div style={{ marginRight: '20px', marginBottom: '10px' }}>
            <Button type="primary" onClick={showModal}>
                Registrar orden de servicio
            </Button>
            <Modal
                title="Registrar orden de servicio"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancelar
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Registrar
                    </Button>,
                ]}
                width={800}
            >
                <Form
                    form={form}
                    layout="horizontal"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                    onFinish={handleFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <div className='parentOS'>
                        <div className='divOS1'>
                            <Form.Item
                                name="codOrden"
                                label="Código de orden de servicio"
                                rules={[{ required: true, message: 'Por favor ingrese un código de orden de servicio' }]}
                            >
                                <Input type="number" />
                            </Form.Item>

                            <Form.Item
                                name="tecnicoEncargado"
                                label="Técnico encargado"
                                rules={[{ required: true, message: 'Por favor seleccione un técnico encargado' }]}
                            >
                                <Select placeholder="Seleccione un técnico">
                                    {dataEmpleados.map(empleado => (
                                        <Option key={empleado.id} value={empleado.Nombre}>
                                            {empleado.Nombre}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="buscarRepuestos"
                                label="Buscar repuestos"
                            >
                                <AutoComplete
                                    options={options}
                                    onSelect={onSelect}
                                    onSearch={handleSearch}
                                    placeholder="Ingrese el nombre del repuesto"
                                />
                                <Button style={{ width: '150px', marginTop: '10px' }} type='primary' onClick={agregarLista}>Agregar</Button>
                            </Form.Item>

                            <Table
                                columns={columns}
                                dataSource={dataOrdenServicio}
                                pagination={false}
                                onChange={onChange}
                                showSorterTooltip={{
                                    target: 'sorter-icon',
                                }}
                                scroll={{ x: true }}
                            />
                            <h3 style={{ textAlign: 'right', marginRight: '100px' }}>Costo total repuestos: {costoTotal} Bs.</h3>

                            <Form.Item
                                name="fechaReparacion"
                                label="Fecha de reparación"
                                rules={[{ required: true, message: 'Por favor seleccione la fecha de reparación' }]}
                            >
                                <DatePicker format="YYYY-MM-DD" />
                            </Form.Item>

                            <Form.Item
                                name="fechaEntrega"
                                label="Fecha de entrega"
                                rules={[{ required: true, message: 'Por favor seleccione la fecha de entrega' }]}
                            >
                                <DatePicker format="YYYY-MM-DD" />
                            </Form.Item>

                            <Form.Item
                                name="garantia"
                                label="Garantía"
                                rules={[{ required: true, message: 'Por favor ingrese la garantía' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="costoServicio"
                                label="Costo del servicio"
                                rules={[{ required: true, message: 'Por favor ingrese el costo del servicio' }]}
                            >
                                <Input prefix="Bs" type="number" />
                            </Form.Item>
                        </div>

                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default RegistrarOrdenServicio;
