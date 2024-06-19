// import React from 'react';

// const ReporteVentas = () => {
//   return (
//     <>
//       <div style={{ marginTop: '8%' }}>
//         <h2>Reporte de ventas</h2>
//       </div>
//     </>
//   );
// };

// export default ReporteVentas;

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../FireBase/fireBase'; // Asegúrate de importar tu configuración de Firebase
import { Card, Row, Col } from 'antd';

const ReporteVentas = () => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "ReportesVentas"));
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      dataList.reverse();
      setReportes(dataList);
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {reportes.map((reporte) => (
          <Col key={reporte.id} span={24}>
            <Card title={`Fecha: ${new Date(reporte.fecha).toLocaleString()}`} bordered={true}>
              {reporte.productos.map((producto, id) => (
                <div key={id} style={{ marginBottom: '10px' }}>
                  <p><strong>Producto:</strong> {producto.NombreProducto}</p>
                  <p><strong>Precio unitario:</strong> {producto.PrecioUnitario} Bs</p>
                  <p><strong>Cantidad inicial:</strong> {producto.CantidadInicial} unidades</p>
                  <p><strong>Cantidad vendida:</strong> {producto.CantidadVendida} unidades</p>
                  <p><strong>Total:</strong> {producto.total} Bs</p>
                </div>
              ))}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ReporteVentas;
