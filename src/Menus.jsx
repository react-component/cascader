import React from 'react';
import arrayTreeFilter from 'array-tree-filter';

class Menus extends React.Component {
  constructor(props) {
    super();
    const { value, defaultValue } = props;
    const initialValue = value || defaultValue || [];
    this.state = {
      activeValue: initialValue,
      value: initialValue,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        activeValue: nextProps.value || [],
        value: nextProps.value || [],
      });
    }
    if (!nextProps.visible) {
      this.setState({
        activeValue: this.state.value,
      });
    }
  }
  getActiveOptions(values) {
    const activeValue = values || this.state.activeValue;
    const options = this.props.options;
    return arrayTreeFilter(options, (o, level) => o.value === activeValue[level]);
  }
  getShowOptions() {
    const { options } = this.props;
    const result = this.getActiveOptions()
      .map(activeOption => activeOption.children)
      .filter(activeOption => !!activeOption);
    result.unshift(options);
    return result;
  }
  handleSelect(targetOption, menuIndex) {
    if (!targetOption) {
      return;
    }
    let activeValue = this.state.activeValue;
    activeValue = activeValue.slice(0, menuIndex + 1);
    activeValue[menuIndex] = targetOption.value;
    const activeOptions = this.getActiveOptions(activeValue);
    const selectCallback = () => {
      if (!targetOption.children || targetOption.children.length === 0) {
        this.props.onChange(activeOptions);
      }
      this.setState({
        activeValue,
        value: activeValue,
      });
    };
    // specify the last argument `done`:
    //  onSelect(selectedOptions, done)
    // it means async select
    if (this.props.onSelect.length >= 2) {
      this.props.onSelect(activeOptions, selectCallback);
      this.setState({ activeValue });
    } else {
      this.props.onSelect(activeOptions);
      selectCallback();
    }
  }
  isActiveOption(option) {
    return this.state.activeValue.some(value => value === option.value);
  }
  render() {
    const { prefixCls, expandTrigger } = this.props;
    return (
      <div>
        {this.getShowOptions().map((options, menuIndex) =>
          <ul className={`${prefixCls}-menu`} key={menuIndex}>
            {options.map(option => {
              let menuItemCls = `${prefixCls}-menu-item`;
              if (this.isActiveOption(option)) {
                menuItemCls += ` ${prefixCls}-menu-item-active`;
              }
              const handleSelect = this.handleSelect.bind(this, option, menuIndex);
              let expandProps = {
                onClick: handleSelect,
              };
              if (expandTrigger === 'hover' &&
                  option.children &&
                  option.children.length > 0) {
                expandProps = {
                  onMouseEnter: handleSelect,
                };
                menuItemCls += ` ${prefixCls}-menu-item-expand`;
              }
              return (
                <li key={option.value}
                  className={menuItemCls}
                  title={option.label}
                  {...expandProps}>
                  {option.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}

Menus.defaultProps = {
  options: [],
  onChange() {},
  onSelect() {},
  prefixCls: 'rc-cascader-menus',
  visible: false,
  expandTrigger: 'click',
};

Menus.propTypes = {
  options: React.PropTypes.array.isRequired,
  prefixCls: React.PropTypes.string,
  expandTrigger: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  visible: React.PropTypes.bool,
};

export default Menus;
