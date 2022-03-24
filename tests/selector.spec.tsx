import React, { useState } from 'react';
import { mount } from './enzyme';
import Cascader from '../src';
import { addressOptions } from './demoOptions';

describe('Cascader.Selector', () => {
  describe('clear all', () => {
    it('single', () => {
      const onChange = jest.fn();
      const wrapper = mount(<Cascader value={['not', 'exist']} allowClear onChange={onChange} />);

      wrapper.find('.rc-cascader-clear-icon').simulate('mouseDown');
      expect(onChange).toHaveBeenCalledWith(undefined, undefined);
    });

    it('multiple', () => {
      const onChange = jest.fn();
      const wrapper = mount(
        <Cascader checkable value={[['not'], ['exist']]} allowClear onChange={onChange} />,
      );

      wrapper.find('.rc-cascader-clear-icon').simulate('mouseDown');
      expect(onChange).toHaveBeenCalledWith([], []);
    });
  });

  it('remove selector', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Cascader checkable value={[['not'], ['exist']]} allowClear onChange={onChange} />,
    );

    wrapper.find('.rc-cascader-selection-item-remove-icon').first().simulate('click');
    expect(onChange).toHaveBeenCalledWith([['exist']], expect.anything());
  });

  it('avoid reuse', () => {
    const Tag: React.FC<any> = ({ children, onClose }) => {
      const [visible, setVisible] = useState(true);
      return (
        <button
          onClick={() => {
            setVisible(false);
            onClose();
          }}
          className={visible ? '' : 'reuse'}
        >
          {children}
        </button>
      );
    };

    const wrapper = mount(
      <Cascader
        options={[
          { label: 'AA', value: 'aa' },
          { label: 'BB', value: 'bb' },
          { label: 'CC', value: 'cc' },
          { label: 'DD', value: 'dd' },
          { label: 'EE', value: 'ee' },
        ]}
        value={[['aa'], ['bb'], ['cc'], ['dd'], ['ee']]}
        onChange={values => {
          wrapper.setProps({
            value: values,
          });
        }}
        tagRender={({ label, onClose }) => (
          <Tag onClose={onClose} id={label}>
            {label}
          </Tag>
        )}
        checkable
      />,
    );

    for (let i = 5; i > 0; i--) {
      const buttons = wrapper.find('button');
      expect(buttons.length).toBe(i);
      buttons.first().simulate('click');
      wrapper.update();
      expect(wrapper.find('.reuse').length).toBe(0);
    }
  });

  it('when selected modify options', () => {
    const wrapper = mount(<Cascader options={addressOptions} open />);

    // First column click
    wrapper.find('.rc-cascader-menu-item-content').first().simulate('click');
    wrapper.update();

    // Second column click
    wrapper.find('.rc-cascader-menu-item-content').last().simulate('click');
    wrapper.update();

    wrapper.setProps({
      options: [{ label: '福建', value: 'fj', isLeaf: false }],
    });

    wrapper.update();
  });
});
