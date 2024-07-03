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
  const [dataProductos, setDataProductos] = useState([]);
  const [dataCaja, setDataCaja] = useState([]);
  const [valorCarrito, setValorCarrito] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [reporte, setReporte] = useState('');
  const [valorCambio, setValorCambio] = useState(0);
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
    const updatedProductos = dataProductos.map((producto) => {
      if (producto.id === key) {
        const newNuevaCantidad = producto.cantidadIncrementada + incrementValue;
        const cantidadFinal = Math.min(Math.max(newNuevaCantidad, 0), producto.cantidadRespaldo);
        return { ...producto, cantidadIncrementada: cantidadFinal };
      }
      return producto;
    });
    setDataProductos(updatedProductos);

  };

  const handleQuitar = (key) => {
    const updatedProductos = dataProductos.map((producto) => {
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
    setDataProductos(updatedProductos);
  }

  const handleActualizar = (key) => {
    const updatedProductos = dataProductos.map((producto) => {
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
    setDataProductos(updatedProductos);
    // console.log(updatedProductos);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    //console.log('params', pagination, filters, sorter, extra);
  };

  const actualizarProductos = async () => {
    // mapeamos cada elemento de 'dataProductos' para crear una promesa que actualiza
    // la lista de productos de la base de datos
    const promises = dataProductos.map((item) => {
      // creamos una referencia al documento correspondiente en la "ListaProductos" con el id de cada producto
      // para actualizar el valor de la cantidad de ese producto
      const productRef = doc(db, "ListaProductos", item.id);
      // devolvemos una promesa que actualiza el campo 'Cantidad' de cada producto en la lista de productos si
      // es que existieron modificaciones
      return updateDoc(productRef, { Cantidad: item.Cantidad });
    }).filter(promise => promise !== null); // Filtramos cualquier promesa nulas si es que hubiera

    try {
      // esperamos a que todas las promesas de actualización se completen
      await Promise.all(promises);
      // mostramos un mensaje para comprobar si los productos se actualizaron
      console.log('Todos los productos han sido actualizados.');
    } catch (error) {
      // Si ocurre un error en alguna de las promesas, lo capturamos y lo imprimimos en la consola
      console.error('Error al actualizar los productos:', error);
    }
  };


  const guardarReporteVentas = async (montoPagado) => {
    // filtramos los productos que fueron añadidos al carrito de compra
    const productosVendidos = dataProductos.filter(producto => producto.cantidadCarrito > 0);
    // se obtiene la fecha y hora actual utilizando la función obtenerFechaHoraActual
    const tiempoActual = obtenerFechaHoraActual();
    // se crea el reporte de ventas con toda los siguientes datos:
    const reporte = {
      Fecha: tiempoActual.fecha,
      Hora: tiempoActual.hora,
      NombreEmpleado: dataCaja.NombreEmpleado,
      IdCaja: dataCaja.id,
      // se hace uso de la funcion calcularTotalVentas() y calcularTotalGanancias() para tener ese 
      // valor especificos en el reporte
      TotalVenta: calcularTotalVentas(),
      TotalGanancias: calcularGanancias(),
      PagoCliente: parseInt(montoPagado),
      CambioCliente: valorCambio,
      // se guarda el dinero actual en caja luego de realizar la venta de los productos
      CajaActual: dataCaja.MontoActualCaja + calcularTotalVentas(),
      // se mapea los productos vendidos para agregar la información detallada de cada uno al reporte
      productos: productosVendidos.map(producto => ({
        NombreProducto: producto.NombreProducto,
        CantidadInicial: producto.cantidadRespaldo,
        CantidadVendida: producto.cantidadIncrementada,
        PrecioUnitario: producto.Precio,
        // se calcula y agrega el total de la venta del producto por la cantidad de productos y por el precio
        total: producto.cantidadIncrementada * producto.Precio
      }))
    };

    try {
      // se guarda el reporte de la venta en la lista de "ReportesVentas" en la base de datos
      await addDoc(collection(db, "ReportesVentas"), reporte);
      // si la operación es exitosa, puedo imprimir un mensaje de éxito (comentado)
      console.log("Reporte de ventas guardado con éxito.");
    } catch (error) {
      // si ocurre un error al guardar el reporte, lo capturo y lo imprimo en la consola
      console.error("Error al guardar el reporte de ventas:", error);
    }
  };


  const actualizarCaja = async (id, pagoCliente) => {
    try {
      // se crea una referencia a la lista "HistorialAperturaCaja" con el id proporcionado del prop
      const docRef = doc(db, "HistorialAperturaCaja", id);
      // actualizamos la lista de "HistorialAperturaCaja" solo los campos que se ven a continuación
      await updateDoc(docRef, {
        // se suma el monto actual en la caja con el total de ventas hcechas que se optiene del calcularTotalVentas()
        MontoActualCaja: dataCaja.MontoActualCaja + calcularTotalVentas(),
        // se suma el total de ventas con el total de ventas actual para controlar las ventas netas
        TotalVentas: dataCaja.TotalVentas + calcularTotalVentas(),
        // se suma el total pagado con el pago del cliente convertido a entero para controlar el Total de pagos de clientes
        TotalPagado: dataCaja.TotalPagado + parseInt(pagoCliente),
        // se suma el total de cambio con la variable `valorCambio` que es el cambio que se dio al cliente al realizar la venta
        TotalCambio: dataCaja.TotalCambio + valorCambio,
        // se suma el total de ganancias con el total calculado de ganancias para controlar las ganancias por producto en total
        TotalGanancias: dataCaja.TotalGanancias + calcularGanancias(),
      });
    } catch (e) {
      // capturamos y mostramos cualquier error que ocurra durante la actualización a la lista del historial de apertura de caja
      console.error("Error updating document: ", e);
    }
  }


  // ---------------------- G U A R D A D O  D E  U N A  V E N T A --------------------------------------
  const confirmarRegistroVenta = () => {
    // valida si los inputs del formulario cumplen con las restricciones, 
    // si no muestras las validaciones en el input de pago del cliente
    form.validateFields().then(values => {
      // actualiza los productos una vez realizado una venta
      actualizarProductos();
      // guarda el reporte de venta y se envia como prop el pago del cliente del formulario para guardar en el reporte
      guardarReporteVentas(values.pagoCliente);
      // muestra un mensaje de exito proporcionado de los componente de ant desing
      message.success('Se ha registrado la venta de los productos correctamente.');
      // cambia el estado del modal para ocultarlo una vez se actualize los productos y se genere el reporte de venta
      setModalVisible(false);
      // recarga la lista de productos una vez realizado una compra con datos actualizados
      recargarTablaProductos();
      // se actualiza la caja debido a que como se realizo una venta la caja aumenta con el pago del cliente 
      // se envia dos props para actualizar el id de la caja y el pago que el cliente hizo al realizar la compra
      actualizarCaja(dataCaja.id, values.pagoCliente);
    })
      .catch(info => {
        // se muestra un error si algo salio mal al registrar la venta
        console.log('Validation Failed:', info);
      });
  };


  const recargarTablaProductos = async () => {
    // se obtiene la "ListaProductos" de la base de datos y se agregar los datos a la variable dataListaProductos
    const dataListaProductos = await getDocs(collection(db, "ListaProductos"));
    // se mapea(recorre) la dataListaProductos para crear una lista de productos con campos adicionales
    const dataList = dataListaProductos.docs.map(doc => ({
      ...doc.data(), // se incluye todos los datos del documento
      id: doc.id, // añadimos el id de cada producto
      cantidadRespaldo: doc.data().Cantidad, // se añade un respaldo de  la cantidad original de un producto
      cantidadIncrementada: 0, // añadimos e inicializaos la cantidad que se puede comprar de un producto
      cantidadCarrito: 0, // añadimos e inicializamos para saber si este producto este en el carrito de compras
    }));
    // actualizamos la lista de prooductos con la nueva lista actualizada que es dataList para mostrar en la tabla
    setDataProductos(dataList);
    // se actualizado el valor del carrito en 0
    setValorCarrito(0);
    // se crea una referencia a la lista "HistorialAperturaCaja" usando el id de caja que actualmente nos encontramos
    const docRef = doc(db, "HistorialAperturaCaja", idCaja);
    // esperamos para obtenere la lista antes mencionada para almacenarlo en dataCajaActual
    const dataCajaActual = await getDoc(docRef);
    // se verifica si el documento existe
    if (dataCajaActual.exists()) {
      // si existe, obtenemos los datos del documento y añadimos el id para tener el acceso a caja en todo momento
      const data = { ...dataCajaActual.data(), id: dataCajaActual.id };
      // con el información de data actualizamos los valores de la caja actual
      setDataCaja(data);
    } else {
      // si no existe, imprimes un mensaje en la consola
      console.log("No existe el documento!");
    }
  };


  useEffect(() => {
    const idCajaActual = sessionStorage.getItem('id');
    if(idCajaActual === null){
      window.location.reload();
    }
    const fetchData = async () => {
      const dataListaProductos = await getDocs(collection(db, "ListaProductos"));
      const dataList = dataListaProductos.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        cantidadRespaldo: doc.data().Cantidad,
        cantidadIncrementada: 0,
        cantidadCarrito: 0,
      }));
      // console.log(dataList);
      setDataProductos(dataList);
      setValorCarrito(0)
    };
    fetchData();

    const fetchData2 = async () => {
      const docRef = doc(db, "HistorialAperturaCaja", idCajaActual);
      const dataCajaActual = await getDoc(docRef);

      if (dataCajaActual.exists()) {
        const data = { ...dataCajaActual.data(), id: dataCajaActual.id };
        setDataCaja(data)
      } else {
        console.log("No such document!");
      }
    };
    fetchData2();
    estadoCarrito();
  }, []);

  const calcularTotalVentas = () => {
    let total = 0;
    dataProductos.forEach((producto) => {
      if (producto.cantidadCarrito > 0) {
        total += producto.Precio * producto.cantidadIncrementada;
      }
    });
    return total;
  };

  const calcularGanancias = () => {
    let total = 0;
    dataProductos.forEach((producto) => {
      if (producto.cantidadCarrito > 0) {
        total += producto.Precio * producto.cantidadIncrementada - producto.PrecioCompra * producto.cantidadIncrementada;
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
    dataProductos.forEach((producto) => {
      if (producto.cantidadIncrementada > 0 && producto.cantidadCarrito > 0) {
        contenidoReporte += `${producto.NombreProducto}: ${producto.Precio} Bs x ${producto.cantidadIncrementada} unidades = ${producto.Precio * producto.cantidadIncrementada} Bs\n`;
      }
    });
    contenidoReporte += `\nTotal: ${calcularTotalVentas()} Bs`;
    setReporte(contenidoReporte);
  };
  //console.log(dataProductos);
  const accionRegistrarVenta = () => {
    if (Object.keys(dataCaja).length > 0) {
      generarReporte();
      setValorCambio(0);
      form.resetFields();
      setModalVisible(true);
    } else {
      message.info("No se realizo la apertura de caja");
    }
  }

  const handleValuesChange = (changedValues, allValues) => {
    const { pagoCliente } = allValues;
    setValorCambio(pagoCliente - calcularTotalVentas());
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
            dataSource={dataProductos}
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
        // onOk={() => confirmarRegistroVenta()}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancelar
          </Button>,
          <Button key="register" type="primary" onClick={confirmarRegistroVenta}>
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
                  if (value >= calcularTotalVentas()) {
                    if ((value - calcularTotalVentas()) <= dataCaja.MontoActualCaja) {
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
            <Input prefix="Bs." type="number" value={valorCambio} readOnly />
          </Form.Item>
        </Form>
      </Modal>

    </>
  );
};

export default MostrarProducto;
