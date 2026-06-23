import { useState } from "react";

function TaskForm({ addTask }) {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Personal");
  const [priority, setPriority] = useState("Media");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    addTask(input, category, priority);
    setInput("");
    setPriority("Media");
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe una tarea..."
        style={styles.input}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={styles.select}
      >
        <option value="Personal">🏠 Personal</option>
        <option value="Trabajo">💼 Trabajo</option>
        <option value="Estudio">📚 Estudio</option>
        <option value="Ocio">🎮 Ocio</option>
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        style={styles.select}

      >
        <option value="Baja">🟢 Baja</option>
        <option value="Media">🟡 Prioridad media</option>
        <option value="Alta">🔴 Alta</option>
      </select>

      <button style={styles.button}>Agregar</button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
  },
  select: {
    padding: "10px",
  },
  button: {
    padding: "10px",
    cursor: "pointer",
  },
};

export default TaskForm;