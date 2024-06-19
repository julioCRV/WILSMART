import { Table, Button, InputNumber, Badge, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './MostrarProducto.css'

const MostrarProducto = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const [dataFirebase, setDataFirebase] = useState([]);
  const [valorCarrito, setValorCarrito] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [reporte, setReporte] = useState('');

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'NombreProducto',
      defaultSortOrder: 'descend',
      width: '250px'
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Imagen',
      dataIndex: 'Imagen',
      render: (imageUrl) => <img src={imageUrl} alt="Empleado" style={{ width: '100px' }} />,
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Precio',
      dataIndex: 'Precio',
      defaultSortOrder: 'descend',
      render: (text) => `Bs   ${text}`,
      // sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Cantidad',
      dataIndex: 'Cantidad',
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.age - b.age,
    },
    // {
    //     title: 'Nueva cantidad',
    //     dataIndex: 'nuevaCantidad',
    //     defaultSortOrder: 'descend',
    //     // sorter: (a, b) => a.name.localeCompare(b.name),
    // },
    {
      title: 'Incrementar',
      dataIndex: 'cantidadIncrementada',
      key: 'incrementar',
      render: (_, record) => (
        <div>
          <Button onClick={() => handleIncrement(record.id, -1)}>-</Button>
          <InputNumber
            min={0}
            value={record.cantidadIncrementada}
            onChange={(value) => handleIncrement(record.id, value - record.cantidadIncrementada)}
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
        <>
          <Button onClick={() => handleActualizar(record.id)}>Agregar</Button>
          <Button onClick={() => handleQuitar(record.id)}>Quitar</Button>
        </>
      ),
    },
  ];

  const handleIncrement = (key, incrementValue) => {
    const updatedProductos = dataFirebase.map((producto) => {
      if (producto.id === key) {
        const newNuevaCantidad = producto.cantidadIncrementada + incrementValue;
        const cantidadFinal = Math.min(Math.max(newNuevaCantidad, 0), producto.cantidadRespaldo);
        return { ...producto, cantidadIncrementada: cantidadFinal };
      }
      return producto;
    });
    setDataFirebase(updatedProductos);
  };

  const handleQuitar = (key) => {
    const updatedProductos = dataFirebase.map((producto) => {
      if (producto.id === key) {
        if (valorCarrito > 0) {
          if (producto.cantidadCarrito > 0) {
            setValorCarrito((prevCount) => prevCount - 1);
          }
        }
        return { ...producto, Cantidad: parseInt(producto.cantidadRespaldo), cantidadIncrementada: 0, cantidadCarrito: 0 };
      }
      return producto;
    });
    setDataFirebase(updatedProductos);
  }

  const handleActualizar = (key) => {
    const updatedProductos = dataFirebase.map((producto) => {
      if (producto.id === key) {
        if (producto.cantidadIncrementada === 0) {
          if (producto.cantidadCarrito === 0) {
            if (valorCarrito === 0) {
              setValorCarrito(0)
            }
          } else {
            setValorCarrito((prevCount) => prevCount - 1);
          }
          return {
            ...producto, Cantidad: parseInt(producto.cantidadRespaldo) - producto.cantidadIncrementada,
            cantidadCarrito: producto.cantidadIncrementada
          };
        } else {
          if (producto.cantidadCarrito === 0) {
            setValorCarrito((prevCount) => prevCount + 1);
          }
          return {
            ...producto, Cantidad: parseInt(producto.cantidadRespaldo) - producto.cantidadIncrementada,
            cantidadCarrito: producto.cantidadIncrementada
          };
        }

      }
      return producto;
    });
    setDataFirebase(updatedProductos);
    // console.log(updatedProductos);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  // const handleSaveAll = async () => {
  //     const batch = db.batch(); 
  //     dataFirebase.forEach((item) => {
  //         const productRef = doc(db, "ListaProductos", item.id);
  //         if(item.nuevaCantidad != 0){
  //             batch.update(productRef, { cantidad: item.nuevaCantidad });
  //         }
  //     });

  //     await batch.commit(); 
  //     console.log('Todos los productos han sido actualizados en Firebase.');
  // };

  const handleSaveAll = async () => {
    const promises = dataFirebase.map((item) => {
      const productRef = doc(db, "ListaProductos", item.id);
      return updateDoc(productRef, { Cantidad: item.Cantidad });
    }).filter(promise => promise !== null);

    try {
      await Promise.all(promises); // Espera a que todas las actualizaciones se completen
      console.log('Todos los productos han sido actualizados en Firebase.');
    } catch (error) {
      console.error('Error al actualizar los productos:', error);
    }
  };

  const guardarReporteVentas = async () => {
    // Filtrar productos que fueron añadidos al carrito
    const productosVendidos = dataFirebase.filter(producto => producto.cantidadCarrito > 0);

    // Crear el reporte de ventas
    const reporte = {
      fecha: new Date().toISOString(), // Fecha y hora actuales
      productos: productosVendidos.map(producto => ({
        NombreProducto: producto.NombreProducto,
        CantidadInicial: producto.cantidadRespaldo,
        CantidadVendida: producto.cantidadIncrementada,
        PrecioUnitario: producto.Precio,
        total: producto.cantidadIncrementada * producto.Precio
      }))
    };

    try {
      // Guardar el reporte en Firebase
      await addDoc(collection(db, "ReportesVentas"), reporte);
      console.log("Reporte de ventas guardado con éxito.");
    } catch (error) {
      console.error("Error al guardar el reporte de ventas:", error);
    }
  };

  const confirmRegistrarVenta = () => {
    handleSaveAll();
    guardarReporteVentas();
    message.success('Se ha registrado la venta de los productos correctamente.');
    navigate('/sistema-ventas/mostrar-productos');

    // confirm({
    //   title: 'Confirmar guardado',
    //   content: '¿Está seguro de guardar las modificaciones?',
    //   okText: 'Guardar',
    //   okType: 'ghost',
    //   cancelText: 'Cancelar',
    //   onOk() {
    //     handleSaveAll();
    //     message.success('Se han actualizado los productos correctamente.');
    //     navigate('/sistema-ventas/mostrar-productos');
    //   },
    //   onCancel() { },
    // });
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "ListaProductos"));
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        cantidadRespaldo: doc.data().Cantidad,
        cantidadIncrementada: 0,
        cantidadCarrito: 0,
      }));
      // console.log(dataList);
      setDataFirebase(dataList);
      setValorCarrito(0)
    };
    fetchData();
  }, []);


  const calcularTotal = () => {
    let total = 0;
    dataFirebase.forEach((producto) => {
      if (producto.cantidadCarrito > 0) {
        total += producto.Precio * producto.cantidadIncrementada;
      }
    });
    return total;
  };

  const generarReporte = () => {
    let contenidoReporte = 'Factura de venta\n\nProducto | Precio unitario | Cantidad | Subtotal\n\n';
    dataFirebase.forEach((producto) => {
      if (producto.cantidadIncrementada > 0 && producto.cantidadCarrito > 0) {
        contenidoReporte += `${producto.NombreProducto}: ${producto.Precio} Bs x ${producto.cantidadIncrementada} unidades = ${producto.Precio * producto.cantidadIncrementada} Bs\n`;
      }
    });
    contenidoReporte += `\nTotal: ${calcularTotal()} Bs`;
    setReporte(contenidoReporte);
  };
  console.log(dataFirebase);
  const accionRegistrarVenta = () => {
    if (valorCarrito > 0) {
      generarReporte();
      setModalVisible(true);
    } else {
      confirm({
        title: 'Carrito de compras vacío',
        content: 'No ha añadido ningún producto al carrito de compras.',
        okText: 'Aceptar',
        okType: 'warning',
        onOk() {
          message.warning('No se realizo un registro de compra.');
        },
      });
    }
  }

  return (
    <>
      <div>
        <h2 className="form-titleIncr">Realizar ventas</h2>
        <div className='TituloForm'>
          <Badge count={valorCarrito} showZero>
            <ShoppingCartOutlined style={{ fontSize: '45px' }} />
          </Badge>
        </div>

        <div className='parentMostrarIncr'>
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
        <div className='BotIncrementar'>
          <Button onClick={accionRegistrarVenta}>Registrar venta</Button>
        </div>
      </div>


      <Modal
        title="Reporte de venta"
        visible={modalVisible}
        onOk={() => confirmRegistrarVenta()}
        onCancel={() => setModalVisible(false)}
      >
        <pre>{reporte}</pre>
      </Modal>

    </>
  );
};

export default MostrarProducto;
