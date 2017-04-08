import TaskResult from '../src/TaskResult';
import { PENDING, RUNNING, SKIPPED, PASSED, FAILED } from '../src/constants';

describe('TaskResult', () => {
  let result;

  beforeEach(() => {
    result = new TaskResult('title', PENDING);
  });

  describe('hasFailed()', () => {
    it('returns a boolean for FAILED status state', () => {
      expect(result.hasFailed()).toBe(false);

      result.status = FAILED;

      expect(result.hasFailed()).toBe(true);
    });
  });

  describe('hasPassed()', () => {
    it('returns a boolean for PASSED status state', () => {
      expect(result.hasPassed()).toBe(false);

      result.status = PASSED;

      expect(result.hasPassed()).toBe(true);
    });
  });

  describe('isPending()', () => {
    it('returns a boolean for PENDING status state', () => {
      expect(result.isPending()).toBe(true);

      result.status = PASSED;

      expect(result.isPending()).toBe(false);
    });
  });

  describe('isRunning()', () => {
    it('returns a boolean for RUNNING status state', () => {
      expect(result.isRunning()).toBe(false);

      result.status = RUNNING;

      expect(result.isRunning()).toBe(true);
    });
  });

  describe('isSkipped()', () => {
    it('returns a boolean for SKIPPED status state', () => {
      expect(result.isSkipped()).toBe(false);

      result.status = SKIPPED;

      expect(result.isSkipped()).toBe(true);
    });
  });

  describe('spinner()', () => {
    it('increases frames each call', () => {
      expect(result.spinner()).toBe('⠙');
      expect(result.spinner()).toBe('⠹');
      expect(result.spinner()).toBe('⠸');
      expect(result.spinner()).toBe('⠼');
    });
  });
});
