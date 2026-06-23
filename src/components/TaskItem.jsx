import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";

function TaskItem({ task, deleteTask, toggleComplete, editTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const categoryColors = {
    Trabajo: "#4a90e2",
    Personal: "#7ed321",
    Estudio: "#f5a623",
    Ocio: "#bd10e0",
  };

  const priorityColors = {
    Baja: "#2ecc71",
    Media: "#f1c40f",
    Alta: "#e74c3c",
  };

  const priorityLabels = {
    Baja: "Baja",
    Media: "Prioridad media",
    Alta: "Alta",
  };

  const handleSave = () => {
    if (!newText.trim()) return;

    editTask(task.id, newText);
    setIsEditing(false);
  };

  const handleComplete = () => {
    if (!task.completed) {
      setIsAnimating(true);

      setTimeout(() => {
        setIsAnimating(false);
      }, 450);
    }

    toggleComplete(task.id);
  };

  const handleDelete = () => {
    setIsDeleting(true);

    setTimeout(() => {
      deleteTask(task.id);
    }, 400);
  };

  return (
    <div
      ref={setNodeRef}
      className={`task-item ${isAnimating ? "completed-animation" : ""}`}
      style={{
        ...styles.item,
        background: task.completed ? "#123524" : "#000",
        opacity: isDeleting ? 0 : isDragging ? 0.6 : 1,
        transform: isDeleting
          ? "translateX(60px) scale(0.85)"
          : transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : "translateX(0) scale(1)",
        zIndex: isDragging ? 20 : "auto",
      }}
    >
      <div style={styles.content}>
        {isEditing ? (
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
        ) : (
          <>
            <div style={styles.topLine}>
              <span
                {...listeners}
                {...attributes}
                style={styles.dragHandle}
              >
                ⋮⋮
              </span>

              <span
                style={{
                  ...styles.text,
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed
                    ? "#888"
                    : categoryColors[task.category] || "#fff",
                  fontWeight: "bold",
                }}
              >
                {task.text}
              </span>
            </div>

            <div style={styles.category}>
              {task.category === "Trabajo" && "💼 Trabajo"}
              {task.category === "Estudio" && "📚 Estudio"}
              {task.category === "Personal" && "🏠 Personal"}
              {task.category === "Ocio" && "🎮 Ocio"}
            </div>

            {task.createdAt && (
              <div style={styles.date}>Creada: {task.createdAt}</div>
            )}

            <div
              translate="no"
              style={{
                ...styles.priority,
                background: priorityColors[task.priority] || "#777",
              }}
            >
              {priorityLabels[task.priority] || "Prioridad media"}
            </div>
          </>
        )}
      </div>

      <div style={styles.actions}>
        {isEditing ? (
          <button onClick={handleSave}>💾</button>
        ) : (
          <button onClick={() => setIsEditing(true)}>✏️</button>
        )}

        <button onClick={handleComplete}>✅</button>
        <button onClick={handleDelete}>❌</button>
      </div>
    </div>
  );
}

const styles = {
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    background: "#000",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    transition: "opacity 0.4s ease, background 0.25s ease",
    position: "relative",
    touchAction: "none",
  },

  content: {
    flex: 1,
  },

  topLine: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  dragHandle: {
    cursor: "grab",
    color: "#999",
    fontWeight: "bold",
    userSelect: "none",
    touchAction: "none",
  },

  text: {
    display: "inline-block",
  },

  category: {
    fontSize: "12px",
    marginTop: "5px",
    color: "#aaa",
  },

  date: {
    fontSize: "11px",
    marginTop: "4px",
    color: "#bbb",
  },

  priority: {
    display: "inline-block",
    marginTop: "6px",
    padding: "3px 8px",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "bold",
  },

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
};

export default TaskItem;