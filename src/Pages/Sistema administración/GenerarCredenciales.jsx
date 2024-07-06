import { Table, Button, Space, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import BotonCrearCuenta from './ModalCrearCuenta';
import BotonEliminarCuenta from './EliminarCuenta';
import BotonCrearCredenciales from './ModalCrearCredenciales';
import BotonRestablecerContraseña from './ModalRestablecerContraseña'
import './MostrarPersonal.css'

const GenerarCredenciales = () => {
    const { confirm } = Modal;
    const navigate = useNavigate();
    const [dataFirebase, setDataFirebase] = useState([]);
    const [dataCredenciales, setDataCredenciales] = useState([]);
    const [dataUnificada, setDataUnificada] = useState([]);
    const [confimarcion, setConfirmacion] = useState("");

    const columns = [
        {
            title: 'Foto',
            dataIndex: 'FotoEmpleado',
            render: (imageUrl) => <img src={imageUrl} alt="Empleado" style={{ width: '50px' }} />,
            defaultSortOrder: 'descend',
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Nombre completo',
            dataIndex: 'Nombre',
            defaultSortOrder: 'ascend',
            width: '180px',
            sorter: (a, b) => a.Nombre.localeCompare(b.Nombre),
        },
        {
            title: 'Puesto o cargo',
            dataIndex: 'PuestoOcargo',
            defaultSortOrder: 'descend',
            width: '200px'
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Correo',
            dataIndex: 'CorreoElectrónico',
            defaultSortOrder: 'descend',
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Credenciales',
            dataIndex: 'SistemaAsignado',
            defaultSortOrder: 'descend',
            // sorter: (a, b) => a.name.localeCompare(b.name),
        },
        // {
        //   title: 'Número de teléfono',
        //   dataIndex: 'NumeroTeléfono',
        //   defaultSortOrder: 'descend',
        //   // sorter: (a, b) => a.name.localeCompare(b.name),
        // },
        // {
        //   title: 'C.I.',
        //   dataIndex: 'CI',
        //   defaultSortOrder: 'descend',
        //   // sorter: (a, b) => a.name.localeCompare(b.name),
        // },
        // {
        //   title: 'Salario',
        //   dataIndex: 'Salario',
        //   defaultSortOrder: 'descend',
        //   // sorter: (a, b) => a.age - b.age,
        // },
        {
            title: 'Acciones',
            key: 'actions',
            render: (text, record) => (
                <>

                    <Space>
                        <BotonCrearCuenta record={record} desabilitar={validateButton(record)} actualizar={recibirRespuesta} />
                        <BotonEliminarCuenta record={record} desabilitar={validateButtonEliminarCuenta(record)} actualizar={recibirRespuesta} />
                        {/* <Button disabled={comprobarBotonEliminarCredenciales(record)} onClick={() => confirmDelete(record)}>Eliminar cuenta  </Button> */}
                        {/* <Button disabled={validateButtonEliminarCuenta(record)} onClick={() => editRecord(record)}>Recuperar contraseña</Button> */}
                        <BotonRestablecerContraseña record={record} desabilitar={validateButtonEliminarCuenta(record)} actualizar={recibirRespuesta} />
                    </Space>
                    <Space style={{ marginTop: '12px' }}>
                        <BotonCrearCredenciales record={record} desabilitar={comprobarDarCredenciales(record)} actualizar={recibirRespuesta} />
                        <Button disabled={comprobarBotonEliminarCredenciales(record)} onClick={() => confirmDelete(record)}>Eliminar credenciales</Button>
                    </Space>

                </>
            ),
        },
    ];

    const validateButton = (record) => {
        return dataCredenciales.some(credencial => credencial.id === record.id);
    };

    const validateButtonEliminarCuenta = (record) => {
        return !dataCredenciales.some(credencial => credencial.id === record.id);
    };

    const comprobarBotonEliminarCredenciales = (record) => {
        const dataCredencialUnica = dataCredenciales.filter((item) => item.id === record.id);
        if (dataCredencialUnica.length > 0) {
            if (dataCredencialUnica[0].SistemaAsignado === "Ninguno") {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    const comprobarDarCredenciales = (record) => {
        const dataCredencialUnica = dataCredenciales.filter((item) => item.id === record.id);
        if (dataCredencialUnica.length > 0) {
            if (dataCredencialUnica[0].SistemaAsignado != "Ninguno") {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    //------------------------------------- ELIMINAR CREDENCIALES ---------------------------------------------
    const confirmDelete = (record) => {
        const dataCredencialUnica = dataCredenciales.filter((item) => item.id === record.id);
        confirm({
            title: '¿Estás seguro de eliminar esta credencial?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                //console.log('Eliminar:', record);
                handleDelete(dataCredencialUnica[0].id);
            },
            onCancel() { },
        });
    };

    const handleDelete = async (id) => {
        // const docRef = doc(db, "ListaCredenciales", id);
        // try {
        //     await deleteDoc(docRef);
        //     //console.log("Document deleted");
        //     actuallizarListas();
        // } catch (e) {
        //     console.error("Error deleting document: ", e);
        // }

        const docRef = doc(db, "ListaCredenciales", id);
        try {
            await updateDoc(docRef, {
                SistemaAsignado: "Ninguno"
            });
            // console.log("Document updated");
            message.success('Credencial eliminada exitosamente.');
            actualizarListas(); // Asegúrate de que esta función actualiza la lista correctamente
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    const actualizarListas = async () => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaEmpleados"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            // console.log(dataList);
            setDataFirebase(dataList);
        };
        fetchData();

        const fetchData2 = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaCredenciales"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setDataCredenciales(dataList);
        };
        fetchData2();
    };

    const onChange = (pagination, filters, sorter, extra) => {
        //console.log('params', pagination, filters, sorter, extra);
    };

    const recibirRespuesta = (mensaje) => {
        setConfirmacion(mensaje);
    };

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaEmpleados"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            // console.log(dataList);
            setDataFirebase(dataList);
        };
        fetchData();

        const fetchData2 = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaCredenciales"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setDataCredenciales(dataList);
        };
        fetchData2();
        setConfirmacion("");
    }, [confimarcion]);

    useEffect(() => {
        const unificarDatos = () => {
            const unificada = dataFirebase.map((item) => {
                const credencial = dataCredenciales.find((cred) => cred.id === item.id);
                return {
                    ...item,
                    SistemaAsignado: credencial ? credencial.SistemaAsignado : 'Ninguno', // Asignar 'Ninguno' si no se encuentra coincidencia
                };
            });
            setDataUnificada(unificada);
        };

        if (dataFirebase.length > 0 && dataCredenciales.length > 0) {
            unificarDatos();
        }

    }, [dataFirebase, dataCredenciales]);

    return (
        <>
            <div>
                <h2 className="form-title">Lista empleados</h2>
                <div className='parentMostrar'>
                    <Table
                        columns={columns}
                        dataSource={dataUnificada}
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

export default GenerarCredenciales;
