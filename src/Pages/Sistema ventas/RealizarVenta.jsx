import { Table, Button, InputNumber, Badge, Modal, message, Space, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './MostrarProducto.css'

const MostrarProducto = () => {
  const { confirm } = Modal;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [dataFirebase, setDataFirebase] = useState([]);
  const [dataCaja, setDataCaja] = useState([]);
  const [valorCarrito, setValorCarrito] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [reporte, setReporte] = useState('');
  const [change, setChange] = useState(0);
  const idCaja = sessionStorage.getItem('id');

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'NombreProducto',
      defaultSortOrder: 'ascend',
      width: '200px',
      sorter: (a, b) => a.NombreProducto.localeCompare(b.NombreProducto),
    },
    {
      title: 'Imagen',
      dataIndex: 'Imagen',
      render: (imageUrl) => <img src={imageUrl} alt="Empleado" style={{ width: '50px' }} />,
      defaultSortOrder: 'descend',
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Marca',
      dataIndex: 'Marca',
      // defaultSortOrder: 'ascend',
      width: '150px',
      // sorter: (a, b) => a.NombreProducto.localeCompare(b.NombreProducto),
    },
    {
      title: 'Precio compra',
      dataIndex: 'PrecioCompra',
      // defaultSortOrder: 'descend',
      render: (text) => `Bs   ${text}`,
      width: '80px',
      sorter: (a, b) => a.Precio - b.Precio,
    },
    {
      title: 'Precio venta',
      dataIndex: 'Precio',
      // defaultSortOrder: 'descend',
      render: (text) => `Bs   ${text}`,
      width: '80px',
      sorter: (a, b) => a.Precio - b.Precio,
    },
    {
      title: 'Cantidad',
      dataIndex: 'Cantidad',
      // defaultSortOrder: 'descend',
      sorter: (a, b) => a.Cantidad - b.Cantidad,
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
        <Space>
          <Button onClick={() => handleIncrement(record.id, -1)}>-</Button>
          <InputNumber
            min={0}
            value={record.cantidadIncrementada}
            onChange={(value) => handleIncrement(record.id, value - record.cantidadIncrementada)}
          />
          <Button onClick={() => handleIncrement(record.id, 1)}>+</Button>
        </Space>
      ),
    },
    {
      title: 'Acción',
      dataIndex: 'accion',
      key: 'accion',
      render: (_, record) => (
        <>
          <Button className="btn-agregar" onClick={() => handleActualizar(record.id)}>Agregar</Button>
          <Button className="btn-quitar" onClick={() => handleQuitar(record.id)}>Quitar</Button>
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
    //console.log('params', pagination, filters, sorter, extra);
  };

  const UpdateProductos = async () => {
    const promises = dataFirebase.map((item) => {
      const productRef = doc(db, "ListaProductos", item.id);
      return updateDoc(productRef, { Cantidad: item.Cantidad });
    }).filter(promise => promise !== null);

    try {
      await Promise.all(promises); // Espera a que todas las actualizaciones se completen
      // console.log('Todos los productos han sido actualizados en Firebase.');
    } catch (error) {
      console.error('Error al actualizar los productos:', error);
    }
  };

  const guardarReporteVentas = async (montoPagado) => {
    // Filtrar productos que fueron añadidos al carrito de compra
    const productosVendidos = dataFirebase.filter(producto => producto.cantidadCarrito > 0);
    const tiempoActual = obtenerFechaHoraActual();

    // Crear el reporte de ventas
    const reporte = {
      Fecha: tiempoActual.fecha,
      Hora: tiempoActual.hora,
      NombreEmpleado: dataCaja.NombreEmpleado,
      IdCaja: dataCaja.id,
      TotalVenta: calcularTotal(),
      TotalGanancias: calcularGanancias(),
      PagoCliente: parseInt(montoPagado),
      CambioCliente: change,
      CajaActual: dataCaja.MontoActualCaja + calcularTotal(),
      productos: productosVendidos.map(producto => ({
        NombreProducto: producto.NombreProducto,
        CantidadInicial: producto.cantidadRespaldo,
        CantidadVendida: producto.cantidadIncrementada,
        PrecioUnitario: producto.Precio,
        total: producto.cantidadIncrementada * producto.Precio
      }))
    };

    try {
      await addDoc(collection(db, "ReportesVentas"), reporte);
      // console.log("Reporte de ventas guardado con éxito.");
    } catch (error) {
      console.error("Error al guardar el reporte de ventas:", error);
    }
  };

  const actualizarCaja = async (id, pagoCliente) => {
    try {
      const docRef = doc(db, "HistorialAperturaCaja", id);
      await updateDoc(docRef, {
        MontoActualCaja: dataCaja.MontoActualCaja + calcularTotal(),
        TotalVentas: dataCaja.TotalVentas + calcularTotal(),
        TotalPagado: dataCaja.TotalPagado + parseInt(pagoCliente),
        TotalCambio: dataCaja.TotalCambio + change,
        TotalGanancias: dataCaja.TotalGanancias + calcularGanancias(),
      });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }

  // ---------------------- G  U  A  R  D  A  D  O -------------------------------------F
  const confirmRegistrarVenta = () => {
    form.validateFields()
      .then(values => {
        UpdateProductos();
        guardarReporteVentas(values.pagoCliente);
        message.success('Se ha registrado la venta de los productos correctamente.');
        setModalVisible(false);
        recargarTablaProductos();
        actualizarCaja(dataCaja.id, values.pagoCliente);
      })
      .catch(info => {
        console.log('Validation Failed:', info);
      });
  };


  const recargarTablaProductos = async () => {
    const querySnapshot = await getDocs(collection(db, "ListaProductos"));
    const dataList = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      cantidadRespaldo: doc.data().Cantidad,
      cantidadIncrementada: 0,
      cantidadCarrito: 0,
    }));
    setDataFirebase(dataList);
    setValorCarrito(0);

    const docRef = doc(db, "HistorialAperturaCaja", idCaja);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = { ...docSnap.data(), id: docSnap.id };
      setDataCaja(data)
    } else {
      console.log("No existe el docuemnto!");
    }
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

    const fetchData2 = async () => {
      const docRef = doc(db, "HistorialAperturaCaja", idCaja);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { ...docSnap.data(), id: docSnap.id };
        setDataCaja(data)
      } else {
        console.log("No such document!");
      }
    };
    fetchData2();
    estadoCarrito();
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

  const calcularGanancias = () => {
    let total = 0;
    dataFirebase.forEach((producto) => {
      if (producto.cantidadCarrito > 0) {
        total += producto.Precio*producto.cantidadIncrementada - producto.PrecioCompra * producto.cantidadIncrementada;
      }
    });
    return total;
  };

  const obtenerFechaHoraActual = () => {
    const ahora = new Date();

    const dia = ahora.getDate().toString().padStart(2, '0');
    const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
    const año = ahora.getFullYear();
    const hora = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const segundos = ahora.getSeconds().toString().padStart(2, '0');

    const tiempo = {
      fecha: `${año}-${mes}-${dia}`,
      hora: `${hora}:${minutos}:${segundos}`
    };

    return tiempo;
  };

  const generarReporte = () => {
    let contenidoReporte = `Monto en caja: ${dataCaja.MontoActualCaja ?? '0'}\n\nProducto | Precio unitario | Cantidad | Subtotal\n\n`;
    dataFirebase.forEach((producto) => {
      if (producto.cantidadIncrementada > 0 && producto.cantidadCarrito > 0) {
        contenidoReporte += `${producto.NombreProducto}: ${producto.Precio} Bs x ${producto.cantidadIncrementada} unidades = ${producto.Precio * producto.cantidadIncrementada} Bs\n`;
      }
    });
    contenidoReporte += `\nTotal: ${calcularTotal()} Bs`;
    setReporte(contenidoReporte);
  };
  //console.log(dataFirebase);
  const accionRegistrarVenta = () => {
    if (Object.keys(dataCaja).length > 0) {
      generarReporte();
      setChange(0);
      form.resetFields();
      setModalVisible(true);
    } else {
      message.info("No se realizo la apertura de caja");
    }
  }

  const handleValuesChange = (changedValues, allValues) => {
    const { pagoCliente } = allValues;
    setChange(pagoCliente - calcularTotal());
  };

  useEffect(() => {
    estadoCarrito();
  }, [valorCarrito])

  const estadoCarrito = () => {
    if (valorCarrito > 0) {
      return false;
    } else {
      return true;
    }
  }
  return (
    <>
      <div>
        <h2 className="form-titleIncr">Registrar venta</h2>
        <div className='TituloForm'>
          <Badge count={valorCarrito} showZero>
            <ShoppingCartOutlined style={{ fontSize: '45px' }} />
          </Badge>
          <div className='BotIncrementar'>
            <Button disabled={estadoCarrito()} className='btn-realizar-venta' onClick={accionRegistrarVenta}>Realizar venta</Button>
          </div>
        </div>

        <div className='parentMostrarIncre'>
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


      <Modal
        title="Factura de venta"
        open={modalVisible}
        // onOk={() => confirmRegistrarVenta()}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancelar
          </Button>,
          <Button key="register" type="primary" onClick={confirmRegistrarVenta}>
            Registrar
          </Button>,
          // <BottonPAgoCambio />
        ]}
      >
        <pre>{reporte}</pre>
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          onValuesChange={handleValuesChange}
        // initialValues={initialValues}
        >
          <Form.Item
            name="pagoCliente"
            label="Pago del cliente"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value === undefined || value === null || value === '') {
                    return Promise.reject('Por favor, indique el monto pagado por el cliente.');
                  }
                  if (value >= calcularTotal()) {
                    if ((value - calcularTotal()) <= dataCaja.MontoActualCaja) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('No existe suficiente dinero en caja para dar cambio.');
                    }
                  } else {
                    return Promise.reject('El monto es insuficiente para pagar los productos.');
                  }
                },
              }),
            ]}
          >
            <Input prefix="Bs." type='number' />
          </Form.Item>


          <Form.Item
            label="Cambio a entregar"
          >
            <Input prefix="Bs." type="number" value={change} readOnly />
          </Form.Item>
        </Form>
      </Modal>

    </>
  );
};

export default MostrarProducto;
