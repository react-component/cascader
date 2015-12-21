import React from 'react';

class Menus extends React.Component {
  constructor(props) {
    super();
    this.state = {
      activeOptions: [],
    };
  }
  handleClick(targetOption, menuIndex) {
    if (!targetOption) {
      return;
    }
    let activeOptions = this.state.activeOptions;
    activeOptions = activeOptions.slice(0, menuIndex + 1);
    activeOptions[menuIndex] = targetOption;
    if (!targetOption.options || targetOption.options.length === 0) {
      this.props.onSelect(activeOptions);
    } else {
      this.setState({ activeOptions });
    }
  }
  getShowOptions() {
    let { options } = this.props;
    const result = this.state.activeOptions.map(activeOption => activeOption.options);
    result.unshift(options);
    return result;
  }
  render() {
    const { prefixCls } = this.props;
    return (
      <div>
        {this.getShowOptions().map((options, menuIndex) =>
          <ul className={`${prefixCls}-menu`} key={menuIndex}>
            {options.map(option => (
              <li key={option.value} onClick={this.handleClick.bind(this, option, menuIndex)}>
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
};

Menus.defaultProps = {
  options: [],
  onSelect() {},
  prefixCls: 'rc-cascader-menus',
};

Menus.propTypes = {
  options: React.PropTypes.array.isRequired,
  prefixCls: React.PropTypes.string,
  onSelect: React.PropTypes.func,
};

export default Menus;
