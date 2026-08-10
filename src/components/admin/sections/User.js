import { useState } from "react";
import styles  from '@/components/css/admin/styles.module.css'
import { envs as env } from "@/lib/env";
import { UFetch } from "@/service/fetch";

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
  const [waningBan, setWaningBan] = useState(false);
  const [dataUser, setDataUser] = useState(FormDataUser);

  const checkUser = async (e) => {
    e.preventDefault();
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
    try{
      const res = await fetch(`${env.serverApi}/user/${dataUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataUser),
      });
      if (!res.ok) {
        throw new Error("Erro ao editar usuário");
      }
    }catch(err){
      console.error("Erro ao editar usuário", err);
    }
  }

  const HandlerBanUser = async (event) =>{
    event.preventDefault();
    try{
      const res = await fetch(`${env.serverApi}/user/${dataUser.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Erro ao banir usuário");
      } else {
        setUsers(users.filter(user => user.id !== dataUser.id));
      }
    }catch(err){
      console.error("Erro ao banir usuário", err);
    }
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
        <button onClick={() => setEditUser(!editUser)}>Editar Usuario</button>
        <button onClick={() => setWaningBan(!waningBan)}>Banir Usuario</button>
      </div>
      <div hidden={!editUser}>
        <h4>Editar Usuario</h4>
        <form onSubmit={HandlerEditUser}>
          <input type="text" placeholder="Nome" value={dataUser.name} onChange={(e) => setDataUser({ ...dataUser, name: e.target.value })} />
          <input type="email" placeholder="Email" value={dataUser.email} onChange={(e) => setDataUser({ ...dataUser, email: e.target.value })} />
          <input type="date" placeholder="Data de Nascimento" value={dataUser.birthdate} onChange={(e) => setDataUser({ ...dataUser, birthdate: e.target.value })} />
          <select value={dataUser.role} onChange={(e) => setDataUser({ ...dataUser, role: e.target.value })}>
            <option value="">Selecione o papel</option>
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
          <button type="submit">Salvar Alterações</button>
        </form>
      </div>
      <div hidden={!waningBan}>
        <h4>Banir Usuario</h4>
        <form onSubmit={HandlerBanUser}>
          <p>Tem certeza que deseja banir o usuário {dataUser.name}?</p>
          <button type="submit">Confirmar Banimento</button>
        </form>
      </div>
    </div>
  );
}