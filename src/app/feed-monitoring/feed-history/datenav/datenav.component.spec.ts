import { byText, createComponentFactory, Spectator } from '@ngneat/spectator';
import { DateTime } from 'luxon';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeedMonitoringModule } from '../../feed-monitoring.module';
import { DatenavItemComponent } from './datenav-item/datenav-item.component';
import { DatenavComponent } from './datenav.component';

describe('DatenavComponent', () => {
  let spectator: Spectator<DatenavComponent>;

  const createComponent = createComponentFactory({
    component: DatenavComponent,
    imports: [SharedModule, FeedMonitoringModule],
    declarations: [DatenavItemComponent],
  });

  const items = [
    { heat: 0, date: DateTime.fromObject({ year: 2020, month: 11, day: 19 }) },
    { heat: 1, date: DateTime.fromObject({ year: 2020, month: 11, day: 20 }) },
    { heat: 2, date: DateTime.fromObject({ year: 2020, month: 11, day: 21 }) },
    { heat: 3, date: DateTime.fromObject({ year: 2020, month: 11, day: 22 }) },
    { heat: 4, date: DateTime.fromObject({ year: 2020, month: 11, day: 23 }) },
    { heat: 5, date: DateTime.fromObject({ year: 2020, month: 11, day: 24 }) },
    { heat: 6, date: DateTime.fromObject({ year: 2020, month: 11, day: 25 }) },
  ];

  beforeEach(async () => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display buttons for each item in map', () => {
    spectator.component.stats = items;

    spectator.detectChanges();

    const navitems = spectator.queryAll(DatenavItemComponent);

    expect(navitems).toHaveLength(7);

    items.forEach(({ heat, date }, inx) => {
      expect(navitems[inx].heat).toEqual(heat);
      expect(navitems[inx].date).toEqual(date);
      expect(navitems[inx].active).toEqual(false);
    });
  });

  it('should set active state on selected date', () => {
    spectator.component.stats = items;

    const selectedDate = DateTime.fromObject({ year: 2020, month: 11, day: 22 });
    spectator.component.date = selectedDate;

    spectator.detectChanges();

    const navitems = spectator.queryAll(DatenavItemComponent);

    const selectedItem = navitems.find(({ date }) => date?.equals(selectedDate));

    expect(selectedItem?.active).toBeTrue();
  });

  it('should emit date on click', () => {
    spyOn(spectator.component.dateSelected, 'emit');

    spectator.component.stats = items;
    spectator.detectChanges();

    spectator.click(byText('20 November'));

    expect(spectator.component.dateSelected.emit).toHaveBeenCalledTimes(1);
    expect(spectator.component.dateSelected.emit).toHaveBeenCalledWith(
      DateTime.fromObject({ year: 2020, month: 11, day: 20 })
    );
  });

  it('should show next and previous buttons', () => {
    spectator.component.stats = items;
    spectator.component.date = DateTime.fromObject({ year: 2020, month: 11, day: 22 });
    spectator.detectChanges();

    const prev = spectator.query(byText('Previous'));

    expect(prev).toBeTruthy();

    const next = spectator.query(byText('Next'));

    expect(next).toBeTruthy();
  });

  it('should emit event on previous click', () => {
    spyOn(spectator.component.dateSelected, 'emit');
    const selectedDate = DateTime.fromObject({ year: 2020, month: 11, day: 22 });
    const expectedDate = DateTime.fromObject({ year: 2020, month: 11, day: 21 });

    spectator.component.stats = items;
    spectator.component.date = selectedDate;
    spectator.detectChanges();

    spectator.click(byText('Previous'));

    expect(spectator.component.dateSelected.emit).toHaveBeenCalledTimes(1);
    expect(spectator.component.dateSelected.emit).toHaveBeenCalledWith(expectedDate);
  });

  it('should emit event on next click', () => {
    spyOn(spectator.component.dateSelected, 'emit');
    const selectedDate = DateTime.fromObject({ year: 2020, month: 11, day: 22 });
    const expectedDate = DateTime.fromObject({ year: 2020, month: 11, day: 23 });

    spectator.component.stats = items;
    spectator.component.date = selectedDate;
    spectator.detectChanges();

    spectator.click(byText('Next'));

    expect(spectator.component.dateSelected.emit).toHaveBeenCalledTimes(1);
    expect(spectator.component.dateSelected.emit).toHaveBeenCalledWith(expectedDate);
  });

  it('should not emit event on next click if at end of range', () => {
    spyOn(spectator.component.dateSelected, 'emit');
    const selectedDate = DateTime.fromObject({ year: 2020, month: 11, day: 25 });

    spectator.component.stats = items;
    spectator.component.date = selectedDate;
    spectator.detectChanges();

    spectator.click(byText('Next'));

    expect(spectator.component.dateSelected.emit).not.toHaveBeenCalled();
  });

  it('should not emit event on prev click if at end of range', () => {
    spyOn(spectator.component.dateSelected, 'emit');
    const selectedDate = DateTime.fromObject({ year: 2020, month: 11, day: 19 });

    spectator.component.stats = items;
    spectator.component.date = selectedDate;
    spectator.detectChanges();

    spectator.click(byText('Previous'));

    expect(spectator.component.dateSelected.emit).not.toHaveBeenCalled();
  });
});
