import type { RefOptionListProps } from '@rc-component/select/lib/OptionList';
import KeyCode from '@rc-component/util/lib/KeyCode';
import * as React from 'react';
import type { DefaultOptionType, InternalFieldNames, LegacyKey, SingleValueType } from '../Cascader';
import { SEARCH_MARK } from '../hooks/useSearchOptions';
import { getFullPathKeys, toPathKey } from '../utils/commonUtil';

export default (
  ref: React.Ref<RefOptionListProps>,
  options: DefaultOptionType[],
  fieldNames: InternalFieldNames,
  activeValueCells: LegacyKey[],
  setActiveValueCells: (activeValueCells: LegacyKey[]) => void,
  onKeyBoardSelect: (valueCells: SingleValueType, option: DefaultOptionType) => void,
  contextProps: {
    direction?: 'ltr' | 'rtl';
    searchValue: string;
    toggleOpen: (open?: boolean) => void;
    open?: boolean;
  },
) => {
  const { direction, searchValue, toggleOpen, open } = contextProps;
  const rtl = direction === 'rtl';

  const [validActiveValueCells, lastActiveIndex, lastActiveOptions, fullPathKeys] =
    React.useMemo(() => {
      let activeIndex = -1;
      let currentOptions = options;

      const mergedActiveIndexes: number[] = [];
      const mergedActiveValueCells: LegacyKey[] = [];

      const len = activeValueCells.length;

      const pathKeys = getFullPathKeys(options, fieldNames);

      // Fill validate active value cells and index
      for (let i = 0; i < len && currentOptions; i += 1) {
        // Mark the active index for current options
        const nextActiveIndex = currentOptions.findIndex(
          (option, index) =>
            (pathKeys[index] ? toPathKey(pathKeys[index]) : option[fieldNames.value]) ===
            activeValueCells[i],
        );

        if (nextActiveIndex === -1) {
          break;
        }

        activeIndex = nextActiveIndex;
        mergedActiveIndexes.push(activeIndex);
        mergedActiveValueCells.push(activeValueCells[i]);

        currentOptions = currentOptions[activeIndex][fieldNames.children];
      }

      // Fill last active options
      let activeOptions = options;
      for (let i = 0; i < mergedActiveIndexes.length - 1; i += 1) {
        activeOptions = activeOptions[mergedActiveIndexes[i]][fieldNames.children];
      }

      return [mergedActiveValueCells, activeIndex, activeOptions, pathKeys];
    }, [activeValueCells, fieldNames, options]);

  // Update active value cells and scroll to target element
  const internalSetActiveValueCells = (next: LegacyKey[]) => {
    setActiveValueCells(next);
  };

  // Same options offset
  const offsetActiveOption = (offset: number) => {
    const len = lastActiveOptions.length;

    let currentIndex = lastActiveIndex;
    if (currentIndex === -1 && offset < 0) {
      currentIndex = len;
    }

    for (let i = 0; i < len; i += 1) {
      currentIndex = (currentIndex + offset + len) % len;
      const option = lastActiveOptions[currentIndex];
      if (option && !option.disabled) {
        const nextActiveCells = validActiveValueCells
          .slice(0, -1)
          .concat(
            fullPathKeys[currentIndex]
              ? toPathKey(fullPathKeys[currentIndex])
              : option[fieldNames.value],
          );
        internalSetActiveValueCells(nextActiveCells);
        return;
      }
    }
  };

  // Different options offset
  const prevColumn = () => {
    if (validActiveValueCells.length > 1) {
      const nextActiveCells = validActiveValueCells.slice(0, -1);
      internalSetActiveValueCells(nextActiveCells);
    } else {
      toggleOpen(false);
    }
  };

  const nextColumn = () => {
    const nextOptions: DefaultOptionType[] =
      lastActiveOptions[lastActiveIndex]?.[fieldNames.children] || [];

    const nextOption = nextOptions.find(option => !option.disabled);

    if (nextOption) {
      const nextActiveCells = [...validActiveValueCells, nextOption[fieldNames.value]];
      internalSetActiveValueCells(nextActiveCells);
    }
  };

  React.useImperativeHandle(ref, () => ({
    // scrollTo: treeRef.current?.scrollTo,
    onKeyDown: event => {
      const { which } = event;

      switch (which) {
        // >>> Arrow keys
        case KeyCode.UP:
        case KeyCode.DOWN: {
          let offset = 0;
          if (which === KeyCode.UP) {
            offset = -1;
          } else if (which === KeyCode.DOWN) {
            offset = 1;
          }

          if (offset !== 0) {
            offsetActiveOption(offset);
          }

          break;
        }

        case KeyCode.LEFT: {
          if (searchValue) {
            break;
          }
          if (rtl) {
            nextColumn();
          } else {
            prevColumn();
          }
          break;
        }

        case KeyCode.RIGHT: {
          if (searchValue) {
            break;
          }
          if (rtl) {
            prevColumn();
          } else {
            nextColumn();
          }
          break;
        }

        case KeyCode.BACKSPACE: {
          if (!searchValue) {
            prevColumn();
          }
          break;
        }

        // >>> Select
        case KeyCode.ENTER: {
          if (validActiveValueCells.length) {
            const option = lastActiveOptions[lastActiveIndex];

            // Search option should revert back of origin options
            const originOptions: DefaultOptionType[] = option?.[SEARCH_MARK] || [];
            if (originOptions.length) {
              onKeyBoardSelect(
                originOptions.map(opt => opt[fieldNames.value]),
                originOptions[originOptions.length - 1],
              );
            } else {
              onKeyBoardSelect(validActiveValueCells, lastActiveOptions[lastActiveIndex]);
            }
          }
          break;
        }

        // >>> Close
        case KeyCode.ESC: {
          toggleOpen(false);

          if (open) {
            event.stopPropagation();
          }
        }
      }
    },
    onKeyUp: () => {},
  }));
};
