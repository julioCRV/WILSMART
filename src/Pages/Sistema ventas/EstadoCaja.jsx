import Reactm, { useState, useEffect } from 'react';
import { Card, Button, Modal, message, Space } from 'antd';
import { collection, addDoc, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from '../../FireBase/fireBase';
import BottonModalIngresoRetiroCaja from './ModalRetiroIngresoCaja';
import BottonModalAperturaCaja from './ModalAperturaCajaEstado';
import { useNavigate } from 'react-router-dom';
import './EstadoCaja.css'

const EstadoCaja = () => {
  const navigate = useNavigate();
  const { confirm } = Modal;
  const [dataCaja, setDataCaja] = useState([]);
  const [respuesta, setRespuesta] = useState("");
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const idCaja = sessionStorage.getItem('id');

    setNombre(sessionStorage.getItem('nombre'));
    if (idCaja != null) {
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
    }
    estadoCerrarCaja();
  }, []);

  useEffect(() => {
    if (respuesta === "si") {
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "HistorialAperturaCaja"));
        const dataList = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        const listSeleccionada = dataList.filter((item) => item.Estado === true);
        setDataCaja(listSeleccionada);
        sessionStorage.setItem('id', listSeleccionada[0].id);
      };
      fetchData();
      estadoCerrarCaja();
      reloadCurrentRoute();
    }
    if (respuesta === "sisi") {
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "HistorialAperturaCaja"));
        const dataList = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        const listSeleccionada = dataList.filter((item) => item.Estado === true)
        .reduce((obj, item) => {
          obj = { ...item };
          return obj;
        }, {});
        setDataCaja(listSeleccionada);
      };
      fetchData();
      // reloadCurrentRoute();
    }
    setRespuesta("");
  }, [respuesta]);

  const confirmacion = (estado) => {
    setRespuesta(estado);
  };

  const accionCerrarCaja = async () => {
    const idCliente = sessionStorage.getItem('id');
    try {
      // Actualizar documento en la colección "HistorialAperturaCaja"
      const docRefHistorial = doc(db, "HistorialAperturaCaja", idCliente);
      await updateDoc(docRefHistorial, {
        Estado: false
      });
      message.success('Cierre de caja realizado exitosamente.');
      sessionStorage.removeItem('id');
      reloadCurrentRoute();
    } catch (e) {
      console.error("Error processing request: ", e);
    }
  };

  const confirmarCierreCaja = () => {
    confirm({
      title: '¿Estás seguro de cerrar caja?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Cerrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        //console.log('Eliminar:', record);
        sessionStorage.setItem('nombre', dataCaja.NombreEmpleado);
        setNombre(dataCaja.NombreEmpleado);
        accionCerrarCaja();
      },
      onCancel() { },
    });
  };

  const estadoCerrarCaja = () => {
    if (Object.keys(dataCaja).length > 0) {
      return false;
    } else {
      return true;
    }
  }

  const reloadCurrentRoute = () => {
    navigate('/sistema-ventas/recargar');
    setTimeout(() => {
      navigate('/sistema-ventas/estado-caja');
    }, 1000);
  };

  return (
    // <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    //   <Card title="Resumen del Día" style={{ width: 300 }}>
    //     <p><strong>Monto inicial en la caja:</strong> {resumenDia.montoInicial}</p>
    //     <p><strong>Ventas Totales:</strong> {resumenDia.ventasTotales}</p>
    //     <p><strong>Cambio dado:</strong> {resumenDia.cambioDado}</p>
    //     <p><strong>Monto final en la caja:</strong> {resumenDia.montoFinal}</p>
    //   </Card>
    // </div>
    <>
      <h2 >Estado de caja</h2>
      <p><strong>Nombre encargado caja: </strong>{dataCaja.NombreEmpleado ?? nombre}</p>
      <BottonModalIngresoRetiroCaja confirmacion={confirmacion} dataCaja={dataCaja} />
      <div style={{ textAlign: 'Right', paddingRight: '10%' }}>
        <Space style={{paddingBottom: '10px'}}> 
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
          {/* <div className="row">
            <span>Ventas totales </span>
            <span>+ Bs {dataCaja.TotalVentas}</span>
          </div> */}
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
          {/* <div className="row">
            <span>Monto inicial de caja Bs</span>
            <span>{dataCaja.MontoInicialCaja}</span>
          </div> */}
          <div className="row">
            <span>Pago en efectivo </span>
            <span>+ Bs {dataCaja.TotalPagado ?? '0'}</span>
          </div>
          <div className="row">
            <span>Cambio dado </span>
            <span>- Bs {dataCaja.TotalCambio ?? '0'}</span>
          </div>
          {/* <div className="row">
            <span>Ventas totales </span>
            <span>Bs {dataCaja.TotalVentas}</span>
          </div> */}

          {/* <div className="row">
            <span>Retiro caja </span>
            <span>{dataCaja.TotalRetiroCaja}</span>
          </div>
          <div className="row">
            <span>Entrada caja </span>
            <span>{dataCaja.TotalIngresoCaja}</span>
          </div> */}
        </div>
        <div className='div6-caja'>{dataCaja.TotalVentas ?? '0'}</div>

      </div>
    </>

  );
};

export default EstadoCaja;
