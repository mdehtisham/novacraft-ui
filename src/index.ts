// ─── Core ───
export { NcBaseElement } from './core/base-element';
export { defineElement, css, clamp, debounce, uniqueId } from './utils/helpers';

// ─── Theme ───
import './theme/tokens.css';

// ─── Sprint 1: Core Primitives ───
export { NcButton } from './components/button/button';
export { NcBadge } from './components/badge/badge';
export { NcCard } from './components/card/card';
export { NcIcon, iconRegistry } from './components/icon/icon';
export { NcSpinner } from './components/spinner/spinner';
export { NcSkeleton } from './components/skeleton/skeleton';
export { NcThemeToggle } from './components/theme-toggle/theme-toggle';
export { NcTooltip } from './components/tooltip/tooltip';
export { NcAvatar } from './components/avatar/avatar';
export { NcStatusBadge } from './components/status-badge/status-badge';

// ─── Sprint 2: Form Components ───
export { NcInput } from './components/input/input';
export { NcTextarea } from './components/textarea/textarea';
export { NcSelect } from './components/select/select';
export { NcCheckbox } from './components/checkbox/checkbox';
export { NcRadioGroup, NcRadio } from './components/radio/radio';
export { NcToggle } from './components/toggle/toggle';
export { NcSearchInput } from './components/search-input/search-input';

// ─── Sprint 2: Overlay & Feedback ───
export { NcModal } from './components/modal/modal';
export { NcToast, NcToastContainer, toast } from './components/toast/toast';
export { NcDrawer } from './components/drawer/drawer';
export { NcPopover } from './components/popover/popover';
export { NcAlert } from './components/alert/alert';

// ─── Sprint 3: Navigation & Data Display ───
export { NcTabs, NcTab, NcTabPanel } from './components/tabs/tabs';
export { NcAccordion, NcAccordionItem } from './components/accordion/accordion';
export { NcBreadcrumb, NcBreadcrumbItem } from './components/breadcrumb/breadcrumb';
export { NcPagination } from './components/pagination/pagination';
export { NcProgressBar } from './components/progress-bar/progress-bar';
export { NcStarRating } from './components/star-rating/star-rating';
export { NcDropdownMenu, NcMenuItem, NcMenuDivider, NcMenuGroup } from './components/dropdown-menu/dropdown-menu';
export { NcTable } from './components/table/table';
