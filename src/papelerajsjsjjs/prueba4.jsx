// src/components/UpdateData.js
import React, { useState } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../FireBase/fireBase';

const UpdateData = ({ id }) => {
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "yourCollection", id);
    try {
      await updateDoc(docRef, {
        field1,
        field2
      });
      console.log("Document updated");
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <input type="text" value={field1} onChange={(e) => setField1(e.target.value)} placeholder="Field 1" />
      <input type="text" value={field2} onChange={(e) => setField2(e.target.value)} placeholder="Field 2" />
      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateData;
