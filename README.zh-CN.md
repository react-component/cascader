<div align="center">
  <h1>@rc-component/cascader</h1>
  <p><sub>Ant Design 生态的一部分。</sub></p>
  <img alt="Ant Design" height="32" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
  <p>🧭 React 级联选择组件，支持层级选项、搜索、多选、异步加载和自定义渲染。</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/cascader"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/cascader.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/cascader"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/cascader.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/cascader/actions/workflows/main.yml"><img alt="build status" src="https://github.com/react-component/cascader/actions/workflows/main.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/cascader"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/cascader/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/cascader"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/cascader?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center"><a href="./README.md">English</a> | 简体中文</p>


## 特性

| 范围 | 支持 |
| --------- | ---------------------------------------------------------------- |
| Data      | Nested options, field name mapping, disabled nodes               |
| Selection | Single, multiple, checkable, and change-on-select flows          |
| Search    | Controlled search, custom filter, custom sort, custom render     |
| Loading   | Async option loading with `loadData`                             |
| Rendering | Custom option label, dropdown content, icons, and expand trigger |

## 安装

```bash
npm install @rc-component/cascader
```

## 使用

```tsx | pure
import Cascader from '@rc-component/cascader';

const options = [
  {
    label: 'Zhejiang',
    value: 'zhejiang',
    children: [
      {
        label: 'Hangzhou',
        value: 'hangzhou',
        children: [{ label: 'Xihu', value: 'xihu' }],
      },
    ],
  },
  {
    label: 'Jiangsu',
    value: 'jiangsu',
    children: [{ label: 'Nanjing', value: 'nanjing' }],
  },
];

export default () => (
  <Cascader options={options}>
    <button type="button">Please select</button>
  </Cascader>
);
```

## 示例

查看[在线示例](https://cascader-react-component.vercel.app/)，了解 search, multiple selection, custom field names, lazy loading, panel mode, and popup customization。

## API

### Cascader

| 参数             | 类型                                                    | 默认值                                                    | 说明                                                |
| -------------------- | ------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| autoClearSearchValue | boolean                                                 | true                                                       | Deprecated. Use `showSearch.autoClearSearchValue` instead. |
| builtinPlacements    | BuildInPlacements                                       | -                                                          | Custom popup placements.                                   |
| changeOnSelect       | boolean                                                 | false                                                      | Trigger `onChange` when selecting each level.              |
| checkable            | boolean \| ReactNode                                    | false                                                      | Enable multiple selection with checkbox UI.                |
| children             | ReactElement                                            | -                                                          | Trigger element.                                           |
| classNames           | Semantic class name map                                 | -                                                          | Semantic class names for selector and popup elements.      |
| defaultValue         | string[] \| number[] \| Array<string[] \| number[]>     | -                                                          | Initial selected value.                                    |
| displayRender        | `(label, selectedOptions) => ReactNode`                 | -                                                          | Render selected labels.                                    |
| expandIcon           | ReactNode                                               | `>`                                                        | Custom expand icon.                                        |
| expandTrigger        | `click` \| `hover`                                      | `click`                                                    | Trigger action for expanding the next option level.        |
| fieldNames           | `{ label?: string; value?: string; children?: string }` | `{ label: 'label', value: 'value', children: 'children' }` | Custom option field names.                                 |
| loadData             | `(selectedOptions) => void`                             | -                                                          | Load child options asynchronously.                         |
| loadingIcon          | ReactNode                                               | -                                                          | Custom loading icon.                                       |
| onChange             | `(value, selectedOptions) => void`                      | -                                                          | Called when selection changes.                             |
| onPopupVisibleChange | `(open: boolean) => void`                               | -                                                          | Called when popup visibility changes.                      |
| onSearch             | `(value: string) => void`                               | -                                                          | Deprecated. Use `showSearch.onSearch` instead.             |
| open                 | boolean                                                 | -                                                          | Controlled popup visibility.                               |
| optionRender         | `(option) => ReactNode`                                 | -                                                          | Custom option renderer.                                    |
| options              | Option[]                                                | -                                                          | Hierarchical option data.                                  |
| placement            | Select placement                                        | -                                                          | Popup placement.                                           |
| popupClassName       | string                                                  | -                                                          | Popup class name.                                          |
| popupMenuColumnStyle | CSSProperties                                           | -                                                          | Style for each popup menu column.                          |
| prefixCls            | string                                                  | `rc-cascader`                                              | Class name prefix.                                         |
| searchValue          | string                                                  | -                                                          | Deprecated. Use `showSearch.searchValue` instead.          |
| showCheckedStrategy  | `SHOW_PARENT` \| `SHOW_CHILD`                           | `SHOW_PARENT`                                              | Strategy for rendering checked values in multiple mode.    |
| showSearch           | boolean \| SearchConfig                                 | false                                                      | Enable and configure search.                               |
| styles               | Semantic style map                                      | -                                                          | Semantic styles for selector and popup elements.           |
| value                | string[] \| number[] \| Array<string[] \| number[]>     | -                                                          | Controlled selected value.                                 |

`Cascader` also accepts public props from `@rc-component/select` `BaseSelect`, except private select-only props such as `mode`, `labelInValue`, `showSearch`, and `tokenSeparators`.

### SearchConfig

| 参数             | 类型                                                     | 默认值 | 说明                                                |
| -------------------- | -------------------------------------------------------- | ------- | ---------------------------------------------------------- |
| autoClearSearchValue | boolean                                                  | true    | Clear search text after selecting an item.                 |
| filter               | `(inputValue, options, fieldNames) => boolean`           | -       | Return `true` to include an option path in search results. |
| limit                | number \| false                                          | 50      | Limit the number of filtered items.                        |
| matchInputWidth      | boolean                                                  | true    | Whether the search result width matches the input width.   |
| onSearch             | `(value: string) => void`                                | -       | Called when search text changes.                           |
| render               | `(inputValue, path, prefixCls, fieldNames) => ReactNode` | -       | Render a filtered option path.                             |
| searchValue          | string                                                   | -       | Controlled search text.                                    |
| sort                 | `(a, b, inputValue, fieldNames) => number`               | -       | Sort filtered option paths.                                |

### Option

| 参数        | 类型                     | 默认值 | 说明                                      |
| --------------- | ------------------------ | ------- | ------------------------------------------------ |
| children        | Option[]                 | -       | Child options.                                   |
| disabled        | boolean                  | false   | Disable this option.                             |
| disableCheckbox | boolean                  | false   | Disable this option's checkbox in multiple mode. |
| label           | ReactNode                | -       | Display label.                                   |
| value           | string \| number \| null | -       | Option value.                                    |

## 本地开发

```bash
npm install
npm start
```

Common commands:

```bash
npm run lint
npm test
npm run tsc
npm run lint:tsc
npm run compile
```

## 发布

```bash
npm run prepublishOnly
```

The release flow is handled by `@rc-component/np` through the `rc-np` command after the package build.

## 许可证

@rc-component/cascader is released under the [MIT](./LICENSE.md) license.
