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
  clickOption(menuIndex, itemIndex, type = 'click') {
    const menu = this.find('ul.rc-cascader-menu').at(menuIndex);
    const itemList = menu.find('li.rc-cascader-menu-item');

    itemList.at(itemIndex).find('div').first().simulate(type);

    return this;
  },
});
