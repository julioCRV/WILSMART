import { Table, Button, InputNumber, Badge, Modal, message, Space, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './MostrarProducto.css'

const MostrarProducto = () => {
  const [form] = Form.useForm();
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

  // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - -
  // --> useEffect que se ejecuta cuando el componente se monta (por la dependencia vacía [])
  useEffect(() => {
    // Obtiene el id de la caja actual desde sessionStorage
    const idCajaActual = sessionStorage.getItem('id');

    // Verifica si el rol guardado en sessionStorage es "administrador" (usado para roles de acceso)
    if (sessionStorage.getItem('saveRol') === 'administrador@gmail.com') {
      // Si es administrador, no hace nada en este bloque
    } else if (idCajaActual === null) {
      // Si no es administrador y el idCajaActual es null, recarga la página
      window.location.reload();
    }

    // Función asíncrona para obtener los productos desde Firestore y actualizar el estado
    const fetchData = async () => {
      // Realiza la consulta a la colección "ListaProductos" en Firestore
      const dataListaProductos = await getDocs(collection(db, "ListaProductos"));
      // Mapea los productos obtenidos y agrega campos adicionales
      const dataList = dataListaProductos.docs.map(doc => ({
        ...doc.data(), // Datos del producto
        id: doc.id, // Agrega el ID del documento
        cantidadRespaldo: doc.data().Cantidad, // Respaldo de la cantidad del producto
        cantidadIncrementada: 0, // Cantidad inicializada a 0 para manejar incrementos
        cantidadCarrito: 0, // Cantidad en el carrito inicialmente a 0
      }));
      // Actualiza el estado con la lista de productos
      setDataProductos(dataList);
      setValorCarrito(0); // Reinicia el valor del carrito
    };
    fetchData(); // Llama la función para obtener los productos

    // Función asíncrona para obtener los datos de la caja actual desde Firestore
    const fetchData2 = async () => {
      const docRef = doc(db, "HistorialAperturaCaja", idCajaActual); // Referencia al documento de la caja
      const dataCajaActual = await getDoc(docRef); // Obtiene los datos de la caja

      if (dataCajaActual.exists()) {
        const data = { ...dataCajaActual.data(), id: dataCajaActual.id }; // Extrae los datos y agrega el id
        setDataCaja(data); // Actualiza el estado con los datos de la caja
      } else {
        console.log("No such document!"); // Si no existe el documento, muestra mensaje de error
      }
    };
    fetchData2(); // Llama la función para obtener los datos de la caja

    // Llama la función para actualizar el estado del carrito
    estadoCarrito();
  }, []); // Este useEffect se ejecuta solo una vez al montar el componente

  // --> useEffect que se ejecuta cada vez que el valor del carrito cambia
  useEffect(() => {
    estadoCarrito(); // Llama a la función estadoCarrito para actualizar el estado del carrito
  }, [valorCarrito]); // Dependencia de valorCarrito para que se ejecute cada vez que cambia
  // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


  // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
  // Función que maneja el incremento de la cantidad de un producto
  const handleIncrement = (key, incrementValue) => {
    // Mapea todos los productos y busca el producto con el id correspondiente
    const updatedProductos = dataProductos.map((producto) => {
      if (producto.id === key) {
        // Calcula la nueva cantidad incrementada sumando el valor proporcionado
        const newNuevaCantidad = producto.cantidadIncrementada + incrementValue;
        // Asegura que la nueva cantidad esté dentro del rango permitido: entre 0 y la cantidad de respaldo
        const cantidadFinal = Math.min(Math.max(newNuevaCantidad, 0), producto.cantidadRespaldo);
        // Devuelve el producto actualizado con la nueva cantidad incrementada
        return { ...producto, cantidadIncrementada: cantidadFinal };
      }
      return producto; // Si el id no coincide, devuelve el producto sin cambios
    });
    // Actualiza el estado con la lista de productos modificada
    setDataProductos(updatedProductos);
  };

  // Función que maneja la acción de quitar un producto del carrito
  const handleQuitar = (key) => {
    // Mapea todos los productos y busca el producto con el id correspondiente
    const updatedProductos = dataProductos.map((producto) => {
      if (producto.id === key) {
        // Si hay un valor en el carrito y la cantidad de producto en carrito es mayor que 0
        if (valorCarrito > 0) {
          if (producto.cantidadCarrito > 0) {
            // Decrementa el valor total del carrito
            setValorCarrito((prevCount) => prevCount - 1);
          }
        }
        // Resetea los valores del producto a su cantidad de respaldo y limpia el carrito
        return { ...producto, Cantidad: parseInt(producto.cantidadRespaldo), cantidadIncrementada: 0, cantidadCarrito: 0 };
      }
      return producto; // Si el id no coincide, devuelve el producto sin cambios
    });
    // Actualiza el estado con la lista de productos modificada
    setDataProductos(updatedProductos);
  };

  // Función que maneja la actualización de la cantidad de un producto en el carrito
  const handleActualizar = (key) => {
    // Mapea todos los productos y busca el producto con el id correspondiente
    const updatedProductos = dataProductos.map((producto) => {
      if (producto.id === key) {
        // Si la cantidad incrementada es 0 (producto no tiene incremento), ajusta el producto
        if (producto.cantidadIncrementada === 0) {
          // Si no hay nada en el carrito y el valor del carrito es 0, no hace nada
          if (producto.cantidadCarrito === 0) {
            if (valorCarrito === 0) {
              setValorCarrito(0); // Se asegura de que el valor del carrito sea 0
            }
          } else {
            // Si ya hay algo en el carrito, decrementa el valor del carrito
            setValorCarrito((prevCount) => prevCount - 1);
          }
          // Actualiza la cantidad del producto y ajusta su cantidad en carrito
          return {
            ...producto,
            Cantidad: parseInt(producto.cantidadRespaldo) - producto.cantidadIncrementada, // Restar la cantidad incrementada al producto
            cantidadCarrito: producto.cantidadIncrementada // Establecer la cantidad en carrito
          };
        } else {
          // Si la cantidad incrementada no es 0, agrega el producto al carrito y ajusta la cantidad
          if (producto.cantidadCarrito === 0) {
            // Si el carrito estaba vacío, incrementa el valor del carrito
            setValorCarrito((prevCount) => prevCount + 1);
          }
          // Actualiza la cantidad del producto y ajusta su cantidad en carrito
          return {
            ...producto,
            Cantidad: parseInt(producto.cantidadRespaldo) - producto.cantidadIncrementada,
            cantidadCarrito: producto.cantidadIncrementada
          };
        }
      }
      return producto; // Si el id no coincide, devuelve el producto sin cambios
    });
    // Actualiza el estado con la lista de productos modificada
    setDataProductos(updatedProductos);
  };

  // Función que maneja los cambios de la tabla (paginación, filtros, orden)
  const onChange = (pagination, filters, sorter, extra) => {
    //console.log('params', pagination, filters, sorter, extra); // Puedes utilizar esto para depurar los parámetros de la tabla
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

  // función que guarda los reportes de venta de cada producto vendido
  const guardarReporteVentas = async (montoPagado) => {
    // filtramos los productos que fueron añadidos al carrito de compra
    const productosVendidos = dataProductos.filter(producto => producto.cantidadCarrito > 0);
    // se obtiene la fecha y hora actual utilizando la función obtenerFechaHoraActual
    const tiempoActual = obtenerFechaHoraActual();
    // se crea el reporte de ventas con toda los siguientes datos:
    const reporte = {
      Fecha: tiempoActual.fecha,
      Hora: tiempoActual.hora,
      NombreEmpleado: dataCaja.NombreEmpleado || 'Administrador',
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

  // función que actualiza es estado actual de la caja
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
  // función que confirma si el registro de venta es exitoso
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

  // función que actualiza la tabla de productos
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

  // Función que calcula el total de las ventas (sin ganancias)
  const calcularTotalVentas = () => {
    let total = 0;
    // Recorre los productos para sumar el total de las ventas
    dataProductos.forEach((producto) => {
      // Si el producto tiene una cantidad en el carrito mayor a 0, se calcula su subtotal
      if (producto.cantidadCarrito > 0) {
        total += producto.Precio * producto.cantidadIncrementada;
      }
    });
    return total; // Devuelve el total calculado
  };

  // Función que calcula las ganancias netas (ventas menos el costo de compra)
  const calcularGanancias = () => {
    let total = 0;
    // Recorre los productos para sumar las ganancias netas
    dataProductos.forEach((producto) => {
      // Si el producto tiene una cantidad en el carrito mayor a 0, se calcula su ganancia neta
      if (producto.cantidadCarrito > 0) {
        total += producto.Precio * producto.cantidadIncrementada - producto.PrecioCompra * producto.cantidadIncrementada;
      }
    });
    return total; // Devuelve el total de ganancias
  };

  // Función que obtiene la fecha y hora actual
  const obtenerFechaHoraActual = () => {
    const ahora = new Date();

    // Obtiene el día, mes, año, hora, minutos y segundos y los formatea a dos dígitos si es necesario
    const dia = ahora.getDate().toString().padStart(2, '0');
    const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
    const año = ahora.getFullYear();
    const hora = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const segundos = ahora.getSeconds().toString().padStart(2, '0');

    // Retorna un objeto con la fecha y la hora formateadas
    const tiempo = {
      fecha: `${año}-${mes}-${dia}`,
      hora: `${hora}:${minutos}:${segundos}`
    };

    return tiempo;
  };

  // Función para generar un reporte de ventas
  const generarReporte = () => {
    // Inicializa el contenido del reporte con el monto actual en caja y los detalles de los productos
    let contenidoReporte = `Monto en caja: ${dataCaja.MontoActualCaja ?? '0'}\n\nProducto | Precio unitario | Cantidad | Subtotal\n\n`;

    // Recorre los productos para agregar los detalles al reporte
    dataProductos.forEach((producto) => {
      // Si el producto tiene una cantidad en carrito mayor a 0, se agrega al reporte
      if (producto.cantidadIncrementada > 0 && producto.cantidadCarrito > 0) {
        contenidoReporte += `${producto.NombreProducto}: ${producto.Precio} Bs x ${producto.cantidadIncrementada} unidades = ${producto.Precio * producto.cantidadIncrementada} Bs\n`;
      }
    });

    // Agrega el total de las ventas al reporte
    contenidoReporte += `\nTotal: ${calcularTotalVentas()} Bs`;
    // Establece el contenido del reporte en el estado
    setReporte(contenidoReporte);
  };

  // Función que maneja la acción de registrar una venta
  const accionRegistrarVenta = () => {
    // Verifica que se haya realizado la apertura de la caja
    if (Object.keys(dataCaja).length > 0) {
      generarReporte(); // Genera el reporte de ventas
      setValorCambio(0); // Resetea el valor del cambio
      form.resetFields(); // Resetea los campos del formulario
      setModalVisible(true); // Muestra el modal con el reporte
    } else {
      message.info("No se realizo la apertura de caja"); // Muestra un mensaje si no se ha realizado la apertura de caja
    }
  };

  // Función que maneja los cambios de los valores del formulario
  const handleValuesChange = (changedValues, allValues) => {
    const { pagoCliente } = allValues; // Obtiene el valor del pago del cliente
    // Calcula el valor del cambio que debe dar al cliente
    setValorCambio(pagoCliente - calcularTotalVentas());
  };

  // Función que determina si el carrito está vacío o no
  const estadoCarrito = () => {
    // Si el valor total del carrito es mayor a 0, el carrito no está vacío
    if (valorCarrito > 0) {
      return false;
    } else {
      // Si el valor es 0, el carrito está vacío
      return true;
    }
  };
  // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 

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
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancelar
          </Button>,
          <Button key="register" type="primary" onClick={confirmarRegistroVenta}>
            Registrar
          </Button>,
        ]}
      >
        <pre>{reporte}</pre>
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          onValuesChange={handleValuesChange}
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
