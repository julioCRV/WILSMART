import React, { useState } from 'react';
import { Modal } from 'antd';

const Factura = () => {
  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Producto A', precio: 10, cantidad: 2 },
    { id: 2, nombre: 'Producto B', precio: 15, cantidad: 3 },
    // Otros productos...
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reporte, setReporte] = useState('');

  const calcularTotal = () => {
    let total = 0;
    productos.forEach((producto) => {
      total += producto.precio * producto.cantidad;
    });
    return total;
  };

  const generarReporte = () => {
    let contenidoReporte = 'Factura de Venta\n\n';
    productos.forEach((producto) => {
      contenidoReporte += `${producto.nombre}: ${producto.cantidad} x ${producto.precio} = ${producto.precio * producto.cantidad}\n`;
    });
    contenidoReporte += `\nTotal: ${calcularTotal()}`;
    setReporte(contenidoReporte);
  };

  return (
    <div>
      <h1>Factura de Venta</h1>
      <table>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.precio}</td>
              <td>{producto.cantidad}</td>
              <td>{producto.precio * producto.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Total: {calcularTotal()}</h2>
      <button onClick={() => {
        generarReporte();
        setModalVisible(true);
      }}>Registrar Venta</button>
      <Modal
        title="Reporte de Venta"
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
      >
        <pre>{reporte}</pre>
      </Modal>
    </div>
  );
};

export default Factura;
