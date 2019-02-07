import Reporter from '../Reporter';

export default class CIReporter extends Reporter {
  routineCount: number = 0;

  taskCount: number = 0;

  bootstrap() {
    super.bootstrap();

    this.console
      .disable()
      .on('stop', this.handleStop)
      .on('task', this.handleTask)
      .on('routine', this.handleRoutine)
      .on('routine.skip', this.handleRoutineSkip)
      .on('routine.pass', this.handleRoutinePass)
      .on('routine.fail', this.handleRoutineFail);
  }

  handleRoutine = () => {
    this.routineCount += 1;
    this.console.out('.');
  };

  handleRoutineSkip = () => {
    this.console.out(this.style('.', 'warning'));
  };

  handleRoutinePass = () => {
    this.console.out(this.style('.', 'success'));
  };

  handleRoutineFail = () => {
    this.console.err(this.style('.', 'failure'));
  };

  handleTask = () => {
    this.taskCount += 1;
    this.console.out(this.style('.', 'pending'));
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
