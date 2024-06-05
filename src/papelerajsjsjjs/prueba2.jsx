// src/components/CreateData.js
import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../FireBase/fireBase';

const CreateData = () => {
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "ListaEmpleados"), {
        field1,
        field2
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={field1} onChange={(e) => setField1(e.target.value)} placeholder="Field 1" />
      <input type="text" value={field2} onChange={(e) => setField2(e.target.value)} placeholder="Field 2" />
      <button type="submit">Add</button>
    </form>
  );
};

export default CreateData;
