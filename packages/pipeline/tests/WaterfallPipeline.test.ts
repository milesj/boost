import Context from '../src/Context';
import Routine from '../src/Routine';
import Task from '../src/Task';
import WaterfallPipeline from '../src/WaterfallPipeline';

describe('WaterfallPipeline', () => {
	it('supports piping action functions and passing a value between each', async () => {
		const pipeline = new WaterfallPipeline(new Context(), 123)
			.pipe('One', (ctx, value) => value * 2)
			.pipe('Two', (ctx, value) => String(value))
			.pipe('Three', (ctx, value) => [value]);

		expect(await pipeline.run()).toEqual(['246']);
	});

	it('supports piping `Task` instances and passing a value between each', async () => {
		const pipeline = new WaterfallPipeline(new Context(), 123)
			.pipe(new Task('One', (ctx, value) => value * 2))
			.pipe(new Task('Two', (ctx, value) => String(value)))
			.pipe(new Task('Three', (ctx, value) => [value]));

		expect(await pipeline.run()).toEqual(['246']);
	});

	it('supports piping `Routine` instances and passing a value between each', async () => {
		class One extends Routine<number, number, {}> {
			blueprint() {
				return {};
			}

			async execute(ctx: Context, value: number) {
				return value * 2;
			}
		}

		class Two extends Routine<string, number, {}> {
			blueprint() {
				return {};
			}

			async execute(ctx: Context, value: number) {
				return String(value);
			}
		}

		class Three extends Routine<string[], string, {}> {
			blueprint() {
				return {};
			}

			async execute(ctx: Context, value: string) {
				return [value];
			}
		}

		const pipeline = new WaterfallPipeline(new Context(), 123)
			.pipe(new One('one', 'One'))
			.pipe(new Two('two', 'Two'))
			.pipe(new Three('three', 'Three'));

		expect(await pipeline.run()).toEqual(['246']);
	});

	it('can define a custom scope for actions', async () => {
		const scope = { test: true };
		const pipeline = new WaterfallPipeline(new Context(), 123).pipe(
			'Scope',
			function scopeAction(ctx, value) {
				// @ts-expect-error
				expect(this).toBe(scope); // eslint-disable-line babel/no-invalid-this

				return value * 2;
			},
			scope,
		);

		expect(await pipeline.run()).toEqual(246);
	});

	it('emits `onRun` and `onFinish`', async () => {
		const action = (ctx: Context, value: number) => value;
		const pipeline = new WaterfallPipeline(new Context(), 123)
			.pipe(new Task('One', action))
			.pipe(new Task('Two', action))
			.pipe(new Task('Three', action));
		const runSpy = jest.fn();
		const finSpy = jest.fn();

		pipeline.onBeforeRun.listen(runSpy);
		pipeline.onAfterRun.listen(finSpy);

		await pipeline.run();

		expect(runSpy).toHaveBeenCalledTimes(1);
		expect(runSpy).toHaveBeenCalledWith(123);
		expect(finSpy).toHaveBeenCalledTimes(1);
	});

	it('emits `onRunWorkUnit` for each work unit', async () => {
		const one = new Task('One', (ctx, value: number) => value);
		const two = new Task('Two', (ctx, value: number) => value * 2);
		const three = new Task('Three', (ctx, value: number) => value * 3);
		const pipeline = new WaterfallPipeline(new Context(), 123).pipe(one).pipe(two).pipe(three);
		const spy = jest.fn();

		pipeline.onRunWorkUnit.listen(spy);

		await pipeline.run();

		expect(spy).toHaveBeenCalledTimes(3);
		expect(spy).toHaveBeenCalledWith(one, 123);
		expect(spy).toHaveBeenCalledWith(two, 123);
		expect(spy).toHaveBeenCalledWith(three, 246);
	});

	it('resolves the initial value when no work units are defined', async () => {
		const pipeline = new WaterfallPipeline(new Context(), 123);

		expect(await pipeline.run()).toBe(123);
	});
});
