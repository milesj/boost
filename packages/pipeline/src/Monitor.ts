import { BailEvent, Event } from '@boost/event';
import Routine from './Routine';
import { AnyPipeline, AnyWorkUnit } from './types';

export default class Monitor {
	readonly onPipelineAfterRun = new Event<[AnyPipeline]>('after-run');

	readonly onPipelineBeforeRun = new Event<[AnyPipeline, unknown]>('before-run');

	readonly onPipelineRunWorkUnit = new Event<[AnyPipeline, AnyWorkUnit, unknown]>('run-work-unit');

	readonly onWorkUnitFail = new Event<[AnyWorkUnit, Error | null]>('fail');

	readonly onWorkUnitPass = new Event<[AnyWorkUnit, unknown]>('pass');

	readonly onWorkUnitRun = new BailEvent<[AnyWorkUnit, unknown]>('run');

	readonly onWorkUnitSkip = new Event<[AnyWorkUnit, unknown]>('skip');

	monitor(pipeline: AnyPipeline): this {
		pipeline.onAfterRun.listen(() => {
			this.onPipelineAfterRun.emit([pipeline]);
		});

		pipeline.onBeforeRun.listen((input) => {
			this.onPipelineBeforeRun.emit([pipeline, input]);
		});

		pipeline.onRunWorkUnit.listen((workUnit, value) => {
			if (workUnit instanceof Routine) {
				workUnit.setMonitor(this);
			}

			this.onPipelineRunWorkUnit.emit([pipeline, workUnit, value]);

			workUnit.onFail.listen((error) => {
				this.onWorkUnitFail.emit([workUnit, error]);
			});

			workUnit.onPass.listen((output) => {
				this.onWorkUnitPass.emit([workUnit, output]);
			});

			workUnit.onRun.listen((input) => {
				this.onWorkUnitRun.emit([workUnit, input]);
			});

			workUnit.onSkip.listen((input) => {
				this.onWorkUnitSkip.emit([workUnit, input]);
			});
		});

		return this;
	}
}
