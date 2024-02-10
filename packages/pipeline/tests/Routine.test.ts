import execa from 'execa';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { Schemas } from '@boost/common/optimal';
import { AggregatedPipeline } from '../src/AggregatedPipeline';
import { ConcurrentPipeline } from '../src/ConcurrentPipeline';
import { STATUS_RUNNING } from '../src/constants';
import { Context } from '../src/Context';
import { PooledPipeline } from '../src/PooledPipeline';
import { Routine } from '../src/Routine';
import { Task } from '../src/Task';
import { WaterfallPipeline } from '../src/WaterfallPipeline';

vi.mock('execa');

describe('Routine', () => {
	class TestRoutine extends Routine<string, string, { test: number }> {
		blueprint({ number }: Schemas) {
			return {
				test: number(),
			};
		}

		async execute() {
			return '';
		}
	}

	let routine: TestRoutine;

	beforeEach(() => {
		routine = new TestRoutine('key', 'title');
	});

	it('errors if no key is provided', () => {
		expect(() => new TestRoutine('', 'title')).toThrowErrorMatchingSnapshot();
	});

	it('errors if key is not a string', () => {
		expect(
			() =>
				new TestRoutine(
					// @ts-expect-error Invalid type
					123,
					'title',
				),
		).toThrowErrorMatchingSnapshot();
	});

	it('sets key', () => {
		routine = new TestRoutine('fooBar', 'title');

		expect(routine.key).toBe('foo-bar');
	});

	it('sets key using an array', () => {
		routine = new TestRoutine(['fooBar', 'baz'], 'title');

		expect(routine.key).toBe('foo-bar:baz');
	});

	it('inherits options', () => {
		routine = new TestRoutine('key', 'title', { test: 123 });

		expect(routine.options).toEqual({ test: 123 });
	});

	it('creates an returns an `AggregatedPipeline`', () => {
		const context = new Context();
		const pipeline = routine.createAggregatedPipeline(context, 123);

		expect(pipeline).toBeInstanceOf(AggregatedPipeline);
		expect(pipeline.context).toBe(context);
		expect(pipeline.value).toBe(123);
	});

	it('creates an returns an `AggregatedPipeline` with optional value', () => {
		const context = new Context();
		const pipeline = routine.createAggregatedPipeline(context);

		expect(pipeline.value).toBeUndefined();
	});

	it('creates an returns an `ConcurrentPipeline`', () => {
		const context = new Context();
		const pipeline = routine.createConcurrentPipeline(context, 123);

		expect(pipeline).toBeInstanceOf(ConcurrentPipeline);
		expect(pipeline.context).toBe(context);
		expect(pipeline.value).toBe(123);
	});

	it('creates an returns an `ConcurrentPipeline` with optional value', () => {
		const context = new Context();
		const pipeline = routine.createConcurrentPipeline(context);

		expect(pipeline.value).toBeUndefined();
	});

	it('creates an returns an `PooledPipeline`', () => {
		const context = new Context();
		const pipeline = routine.createPooledPipeline(context, 123);

		expect(pipeline).toBeInstanceOf(PooledPipeline);
		expect(pipeline.context).toBe(context);
		expect(pipeline.value).toBe(123);
	});

	it('creates an returns an `PooledPipeline` with optional value', () => {
		const context = new Context();
		const pipeline = routine.createPooledPipeline(context);

		expect(pipeline.value).toBeUndefined();
	});

	it('creates an returns an `WaterfallPipeline`', () => {
		const context = new Context();
		const pipeline = routine.createWaterfallPipeline(context, 123);

		expect(pipeline).toBeInstanceOf(WaterfallPipeline);
		expect(pipeline.context).toBe(context);
		expect(pipeline.value).toBe(123);
	});

	it('creates an returns an `WaterfallPipeline` with optional value', () => {
		const context = new Context();
		const pipeline = routine.createWaterfallPipeline(context);

		expect(pipeline.value).toBeUndefined();
	});

	describe('executeCommand()', () => {
		class FakeStream {
			value: string;

			constructor(value: string) {
				this.value = value;
			}

			pipe() {
				return this;
			}

			on(event: string, handler: (line: string) => string) {
				handler(this.value);

				return this;
			}

			toString() {
				return '';
			}
		}

		function mockExeca(value: string) {
			(execa as unknown as Mock).mockImplementation((command, args) => ({
				command: `${command} ${args.join(' ')}`,
				stdout: new FakeStream(value),
				stderr: new FakeStream(value),
			}));
		}

		beforeEach(() => {
			mockExeca('Mocked stream line');
		});

		it('runs a local command', async () => {
			const result = await routine.executeCommand('yarn', ['-v']);

			expect(result).toEqual(expect.objectContaining({ command: 'yarn -v' }));
		});

		it('runs a local command in a shell', async () => {
			const result = await routine.executeCommand('echo', ['boost'], { shell: true });

			expect(execa).toHaveBeenCalledWith('echo', ['boost'], { shell: true });
			expect(result).toEqual(expect.objectContaining({ command: 'echo boost' }));
		});

		it('calls callback with stream', async () => {
			const spy = vi.fn();

			await routine.executeCommand('yarn', ['-v'], { wrap: spy });

			expect(spy).toHaveBeenCalled();
		});

		it('pipes stdout/stderr to handler', async () => {
			const commandSpy = vi.fn();
			const commandDataSpy = vi.fn();
			const task = new Task<string, string>('title', () => '');

			// @ts-expect-error Allow overwrite
			task.status = STATUS_RUNNING;

			routine.onCommand.listen(commandSpy);
			routine.onCommandData.listen(commandDataSpy);

			await routine.executeCommand('yarn', ['-v'], { workUnit: task });

			expect(commandSpy).toHaveBeenCalledWith('yarn', ['-v']);
			expect(commandDataSpy).toHaveBeenCalledWith('yarn', expect.anything());
		});

		it('sets `statusText` on work unit', async () => {
			const task = new Task('title', () => {});

			// @ts-expect-error Allow overwrite
			task.status = STATUS_RUNNING;

			await routine.executeCommand('yarn', ['--help'], { workUnit: task });

			expect(task.statusText).toBe('Mocked stream line');
		});

		it('doesnt set `statusText` when chunk line is empty', async () => {
			mockExeca('');

			const task = new Task('title', () => {});

			// @ts-expect-error Allow overwrite
			task.status = STATUS_RUNNING;
			task.statusText = 'Should not be changed';

			await routine.executeCommand('yarn', ['-v'], { workUnit: task });

			expect(task.statusText).toBe('Should not be changed');
		});

		it('doesnt set `statusText` or `output` on work unit when not running', async () => {
			const task = new Task('title', () => {});

			await routine.executeCommand('yarn', ['-v'], { workUnit: task });

			expect(task.statusText).toBe('');
			expect(task.output).toBeUndefined();
		});
	});
});
