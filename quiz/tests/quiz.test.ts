import { describe, it, expect, beforeEach } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>';
});

describe('quiz navigation', () => {
  it('renderStep does not change current step', async () => {
    const { renderStep, getCurrentStep } = await import('../../index.tsx?test=render');
    renderStep('q_financingSource');
    expect(getCurrentStep()).toBe('start');
  });

  it('handleClick updates current step based on button data-next', async () => {
    const { renderStep, handleClick, getCurrentStep } = await import('../../index.tsx?test=click');
    renderStep('start');
    const btn = document.querySelector('button[data-next="q_financingSource"]') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    handleClick({ target: btn } as any as MouseEvent);
    expect(getCurrentStep()).toBe('q_financingSource');
  });
});
