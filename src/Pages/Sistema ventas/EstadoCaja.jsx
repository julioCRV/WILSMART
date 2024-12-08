import React, { useState, useEffect } from 'react';
import { Button, Modal, message, Space } from 'antd';
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import BottonModalIngresoRetiroCaja from './ModalRetiroIngresoCaja';
import BottonModalAperturaCaja from './ModalAperturaCajaEstado';
import { useNavigate } from 'react-router-dom';
import './EstadoCaja.css'

const EstadoCaja = () => {
  const navigate = useNavigate();
  const { confirm } = Modal;
  const [dataCaja, setDataCaja] = useState([]);
  const [dataRetiroIngreso, setDataRetiroIngreso] = useState([]);
  const [respuesta, setRespuesta] = useState("");
  const [nombre, setNombre] = useState("");

  // #region - - - - - - - - - - - - [ Efectos iniciales de carga y dependencias ( useEffects ) ] - - - - - - - - - - - - - - - - - -
  // useEffect principal para cargar datos al montar el componente
  useEffect(() => {
    const idCaja = sessionStorage.getItem('id'); // Obtener el ID de la caja desde el sessionStorage

    setNombre(sessionStorage.getItem('nombre')); // Establecer el nombre desde sessionStorage

    if (idCaja != null) {
      // Obtener datos de HistorialAperturaCaja por ID
      const fetchData2 = async () => {
        const docRef = doc(db, "HistorialAperturaCaja", idCaja);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { ...docSnap.data(), id: docSnap.id };
          setDataCaja(data); // Establecer datos de la caja
        } else {
          console.log("No such document!");
        }
      };
      fetchData2();

      // Obtener lista de cambios en caja y filtrarla
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "ListaCambiosCaja"));
        const dataList = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));

        // Filtrar por empleado y ordenar por fecha y hora
        const data = dataList.filter(item => item.IdEmpleado === idCaja);
        const dataF = data.sort((a, b) => {
          const horaA = new Date(`${a.Fecha}T${a.Hora}`);
          const horaB = new Date(`${b.Fecha}T${b.Hora}`);
          return horaB - horaA; // Orden descendente
        });
        setDataRetiroIngreso(dataF); // Establecer datos filtrados y ordenados
      };
      fetchData();
    }

    estadoCerrarCaja(); // Llamar a función para verificar estado de cierre de caja
  }, []); // Ejecutar al montar el componente

  // useEffect para manejar cambios en la respuesta
  useEffect(() => {
    if (respuesta === "si") {
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "HistorialAperturaCaja"));
        const dataList = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));

        // Filtrar cajas abiertas
        const listSeleccionada = dataList.filter(item => item.Estado === true);
        setDataCaja(listSeleccionada); // Establecer datos de la caja seleccionada

        // Guardar ID de la caja seleccionada en sessionStorage
        sessionStorage.setItem('id', listSeleccionada[0].id);
      };
      fetchData();

      estadoCerrarCaja(); // Verificar estado de cierre de caja
      reloadCurrentRoute(); // Recargar ruta actual
    }

    if (respuesta === "sisi") {
      reloadCurrentRoute(); // Recargar ruta actual
    }

    setRespuesta(""); // Reiniciar estado de respuesta
  }, [respuesta]); // Ejecutar cuando cambie `respuesta`
  // #endregion - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


  // #region + + + + + + + + + + + + + [ Métodos ] + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
  // Función para manejar confirmación de acciones
  const confirmacion = (estado) => {
    setRespuesta(estado); // Establece el estado de respuesta
  };

  // Acción para cerrar la caja
  const accionCerrarCaja = async () => {
    const idCliente = sessionStorage.getItem('id'); // Obtener el ID del cliente desde sessionStorage

    try {
      // Actualizar el documento en "HistorialAperturaCaja" para establecer el estado como cerrado
      const docRefHistorial = doc(db, "HistorialAperturaCaja", idCliente);
      await updateDoc(docRefHistorial, {
        Estado: false,
      });

      message.success('Cierre de caja realizado exitosamente.'); // Mensaje de éxito
      sessionStorage.removeItem('id'); // Eliminar ID del cliente de sessionStorage
      reloadCurrentRoute(); // Recargar la ruta actual
    } catch (e) {
      console.error("Error processing request: ", e); // Manejo de errores
    }
  };

  // Función para confirmar el cierre de caja con un modal
  const confirmarCierreCaja = () => {
    confirm({
      title: '¿Estás seguro de cerrar caja?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Cerrar', // Texto del botón de confirmación
      okType: 'danger', // Estilo del botón de confirmación
      cancelText: 'Cancelar', // Texto del botón de cancelación
      onOk() {
        sessionStorage.setItem('nombre', dataCaja.NombreEmpleado); // Guardar el nombre del empleado en sessionStorage
        setNombre(dataCaja.NombreEmpleado); // Actualizar el estado del nombre
        accionCerrarCaja(); // Llamar a la acción de cierre de caja
      },
      onCancel() {
        // Acción al cancelar (vacío en este caso)
      },
    });
  };

  // Verificar el estado de la caja
  const estadoCerrarCaja = () => {
    // Si hay datos en la caja, significa que no está cerrada
    return Object.keys(dataCaja).length === 0; // Devuelve true si la caja está cerrada
  };

  // Recargar la ruta actual
  const reloadCurrentRoute = () => {
    navigate('/sistema-ventas/recargar'); // Navegar a la ruta de recarga
    setTimeout(() => {
      navigate('/sistema-ventas/estado-caja'); // Navegar de vuelta a la vista del estado de caja
    }, 1300); // Esperar 1.3 segundos antes de redirigir
  };
  // #endregion + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + 


  return (
    <>
      <h2 >Estado de caja</h2>
      <p><strong>Nombre encargado caja: </strong>{dataCaja.NombreEmpleado ?? nombre}</p>
      <BottonModalIngresoRetiroCaja confirmacion={confirmacion} dataCaja={dataCaja} />
      <div style={{ textAlign: 'Right', paddingRight: '10%',paddingTop: '10px' }}>
        <Space style={{ paddingBottom: '10px' }}>
          <BottonModalAperturaCaja confirmacion={confirmacion} nombre={nombre} />
          <Button onClick={confirmarCierreCaja} disabled={estadoCerrarCaja()} type='primary'>Cerrar caja</Button>
        </Space>
      </div>

      <div className="parent-caja">

        <div className="div1-caja">
          <div className='row-otro'>
            <span style={{ paddingLeft: '80px', fontSize: '1.3rem', fontWeight: 'bold' }}>
              <img src="/assets/bs.jpg" alt="bs" style={{ paddingRight: '15px', height: '35px', position: 'relative', top: '11px' }} />
              Ventas totales <span style={{ marginLeft: '120px' }}></span> Bs {dataCaja.TotalVentas ?? '0'}
            </span>

            <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
              <img src="/assets/cajero.png" alt="cajero" style={{ paddingRight: '15px', height: '35px', position: 'relative', top: '5px' }} />
              Dinero en caja
            </span>
          </div>
        </div>
        <div className="div2-caja">
          <div className="row">
            <span>Monto inicial de caja </span>
            <span>+ Bs {dataCaja.MontoInicialCaja ?? '0'}</span>
          </div>
          <div className="row">
            <span>Cambio total dado </span>
            <span>- Bs {dataCaja.TotalCambio ?? '0'}</span>
          </div>
          <div className="row">
            <span>Pagado en efectivo</span>
            <span>+ Bs {dataCaja.TotalPagado ?? '0'}</span>
          </div>
          <div className="row">
            <span>Retiro caja </span>
            <span>- Bs {dataCaja.TotalRetiroCaja ?? '0'}</span>
          </div>
          <div className="row">
            <span>Entrada caja </span>
            <span>+ Bs {dataCaja.TotalIngresoCaja ?? '0'}</span>
          </div>
        </div>
        <div className="div3-caja">{dataCaja.MontoActualCaja ?? '0'}</div>

        <div className='div4-caja'>
          <div className='row-otro'>
            <span style={{ paddingLeft: '80px', fontSize: '1.3rem', fontWeight: 'bold' }}>
              <img src="/assets/ganancias.png" alt="ganancias" style={{ paddingRight: '15px', height: '35px', position: 'relative', top: '11px' }} />
              Ganancias <span style={{ marginLeft: '120px' }}></span> Bs {dataCaja.TotalGanancias ?? '0'}
            </span>

            <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
              <img src="/assets/ventas.png" alt="vemtas" style={{ paddingRight: '15px', height: '35px', position: 'relative', top: '5px' }} />
              Ventas
            </span>
          </div>
        </div>
        <div className='div5-caja'>
          <div className="row">
            <span>Pago en efectivo </span>
            <span>+ Bs {dataCaja.TotalPagado ?? '0'}</span>
          </div>
          <div className="row">
            <span>Cambio dado </span>
            <span>- Bs {dataCaja.TotalCambio ?? '0'}</span>
          </div>
        </div>
        <div className='div6-caja'>{dataCaja.TotalVentas ?? '0'}</div>

        <div className="div7-caja">
          <div className='row-otro'>
            <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
              <img src="/assets/ingresar.png" alt="cajero" style={{ paddingRight: '15px', height: '35px', position: 'relative', top: '5px' }} />
              Dinero ingreso a caja
            </span>
          </div>
        </div>
        <div className='div8-caja'>
          {dataRetiroIngreso.map((item, index) => (
            item.MontoIngreso !== 0 && (
              <div className="row" key={index}>
                <span>{item.Hora} {item.Descripcion}</span>
                <span>+ Bs {item.MontoIngreso}</span>
              </div>
            )
          ))}
        </div>

        <div className='div9-caja'>
          <div className='row-otro'>
            <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
              <img src="/assets/retirar.png" alt="vemtas" style={{ paddingRight: '15px', height: '35px', position: 'relative', top: '5px' }} />
              Dinero retirado de caja
            </span>
          </div>
        </div>
        <div className='div10-caja'>
          {dataRetiroIngreso.map((item, index) => (
            item.MontoRetiro !== 0 && (
              <div className="row" key={index}>
                <span>{item.Hora} {item.Descripcion} </span>
                <span>- Bs {item.MontoRetiro ?? '0'}</span>
              </div>
            )
          ))}
        </div>

      </div>
    </>

  );
};

export default EstadoCaja;
