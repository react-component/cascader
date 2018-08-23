webpackJsonp([11],{

/***/ 189:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(190);


/***/ }),

/***/ 190:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rc_cascader_assets_index_less__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rc_cascader_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rc_cascader_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rc_cascader__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_dom__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable no-console */





var addressOptions = [{
  label: '福建',
  value: 'fj',
  children: [{
    label: '福州',
    value: 'fuzhou',
    children: [{
      label: '马尾',
      value: 'mawei'
    }]
  }, {
    label: '泉州',
    value: 'quanzhou'
  }]
}, {
  label: '浙江',
  value: 'zj',
  children: [{
    label: '杭州',
    value: 'hangzhou',
    children: [{
      label: '余杭',
      value: 'yuhang'
    }]
  }]
}, {
  label: '北京',
  value: 'bj',
  children: [{
    label: '朝阳区',
    value: 'chaoyang'
  }, {
    label: '海淀区',
    value: 'haidian',
    disabled: true
  }]
}];

var svgPath = 'M869 487.8L491.2 159.9c-2.9-2.5-6.6-' + '3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2' + ' 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 ' + '3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2' + ' 14h91.5c1.9 0 3.8-0.7 5.2-2L869 536.2c14.7-12.8' + ' 14.7-35.6 0-48.4z';

var loadingPath = 'M511.4 124C290.5 124.3 112 303 112' + ' 523.9c0 128 60.2 242 153.8 315.2l-37.5 48c-4.1 5.3-' + '0.3 13 6.3 12.9l167-0.8c5.2 0 9-4.9 7.7-9.9L369.8 72' + '7c-1.6-6.5-10-8.3-14.1-3L315 776.1c-10.2-8-20-16.7-2' + '9.3-26-29.4-29.4-52.5-63.6-68.6-101.7C200.4 609 192 ' + '567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-7' + '2.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 ' + '212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.' + '1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.' + '7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.' + '5c-16.1 38.1-39.2 72.3-68.6 101.7-7.5 7.5-15.3 14.5-' + '23.4 21.2-3.4 2.8-3.9 7.7-1.2 11.1l39.4 50.5c2.8 3.5' + ' 7.9 4.1 11.4 1.3C854.5 760.8 912 649.1 912 523.9c0-' + '221.1-179.4-400.2-400.6-399.9z';

var Demo = function (_React$Component) {
  _inherits(Demo, _React$Component);

  function Demo() {
    var _React$createElement, _React$createElement2;

    var _temp, _this, _ret;

    _classCallCheck(this, Demo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      inputValue: '',
      dynamicInputValue: '',
      options: [{
        label: '福建',
        isLeaf: false,
        value: 'fj'
      }, {
        label: '浙江',
        isLeaf: false,
        value: 'zj'
      }]
    }, _this.onChange = function (value, selectedOptions) {
      console.log(value, selectedOptions);
      _this.setState({
        inputValue: selectedOptions.map(function (o) {
          return o.label;
        }).join(', ')
      });
    }, _this.onChangeDynamic = function (value, selectedOptions) {
      console.log(value, selectedOptions);
      _this.setState({
        dynamicInputValue: selectedOptions.map(function (o) {
          return o.label;
        }).join(', ')
      });
    }, _this.expandIcon = __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
      'i',
      null,
      __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
        'svg',
        (_React$createElement = {
          viewBox: '0 0 1024 1024',
          style: { verticalAlign: '-.125em' },
          width: '1em',
          height: '1em',
          fill: 'currentColor'
        }, _React$createElement['style'] = {
          verticalAlign: '-.125em',
          margin: 'auto'
        }, _React$createElement),
        __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement('path', { d: svgPath })
      )
    ), _this.loadingIcon = __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
      'i',
      {
        style: {
          position: 'absolute',
          right: '12px',
          color: '#aaa'
        }
      },
      __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
        'svg',
        (_React$createElement2 = {
          viewBox: '0 0 1024 1024',
          style: { verticalAlign: '-.125em' },
          width: '1em',
          height: '1em',
          fill: 'currentColor'
        }, _React$createElement2['style'] = {
          verticalAlign: '-.125em',
          margin: 'auto'
        }, _React$createElement2),
        __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement('path', { d: loadingPath })
      )
    ), _this.loadData = function (selectedOptions) {
      var targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      // 动态加载下级数据
      setTimeout(function () {
        targetOption.loading = false;
        targetOption.children = [{
          label: targetOption.label + '\u52A8\u6001\u52A0\u8F7D1',
          value: 'dynamic1'
        }, {
          label: targetOption.label + '\u52A8\u6001\u52A0\u8F7D2',
          value: 'dynamic2'
        }];
        _this.setState({
          options: [].concat(_this.state.options)
        });
      }, 1500);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Demo.prototype.render = function render() {
    return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
      'div',
      { style: { padding: '2rem' } },
      __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_1_rc_cascader__["a" /* default */],
        {
          style: { marginBottom: '2rem' },
          options: addressOptions,
          onChange: this.onChange,
          expandIcon: this.expandIcon
        },
        __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement('input', {
          placeholder: 'please select address',
          value: this.state.inputValue
        })
      ),
      __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_1_rc_cascader__["a" /* default */],
        {
          options: this.state.options,
          loadData: this.loadData,
          onChange: this.onChangeDynamic,
          expandIcon: this.expandIcon,
          loadingIcon: this.loadingIcon,
          changeOnSelect: true
        },
        __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement('input', { value: this.state.dynamicInputValue, readOnly: true })
      )
    );
  };

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_2_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_3_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ })

},[189]);
//# sourceMappingURL=custom-arrow-icon.js.map