import React from 'react';
import { Form, Input, Button, DatePicker, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './RegistroEmpleado.css';

const { Option } = Select;

const RegistroEmpleado = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div style={{ marginTop: '8%' }} className="form-container">
      <h2 className="form-title">Registro de empleado</h2>
      <div className='contenedorForm'>
        <Form
          name="registro_empleado"
          layout="vertical"
          onFinish={onFinish}
          className="form-columns"
        >
          <div className="column">
            <Form.Item
              name="nombreCompleto"
              label="Nombre Completo"
              rules={[{ required: true, message: 'Por favor ingrese su nombre completo' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="fechaNacimiento"
              label="Fecha de Nacimiento"
              rules={[{ required: true, message: 'Por favor seleccione su fecha de nacimiento' }]}
            >
              <DatePicker className='full-width'/>
            </Form.Item>
            <Form.Item
              name="ci"
              label="CI"
              rules={[{ required: true, message: 'Por favor ingrese su CI' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="genero"
              label="Género"
              rules={[{ required: true, message: 'Por favor seleccione su género' }]}
            >
              <Select placeholder="Seleccione su género">
                <Option value="Femenino">Femenino</Option>
                <Option value="Masculino">Masculino</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="estadoCivil"
              label="Estado Civil"
              rules={[{ required: true, message: 'Por favor ingrese su estado civil' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="telefono"
              label="Número de Teléfono"
              rules={[{ required: true, message: 'Por favor ingrese su número de teléfono' }]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="column">
            <Form.Item
              name="foto"
              label="Foto de Empleado"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
              rules={[{ required: true, message: 'Por favor suba una foto' }]}
            >
              <Upload name="foto" listType="picture" maxCount={1}>
                <Button icon={<UploadOutlined />}>Examinar</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="email"
              label="Correo Electrónico"
              rules={[
                { type: 'email', message: 'El correo no es válido' },
                { required: true, message: 'Por favor ingrese su correo electrónico' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="puesto"
              label="Puesto o Cargo"
              rules={[{ required: true, message: 'Por favor ingrese su puesto o cargo' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="salario"
              label="Salario"
              rules={[{ required: true, message: 'Por favor ingrese su salario' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="direccion"
              label="Dirección de Domicilio"
              rules={[{ required: true, message: 'Por favor ingrese su dirección de domicilio' }]}
            >
              <Input />
            </Form.Item>
          </div>


        </Form>
      </div>
      <div>
      <div className="button-container">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Registrar
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="default" htmlType="button">
                Cancelar
              </Button>
            </Form.Item>
          </div>
          </div>
    </div>
  );
};

export default RegistroEmpleado;
