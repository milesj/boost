import Reporter from '../Reporter';
import Routine from '../Routine';

export default class CIReporter extends Reporter {
  routineCount: number = 0;

  taskCount: number = 0;

  bootstrap() {
    super.bootstrap();

    this.console.disable();
    this.console.onStop.listen(this.handleStop);
    this.console.onRoutine.listen(this.handleRoutine);
    this.console.onTask.listen(this.handleTask);
  }

  handleRoutine = (routine: Routine<any, any>) => {
    this.routineCount += 1;
    this.console.out('.');

    routine.onFail.listen(this.handleRoutineFail);
    routine.onPass.listen(this.handleRoutinePass);
    routine.onSkip.listen(this.handleRoutineSkip);
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
