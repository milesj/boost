import { Context } from '../src/Context';
import { Monitor } from '../src/Monitor';
import { Task } from '../src/Task';
import { WaterfallPipeline } from '../src/WaterfallPipeline';
import { createMonitor, getMonitoredEvents } from './helpers';
import { describe, beforeEach, it, expect } from 'vitest';

describe('Monitor', () => {
	let monitor: Monitor;

	beforeEach(() => {
		monitor = createMonitor();
	});

	it('captures a failed work unit', async () => {
		const pipeline = new WaterfallPipeline(new Context(), 123).pipe('Action', () => {
			throw new Error('Failure');
		});

		try {
			await pipeline.monitor(monitor).run();
		} catch {
			// Skip
		}

		expect(getMonitoredEvents()).toEqual([
			['onBeforeRun', ['pipeline[0:0]', 123]],
			['onRunWorkUnit', ['pipeline[0:0]', 'work[0:0]', 123]],
			['onRun', ['work[0:0]', 123]],
			['onFail', ['work[0:0]', new Error('Failure'), 123]],
		]);
	});

	it('captures a skipped work unit', async () => {
		const pipeline = new WaterfallPipeline(new Context(), 123).pipe(
			new Task('Action', (context, input: number) => 456).skip(true),
		);

		await pipeline.monitor(monitor).run();

		expect(getMonitoredEvents()).toEqual([
			['onBeforeRun', ['pipeline[0:0]', 123]],
			['onRunWorkUnit', ['pipeline[0:0]', 'work[0:0]', 123]],
			['onRun', ['work[0:0]', 123]],
			['onSkip', ['work[0:0]', 123]],
			['onAfterRun', ['pipeline[0:0]']],
		]);
	});
});
