import { PENDING, RUNNING, SKIPPED, FAILED } from '../../src/constants';

export default class MockRenderer {
  render() {
    const output = [];
    const nodes = this.loader();

    nodes.forEach((node) => {
      output.push(...this.renderNode(node, 0));
    });

    return output.join('\n');
  }

  renderNode(node, level) {
    const output = [];
    let message = `${'    '.repeat(level)}${this.renderStatus(node.status)} ${node.title}`;

    if (node.status === SKIPPED) {
      message += ' [skipped]';
    } else if (node.status === FAILED) {
      message += ' [failed]';
    }

    output.push(message);

    // Show only one task at a time
    if (node.tasks && node.tasks.length) {
      let pendingTask;
      let runningTask;
      let failedTask;

      node.tasks.some((task) => {
        switch (task.status) {
          case PENDING:
            pendingTask = task;
            return false;

          case RUNNING:
            runningTask = task;
            return false;

          case FAILED:
            failedTask = task;
            return true;

          default:
            return false;
        }
      });

      const task = failedTask || runningTask || pendingTask;

      if (task) {
        output.push(...this.renderNode(task, level + 1));
      }
    }

    if (node.routines && node.routines.length) {
      node.routines.forEach((routine) => {
        output.push(...this.renderNode(routine, level + 1));
      });
    }

    return output;
  }

  renderStatus(status) {
    return `[${status}]`;
  }

  reset() {}

  start() {}

  stop() {}
}
