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
    // Se importa el componente Modal de Ant Design, específicamente el método 'confirm' que permite mostrar un cuadro de confirmación
    const { confirm } = Modal;

    // Inicialización de los estados de los datos
    const [dataFirebase, setDataFirebase] = useState([]); // 'dataFirebase' almacena los datos obtenidos de la colección "ListaEmpleados"
    const [dataCredenciales, setDataCredenciales] = useState([]); // 'dataCredenciales' almacena los datos obtenidos de la colección "ListaCredenciales"
    const [dataUnificada, setDataUnificada] = useState([]); // 'dataUnificada' contiene los datos combinados de 'dataFirebase' y 'dataCredenciales'
    const [confimarcion, setConfirmacion] = useState(""); // 'confimarcion' es un estado para manejar la confirmación de alguna acción o evento


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
        {
            title: 'Acciones',
            key: 'actions',
            render: (text, record) => (
                <>

                    <Space>
                        <BotonCrearCuenta record={record} desabilitar={validateButton(record)} actualizar={recibirRespuesta} />
                        <BotonEliminarCuenta record={record} desabilitar={validateButtonEliminarCuenta(record)} actualizar={recibirRespuesta} />
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

    // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - -
    // useEffect para obtener datos de "ListaEmpleados" y "ListaCredenciales" desde Firebase
    useEffect(() => {
        // Función asíncrona para obtener datos de la colección "ListaEmpleados"
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaEmpleados"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id // Se agrega el id del documento para referencia
            }));
            setDataFirebase(dataList); // Se establece el estado 'dataFirebase' con los datos obtenidos
        };
        fetchData(); // Llamada a la función fetchData para obtener los empleados

        // Función asíncrona para obtener datos de la colección "ListaCredenciales"
        const fetchData2 = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaCredenciales"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id // Se agrega el id del documento para referencia
            }));
            setDataCredenciales(dataList); // Se establece el estado 'dataCredenciales' con los datos obtenidos
        };

        fetchData2(); // Llamada a la función fetchData2 para obtener las credenciales
        setConfirmacion(""); // Se restablece la confirmación (vacío)
    }, [confimarcion]); // Este useEffect se ejecuta cuando 'confimarcion' cambia

    // useEffect para obtener datos de "ListaEmpleados" y "ListaCredenciales" solo una vez al montar el componente
    useEffect(() => {
        // Función asíncrona para obtener datos de la colección "ListaEmpleados"
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaEmpleados"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id // Se agrega el id del documento para referencia
            }));
            setDataFirebase(dataList); // Se establece el estado 'dataFirebase' con los datos obtenidos
        };
        fetchData(); // Llamada a la función fetchData para obtener los empleados

        // Función asíncrona para obtener datos de la colección "ListaCredenciales"
        const fetchData2 = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaCredenciales"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id // Se agrega el id del documento para referencia
            }));
            setDataCredenciales(dataList); // Se establece el estado 'dataCredenciales' con los datos obtenidos
        };

        fetchData2(); // Llamada a la función fetchData2 para obtener las credenciales
        setConfirmacion(""); // Se restablece la confirmación (vacío)
    }, []); // Este useEffect se ejecuta solo una vez al montar el componente

    // useEffect para unificar los datos de 'dataFirebase' y 'dataCredenciales' en un solo estado
    useEffect(() => {
        // Función para unificar los datos, combinando la información de 'dataFirebase' y 'dataCredenciales'
        const unificarDatos = () => {
            const unificada = dataFirebase.map((item) => {
                const credencial = dataCredenciales.find((cred) => cred.id === item.id); // Buscar credencial con el mismo id
                return {
                    ...item,
                    SistemaAsignado: credencial ? credencial.SistemaAsignado : 'Ninguno', // Asigna 'Ninguno' si no hay coincidencia
                };
            });
            setDataUnificada(unificada); // Establece el estado 'dataUnificada' con los datos combinados
        };

        // Función alternativa para unificar solo con 'Ninguno' si no hay coincidencia
        const unificarDatos2 = () => {
            const unificada = dataFirebase.map((item) => {
                return {
                    ...item,
                    SistemaAsignado: 'Ninguno', // Asigna 'Ninguno' a todos los empleados
                };
            });
            setDataUnificada(unificada); // Establece el estado 'dataUnificada' con los datos unificados
        };

        // Llama a la función unificarDatos si ambos datos están disponibles
        if (dataFirebase.length > 0 && dataCredenciales.length > 0) {
            unificarDatos();
        } else {
            unificarDatos2(); // Llama a unificarDatos2 si no hay suficientes datos
        }
    }, [dataFirebase, dataCredenciales]); // Este useEffect se ejecuta cada vez que 'dataFirebase' o 'dataCredenciales' cambian
    // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
    // Función que valida si un botón debe estar habilitado basado en la existencia de una credencial asociada al 'record' (registro)
    const validateButton = (record) => {
        // Retorna 'true' si se encuentra una credencial que tenga el mismo 'id' que el registro, indicando que el botón puede estar habilitado
        return dataCredenciales.some(credencial => credencial.id === record.id);
    };

    // Función que valida si el botón de eliminación de cuenta debe estar habilitado
    const validateButtonEliminarCuenta = (record) => {
        // Retorna 'true' si NO existe una credencial asociada al 'record', indicando que el botón de eliminar cuenta puede estar habilitado
        return !dataCredenciales.some(credencial => credencial.id === record.id);
    };

    // Función para comprobar si un botón de eliminar credenciales debe ser habilitado
    const comprobarBotonEliminarCredenciales = (record) => {
        // Filtra las credenciales para encontrar la asociada al 'record'
        const dataCredencialUnica = dataCredenciales.filter((item) => item.id === record.id);

        // Si se encuentra una credencial, revisa si su 'SistemaAsignado' es 'Ninguno'
        if (dataCredencialUnica.length > 0) {
            if (dataCredencialUnica[0].SistemaAsignado === "Ninguno") {
                return true; // Si 'SistemaAsignado' es 'Ninguno', el botón de eliminación de credenciales puede ser habilitado
            } else {
                return false; // Si no es 'Ninguno', el botón no estará habilitado
            }
        } else {
            return true; // Si no se encuentra la credencial, se habilita el botón
        }
    }

    // Función para comprobar si un botón para dar credenciales debe ser habilitado
    const comprobarDarCredenciales = (record) => {
        // Filtra las credenciales para encontrar la asociada al 'record'
        const dataCredencialUnica = dataCredenciales.filter((item) => item.id === record.id);

        // Si se encuentra una credencial, revisa si su 'SistemaAsignado' NO es 'Ninguno'
        if (dataCredencialUnica.length > 0) {
            if (dataCredencialUnica[0].SistemaAsignado != "Ninguno") {
                return true; // Si 'SistemaAsignado' no es 'Ninguno', el botón para dar credenciales puede ser habilitado
            } else {
                return false; // Si es 'Ninguno', el botón no estará habilitado
            }
        } else {
            return true; // Si no se encuentra la credencial, se habilita el botón
        }
    }

    //------------------------------------- ELIMINAR CREDENCIALES ---------------------------------------------
    // Función que muestra una confirmación para eliminar la credencial asociada a un registro
    const confirmDelete = (record) => {
        // Filtra las credenciales para encontrar la asociada al 'record'
        const dataCredencialUnica = dataCredenciales.filter((item) => item.id === record.id);
        confirm({
            // Título y contenido del modal de confirmación
            title: '¿Estás seguro de eliminar esta credencial?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Eliminar', // Texto del botón de confirmación
            okType: 'danger', // Tipo de botón (peligroso)
            cancelText: 'Cancelar', // Texto del botón de cancelación
            onOk() {
                // Si se confirma la acción, se llama a la función de eliminación pasando el id de la credencial
                handleDelete(dataCredencialUnica[0].id);
            },
            onCancel() { }, // Acción a realizar si se cancela (vacía en este caso)
        });
    };

    // Función para eliminar una credencial actualizando el campo 'SistemaAsignado' a 'Ninguno'
    const handleDelete = async (id) => {
        const docRef = doc(db, "ListaCredenciales", id);
        try {
            // Actualiza el documento en Firestore poniendo 'SistemaAsignado' en 'Ninguno'
            await updateDoc(docRef, {
                SistemaAsignado: "Ninguno"
            });
            message.success('Credencial eliminada exitosamente.'); // Muestra un mensaje de éxito
            actualizarListas(); // Actualiza las listas de datos
        } catch (e) {
            // Captura y muestra cualquier error que ocurra durante la actualización
            console.error("Error updating document: ", e);
        }
    };

    // Función para actualizar las listas de empleados y credenciales desde la base de datos
    const actualizarListas = async () => {
        // Obtiene y actualiza la lista de empleados
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "ListaEmpleados"));
            const dataList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setDataFirebase(dataList);
        };
        fetchData();

        // Obtiene y actualiza la lista de credenciales
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

    // Función que se ejecuta cuando cambian los parámetros de la tabla, aunque no está siendo utilizada en este fragmento
    const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra); // Puedes descomentar esta línea para ver los cambios en los parámetros
    };

    // Función para recibir una respuesta y actualizar la confirmación
    const recibirRespuesta = (mensaje) => {
        setConfirmacion(mensaje); // Actualiza el estado de la confirmación con el mensaje recibido
    };

    // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

    return (
        <>
            <div>
                <h2 className="titulo">Gestión de cuentas y credenciales de empleados</h2>
                <div className='parentMostrar'>
                    <Table
                        columns={columns}
                        dataSource={dataUnificada.map((usuario, index) => ({
                            ...usuario,
                            key: index,
                        }))}
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
