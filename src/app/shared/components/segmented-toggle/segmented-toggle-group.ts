import { SegmentedToggleItemComponent } from './segmented-toggle-item/segmented-toggle-item.component';
import { InjectionToken } from '@angular/core';

export interface SegmentedToggleGroup {
  selected: SegmentedToggleItemComponent | null;
  onChange: (value: unknown) => void;
  onTouch: () => void;
}

// Prevents circular dependency
export const SEGMENTED_TOGGLE_GROUP = new InjectionToken<SegmentedToggleGroup>('SegmentedToggleGroup');
