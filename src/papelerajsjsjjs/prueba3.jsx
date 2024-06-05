import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../FireBase/fireBase';

const ReadData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "ListaEmpleados"));
      const dataList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      console.log(dataList);
      setData(dataList);
    };
    fetchData();
  }, []);

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>
          <p>ID: {item.id}</p>
          <p>Field 1: {item.Nombre}</p>
          <p>Field 2: {item.FotoEmpleado}</p>
          
        </div>
      ))}
    </div>
  );
};

export default ReadData;
