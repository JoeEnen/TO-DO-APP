import { program } from "commander";
import TodoManager from "./todos.js";

program
  .command("add")
  .description("Add a new todo")
  .requiredOption("-t, --title <title>", "Title of the todo")
  .requiredOption("-d, --description <description>", "Description of the todo")
  .option("-s, --status <status>", "Status of the todo (todo, inprogress, complete)", "todo")
  .action((options) => {
    TodoManager.addTodo({
      title: options.title,
      description: options.description,
      status: options.status,
    });
  });

program
  .command("update")
  .description("Update a todo item")
  .requiredOption("-i, --id <id>", "ID of the todo")
  .option("-t, --title <title>", "New title")
  .option("-d, --description <description>", "New description")
  .option("-s, --status <status>", "New status (todo, inprogress, complete)")
  .action((options) => {
    TodoManager.updateTodo({
      id: parseInt(options.id),
      title: options.title,
      description: options.description,
      status: options.status,
    });
  });

program
  .command("read")
  .description("Read all todos or a specific one")
  .option("-i, --id <id>", "ID of the todo")
  .action((options) => {
    TodoManager.readTodos({
      id: options.id ? parseInt(options.id) : null,
    });
  });

program
  .command("delete")
  .description("Delete a specific todo")
  .requiredOption("-i, --id <id>", "ID of the todo")
  .action((options) => {
    TodoManager.deleteTodo({ id: parseInt(options.id) });
  });

program
  .command("delete-all")
  .description("Delete all todos (requires confirmation)")
  .action(() => {
    TodoManager.deleteAllTodos();
  });

program.parse(process.argv);
