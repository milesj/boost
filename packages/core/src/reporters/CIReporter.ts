import Reporter from '../Reporter';

export default class CIReporter extends Reporter {
  routineCount: number = 0;

  taskCount: number = 0;

  blueprint() {
    return {};
  }

  bootstrap() {
    super.bootstrap();

    this.console.disable();
    this.console.onStop.listen(this.handleStop);
    this.console.onRoutine.listen(this.handleRoutine);
    this.console.onTask.listen(this.handleTask);
  }

  handleRoutine = () => {
    this.routineCount += 1;
  };

  handleTask = () => {
    this.taskCount += 1;
  };

  handleStop = () => {
    const msg = this.tool.msg('app:ciRanIn', {
      routineCount: this.routineCount,
      taskCount: this.taskCount,
      time: this.getElapsedTime(this.startTime, this.stopTime, false),
    });

    this.console.out(`\n${msg}\n`);
  };
}
