global.requestAnimationFrame =
  global.requestAnimationFrame ||
  function requestAnimationFrame(cb) {
    return setTimeout(cb, 0);
  };

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

Object.assign(Enzyme.ReactWrapper.prototype, {
  isOpen() {
    return !!this.find('Trigger').props().popupVisible;
  },
  findOption(menuIndex, itemIndex) {
    const menu = this.find('ul.rc-cascader-menu').at(menuIndex);
    const itemList = menu.find('li.rc-cascader-menu-item');

    return itemList.at(itemIndex);
  },
  clickOption(menuIndex, itemIndex, type = 'click') {
    this.findOption(menuIndex, itemIndex).simulate(type);

    return this;
  },
});

window.HTMLElement.prototype.scrollIntoView = jest.fn();

window.MessageChannel = class {
  constructor() {
    const createPort = () => {
      const port = {
        onmessage: null,
        postMessage: message => {
          setTimeout(() => {
            if (port._target && typeof port._target.onmessage === 'function') {
              port._target.onmessage({ data: message });
            }
          }, 0);
        },
        _target: null,
      };
      return port;
    };

    const port1 = createPort();
    const port2 = createPort();
    port1._target = port2;
    port2._target = port1;
    this.port1 = port1;
    this.port2 = port2;
  }
};
