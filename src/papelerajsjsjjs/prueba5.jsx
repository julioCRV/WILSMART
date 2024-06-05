// src/components/DeleteData.js
import React from 'react';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../FireBase/fireBase';

const DeleteData = ({ id }) => {
  const handleDelete = async () => {
    const docRef = doc(db, "yourCollection", id);
    try {
      await deleteDoc(docRef);
      console.log("Document deleted");
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  return (
    <button onClick={handleDelete}>Delete</button>
  );
};

export default DeleteData;
