import { describe, expect, it } from 'vitest';
import { createWorkUnit } from '../src/createWorkUnit';
import { Routine } from '../src/Routine';
import { Task } from '../src/Task';
import { WorkUnit } from '../src/WorkUnit';

describe('createWorkUnit()', () => {
	class TestRoutine extends Routine<string, string, {}> {
		blueprint() {
			return {};
		}

		async execute() {
			return '';
		}
	}

	class TestWork extends WorkUnit<{}, string, string> {
		blueprint() {
			return {};
		}

		async execute() {
			return '';
		}
	}

	it('returns a `Routine`', () => {
		const routine = new TestRoutine('key', 'title');

		expect(createWorkUnit(routine)).toBe(routine);
	});

	it('returns a `Task`', () => {
		const task = new Task('title', (value) => value);

		expect(createWorkUnit(task)).toBe(task);
	});

	it('returns a custom `WorkUnit`', () => {
		const work = new TestWork('title', (ctx, value) => value);

		expect(createWorkUnit(work)).toBe(work);
	});

	it('returns a `Task` when a function is provided', () => {
		const action = (value: string) => value;
		const work = createWorkUnit('title', action);

		expect(work).toBeInstanceOf(Task);
		// @ts-expect-error Allow access
		expect(work.action).toBe(action);
	});

	it('errors when a work unit is not provided', () => {
		expect(() => {
			createWorkUnit('title');
		}).toThrow('Unknown work unit type. Must be a `Routine`, `Task`, `WorkUnit`, or function.');
	});

	it('errors when a non-function work unit is not provided', () => {
		expect(() => {
			createWorkUnit(
				'title',
				// @ts-expect-error Invalid type
				123,
			);
		}).toThrow('Unknown work unit type. Must be a `Routine`, `Task`, `WorkUnit`, or function.');
	});
});
