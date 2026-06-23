import { useState, useEffect } from "react";
import { DndContext, useDroppable } from "@dnd-kit/core";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import "./App.css";

function DroppableColumn({ category, children, style, titleStyle }) {
  const { setNodeRef, isOver } = useDroppable({
    id: category,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        outline: isOver ? "3px solid #22c55e" : "none",
      }}
    >
      <h3 style={titleStyle}>{category}</h3>
      {children}
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    const parsed = savedTasks ? JSON.parse(savedTasks) : [];

    return parsed.map(task => ({
      id: task.id || crypto.randomUUID(),
      text: task.text,
      completed: task.completed,
      category: task.category,
      priority: task.priority || "Media",
      createdAt: task.createdAt || new Date().toLocaleDateString(),
    }));
  });

  const [filter, setFilter] = useState("Todas");
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const styles = {
    page: {
      minHeight: "100vh",
      padding: "1px 20px",
      transition: "background 0.3s ease",
    },

    container: {
      maxWidth: "1100px",
      margin: "40px auto",
      fontFamily: "Arial",
      minHeight: "100vh",
      color: darkMode ? "#f5f5f5" : "#111",
    },

    title: {
      textAlign: "center",
      marginBottom: "20px",
      color: darkMode ? "#ffffff" : "#111827",
    },

    themeButton: {
      padding: "10px 14px",
      marginBottom: "15px",
      cursor: "pointer",
      border: "none",
      borderRadius: "8px",
      background: darkMode ? "#facc15" : "#111827",
      color: darkMode ? "#111827" : "#fff",
      fontWeight: "bold",
    },

    stats: {
      display: "flex",
      justifyContent: "space-around",
      marginBottom: "15px",
      padding: "10px",
      background: darkMode ? "#020617" : "#222",
      color: "#fff",
      borderRadius: "8px",
    },

    select: {
      padding: "10px",
      marginBottom: "20px",
    },
    search: {
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
      borderRadius: "8px",
      border: darkMode ? "1px solid #374151" : "1px solid #ccc",
      background: darkMode ? "#020617" : "#ffffff",
      color: darkMode ? "#ffffff" : "#111827",
      fontSize: "14px",
      boxSizing: "border-box",
    },
    board: {
      display: "flex",
      gap: "15px",
      alignItems: "flex-start",
    },

    column: {
      flex: 1,
      background: darkMode ? "#1f2937" : "#d6d3d3",
      borderRadius: "10px",
      padding: "10px",
      minHeight: "300px",
      color: darkMode ? "#f87171" : "#cf0909",
    },

    columnTitle: {
      textAlign: "center",
      marginBottom: "10px",
    },
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter(task => {
  const searchText = search.toLowerCase();

  const matchesCategory =
    filter === "Todas" || task.category === filter;

  const matchesSearch =
    task.text.toLowerCase().includes(searchText) ||
    task.category.toLowerCase().includes(searchText) ||
    task.priority.toLowerCase().includes(searchText);

  return matchesCategory && matchesSearch;
});

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;

  const addTask = (text, category, priority) => {
    const newTask = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      category: category.trim(),
      priority,
      createdAt: new Date().toLocaleDateString(),
    };

    setTasks(prev => [...prev, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const editTask = (id, newText) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  const toggleComplete = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newCategory = over.id;

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, category: newCategory }
          : task
      )
    );
  };
  return (
    <div
      style={{
        ...styles.page,
        background: darkMode ? "#111827" : "#fcf9f9",
      }}
    >
      <div style={styles.container}>
        <h1 style={styles.title}>Gestor de tareas</h1>

        <button
          onClick={() => setDarkMode(prev => !prev)}
          style={styles.themeButton}
        >
          {darkMode ? "☀️ Modo claro" : "🌙 Modo oscuro"}
        </button>

        <TaskForm addTask={addTask} />

        <div style={styles.stats}>
          <span>📋 Total: {totalTasks}</span>
          <span>✅ Hechas: {completedTasks}</span>
          <span>⏳ Pendientes: {pendingTasks}</span>
        </div>
        <input
          type="text"
          placeholder="Buscar tarea..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.select}
        >
          <option value="Todas">Todas</option>
          <option value="Personal">Personal</option>
          <option value="Trabajo">Trabajo</option>
          <option value="Estudio">Estudio</option>
          <option value="Ocio">Ocio</option>
        </select>

        <DndContext onDragEnd={handleDragEnd}>
          <div style={styles.board}>
            {["Personal", "Trabajo", "Estudio", "Ocio"].map(category => (
              <DroppableColumn
                key={category}
                category={category}
                style={styles.column}
                titleStyle={styles.columnTitle}
              >
                {filteredTasks
                  .filter(task => task.category === category)
                  .map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      deleteTask={deleteTask}
                      toggleComplete={toggleComplete}
                      editTask={editTask}
                    />
                  ))}
              </DroppableColumn>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}

export default App;