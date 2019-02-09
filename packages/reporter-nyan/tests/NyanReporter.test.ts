import { Tool, STATUS_FAILED, STATUS_PASSED, STATUS_PENDING } from '@boost/core';
import { mockTool, mockConsole, mockRoutine, mockTask } from '@boost/test-utils';
import NyanReporter from '../src/NyanReporter';

describe('NyanReporter', () => {
  let reporter: NyanReporter;
  let tool: Tool<any>;

  beforeEach(() => {
    jest.useFakeTimers();

    tool = mockTool();

    reporter = new NyanReporter();
    reporter.console = mockConsole(tool);
    reporter.tool = tool;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('bootstrap()', () => {
    it('binds events', () => {
      const spy = jest.spyOn(reporter.console, 'on');

      reporter.bootstrap();

      expect(spy).toHaveBeenCalledWith('start', expect.anything());
      expect(spy).toHaveBeenCalledWith('stop', expect.anything());
      expect(spy).toHaveBeenCalledWith('routine', expect.anything());
      expect(spy).toHaveBeenCalledWith('routine.pass', expect.anything());
      expect(spy).toHaveBeenCalledWith('routine.fail', expect.anything());
      expect(spy).toHaveBeenCalledWith('task', expect.anything());
    });

    it('generates rainbow data', () => {
      expect(reporter.rainbowWidth).toBe(0);
      expect(reporter.rainbowColors).toEqual([]);

      reporter.bootstrap();

      expect(reporter.rainbowWidth).not.toBe(0);
      expect(reporter.rainbowColors).not.toEqual([]);
    });
  });

  describe('handleStart()', () => {
    it('enqueues an output', () => {
      expect(reporter.console.outputQueue).toEqual([]);

      reporter.handleStart();

      expect(reporter.console.outputQueue).not.toEqual([]);
    });

    it('hides the cursor', () => {
      const spy = jest.spyOn(reporter.console, 'hideCursor');

      reporter.handleStart();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('handleStop()', () => {
    it('sets `failed` flag', () => {
      reporter.handleStop(null);

      expect(reporter.failed).toBe(false);

      reporter.handleStop(new Error());

      expect(reporter.failed).toBe(true);
    });

    it('shows the cursor', () => {
      const spy = jest.spyOn(reporter.console, 'showCursor');

      reporter.handleStop(null);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('handleRoutine()', () => {
    it('sets active routine', () => {
      const routine = mockRoutine(tool);

      expect(reporter.activeRoutine).toBeNull();

      reporter.handleRoutine(routine);

      expect(reporter.activeRoutine).toBe(routine);
    });
  });

  describe('handleTask()', () => {
    it('sets active task', () => {
      const task = mockTask();

      expect(reporter.activeTask).toBeNull();

      reporter.handleTask(task);

      expect(reporter.activeTask).toBe(task);
    });
  });

  describe('getCatFace()', () => {
    it('returns a normal face', () => {
      expect(reporter.getCatFace()).toMatchSnapshot();
    });

    it('returns a cross eyes face when failed', () => {
      reporter.failed = true;

      expect(reporter.getCatFace()).toMatchSnapshot();
    });

    it('returns a cross eyes face when routine is failed', () => {
      reporter.activeRoutine = mockRoutine(tool);
      reporter.activeRoutine!.status = STATUS_FAILED;

      expect(reporter.getCatFace()).toMatchSnapshot();
    });

    it('returns a happy eyes face when routine is passed', () => {
      reporter.activeRoutine = mockRoutine(tool);
      reporter.activeRoutine!.status = STATUS_PASSED;

      expect(reporter.getCatFace()).toMatchSnapshot();
    });

    it('returns an open eyes face when routine is pending', () => {
      reporter.activeRoutine = mockRoutine(tool);
      reporter.activeRoutine!.status = STATUS_PENDING;

      expect(reporter.getCatFace()).toMatchSnapshot();
    });

    it('returns an open eyes face when routine is skipped', () => {
      reporter.activeRoutine = mockRoutine(tool).skip();

      expect(reporter.getCatFace()).toMatchSnapshot();
    });
  });

  describe('increaseRainbowWidth()', () => {
    beforeEach(() => {
      reporter.bootstrap();
    });

    it('increases width each call', () => {
      reporter.increaseRainbowWidth();

      expect(reporter.rainbows).toMatchSnapshot();

      reporter.increaseRainbowWidth();

      expect(reporter.rainbows).toMatchSnapshot();

      reporter.increaseRainbowWidth();

      expect(reporter.rainbows).toMatchSnapshot();
    });

    it('doesnt go past max width', () => {
      reporter.rainbowWidth = 3;
      reporter.increaseRainbowWidth();
      reporter.increaseRainbowWidth();
      reporter.increaseRainbowWidth();
      reporter.increaseRainbowWidth();
      reporter.increaseRainbowWidth();

      expect(reporter.rainbows[0]).toHaveLength(3);
    });
  });

  describe('renderLines()', () => {
    beforeEach(() => {
      reporter.bootstrap();
    });

    it('renders base cat', () => {
      expect(reporter.renderLines()).toMatchSnapshot();
    });

    it('renders with alternative ticks', () => {
      expect(reporter.renderLines()).toMatchSnapshot();
      expect(reporter.renderLines()).toMatchSnapshot();
      expect(reporter.renderLines()).toMatchSnapshot();
      expect(reporter.renderLines()).toMatchSnapshot();
      expect(reporter.renderLines()).toMatchSnapshot();
    });

    it('renders with a routine', () => {
      reporter.activeRoutine = mockRoutine(tool);

      expect(reporter.renderLines()).toMatchSnapshot();
    });

    it('renders with a routine and task', () => {
      reporter.activeRoutine = mockRoutine(tool);
      reporter.activeTask = mockTask();

      expect(reporter.renderLines()).toMatchSnapshot();
    });

    it('doesnt render routine and task when final render', () => {
      reporter.activeRoutine = mockRoutine(tool);
      reporter.activeTask = mockTask();
      // @ts-ignore
      reporter.console.state.final = true;

      expect(reporter.renderLines()).toMatchSnapshot();
    });
  });
});
