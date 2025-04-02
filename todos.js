import { PrismaClient } from "@prisma/client";
import chalk from "chalk";



const prisma = new PrismaClient();


class TodoManager {
  static async addTodo({ title, description, status = "todo" }) {
    try {
      const validStatuses = ["todo", "inprogress", "complete"];
      if (!validStatuses.includes(status)) {
        console.log(chalk.red("Invalid status. Use 'todo', 'inprogress', or 'complete'."));
        return;
      }

      const newTodo = await prisma.todo.create({
        data: { title, description, status },
      });

      console.log(chalk.green("Congratulations. You have added a new task."));
      console.log(newTodo);
    } catch (error) {
      console.error(chalk.red("Error! Task not added:"), error.message);
    }
  }

  static async updateTodo({ id, title, description, status }) {
    try {
      const todoExists = await prisma.todo.findUnique({ where: { id } });
      if (!todoExists) {
        console.log(chalk.yellow("Task not found."));
        return;
      }

      const updatedTodo = await prisma.todo.update({
        where: { id },
        data: { title, description, status },
      });

      console.log(chalk.blue("Task update successfull!"));
      console.log(updatedTodo);
    } catch (error) {
      console.error(chalk.red("Error! Task not updated:"), error.message);
    }
  }

  static async readTodos({ id = null }) {
    try {
      if (id) {
        const todo = await prisma.todo.findUnique({ where: { id } });
        if (!todo) {
          console.log(chalk.yellow("Task not found."));
          return;
        }
        console.log(todo);
      } else {
        const todos = await prisma.todo.findMany();
        if (todos.length === 0) {
          console.log(chalk.yellow("No tasks here. Please add."));
          return;
        }
        console.log(todos);
      }
    } catch (error) {
      console.error(chalk.red("Error retrieving tasks:"), error.message);
    }
  }

  static async deleteTodo({ id }) {
    try {
      const todoExists = await prisma.todo.findUnique({ where: { id } });
      if (!todoExists) {
        console.log(chalk.yellow("Task not found."));
        return;
      }

      await prisma.todo.delete({ where: { id } });

      console.log(chalk.red("Task deleted successfully!"));
    } catch (error) {
      console.error(chalk.red("Error deleting task:"), error.message);
    }
  }

  static async deleteAllTodos() {
    try {
      const confirmation = await this.confirmDeleteAll();
      if (!confirmation) return;

      await prisma.todo.deleteMany();
      console.log(chalk.red("All tasks deleted!"));
    } catch (error) {
      console.error(chalk.red("Error deleting all tasks:"), error.message);
    }
  }

  static async confirmDeleteAll() {
    return new Promise((resolve) => {
      process.stdout.write(chalk.yellow("Are you sure you want to delete all tasks? (yes/no): "));
      process.stdin.once("data", (data) => {
        resolve(data.toString().trim().toLowerCase() === "yes");
      });
    });
  }
}

export default TodoManager;
