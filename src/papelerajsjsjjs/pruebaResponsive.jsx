import React from 'react';
import { Table, Button, Space, Modal } from 'antd';

const { confirm } = Modal;

const App = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Actions',
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

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
    },
  ];

  const showDetails = (record) => {
    Modal.info({
      title: 'Detalles del Registro',
      content: (
        <div>
          <p>Name: {record.name}</p>
          <p>Age: {record.age}</p>
        </div>
      ),
      onOk() {},
    });
  };

  const editRecord = (record) => {
    console.log('Editar:', record);
    // Aquí puedes implementar la lógica para editar el registro
  };

  const confirmDelete = (record) => {
    confirm({
      title: '¿Estás seguro de eliminar este registro?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        console.log('Eliminar:', record);
        // Aquí puedes implementar la lógica para eliminar el registro
      },
      onCancel() {},
    });
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      showSorterTooltip={{
        target: 'sorter-icon',
      }}
    />
  );
};

export default App;
