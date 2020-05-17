import * as React from 'react';
import Trigger, { BuildInPlacements, TriggerProps } from 'rc-trigger';
import warning from 'warning';
import KeyCode from 'rc-util/lib/KeyCode';
import arrayTreeFilter from 'array-tree-filter';
import { isEqualArrays } from './utils';
import Menus from './Menus';
import BUILT_IN_PLACEMENTS from './placements';

export interface CascaderFieldNames {
  value?: string | number;
  label?: string;
  children?: string;
}

export type CascaderValueType = (string | number)[];

export interface CascaderOption {
  value?: string | number;
  label?: React.ReactNode;
  disabled?: boolean;
  isLeaf?: boolean;
  loading?: boolean;
  children?: CascaderOption[];
  [key: string]: any;
}

export interface CascaderProps extends Pick<TriggerProps, 'getPopupContainer'> {
  value?: CascaderValueType;
  defaultValue?: CascaderValueType;
  options?: CascaderOption[];
  onChange?: (value: CascaderValueType, selectOptions: CascaderOption[]) => void;
  onPopupVisibleChange?: (popupVisible: boolean) => void;
  popupVisible?: boolean;
  disabled?: boolean;
  transitionName?: string;
  popupClassName?: string;
  popupPlacement?: string;
  prefixCls?: string;
  dropdownMenuColumnStyle?: React.CSSProperties;
  builtinPlacements?: BuildInPlacements;
  loadData?: (selectOptions: CascaderOption[]) => void;
  changeOnSelect?: boolean;
  children?: React.ReactElement;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
  expandTrigger?: string;
  fieldNames?: CascaderFieldNames;
  filedNames?: CascaderFieldNames; // typo but for compatibility
  expandIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
}

interface CascaderState {
  popupVisible?: boolean;
  activeValue?: CascaderValueType;
  value?: CascaderValueType;
  prevProps?: CascaderProps;
}

class Cascader extends React.Component<CascaderProps, CascaderState> {
  defaultFieldNames: object;

  trigger: any;

  constructor(props: CascaderProps) {
    super(props);
    let initialValue = [];
    if ('value' in props) {
      initialValue = props.value || [];
    } else if ('defaultValue' in props) {
      initialValue = props.defaultValue || [];
    }

    warning(
      !('filedNames' in props),
      '`filedNames` of Cascader is a typo usage and deprecated, please use `fieldNames` instead.',
    );

    this.state = {
      popupVisible: props.popupVisible,
      activeValue: initialValue,
      value: initialValue,
      prevProps: props,
    };
    this.defaultFieldNames = {
      label: 'label',
      value: 'value',
      children: 'children',
    };
  }

  static defaultProps: CascaderProps = {
    onChange: () => {},
    onPopupVisibleChange: () => {},
    disabled: false,
    transitionName: '',
    prefixCls: 'rc-cascader',
    popupClassName: '',
    popupPlacement: 'bottomLeft',
    builtinPlacements: BUILT_IN_PLACEMENTS,
    expandTrigger: 'click',
    fieldNames: { label: 'label', value: 'value', children: 'children' },
    expandIcon: '>',
  };

  static getDerivedStateFromProps(nextProps: CascaderProps, prevState: CascaderState) {
    const { prevProps = {} } = prevState;
    const newState: CascaderState = {
      prevProps: nextProps,
    };

    if ('value' in nextProps && !isEqualArrays(prevProps.value, nextProps.value)) {
      newState.value = nextProps.value || [];

      // allow activeValue diff from value
      // https://github.com/ant-design/ant-design/issues/2767
      if (!('loadData' in nextProps)) {
        newState.activeValue = nextProps.value || [];
      }
    }
    if ('popupVisible' in nextProps) {
      newState.popupVisible = nextProps.popupVisible;
    }

    return newState;
  }

  getPopupDOMNode() {
    return this.trigger.getPopupDomNode();
  }

  getFieldName(name: string): string {
    const { defaultFieldNames } = this;
    const { fieldNames, filedNames } = this.props;
    if ('filedNames' in this.props) {
      return filedNames[name] || defaultFieldNames[name]; // For old compatibility
    }
    return fieldNames[name] || defaultFieldNames[name];
  }

  getFieldNames(): CascaderFieldNames {
    const { fieldNames, filedNames } = this.props;
    if ('filedNames' in this.props) {
      return filedNames; // For old compatibility
    }
    return fieldNames;
  }

  getCurrentLevelOptions(): CascaderOption[] {
    const { options = [] } = this.props;
    const { activeValue = [] } = this.state;
    const result = arrayTreeFilter(
      options,
      (o, level) => o[this.getFieldName('value')] === activeValue[level],
      { childrenKeyName: this.getFieldName('children') },
    );
    if (result[result.length - 2]) {
      return result[result.length - 2][this.getFieldName('children')];
    }
    return [...options].filter(o => !o.disabled);
  }

  getActiveOptions(activeValue: CascaderValueType): CascaderOption[] {
    return arrayTreeFilter(
      this.props.options || [],
      (o, level) => o[this.getFieldName('value')] === activeValue[level],
      { childrenKeyName: this.getFieldName('children') },
    );
  }

  setPopupVisible = (popupVisible: boolean) => {
    const { value } = this.state;
    if (!('popupVisible' in this.props)) {
      this.setState({ popupVisible });
    }
    // sync activeValue with value when panel open
    if (popupVisible && !this.state.popupVisible) {
      this.setState({
        activeValue: value,
      });
    }
    this.props.onPopupVisibleChange(popupVisible);
  };

  handleChange = (options: CascaderOption[], { visible }, e: React.KeyboardEvent<HTMLElement>) => {
    if (e.type !== 'keydown' || e.keyCode === KeyCode.ENTER) {
      this.props.onChange(options.map(o => o[this.getFieldName('value')]), options);
      this.setPopupVisible(visible);
    }
  };

  handlePopupVisibleChange = (popupVisible: boolean) => {
    this.setPopupVisible(popupVisible);
  };

  handleMenuSelect = (
    targetOption: CascaderOption,
    menuIndex: number,
    e: React.KeyboardEvent<HTMLElement>,
  ) => {
    // Keep focused state for keyboard support
    const triggerNode = this.trigger.getRootDomNode();
    if (triggerNode && triggerNode.focus) {
      triggerNode.focus();
    }
    const { changeOnSelect, loadData, expandTrigger } = this.props;
    if (!targetOption || targetOption.disabled) {
      return;
    }
    let { activeValue } = this.state;
    activeValue = activeValue.slice(0, menuIndex + 1);
    activeValue[menuIndex] = targetOption[this.getFieldName('value')];
    const activeOptions = this.getActiveOptions(activeValue);
    if (targetOption.isLeaf === false && !targetOption[this.getFieldName('children')] && loadData) {
      if (changeOnSelect) {
        this.handleChange(activeOptions, { visible: true }, e);
      }
      this.setState({ activeValue });
      loadData(activeOptions);
      return;
    }
    const newState: CascaderState = {};
    if (
      !targetOption[this.getFieldName('children')] ||
      !targetOption[this.getFieldName('children')].length
    ) {
      this.handleChange(activeOptions, { visible: false }, e);
      // set value to activeValue when select leaf option
      newState.value = activeValue;
      // add e.type judgement to prevent `onChange` being triggered by mouseEnter
    } else if (changeOnSelect && (e.type === 'click' || e.type === 'keydown')) {
      if (expandTrigger === 'hover') {
        this.handleChange(activeOptions, { visible: false }, e);
      } else {
        this.handleChange(activeOptions, { visible: true }, e);
      }
      // set value to activeValue on every select
      newState.value = activeValue;
    }
    newState.activeValue = activeValue;
    //  not change the value by keyboard
    if ('value' in this.props || (e.type === 'keydown' && e.keyCode !== KeyCode.ENTER)) {
      delete newState.value;
    }
    this.setState(newState);
  };

  handleItemDoubleClick = () => {
    const { changeOnSelect } = this.props;
    if (changeOnSelect) {
      this.setPopupVisible(false);
    }
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const { children } = this.props;
    // https://github.com/ant-design/ant-design/issues/6717
    // Don't bind keyboard support when children specify the onKeyDown
    if (children && children.props.onKeyDown) {
      children.props.onKeyDown(e);
      return;
    }
    const activeValue = [...this.state.activeValue];
    const currentLevel = activeValue.length - 1 < 0 ? 0 : activeValue.length - 1;
    const currentOptions = this.getCurrentLevelOptions();
    const currentIndex = currentOptions
      .map(o => o[this.getFieldName('value')])
      .indexOf(activeValue[currentLevel]);
    if (
      e.keyCode !== KeyCode.DOWN &&
      e.keyCode !== KeyCode.UP &&
      e.keyCode !== KeyCode.LEFT &&
      e.keyCode !== KeyCode.RIGHT &&
      e.keyCode !== KeyCode.ENTER &&
      e.keyCode !== KeyCode.SPACE &&
      e.keyCode !== KeyCode.BACKSPACE &&
      e.keyCode !== KeyCode.ESC &&
      e.keyCode !== KeyCode.TAB
    ) {
      return;
    }
    // Press any keys above to reopen menu
    if (
      !this.state.popupVisible &&
      e.keyCode !== KeyCode.BACKSPACE &&
      e.keyCode !== KeyCode.LEFT &&
      e.keyCode !== KeyCode.RIGHT &&
      e.keyCode !== KeyCode.ESC &&
      e.keyCode !== KeyCode.TAB
    ) {
      this.setPopupVisible(true);
      return;
    }
    if (e.keyCode === KeyCode.DOWN || e.keyCode === KeyCode.UP) {
      e.preventDefault();
      let nextIndex = currentIndex;
      if (nextIndex !== -1) {
        if (e.keyCode === KeyCode.DOWN) {
          nextIndex += 1;
          nextIndex = nextIndex >= currentOptions.length ? 0 : nextIndex;
        } else {
          nextIndex -= 1;
          nextIndex = nextIndex < 0 ? currentOptions.length - 1 : nextIndex;
        }
      } else {
        nextIndex = 0;
      }
      activeValue[currentLevel] = currentOptions[nextIndex][this.getFieldName('value')];
    } else if (e.keyCode === KeyCode.LEFT || e.keyCode === KeyCode.BACKSPACE) {
      e.preventDefault();
      activeValue.splice(activeValue.length - 1, 1);
    } else if (e.keyCode === KeyCode.RIGHT) {
      e.preventDefault();
      if (
        currentOptions[currentIndex] &&
        currentOptions[currentIndex][this.getFieldName('children')]
      ) {
        activeValue.push(
          currentOptions[currentIndex][this.getFieldName('children')][0][
            this.getFieldName('value')
          ],
        );
      }
    } else if (e.keyCode === KeyCode.ESC || e.keyCode === KeyCode.TAB) {
      this.setPopupVisible(false);
      return;
    }
    if (!activeValue || activeValue.length === 0) {
      this.setPopupVisible(false);
    }
    const activeOptions = this.getActiveOptions(activeValue);
    const targetOption = activeOptions[activeOptions.length - 1];
    this.handleMenuSelect(targetOption, activeOptions.length - 1, e);

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  };

  saveTrigger = node => {
    this.trigger = node;
  };

  render() {
    const {
      prefixCls,
      transitionName,
      popupClassName,
      options = [],
      disabled,
      builtinPlacements,
      popupPlacement,
      children,
      ...restProps
    } = this.props;
    // Did not show popup when there is no options
    let menus = <div />;
    let emptyMenuClassName = '';
    if (options && options.length > 0) {
      menus = (
        <Menus
          {...this.props}
          fieldNames={this.getFieldNames()}
          defaultFieldNames={this.defaultFieldNames}
          activeValue={this.state.activeValue}
          onSelect={this.handleMenuSelect}
          onItemDoubleClick={this.handleItemDoubleClick}
          visible={this.state.popupVisible}
        />
      );
    } else {
      emptyMenuClassName = ` ${prefixCls}-menus-empty`;
    }
    return (
      <Trigger
        ref={this.saveTrigger}
        {...restProps}
        popupPlacement={popupPlacement}
        builtinPlacements={builtinPlacements}
        popupTransitionName={transitionName}
        action={disabled ? [] : ['click']}
        popupVisible={disabled ? false : this.state.popupVisible}
        onPopupVisibleChange={this.handlePopupVisibleChange}
        prefixCls={`${prefixCls}-menus`}
        popupClassName={popupClassName + emptyMenuClassName}
        popup={menus}
      >
        {React.cloneElement(children, {
          onKeyDown: this.handleKeyDown,
          tabIndex: disabled ? undefined : 0,
        })}
      </Trigger>
    );
  }
}

export default Cascader;
