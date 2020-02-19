import { html, fixture, expect } from '@open-wc/testing';


import { MetarWebApp } from './index.js';

describe('metar-web-app', () => {
  it('Make Sure Control Is Not Undefined', async () => {
    const el = /** @type {MetarWebApp} */ (await fixture('<metar-web-app></metar-web-app>'));
    expect(el.metarControl).not.equal(undefined);
  });
});