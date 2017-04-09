import Task from '../src/Task';

export function createTaskWithStatus(title, status) {
  const task = new Task(title, value => value);
  task.status = status;

  return task;
}
