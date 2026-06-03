import { useState } from "react";
import styles  from '@/components/css/admin/styles.module.css'
import { envs as env } from "@/lib/env";

const FormDataUser = {
  id: "", 
  name: "",
  email: "",
  birthdate: "",
  role: "",
}

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTableSelect, setShowTableSelect] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [dataUser, setDataUser] = useState(FormDataUser);

  const checkUser = async () => {
    setLoading(true);
    try {
      const data = await UFetch({ API_URL: env.serverApi,endPoint: "/user",type: "json"});
      
      if (data.success || Array.isArray(data.data)) {
        const userList = Array.isArray(data.data) ? data.data : [];
        setUsers(userList);
      }
    } catch (err) {
      console.error("Erro ao buscar usuários", err);
    } finally {
      setLoading(false);
    }
  };

  const HandlerEditUser = async (event) => {
    event.preventDefault();
  }

  const HandlerBanUser = async (event) =>{
    event.preventDefault();
  }

  return(
    <div className={styles.userSection}>
      <h2>Gerenciador de Usuários</h2>
      <form onSubmit={checkUser}>

        <button type='submit' className={styles.button}>
                {loading ? 'Carregando...' : 'Procurar Usuarios'}
        </button>
      </form>

      {users.length > 0 && (
        <div>
          <h4>Lista de Usuários:</h4>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} onClick={() => setShowTableSelect(true)} >
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role ? 'Admin' : 'User'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div hidden={!showTableSelect}> 
        <button>Editar Usuario</button>
        <button>Banir Usuario</button>
      </div>
    </div>
  );
}