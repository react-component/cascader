# History

The package has been published as `@rc-component/cascader` since version 1.0.0.
Earlier versions were published as `rc-cascader`. Only notable changes are
listed here; see [GitHub Releases](https://github.com/react-component/cascader/releases)
for the complete release history.

## @rc-component/cascader

### 1.21.0 / 2026-07-10

- Upgrade `@rc-component/select` to 1.10.

### 1.19.0 / 2026-06-30

- Upgrade `@rc-component/select` to 1.9.
- Standardize repository tooling.

### 1.17.0 / 2026-06-25

- Upgrade `@rc-component/select` to 1.8.

### 1.16.1 / 2026-05-27

- Avoid deep imports from rc packages.

### 1.16.0 / 2026-05-14

- Upgrade `@rc-component/select`.

### 1.15.0 / 2026-03-13

- Upgrade `@rc-component/tree`.

### 1.14.0 / 2026-01-30

- Upgrade `@rc-component/select`.

### 1.13.0 / 2026-01-27

- Cache filtered options.

### 1.12.1 / 2026-01-27

- Fix `optionRender` usage for empty search results.

### 1.12.0 / 2026-01-22

- Upgrade `@rc-component/tree`.

### 1.11.0 / 2025-12-31

- Upgrade dependencies.

### 1.10.0 / 2025-12-24

- Upgrade `@rc-component/select`.

### 1.9.0 / 2025-12-02

- Upgrade upstream rc dependencies.

### 1.8.0 / 2025-11-25

- Rename the package from `rc-cascader` to `@rc-component/cascader` in the
  documentation.
- Fix the `LegacyKey` import path.
- Prevent keyboard navigation from scrolling the page.

### 1.7.0 / 2025-10-24

- Align the semantic structure with `@rc-component/select`.
- Replace `classnames` with `clsx`.

### 1.6.1 / 2025-09-11

- Upgrade shared utilities and replace the merged-state implementation.

### 1.6.0 / 2025-09-02

- Support `optionRender` in `Panel`.

### 1.5.0 / 2025-06-24

- Upgrade `@rc-component/select` to 1.1.

### 1.4.0 / 2025-06-13

- Move `searchValue`, `autoClearSearchValue`, and `onSearch` into
  `showSearch`.

### 1.3.1 / 2025-06-03

- Use stable React IDs.

### 1.3.0 / 2025-05-16

- Support `aria-*` and `data-*` attributes.

### 1.2.0 / 2025-04-29

- Support semantic `classNames` and `styles`.

### 1.1.1 / 2025-03-13

- Keep the highlighted search option visible during keyboard navigation.

### 1.1.0 / 2025-03-06

- Remove deprecated APIs and rename dropdown APIs to popup APIs.

### 1.0.1 / 2025-02-28

- Fix exported types.

### 1.0.0 / 2025-02-25

- First release under the `@rc-component/cascader` package name.

## Legacy rc-cascader

The legacy package continued through `rc-cascader@3.34.0`. See
[legacy releases](https://github.com/react-component/cascader/releases?q=v3)
for detailed 2.x and 3.x notes.

### 0.17.0 / 2018/12/14

- should close popup on double click when changeOnSelect is set

### 0.16.0 / 2018/08/23

- Add loadingIcon.

### 0.15.0 / 2018/08/10

- Add expandIcon.

### 0.14.0 / 2018/07/03

- Fix typo `filedNames` to `fieldNames`. [ant-design/ant-design#10896](https://github.com/ant-design/ant-design/issues/10896)

### 0.13.0 / 2018/04/27

- Allow to custom the field name of options. [#23](https://github.com/react-component/cascader/pull/23)

### 0.12.0

- Add es build
- support React 16

### 0.11.0 / 2017-01-17

- Add Keyboard support

### 0.10.0 / 2016-08-20

- Add `dropdownMenuColumnStyle`
- Fix `changeOnSelect` when load data dynamicly

### 0.9.0 / 2016-02-19

- support `popupPlacement`

### 0.8.0 / 2016-01-26

- Add prop `changeOnSelect`

### 0.7.0 / 2016-01-25

- Support disabled item

### 0.6.1 / 2016-01-18

- Hide popup menu when there is no options, fix #4

### 0.6.0 / 2016-01-05

- Add prop `disabled`.

### 0.5.1 / 2015-12-31

- Always scroll to show active menu item

### 0.5.0 / 2015-12-30

- Remove `onSelect`
- Add `loadData` for dynamicly changing options

### 0.4.0 / 2015-12-29

- Add prop `popupVisible`.
- `onVisibleChange` => `onPopupVisibleChange`.

### 0.3.0 / 2015-12-28

- Fix value and defaultValue.
- Add Test Cases.

### 0.2.0 / 2015-12-25

- Add prop `expandTrigger`.

### 0.1.0 / 2015-12-25

First release.
