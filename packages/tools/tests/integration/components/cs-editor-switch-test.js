import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';
import { get } from '@ember/object';

module('Integration | Component | cs editor switch', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{cs-editor-switch}}`);
    assert.dom('[data-test-cs-editor-switch-icon="false"]').exists('found button');

    await click('[data-test-cs-editor-switch]');
    assert.dom('[data-test-cs-editor-switch-icon="true"]').exists('found button');
  });

  test('clears opened field after switch is off', async function(assert) {
    // Stub tools service
    const toolsStub = Service.extend({
      editing: true,
      openedFieldId: 'some-field',

      setEditing(value) {
        this.editing = value;
      },
      openField(value) {
        this.openedFieldId = value;
      }
    });
    this.owner.register('service:cardstack-tools', toolsStub);

    await render(hbs`{{cs-editor-switch}}`);
    await click('[data-test-cs-editor-switch]');

    assert.notOk(get(toolsStub, 'openedFieldId'), 'The field is cleared');
  });
});
