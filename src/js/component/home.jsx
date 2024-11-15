import React, { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
  const url = "https://playground.4geeks.com/todo";
  const [username, setUsername] = useState("pepeNavarro"); //para hacerlo dinámico
  const [task, setTask] = useState("");
  const [userData, setUserData] = useState({});

  const getDataAsync = async () => {
    //función que trae info del Usuario al front
    try {
      const resp = await fetch(url + "/users/" + username);
      if (resp.status == 404) return createUser();
      if (!resp.ok) throw new Error("something went wrong");
      const data = await resp.json();
      console.log(data);
      setUserData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    //almacenarlo en Task con el formato label/is_done
    e.preventDefault();
    try {
      const resp = await fetch(url + "/todos/" + username, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: task,
          is_done: false,
        }),
      });
      if (!resp.ok) throw new Error("something went wrong adding task");
      const data = await resp.json(); // para tener visión de lo que ocurre
      console.log(data); // para tener visión de lo que ocurre
      getDataAsync();
      setTask("");
    } catch (error) {
      console.error(error);
    }
  };

  const createUser = async () => {
    try {
      const resp = await fetch(url + "/users/" + username, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) throw new Error("something went wrong adding user");
      const data = await resp.json(); // para tener visión de lo que ocurre
      console.log(data); // para tener visión de lo que ocurre
      getDataAsync(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (todo_id) => {
    // necesito un ID (lo dice la API)
    try {
      const resp = await fetch(url + "/todos/" + todo_id, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error("something went wrong deleting task");
      await getDataAsync();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDataAsync();
  }, []);

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setTask(e.target.value)}
          value={task}
          placeholder="¿qué necesitas hacer?"
        />
      </form>
      <ul>
        {userData.todos?.map((el) => (
          <li key={el.id}>
            {" "}
            {el.label}{" "}
            <span className="delete-button" onClick={() => handleDelete(el.id)}>
              X
            </span>{" "}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
