// src/App.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../FireBase/fireBase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, addDoc } from 'firebase/firestore';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Recupera las tareas de Firestore cuando el componente se monta
  // useEffect(() => {
  //   const fetchTodos = async () => {
  //     const querySnapshot = await getDocs(collection(db, "ListaEmpleados"));
  //     setTodos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  //     console.log(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  //   };
  //   fetchTodos();
  // }, []);

  // Maneja el registro de usuarios
  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Maneja el inicio de sesión de usuarios
  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // console.log(userCredential.user);
        console.log("Puede ingresar tiene las credenciales");
      })
      .catch((error) => {
        console.error("No puede ingresar credenciales: ",error);
      });
  };

  // Añade una nueva tarea a Firestore
  const addTodo = async () => {
    await addDoc(collection(db, "ListaEmpleados"), { text: newTodo });
    setNewTodo('');
    const querySnapshot = await getDocs(collection(db, "ListaEmpleados"));
    setTodos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };
  

  const transformedTodos = todos.map(todo => ({
    id: todo.id,
    entries: Object.entries(todo).filter(([key, value]) => key !== 'id')
  }));
  
  return (
    <div className='contenedor'>
      <h1>Iniciar sesión</h1>
      <h2>Hola, bienvenido</h2>
      <div>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nombre de usuario" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
        {/* <button onClick={signUp}>Sign Up</button> */}
        <button onClick={signIn}>Ingresar</button>
      </div>

      {/* <div>
        <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="New Todo" />
        <button onClick={addTodo}>Add Todo</button>
        <ul>
        {transformedTodos.map(todo => (
            <li key={todo.id}>
              {todo.entries.map(([key, value]) => (
                <span key={key}>{key}: {value} </span>
              ))}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}

export default App;
