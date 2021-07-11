/* eslint-disable jest/no-standalone-expect */

import { Predicates } from '@boost/common';
import ConcurrentPipeline from '../src/ConcurrentPipeline';
import Context from '../src/Context';
import Routine from '../src/Routine';
import { Runnable } from '../src/types';
import WorkUnit from '../src/WorkUnit';
import { createMonitor, getMonitoredEvents } from './helpers';

describe('ParallelPipeline', () => {
	function log(depth: number, index: number) {
		// console.log(`${depth}:${index}`);
	}

	function testTask(depth: number, index: number) {
		return (ctx: Context, value: string, work: Runnable<string, string>) => {
			log(depth, index);

			if (work instanceof WorkUnit) {
				expect(work.depth).toBe(depth);
				expect(work.index).toBe(index);
			}

			return value;
		};
	}

	class TestHierarchy extends Routine<string, string, { depth: number; index: number }> {
		blueprint({ number }: Predicates) {
			return {
				depth: number(),
				index: number(),
			};
		}

		async execute(ctx: Context, value: string) {
			log(this.depth, this.index);

			expect(this.depth).toBe(this.options.depth);
			expect(this.index).toBe(this.options.index);

			return value;
		}
	}

	it('supports an optional constructor value', () => {
		const pipeline = new ConcurrentPipeline(new Context());

		expect(pipeline.value).toBeUndefined();
	});

	it('properly handles a hierarchy', async () => {
		class OneTwo extends Routine<string, string, {}> {
			blueprint() {
				return {};
			}

			async execute(ctx: Context, value: string) {
				log(this.depth, this.index);

				expect(this.depth).toBe(1);
				expect(this.index).toBe(2);

				await this.createAggregatedPipeline(ctx, value)
					.add('2:0', testTask(2, 0))
					.add('2:1', testTask(2, 1))
					.add('2:2', testTask(2, 2))
					.run();

				return value;
			}
		}

		class ZeroZero extends Routine<string, string, {}> {
			blueprint() {
				return {};
			}

			async execute(ctx: Context, value: string) {
				log(this.depth, this.index);

				expect(this.depth).toBe(0);
				expect(this.index).toBe(0);

				await this.createPooledPipeline(ctx, value)
					.add(new TestHierarchy('1:0', 'Title', { depth: 1, index: 0 }))
					.add(new TestHierarchy('1:1', 'Title', { depth: 1, index: 1 }))
					.add(new OneTwo('1:2', 'Title'))
					.add(new TestHierarchy('1:3', 'Title', { depth: 1, index: 3 }))
					.run();

				return value;
			}
		}

		const pipeline = new ConcurrentPipeline(new Context(), '')
			.add(new ZeroZero('0:0', 'Title'))
			.add(new TestHierarchy('0:1', 'Title', { depth: 0, index: 1 }));

		expect(pipeline.depth).toBe(0);

		await pipeline.monitor(createMonitor()).run();

		expect(getMonitoredEvents().sort()).toEqual(
			[
				['onBeforeRun', ['pipeline[0:0]', '']],
				['onRunWorkUnit', ['pipeline[0:0]', 'work[0:0]', '']],
				['onRun', ['work[0:0]', '']],
				['onBeforeRun', ['pipeline[1:0]', '']],
				['onRunWorkUnit', ['pipeline[1:0]', 'work[1:0]', '']],
				['onRun', ['work[1:0]', '']],
				['onRunWorkUnit', ['pipeline[1:0]', 'work[1:1]', '']],
				['onRun', ['work[1:1]', '']],
				['onRunWorkUnit', ['pipeline[1:0]', 'work[1:2]', '']],
				['onRun', ['work[1:2]', '']],
				['onBeforeRun', ['pipeline[2:0]', '']],
				['onRunWorkUnit', ['pipeline[2:0]', 'work[2:0]', '']],
				['onRun', ['work[2:0]', '']],
				['onRunWorkUnit', ['pipeline[2:0]', 'work[2:1]', '']],
				['onRun', ['work[2:1]', '']],
				['onRunWorkUnit', ['pipeline[2:0]', 'work[2:2]', '']],
				['onRun', ['work[2:2]', '']],
				['onRunWorkUnit', ['pipeline[1:0]', 'work[1:3]', '']],
				['onRun', ['work[1:3]', '']],
				['onRunWorkUnit', ['pipeline[0:0]', 'work[0:1]', '']],
				['onRun', ['work[0:1]', '']],
				['onPass', ['work[1:0]', '']],
				['onPass', ['work[1:1]', '']],
				['onPass', ['work[2:0]', '']],
				['onPass', ['work[2:1]', '']],
				['onPass', ['work[2:2]', '']],
				['onPass', ['work[1:3]', '']],
				['onPass', ['work[0:1]', '']],
				['onAfterRun', ['pipeline[2:0]']],
				['onPass', ['work[1:2]', '']],
				['onAfterRun', ['pipeline[1:0]']],
				['onPass', ['work[0:0]', '']],
				['onAfterRun', ['pipeline[0:0]']],
			].sort(),
		);
	});
});
