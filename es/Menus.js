import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import arrayTreeFilter from 'array-tree-filter';
import { findDOMNode } from 'react-dom';

var Menus = (function(_React$Component) {
  _inherits(Menus, _React$Component);

  function Menus(props) {
    _classCallCheck(this, Menus);

    var _this = _possibleConstructorReturn(
      this,
      (Menus.__proto__ || Object.getPrototypeOf(Menus)).call(this, props),
    );

    _this.saveMenuItem = function(index) {
      return function(node) {
        _this.menuItems[index] = node;
      };
    };

    _this.menuItems = {};
    return _this;
  }

  _createClass(Menus, [
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.scrollActiveItemToView();
      },
    },
    {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        if (!prevProps.visible && this.props.visible) {
          this.scrollActiveItemToView();
        }
      },
    },
    {
      key: 'getFieldName',
      value: function getFieldName(name) {
        var _props = this.props,
          fieldNames = _props.fieldNames,
          defaultFieldNames = _props.defaultFieldNames;
        // 防止只设置单个属性的名字

        return fieldNames[name] || defaultFieldNames[name];
      },
    },
    {
      key: 'getOption',
      value: function getOption(option, menuIndex) {
        var _props2 = this.props,
          prefixCls = _props2.prefixCls,
          expandTrigger = _props2.expandTrigger,
          expandIcon = _props2.expandIcon,
          loadingIcon = _props2.loadingIcon;

        var onSelect = this.props.onSelect.bind(this, option, menuIndex);
        var onItemDoubleClick = this.props.onItemDoubleClick.bind(this, option, menuIndex);
        var expandProps = {
          onClick: onSelect,
          onDoubleClick: onItemDoubleClick,
        };
        var menuItemCls = prefixCls + '-menu-item';
        var expandIconNode = null;
        var hasChildren =
          option[this.getFieldName('children')] && option[this.getFieldName('children')].length > 0;
        if (hasChildren || option.isLeaf === false) {
          menuItemCls += ' ' + prefixCls + '-menu-item-expand';
          if (!option.loading) {
            expandIconNode = React.createElement(
              'span',
              { className: prefixCls + '-menu-item-expand-icon' },
              expandIcon,
            );
          }
        }
        if (expandTrigger === 'hover' && hasChildren) {
          expandProps = {
            onMouseEnter: this.delayOnSelect.bind(this, onSelect),
            onMouseLeave: this.delayOnSelect.bind(this),
            onClick: onSelect,
          };
        }
        if (this.isActiveOption(option, menuIndex)) {
          menuItemCls += ' ' + prefixCls + '-menu-item-active';
          expandProps.ref = this.saveMenuItem(menuIndex);
        }
        if (option.disabled) {
          menuItemCls += ' ' + prefixCls + '-menu-item-disabled';
        }

        var loadingIconNode = null;
        if (option.loading) {
          menuItemCls += ' ' + prefixCls + '-menu-item-loading';
          loadingIconNode = loadingIcon || null;
        }
        var title = '';
        if (option.title) {
          title = option.title;
        } else if (typeof option[this.getFieldName('label')] === 'string') {
          title = option[this.getFieldName('label')];
        }

        return React.createElement(
          'li',
          _extends(
            {
              key: option[this.getFieldName('value')],
              className: menuItemCls,
              title: title,
            },
            expandProps,
          ),
          option[this.getFieldName('label')],
          expandIconNode,
          loadingIconNode,
        );
      },
    },
    {
      key: 'getActiveOptions',
      value: function getActiveOptions(values) {
        var _this2 = this;

        var activeValue = values || this.props.activeValue;
        var options = this.props.options;
        return arrayTreeFilter(
          options,
          function(o, level) {
            return o[_this2.getFieldName('value')] === activeValue[level];
          },
          { childrenKeyName: this.getFieldName('children') },
        );
      },
    },
    {
      key: 'getShowOptions',
      value: function getShowOptions() {
        var _this3 = this;

        var options = this.props.options;

        var result = this.getActiveOptions()
          .map(function(activeOption) {
            return activeOption[_this3.getFieldName('children')];
          })
          .filter(function(activeOption) {
            return !!activeOption && Array.isArray(activeOption) && activeOption.length > 0;
          });
        result.unshift(options);
        return result;
      },
    },
    {
      key: 'delayOnSelect',
      value: function delayOnSelect(onSelect) {
        var _this4 = this;

        for (
          var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1;
          _key < _len;
          _key++
        ) {
          args[_key - 1] = arguments[_key];
        }

        if (this.delayTimer) {
          clearTimeout(this.delayTimer);
          this.delayTimer = null;
        }
        if (typeof onSelect === 'function') {
          this.delayTimer = setTimeout(function() {
            onSelect(args);
            _this4.delayTimer = null;
          }, 150);
        }
      },
    },
    {
      key: 'scrollActiveItemToView',
      value: function scrollActiveItemToView() {
        // scroll into view
        var optionsLength = this.getShowOptions().length;
        for (var i = 0; i < optionsLength; i++) {
          var itemComponent = this.menuItems[i];
          if (itemComponent) {
            var target = findDOMNode(itemComponent);
            target.parentNode.scrollTop = target.offsetTop;
          }
        }
      },
    },
    {
      key: 'isActiveOption',
      value: function isActiveOption(option, menuIndex) {
        var _props$activeValue = this.props.activeValue,
          activeValue = _props$activeValue === undefined ? [] : _props$activeValue;

        return activeValue[menuIndex] === option[this.getFieldName('value')];
      },
    },
    {
      key: 'render',
      value: function render() {
        var _this5 = this;

        var _props3 = this.props,
          prefixCls = _props3.prefixCls,
          dropdownMenuColumnStyle = _props3.dropdownMenuColumnStyle;

        return React.createElement(
          'div',
          null,
          this.getShowOptions().map(function(options, menuIndex) {
            return React.createElement(
              'ul',
              { className: prefixCls + '-menu', key: menuIndex, style: dropdownMenuColumnStyle },
              options.map(function(option) {
                return _this5.getOption(option, menuIndex);
              }),
            );
          }),
        );
      },
    },
  ]);

  return Menus;
})(React.Component);

Menus.defaultProps = {
  options: [],
  value: [],
  activeValue: [],
  onSelect: function onSelect() {},

  prefixCls: 'rc-cascader-menus',
  visible: false,
  expandTrigger: 'click',
};

Menus.propTypes = {
  value: PropTypes.array,
  activeValue: PropTypes.array,
  options: PropTypes.array,
  prefixCls: PropTypes.string,
  expandTrigger: PropTypes.string,
  onSelect: PropTypes.func,
  visible: PropTypes.bool,
  dropdownMenuColumnStyle: PropTypes.object,
  defaultFieldNames: PropTypes.object,
  fieldNames: PropTypes.object,
  expandIcon: PropTypes.node,
  loadingIcon: PropTypes.node,
  onItemDoubleClick: PropTypes.func,
};

export default Menus;
