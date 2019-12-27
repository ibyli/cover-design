/* eslint-disable no-undef */
import generator from '../lib/generator';

test('generator({ el: "#canvas", bookName: "醒世姻缘传" }) 返回非空', async () => {
  expect(await generator({ el: '#canvas', bookName: '醒世姻缘传' })).toBeDefined();
});
