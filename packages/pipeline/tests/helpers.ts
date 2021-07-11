import Monitor from '../src/Monitor';
import Pipeline from '../src/Pipeline';
import WorkUnit from '../src/WorkUnit';

let events: unknown[][] = [];

beforeEach(() => {
	events = [];
});

export function monitorEvent(name: string) {
	return (...args: unknown[]) => {
		events.push([
			name,
			args.map((arg) => {
				if (arg instanceof WorkUnit || arg instanceof Pipeline) {
					return arg.id;
				}

				return arg;
			}),
		]);
	};
}

export function createMonitor() {
	const monitor = new Monitor();

	monitor.onPipelineAfterRun.listen(monitorEvent('onAfterRun'));
	monitor.onPipelineBeforeRun.listen(monitorEvent('onBeforeRun'));
	monitor.onPipelineRunWorkUnit.listen(monitorEvent('onRunWorkUnit'));
	monitor.onWorkUnitFail.listen(monitorEvent('onFail'));
	monitor.onWorkUnitPass.listen(monitorEvent('onPass'));
	monitor.onWorkUnitSkip.listen(monitorEvent('onSkip'));
	monitor.onWorkUnitRun.listen(monitorEvent('onRun'));

	return monitor;
}

export function getMonitoredEvents() {
	return [...events];
}
