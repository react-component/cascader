import React, { useState } from "react";
import Cascader from '../src';

export default function Linkage() {
  const [selectData, setSelectData] = useState([]);

  const options = [{
    label: '福建',
    value: 'fj',
    children: [{
      label: '宁德',
      value: 'ningde'
    }]
  }, {
    label: '杭州',
    value: 'hangzhou'
  }, {
    label: '上海',
    value: 'shanghai'
  }];
 
  const onChange = (val) => {
    setSelectData(val)
  }
  return (
    <div className="App">
      <Cascader
        showSearch
        autoFocus
        value={selectData}
        dropdownMatchSelectWidth
        style={{
          width: '100%',
          marginBottom: 20,
        }}
        options={options}
        onChange={onChange}
        placeholder="产品类目搜索"
      />
      <Cascader.Panel
        value={selectData}
        style={{
          width: '100%'
        }}
        options={options}
        onChange={onChange}
      />
    </div>
  );
}
