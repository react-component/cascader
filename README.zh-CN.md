<div align="center">
  <h1>@rc-component/cascader</h1>
  <p><sub><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /> Ant Design 生态的一部分。</sub></p>
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
| 数据      | 嵌套选项、字段名映射和禁用节点               |
| Selection | 单选、多选、勾选和逐级选择流程          |
| 搜索    | 受控搜索、自定义过滤、自定义排序和自定义渲染     |
| Loading   | 通过 `loadData` 异步加载选项                             |
| Rendering | 自定义选项标签、下拉内容、图标和展开触发方式 |

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

查看[在线示例](https://cascader-react-component.vercel.app/)，了解搜索、多选、自定义字段名称、延迟加载、面板模式和弹层窗口自定义。

## API

### Cascader

| 参数             | 类型                                                    | 默认值                                                    | 说明                                                |
| -------------------- | ------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| autoClearSearchValue | boolean                                                 | true                                                       | 已弃用。请改用 `showSearch.autoClearSearchValue`。 |
| builtinPlacements    | BuildInPlacements                                       | -                                                          | 自定义弹层位置。                                   |
| changeOnSelect       | boolean                                                 | false                                                      | 选择每个级别时触发 `onChange`。              |
| checkable            | boolean \| ReactNode                                    | false                                                      | 启用带复选框 UI 的多选。                |
| 孩子们             | ReactElement                                            | -                                                          | 触发元素。                                           |
| classNames           | 语义className映射                                 | -                                                          | 选择器和弹层元素的语义className称。      |
| defaultValue         | 字符串[] \|数字[] \|数组<字符串[] \|数字[]>     | -                                                          | 初始选中值。                                    |
| displayRender        | `(label, selectedOptions) => ReactNode`                 | -                                                          | 渲染选定的标签。                                    |
| expandIcon           | ReactNode                                               | `>`                                                        | 自定义展开图标。                                        |
| expandTrigger        | `click` \| `hover`                                      | `click`                                                    | 触发扩展下一个选项级别的操作。        |
| fieldNames           | `{ label?: string; value?: string; children?: string }` | `{ label: 'label', value: 'value', children: 'children' }` | 自定义选项字段名称。                                 |
| loadData             | `(selectedOptions) => void`                             | -                                                          | 异步加载子选项。                         |
| loadingIcon          | ReactNode                                               | -                                                          | 自定义加载图标。                                       |
| onChange             | `(value, selectedOptions) => void`                      | -                                                          | 选择更改时调用。                             |
| onPopupVisibleChange | `(open: boolean) => void`                               | -                                                          | 当弹层窗口可见性发生变化时调用。                      |
| onSearch             | `(value: string) => void`                               | -                                                          | 已弃用。请改用 `showSearch.onSearch`。             |
| 打开                 | boolean                                                 | -                                                          | 受控的弹层窗口可见性。                               |
| optionRender         | `(option) => ReactNode`                                 | -                                                          | 自定义选项渲染器。                                    |
| 选项              | 选项[]                                                | -                                                          | 分层选项数据。                                  |
| placement            | 选择展示位置                                        | -                                                          | 弹层窗口放置。                                           |
| popupClassName       | string                                                  | -                                                          | 弹层className。                                          |
| popupMenuColumnStyle | CSSProperties                                           | -                                                          | 每个弹出菜单列的样式。                          |
| prefixCls            | string                                                  | `rc-cascader`                                              | className前缀。                                         |
| searchValue          | string                                                  | -                                                          | 已弃用。请改用 `showSearch.searchValue`。          |
| showCheckedStrategy  | `SHOW_PARENT` \| `SHOW_CHILD`                           | `SHOW_PARENT`                                              | 在多种模式下渲染检查值的策略。    |
| showSearch           | boolean \| SearchConfig                                 | false                                                      | 启用并配置搜索。                               |
| styles               | 语义风格图                                      | -                                                          | 选择器和弹层元素的语义样式。           |
| 价值                | 字符串[] \|数字[] \|数组<字符串[] \|数字[]>     | -                                                          | 受控选中值。                                 |

`Cascader` 还接受来自 `@rc-component/select` `BaseSelect` 的公共属性，但私有仅选择属性除外，例如 `mode` 、 `labelInValue` 、 `showSearch` 和 `tokenSeparators`。

### SearchConfig

| 参数             | 类型                                                     | 默认值 | 说明                                                |
| -------------------- | -------------------------------------------------------- | ------- | ---------------------------------------------------------- |
| autoClearSearchValue | boolean                                                  | true    | 选择项目后清除搜索文本。                 |
| 筛选               | `(inputValue, options, fieldNames) => boolean`           | -       | 返回 `true` 以在搜索结果中包含选项路径。 |
| limit                | number \| false                                          | 50      | 限制过滤项目的数量。                        |
| matchInputWidth      | boolean                                                  | true    | 搜索结果宽度是否与输入宽度匹配。   |
| onSearch             | `(value: string) => void`                                | -       | 当搜索文本更改时调用。                           |
| 使成为               | `(inputValue, path, prefixCls, fieldNames) => ReactNode` | -       | 渲染过滤后的选项路径。                             |
| searchValue          | string                                                   | -       | 受控搜索文本。                                    |
| 种类                 | `(a, b, inputValue, fieldNames) => number`               | -       | 对过滤后的选项路径进行排序。                                |

＃＃＃ 选项

| 参数        | 类型                     | 默认值 | 说明                                      |
| --------------- | ------------------------ | ------- | ------------------------------------------------ |
| 孩子们        | 选项[]                 | -       | 儿童选项。                                   |
| disabled        | boolean                  | false   | 禁用此选项。                             |
| disableCheckbox | boolean                  | false   | 在多种模式下禁用此选项的复选框。 |
| label           | ReactNode                | -       | Display label.                                   |
| 价值           | 字符串\|数字\|无效的 | -       | 选项值。                                    |

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

包构建完成后，发布流程由 `@rc-component/np` 通过 `rc-np` 命令处理。

## 许可证

@rc-component/cascader 基于 [MIT](./LICENSE.md) 许可证发布。
