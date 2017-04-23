const expect = require('expect.js');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-dom/test-utils');
const Simulate = TestUtils.Simulate;
const Cascader = require('../');
const addressOptions = require('./demoOptions').addressOptions;
const optionsForActiveMenuItems = require('./demoOptions').optionsForActiveMenuItems;

describe('Cascader', () => {
  let instance;
  let div;
  let selectedValue;
  const onChange = function onChange(value) {
    selectedValue = value;
  };

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
    selectedValue = null;
  });

  it('should toggle select panel when click it', (done) => {
    instance = ReactDOM.render(
      <Cascader options={addressOptions} onChange={onChange}>
        <input readOnly />
      </Cascader>
    , div);
    expect(instance.state.popupVisible).not.to.be.ok();
    Simulate.click(ReactDOM.findDOMNode(instance));
    expect(instance.state.popupVisible).to.be.ok();
    Simulate.click(ReactDOM.findDOMNode(instance));
    expect(instance.state.popupVisible).not.to.be.ok();
    done();
  });

  it('should call onChange when finish select', (done) => {
    instance = ReactDOM.render(
      <Cascader options={addressOptions} onChange={onChange}>
        <input readOnly />
      </Cascader>
    , div);
    Simulate.click(ReactDOM.findDOMNode(instance));
    let menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(1);
    const menu1Items = menus[0].querySelectorAll('.rc-cascader-menu-item');
    expect(menu1Items.length).to.be(3);
    expect(selectedValue).not.to.be.ok();

    Simulate.click(menu1Items[0]);
    expect(menu1Items[0].className).to.contain('rc-cascader-menu-item-active');
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(2);
    const menu2Items = menus[1].querySelectorAll('.rc-cascader-menu-item');
    expect(menu2Items.length).to.be(2);
    expect(instance.state.popupVisible).to.be.ok();
    expect(selectedValue).not.to.be.ok();

    Simulate.click(menu2Items[0]);
    expect(menu2Items[0].className).to.contain('rc-cascader-menu-item-active');
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(3);
    const menu3Items = menus[2].querySelectorAll('.rc-cascader-menu-item');
    expect(menu3Items.length).to.be(1);
    expect(instance.state.popupVisible).to.be.ok();
    expect(selectedValue).not.to.be.ok();

    Simulate.click(menu3Items[0]);
    expect(instance.state.popupVisible).not.to.be.ok();
    expect(selectedValue.join(',')).to.be('fj,fuzhou,mawei');
    done();
  });

  it('should has defaultValue', (done) => {
    instance = ReactDOM.render(
      <Cascader
        options={addressOptions}
        defaultValue={['fj', 'fuzhou', 'mawei']}
        onChange={onChange}
      >
        <input readOnly />
      </Cascader>
    , div);
    Simulate.click(ReactDOM.findDOMNode(instance));
    const menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(3);
    const activeMenuItems =
      instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu-item-active');
    expect(activeMenuItems.length).to.be(3);
    expect(activeMenuItems[0].innerHTML).to.be('福建');
    expect(activeMenuItems[1].innerHTML).to.be('福州');
    expect(activeMenuItems[2].innerHTML).to.be('马尾');
    done();
  });

  it('should support expand previous item when hover', (done) => {
    instance = ReactDOM.render(
      <Cascader expandTrigger="hover" options={addressOptions} onChange={onChange}>
        <input readOnly />
      </Cascader>
    , div);
    Simulate.click(ReactDOM.findDOMNode(instance));
    let menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(1);
    const menu1Items = menus[0].querySelectorAll('.rc-cascader-menu-item');
    expect(menu1Items.length).to.be(3);
    expect(selectedValue).not.to.be.ok();

    Simulate.mouseEnter(menu1Items[0]);
    setTimeout(() => {
      expect(menu1Items[0].className).to.contain('rc-cascader-menu-item-active');
      menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
      expect(menus.length).to.be(2);
      const menu2Items = menus[1].querySelectorAll('.rc-cascader-menu-item');
      expect(menu2Items.length).to.be(2);
      expect(instance.state.popupVisible).to.be.ok();
      expect(selectedValue).not.to.be.ok();

      Simulate.mouseEnter(menu2Items[0]);
      setTimeout(() => {
        expect(menu2Items[0].className).to.contain('rc-cascader-menu-item-active');
        menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
        expect(menus.length).to.be(3);
        const menu3Items = menus[2].querySelectorAll('.rc-cascader-menu-item');
        expect(menu3Items.length).to.be(1);
        expect(instance.state.popupVisible).to.be.ok();
        expect(selectedValue).not.to.be.ok();

        Simulate.click(menu3Items[0]);
        expect(instance.state.popupVisible).not.to.be.ok();
        expect(selectedValue.join(',')).to.be('fj,fuzhou,mawei');
        done();
      }, 150);
    }, 150);
  });

  it('should clear active selection when no finish select', (done) => {
    instance = ReactDOM.render(
      <Cascader options={addressOptions}>
        <input readOnly />
      </Cascader>
    , div);
    Simulate.click(ReactDOM.findDOMNode(instance));
    let menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    const menu1Items = menus[0].querySelectorAll('.rc-cascader-menu-item');
    Simulate.click(menu1Items[0]);
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(2);
    Simulate.click(ReactDOM.findDOMNode(instance));
    expect(instance.state.popupVisible).not.to.be.ok();
    Simulate.click(ReactDOM.findDOMNode(instance));
    expect(instance.state.popupVisible).to.be.ok();
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(1);
    done();
  });

  it('should set back to defaultValue when no finish select', (done) => {
    instance = ReactDOM.render(
      <Cascader options={addressOptions} defaultValue={['fj', 'fuzhou', 'mawei']}>
        <input readOnly />
      </Cascader>
    , div);
    Simulate.click(ReactDOM.findDOMNode(instance));
    let menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(3);
    const menu1Items = menus[0].querySelectorAll('.rc-cascader-menu-item');
    Simulate.click(menu1Items[0]);
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(2);
    Simulate.click(ReactDOM.findDOMNode(instance));
    expect(instance.state.popupVisible).not.to.be.ok();
    Simulate.click(ReactDOM.findDOMNode(instance));
    expect(instance.state.popupVisible).to.be.ok();
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(3);
    done();
  });

  it('should set the value on each selection', (done) => {
    instance = ReactDOM.render(
      <Cascader
        options={addressOptions}
        defaultValue={['fj', 'fuzhou', 'mawei']}
        onChange={onChange}
        changeOnSelect
      >
        <input readOnly />
      </Cascader>
    , div);
    Simulate.click(ReactDOM.findDOMNode(instance));
    let menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(3);
    const menu1Items = menus[0].querySelectorAll('.rc-cascader-menu-item');
    Simulate.click(menu1Items[0]);
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(2);
    Simulate.click(ReactDOM.findDOMNode(instance));
    expect(instance.state.popupVisible).not.to.be.ok();
    Simulate.click(ReactDOM.findDOMNode(instance));
    expect(instance.state.popupVisible).to.be.ok();
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(2);
    expect(selectedValue.length).to.be(1);
    expect(selectedValue[0]).to.be('fj');
    done();
  });

  it('should not change value inside when it is a controlled component', (done) => {
    instance = ReactDOM.render(
      <Cascader options={addressOptions} value={['fj']}>
        <input readOnly />
      </Cascader>
    , div);
    Simulate.click(ReactDOM.findDOMNode(instance));
    let menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(2);
    const menu1Items = menus[0].querySelectorAll('.rc-cascader-menu-item');

    Simulate.click(menu1Items[0]);
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(2);
    const menu2Items = menus[1].querySelectorAll('.rc-cascader-menu-item');

    Simulate.click(menu2Items[0]);
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(3);
    const menu3Items = menus[2].querySelectorAll('.rc-cascader-menu-item');

    Simulate.click(menu3Items[0]);
    expect(instance.state.popupVisible).not.to.be.ok();
    Simulate.click(ReactDOM.findDOMNode(instance));
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(instance.state.popupVisible).to.be.ok();
    expect(menus.length).to.be(2);
    done();
  });

  it('should be disabled', (done) => {
    instance = ReactDOM.render(
      <Cascader options={addressOptions} disabled onChange={onChange}>
        <input readOnly />
      </Cascader>
    , div);
    expect(instance.state.popupVisible).not.to.be.ok();
    Simulate.click(ReactDOM.findDOMNode(instance));
    expect(instance.state.popupVisible).not.to.be.ok();
    Simulate.click(ReactDOM.findDOMNode(instance));
    expect(instance.state.popupVisible).not.to.be.ok();
    done();
  });

  it('should not display popup when there is no options', (done) => {
    instance = ReactDOM.render(
      <Cascader options={[]} onChange={onChange}>
        <input readOnly />
      </Cascader>
    , div);
    Simulate.click(ReactDOM.findDOMNode(instance));
    let menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(0);
    Simulate.click(ReactDOM.findDOMNode(instance));
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(0);
    done();
  });

  it('should be unselectable when option is disabled', (done) => {
    const newAddressOptions = [...addressOptions];
    newAddressOptions[0] = {
      ...newAddressOptions[0],
      disabled: true,
    };
    instance = ReactDOM.render(
      <Cascader options={newAddressOptions} onChange={onChange}>
        <input readOnly />
      </Cascader>
    , div);
    Simulate.click(ReactDOM.findDOMNode(instance));
    let menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(1);
    const menu1Items = menus[0].querySelectorAll('.rc-cascader-menu-item');
    expect(menu1Items.length).to.be(3);
    expect(selectedValue).not.to.be.ok();

    Simulate.click(menu1Items[0]);
    expect(menu1Items[0].className).to.contain('rc-cascader-menu-item-disabled');
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(1);
    done();
  });

  it('should have correct active menu items', () => {
    instance = ReactDOM.render(
      <Cascader options={optionsForActiveMenuItems} defaultValue={['1', '2']}>
        <input readOnly />
      </Cascader>
    , div);
    Simulate.click(ReactDOM.findDOMNode(instance));
    const popup = instance.getPopupDOMNode();
    const activeMenuItems = popup.querySelectorAll('.rc-cascader-menu-item-active');
    expect(activeMenuItems.length).to.be(2);
    expect(activeMenuItems[0].innerHTML).to.be('1');
    expect(activeMenuItems[1].innerHTML).to.be('2');
    const menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    const activeMenuItemsInMenu1 = menus[0].querySelectorAll('.rc-cascader-menu-item-active');
    expect(activeMenuItemsInMenu1.length).to.be(1);
  });

  // https://github.com/ant-design/ant-design/issues/5666
  it('should have not change active value when value is not changed', (done) => {
    class Demo extends React.Component {
      state = {
        value: [],
      };

      componentDidMount() {
        this.timeout = setInterval(() => {
          this.setState({
            value: [],
          });
        }, 10);
      }

      componentWillUnmount() {
        clearInterval(this.timeout);
      }

      getPopupDOMNode() {
        return this.cascader.getPopupDOMNode();
      }

      render() {
        return (
          <Cascader
            options={addressOptions}
            value={this.state.value}
            ref={node => { this.cascader = node; }}
          >
            <input readOnly />
          </Cascader>
        );
      }
    }
    instance = ReactDOM.render(<Demo />, div);
    Simulate.click(ReactDOM.findDOMNode(instance));
    let menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(1);
    const menu1Items = menus[0].querySelectorAll('.rc-cascader-menu-item');
    Simulate.click(menu1Items[0]);
    menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
    expect(menus.length).to.be(2);
    setTimeout(() => {
      menus = instance.getPopupDOMNode().querySelectorAll('.rc-cascader-menu');
      expect(menus.length).to.be(2);
      done();
    }, 100);
  });
});
