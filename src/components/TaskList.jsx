import TaskItem from "./TaskItem";

function TaskList({ tasks, deleteTask, toggleComplete, editTask }) {
  return (
    <div>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
          editTask={editTask}
        />
      ))}
    </div>
  );
}
const categoryColors = {
  Trabajo: "#4a90e2",
  Personal: "#7ed321",
  Estudio: "#f5a623",
  Ocio: "#bd10e0",
};
export default TaskList;