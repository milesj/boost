import { mockConsole, mockTool } from '@boost/test-utils';
import ProgressOutput from '../../src/outputs/ProgressOutput';
import Console from '../../src/Console';

jest.mock('term-size', () => () => ({ columns: 50 }));

class TestProgressOutput extends ProgressOutput {
  testStart() {
    this.onStart();
  }

  testFirst() {
    this.onFirst();
  }

  testLast() {
    this.onLast();
  }

  testRender() {
    return this.toString(this.renderer());
  }
}

const oldDateNow = Date.now;

describe('ProgressOutput', () => {
  let output: TestProgressOutput;
  let cli: Console;

  beforeEach(() => {
    cli = mockConsole(mockTool());
    cli.render = jest.fn();

    output = new TestProgressOutput(cli, () => ({
      current: 25,
      total: 100,
    }));

    Date.now = () => 123;
  });

  afterEach(() => {
    Date.now = oldDateNow;
  });

  describe('onStart()', () => {
    it('marks as concurrent', () => {
      expect(output.isConcurrent()).toBe(false);

      output.testStart();

      expect(output.isConcurrent()).toBe(true);
    });
  });

  describe('onFirst()', () => {
    it('sets start time', () => {
      expect(output.startTime).toBe(0);

      output.testFirst();

      expect(output.startTime).not.toBe(0);
    });
  });

  describe('onLast()', () => {
    it('sets stop time', () => {
      expect(output.stopTime).toBe(0);

      output.testLast();

      expect(output.stopTime).not.toBe(0);
    });
  });

  describe('toString()', () => {
    it('renders with default params', () => {
      expect(output.testRender()).toMatchSnapshot();
    });

    it('marks as final when current hits total', () => {
      output = new TestProgressOutput(cli, () => ({
        current: 100,
        total: 100,
      }));

      output.testRender();

      expect(output.isFinal()).toBe(true);
    });

    it('renders classic style with elapsed time', () => {
      output = new TestProgressOutput(cli, () => ({
        current: 66,
        total: 100,
        style: 'classic',
        template: '{bar} | {elapsed} elapsed',
      }));

      expect(output.testRender()).toMatchSnapshot();
    });

    it('renders hash style with elapsed time', () => {
      output = new TestProgressOutput(cli, () => ({
        current: 66,
        total: 100,
        style: 'hash',
        template: '{eta} eta / {bar}',
      }));

      expect(output.testRender()).toMatchSnapshot();
    });

    it('renders pipe style with rate', () => {
      output = new TestProgressOutput(cli, () => ({
        current: 22,
        total: 100,
        style: 'pipe',
        template: '{rate} bps / {bar}',
      }));

      expect(output.testRender()).toMatchSnapshot();
    });

    it('renders square style with everything', () => {
      output = new TestProgressOutput(cli, () => ({
        current: 22,
        total: 100,
        style: 'square',
        template: '{bar} {percent} {progress} {elapsed} {eta} {rate}',
      }));

      expect(output.testRender()).toMatchSnapshot();
    });

    it('renders red when below 45 and color enabled', () => {
      output = new TestProgressOutput(cli, () => ({
        color: true,
        current: 15,
        total: 100,
        style: 'square',
        template: '{bar}',
      }));

      expect(output.testRender()).toMatchSnapshot();
    });

    it('renders yellow when above 45 and color enabled', () => {
      output = new TestProgressOutput(cli, () => ({
        color: true,
        current: 75,
        total: 100,
        style: 'square',
        template: '{bar}',
      }));

      expect(output.testRender()).toMatchSnapshot();
    });

    it('renders gren when above 90 and color enabled', () => {
      output = new TestProgressOutput(cli, () => ({
        color: true,
        current: 95,
        total: 100,
        style: 'square',
        template: '{bar}',
      }));

      expect(output.testRender()).toMatchSnapshot();
    });

    it('doesnt show incomplete progress when transparent is enabled', () => {
      output = new TestProgressOutput(cli, () => ({
        current: 50,
        total: 100,
        template: '{bar}',
        transparent: true,
      }));

      expect(output.testRender()).toMatchSnapshot();
    });
  });
});
