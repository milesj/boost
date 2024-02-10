/* eslint-disable @typescript-eslint/require-await */

import { Command } from '../../src';

export class Parent extends Command {
	static override description = 'Description';

	static override path = 'parent';

	async run() {
		return 'parent';
	}
}

export class Child extends Command {
	static override description = 'Description';

	static override path = 'parent:child';

	async run() {
		return 'parent:child';
	}
}

export class GrandChild extends Command {
	static override description = 'Description';

	static override path = 'parent:child:grandchild';

	async run() {
		return 'parent:child:grandchild';
	}
}

export class UnknownChild extends Command {
	static override description = 'Description';

	static override path = 'unknown';

	async run() {
		return 'unknown';
	}
}

export class UnknownGrandChild extends Command {
	static override description = 'Description';

	static override path = 'parent:unknown';

	async run() {
		return 'parent:unknown';
	}
}
