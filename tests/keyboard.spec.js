const expect = require('expect.js');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const Simulate = TestUtils.Simulate;
const Cascader = require('../');
const addressOptions = require('./demoOptions').addressOptions;
const KeyCode = require('rc-util/lib/KeyCode');

describe('Cascader', () => {
  let instance;
  let div;
  let selectedValue;
  let triggerNode;
  let menus;
  const onChange = (value) => {
    selectedValue = value;
  };

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
    instance = ReactDOM.render(
      <Cascader options={addressOptions} onChange={onChange}>
        <input readOnly />
      </Cascader>
    , div);
    triggerNode = ReactDOM.findDOMNode(instance);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
    selectedValue = null;
    triggerNode = null;
    menus = null;
    instance = null;
  });

  it('should have keyboard support', () => {
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.DOWN });
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(
      instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menus-hidden'
    ).length).to.be(0);
    expect(menus.length).to.be(1);
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.DOWN });
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(2);
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.RIGHT });
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(3);
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.RIGHT });
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(3);
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.LEFT });
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(3);
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.LEFT });
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(2);
    expect(
      instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu-item-active')[0].innerHTML
    ).to.be(addressOptions[0].label);
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.DOWN });
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(2);
    expect(
      instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu-item-active')[0].innerHTML
    ).to.be(addressOptions[1].label);
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.RIGHT });
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.RIGHT });
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.ENTER });
    expect(
      instance.getPopupDOMNode().className.indexOf('rc-cascader-menus-hidden') >= 0
    ).to.be(true);
    expect(selectedValue).to.eql(['zj', 'hangzhou', 'yuhang']);
  });

  it('should have close menu when press some keys', () => {
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.DOWN });
    expect(
      instance.getPopupDOMNode().className.indexOf('rc-cascader-menus-hidden') >= 0
    ).to.be(false);
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.LEFT });
    expect(
      instance.getPopupDOMNode().className.indexOf('rc-cascader-menus-hidden'
    ) >= 0).to.be(true);
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.DOWN });
    expect(
      instance.getPopupDOMNode().className.indexOf('rc-cascader-menus-hidden') >= 0
    ).to.be(false);
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.BACKSPACE });
    expect(
      instance.getPopupDOMNode().className.indexOf('rc-cascader-menus-hidden') >= 0
    ).to.be(true);
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.DOWN });
    expect(
      instance.getPopupDOMNode().className.indexOf('rc-cascader-menus-hidden') >= 0
    ).to.be(false);
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.RIGHT });
    Simulate.keyDown(triggerNode, { keyCode: KeyCode.ESC });
    expect(
      instance.getPopupDOMNode().className.indexOf('rc-cascader-menus-hidden') >= 0
    ).to.be(true);
  });
});
