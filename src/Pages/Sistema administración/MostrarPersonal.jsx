import { Table, Button, Space, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import './MostrarPersonal.css'

const MostrarEmpleado = () => {
  // 'confirm' es utilizado para mostrar un modal de confirmación (importado desde Modal de Ant Design)
  const { confirm } = Modal;
  // 'useNavigate' es un hook proporcionado por React Router para navegar entre las rutas de la aplicación
  const navigate = useNavigate();
  // 'dataFirebase' es el estado donde se almacenan los datos obtenidos de Firebase, inicialmente vacío
  const [dataFirebase, setDataFirebase] = useState([]);
  // Columnas de la tabla
  const columns = [
    {
      title: 'Foto',
      dataIndex: 'FotoEmpleado',
      render: (imageUrl) => <img src={imageUrl} alt="Empleado" style={{ width: '40px' }} />,
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Nombre completo',
      dataIndex: 'Nombre',
      defaultSortOrder: 'descend',
      width: '250px'
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Puesto o cargo',
      dataIndex: 'PuestoOcargo',
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Número de teléfono',
      dataIndex: 'NumeroTeléfono',
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'C.I.',
      dataIndex: 'CI',
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Salario',
      dataIndex: 'Salario',
      render: (text) => `Bs   ${text}`,
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => showDetails(record)}>Mostrar</Button>
          <Button onClick={() => editRecord(record)}>Editar</Button>
          <Button onClick={() => confirmDelete(record)}>Eliminar</Button>
        </Space>
      ),
    },
  ];

  // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - -
  // useEffect que se ejecuta una vez al cargar el componente para obtener datos desde Firestore
  useEffect(() => {
    const fetchData = async () => {
      // Obtiene todos los documentos de la colección "ListaEmpleados" de Firestore
      const querySnapshot = await getDocs(collection(db, "ListaEmpleados"));

      // Mapea los documentos a un array de objetos y agrega el 'id' de cada documento
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id // Añade el id de cada documento para usarlo más tarde
      }));

      // Establece el estado 'dataFirebase' con la lista de empleados obtenida
      setDataFirebase(dataList);
    };

    fetchData(); // Llama a la función para obtener los datos
  }, []); // El arreglo vacío [] asegura que el efecto se ejecute solo una vez al montar el componente
  // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


  // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
  // Función que muestra los detalles de un registro en un modal
  const showDetails = (record) => {
    // Abre un modal con información detallada sobre un empleado
    Modal.info({
      title: 'Detalles del Registro', // Título del modal
      content: ( // Contenido del modal con los detalles del empleado
        <div>
          {/* Foto del empleado */}
          <img src={record.FotoEmpleado} alt="Empleado" style={{ width: '200px', marginLeft: '15%' }} />
          {/* Información del empleado */}
          <p>{record.Nombre}</p>
          <p>{record.PuestoOcargo}</p>
          <p><strong>Salario:</strong> {record.Salario}</p>
          <p><strong>Fecha nacimiento:</strong> {record.FechaNacimiento}</p>
          <p><strong> C.I.:</strong> {record.CI}</p>
          <p><strong>Género:</strong> {record.Genero}</p>
          <p><strong>Estado civil:</strong> {record.EstadoCivil}</p>
          <p><strong>Número de teléfono:</strong> {record.NumeroTeléfono}</p>
          <p><strong>Correo electrónico:</strong> {record.CorreoElectrónico}</p>
          <p><strong>Dirección de domicilio:</strong> {record.DirecciónDeDomicilio}</p>
        </div>
      ),
      onOk() { }, // Acción cuando se cierra el modal (vacío en este caso)
    });
  };

  // Función que permite editar el registro de un empleado
  const editRecord = (record) => {
    // Navega a una nueva ruta donde se pueda editar la información del empleado, pasando el registro como estado
    navigate('/sistema-administración/editar-empleado', { state: { objetoProp: record } });
  };

  // Función para manejar la eliminación de un registro de empleado
  const handleDelete = async (id) => {
    const docRef = doc(db, "ListaEmpleados", id); // Referencia al documento del empleado en Firestore
    try {
      await deleteDoc(docRef); // Elimina el documento de la base de datos
      actualizarListaEmpleados(); // Actualiza la lista de empleados en la interfaz
    } catch (e) {
      console.error("Error deleting document: ", e); // Manejo de errores en caso de que la eliminación falle
    }
  };

  // Función para mostrar la confirmación antes de eliminar un registro
  const confirmDelete = (record) => {
    // Abre un modal de confirmación antes de eliminar el registro
    confirm({
      title: '¿Estás seguro de eliminar este registro?', // Título del modal de confirmación
      content: 'Esta acción no se puede deshacer.', // Mensaje de advertencia
      okText: 'Eliminar', // Texto del botón de confirmación
      okType: 'danger', // Tipo de botón, color rojo para peligro
      cancelText: 'Cancelar', // Texto del botón de cancelación
      onOk() {
        handleDelete(record.id); // Si se confirma, se llama a la función handleDelete para eliminar el registro
      },
      onCancel() { }, // Acción cuando se cancela (vacío en este caso)
    });
  };

  // Función para manejar el cambio de paginación, filtros o ordenación
  const onChange = (pagination, filters, sorter, extra) => {
    // Aquí puedes manejar eventos como paginación, filtros o cambios en la ordenación de la tabla (vacío por ahora)
    // console.log('params', pagination, filters, sorter, extra); // Descomentar para ver los parámetros
  };

  // Función para actualizar la lista de empleados en la interfaz
  const actualizarListaEmpleados = async () => {
    // Realiza una consulta a la base de datos para obtener todos los empleados
    const querySnapshot = await getDocs(collection(db, "ListaEmpleados"));

    // Mapea los resultados a un array de objetos y agrega el 'id' de cada documento
    const dataList = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id // Agrega el 'id' del documento para su uso posterior
    }));

    // Actualiza el estado de la lista de empleados en la interfaz
    setDataFirebase(dataList);
  };
  // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 



  return (
    <>
      <div>
        <h2 className="form-title">Mostrar empleados</h2>
        <div className='parentMostrar'>
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

export default MostrarEmpleado;
