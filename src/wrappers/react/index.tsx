import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

type EventMap = Record<string, string>;

function createComponent<P extends Record<string, unknown>>(
  tagName: string,
  events: EventMap = {}
) {
  const Component = forwardRef<HTMLElement, P & React.HTMLAttributes<HTMLElement>>((props, ref) => {
    const elementRef = useRef<HTMLElement>(null);

    useImperativeHandle(ref, () => elementRef.current!);

    useEffect(() => {
      const el = elementRef.current;
      if (!el) return;

      // Sync React props to element attributes/properties
      Object.entries(props).forEach(([key, value]) => {
        if (key === 'children' || key === 'className' || key === 'style' || key.startsWith('on')) return;
        if (typeof value === 'boolean') {
          if (value) el.setAttribute(key, '');
          else el.removeAttribute(key);
        } else if (value != null) {
          el.setAttribute(key, String(value));
        }
      });
    });

    useEffect(() => {
      const el = elementRef.current;
      if (!el) return;

      const listeners: Array<[string, EventListener]> = [];
      Object.entries(events).forEach(([customEvent, reactProp]) => {
        const handler = (props as Record<string, unknown>)[reactProp] as EventListener | undefined;
        if (handler) {
          el.addEventListener(customEvent, handler);
          listeners.push([customEvent, handler]);
        }
      });

      return () => {
        listeners.forEach(([event, handler]) => el.removeEventListener(event, handler));
      };
    });

    const { children, className, style, ...rest } = props;
    // Filter out React-specific and event props
    const filteredProps: Record<string, unknown> = {};
    Object.entries(rest).forEach(([key, value]) => {
      if (!key.startsWith('on') && !Object.values(events).includes(key)) {
        filteredProps[key] = value;
      }
    });

    return React.createElement(tagName, {
      ref: elementRef,
      class: className,
      style,
      ...filteredProps
    }, children as React.ReactNode);
  });

  Component.displayName = tagName.replace('nc-', 'Nc').replace(/-./g, x => x[1].toUpperCase());
  return Component;
}

// Sprint 1
export const NcButton = createComponent('nc-button', { 'nc-click': 'onNcClick' });
export const NcBadge = createComponent('nc-badge', { 'nc-dismiss': 'onNcDismiss' });
export const NcCard = createComponent('nc-card', { 'nc-click': 'onNcClick' });
export const NcIcon = createComponent('nc-icon');
export const NcSpinner = createComponent('nc-spinner');
export const NcSkeleton = createComponent('nc-skeleton');
export const NcThemeToggle = createComponent('nc-theme-toggle', { 'nc-theme-change': 'onNcThemeChange' });
export const NcTooltip = createComponent('nc-tooltip');
export const NcAvatar = createComponent('nc-avatar');
export const NcStatusBadge = createComponent('nc-status-badge');

// Sprint 2
export const NcInput = createComponent('nc-input', { 'nc-input': 'onNcInput', 'nc-change': 'onNcChange', 'nc-focus': 'onNcFocus', 'nc-blur': 'onNcBlur' });
export const NcTextarea = createComponent('nc-textarea', { 'nc-input': 'onNcInput', 'nc-change': 'onNcChange', 'nc-focus': 'onNcFocus', 'nc-blur': 'onNcBlur' });
export const NcSelect = createComponent('nc-select', { 'nc-change': 'onNcChange' });
export const NcCheckbox = createComponent('nc-checkbox', { 'nc-change': 'onNcChange' });
export const NcRadioGroup = createComponent('nc-radio-group', { 'nc-change': 'onNcChange' });
export const NcRadio = createComponent('nc-radio');
export const NcToggle = createComponent('nc-toggle', { 'nc-change': 'onNcChange' });
export const NcSearchInput = createComponent('nc-search-input', { 'nc-search': 'onNcSearch', 'nc-clear': 'onNcClear' });
export const NcModal = createComponent('nc-modal', { 'nc-open': 'onNcOpen', 'nc-close': 'onNcClose' });
export const NcToast = createComponent('nc-toast', { 'nc-dismiss': 'onNcDismiss' });
export const NcToastContainer = createComponent('nc-toast-container');
export const NcDrawer = createComponent('nc-drawer', { 'nc-open': 'onNcOpen', 'nc-close': 'onNcClose' });
export const NcPopover = createComponent('nc-popover');
export const NcAlert = createComponent('nc-alert', { 'nc-dismiss': 'onNcDismiss' });

// Sprint 3
export const NcTabs = createComponent('nc-tabs', { 'nc-tab-change': 'onNcTabChange' });
export const NcTab = createComponent('nc-tab');
export const NcTabPanel = createComponent('nc-tab-panel');
export const NcAccordion = createComponent('nc-accordion');
export const NcAccordionItem = createComponent('nc-accordion-item', { 'nc-toggle': 'onNcToggle' });
export const NcBreadcrumb = createComponent('nc-breadcrumb');
export const NcBreadcrumbItem = createComponent('nc-breadcrumb-item');
export const NcPagination = createComponent('nc-pagination', { 'nc-page-change': 'onNcPageChange' });
export const NcProgressBar = createComponent('nc-progress-bar');
export const NcStarRating = createComponent('nc-star-rating', { 'nc-change': 'onNcChange' });
export const NcDropdownMenu = createComponent('nc-dropdown-menu', { 'nc-select': 'onNcSelect' });
export const NcMenuItem = createComponent('nc-menu-item');
export const NcMenuDivider = createComponent('nc-menu-divider');
export const NcMenuGroup = createComponent('nc-menu-group');
export const NcTable = createComponent('nc-table', { 'nc-sort': 'onNcSort' });
