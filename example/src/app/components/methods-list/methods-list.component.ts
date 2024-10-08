import {Component, NgZone} from '@angular/core';
import {
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPickerLegacy,
} from '@ionic/angular/standalone';
import {
  CalendarChooserDisplayStyle,
  CalendarChooserSelectionStyle,
  CapacitorCalendar,
  PluginPermission,
  PluginPermissionsMap,
  RecurrenceFrequency,
  RecurrenceRule,
} from '@ebarooni/capacitor-calendar';
import {StoreService} from '../../store/store.service';
import {calendarChooserPickerColumns} from '../../ion-picker-data/calendar-chooser/calendar-chooser-picker-columns';
import {
  CalendarChooserResult,
  getCalendarChooserPickerButtons,
} from '../../ion-picker-data/calendar-chooser/calendar-chooser-picker-buttons';
import {checkPermissionPickerColumns} from '../../ion-picker-data/check-permission/check-permission-picker-columns';
import {
  CheckPermissionPickerResult,
  getCheckPermissionPickerButtons,
} from '../../ion-picker-data/check-permission/check-permission-picker-buttons';
import {RemindersListViewModalComponent} from '../reminders-list-view-modal/reminders-list-view-modal.component';
import {EventsActionModalComponent} from '../events-action-modal/events-action-modal.component';
import {EventUpdate} from '../events-action-modal/event-update';
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-methods-list',
  templateUrl: './methods-list.component.html',
  imports: [
    IonInput,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    EventsActionModalComponent,
    IonPickerLegacy,
    RemindersListViewModalComponent,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class MethodsListComponent {
  public readonly calendarChooserPickerColumns = calendarChooserPickerColumns;
  public readonly calendarChooserPickerButtons =
    getCalendarChooserPickerButtons((result: CalendarChooserResult) =>
      this.zone.run(() =>
        this.selectCalendarsWithPrompt(
          result.selectionStyle.value,
          result.displayStyle.value,
        ),
      ),
    );
  public readonly checkPermissionPickerColumns = checkPermissionPickerColumns;
  public readonly checkPermissionPickerButtons =
    getCheckPermissionPickerButtons((result: CheckPermissionPickerResult) =>
      this.zone.run(() => this.checkPermission(result.alias.value)),
    );
  public readonly requestPermissionPickerButtons =
    getCheckPermissionPickerButtons((result: CheckPermissionPickerResult) =>
      this.zone.run(() => this.requestPermission(result.alias.value)),
    );

  public calendarDeleteId: FormControl = new FormControl("")
  public eventCalendarId: FormControl = new FormControl("")
  public eventCalendarIdWithRecurrence: FormControl = new FormControl("")

  constructor(
    private readonly storeService: StoreService,
    private readonly zone: NgZone,
  ) {}

  public createEventWithPrompt(): void {
    const now = Date.now();
    CapacitorCalendar.createEventWithPrompt({
      title: 'Capacitor Calendar',
      startDate: now,
      endDate: now + 2 * 60 * 60 * 1000,
      location: 'Capacitor Calendar',
      isAllDay: false,
      alertOffsetInMinutes: [0, 1440],
      url: 'https://capacitor-calendar.pages.dev',
      notes: 'A CapacitorJS plugin',
    })
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public selectCalendarsWithPrompt(
    selectionStyle: CalendarChooserSelectionStyle,
    displayStyle: CalendarChooserDisplayStyle,
  ): void {
    CapacitorCalendar.selectCalendarsWithPrompt({
      selectionStyle: selectionStyle,
      displayStyle: displayStyle,
    })
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public checkAllPermissions(): void {
    CapacitorCalendar.checkAllPermissions()
      .then((response) => {
        this.storeService.updateState({ permissions: response });
        this.storeService.dispatchLog(JSON.stringify(response));
      })
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public requestAllPermissions(): void {
    CapacitorCalendar.requestAllPermissions()
      .then((response) => {
        this.storeService.updateState({ permissions: response });
        this.storeService.dispatchLog(JSON.stringify(response));
      })
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public listCalendars(): void {
    CapacitorCalendar.listCalendars()
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public getDefaultCalendar(): void {
    CapacitorCalendar.getDefaultCalendar()
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public checkPermission(alias: PluginPermission): void {
    CapacitorCalendar.checkPermission({ alias: alias })
      .then((response) => {
        const permissionState: Partial<PluginPermissionsMap> = {};
        permissionState[alias] = response.result;
        this.storeService.updateState({ permissions: permissionState });
        this.storeService.dispatchLog(JSON.stringify(response));
      })
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public createEvent(): void {
    const now = Date.now();
    CapacitorCalendar.createEvent({
      title: 'Capacitor Calendar',
      calendarId: this.eventCalendarId.value,
      startDate: now,
      endDate: now + 2 * 60 * 60 * 1000,
      location: 'Capacitor Calendar',
      isAllDay: false,
      alertOffsetInMinutes: 15,
      url: 'https://capacitor-calendar.pages.dev',
      notes: 'A CapacitorJS plugin',
    })
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public createEventWithRecurrence() {
    const now = Date.now();
    const end = now + 2 * 60 * 60 * 1000;
    const recurrenceRule: RecurrenceRule = {
      frequency: RecurrenceFrequency.DAILY,
      interval: 1,
    }

    CapacitorCalendar.createEvent({
      title: 'Capacitor Calendar',
      calendarId: this.eventCalendarIdWithRecurrence.value,
      startDate: now,
      endDate: end,
      location: 'Capacitor Calendar',
      isAllDay: false,
      alertOffsetInMinutes: 15,
      url: 'https://capacitor-calendar.pages.dev',
      notes: 'A CapacitorJS plugin',
      recurrence: recurrenceRule
    })
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public requestPermission(alias: PluginPermission): void {
    CapacitorCalendar.requestPermission({ alias: alias })
      .then((result) => {
        const update: Partial<PluginPermissionsMap> = {};
        switch (alias) {
          case PluginPermission.READ_CALENDAR:
            update[PluginPermission.READ_CALENDAR] = result.result;
            break;
          case PluginPermission.WRITE_CALENDAR:
            update[PluginPermission.WRITE_CALENDAR] = result.result;
            break;
          case PluginPermission.READ_REMINDERS:
            update[PluginPermission.READ_REMINDERS] = result.result;
            break;
          case PluginPermission.WRITE_REMINDERS:
            update[PluginPermission.WRITE_REMINDERS] = result.result;
            break;
        }
        this.storeService.updateState({ permissions: update });
        this.storeService.dispatchLog(JSON.stringify(result));
      })
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public getDefaultRemindersList(): void {
    CapacitorCalendar.getDefaultRemindersList()
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public getRemindersLists(): void {
    CapacitorCalendar.getRemindersLists()
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public createReminder(): void {
    CapacitorCalendar.createReminder({
      title: 'Capacitor Calendar',
      notes: 'A CapacitorJS Plugin',
      priority: 5,
      dueDate: Date.now(),
      isCompleted: false,
      url: 'https://capacitor-calendar.pages.dev/',
      location: 'Remote',
      recurrence: {
        frequency: RecurrenceFrequency.WEEKLY,
        interval: 3,
        end: Date.now() + 6 * 7 * 24 * 60 * 60 * 1000, // 6 weeks from now
      },
    })
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public openCalendar(): void {
    CapacitorCalendar.openCalendar({
      date: Date.now() + 24 * 60 * 60 * 1000, // tomorrow
    }).catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public openReminders(): void {
    CapacitorCalendar.openReminders().catch((error) =>
      this.storeService.dispatchLog(JSON.stringify(error)),
    );
  }

  public listEventsInRange(): void {
    CapacitorCalendar.listEventsInRange({
      startDate: Date.now(),
      endDate: Date.now() + 6 * 7 * 24 * 60 * 60 * 1000, // 6 weeks from now
    })
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public deleteEventsById(id: string): void {
    CapacitorCalendar.deleteEventsById({
      ids: [id],
    })
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public createCalendar(): void {
    CapacitorCalendar.createCalendar({
      title: 'Capacitor Calendar',
      color: '#fe48b3',
    })
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public deleteCalendarWithPrompt(): void {
    CapacitorCalendar.selectCalendarsWithPrompt({
      selectionStyle: CalendarChooserSelectionStyle.SINGLE,
      displayStyle: CalendarChooserDisplayStyle.ALL_CALENDARS,
    })
      .then(({ result }) => {
        if (result.length) {
          return CapacitorCalendar.deleteCalendar({ id: result[0].id });
        } else {
          return Promise.resolve();
        }
      })
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public deleteCalendar(): void {
    CapacitorCalendar.deleteCalendar({id: this.calendarDeleteId.value})
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public getRemindersFromLists(): void {
    CapacitorCalendar.getRemindersFromLists()
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public deleteRemindersById(ids: string[]): void {
    CapacitorCalendar.deleteRemindersById({
      ids: ids,
    })
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public requestWriteOnlyCalendarAccess(): void {
    CapacitorCalendar.requestWriteOnlyCalendarAccess()
      .then((response) => {
        const update: Partial<PluginPermissionsMap> = {
          [PluginPermission.WRITE_CALENDAR]: response.result,
        };
        this.storeService.updateState({ permissions: update });
        this.storeService.dispatchLog(JSON.stringify(response));
      })
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public requestReadOnlyCalendarAccess(): void {
    CapacitorCalendar.requestReadOnlyCalendarAccess()
      .then((response) => {
        const update: Partial<PluginPermissionsMap> = {
          [PluginPermission.READ_CALENDAR]: response.result,
        };
        this.storeService.updateState({ permissions: update });
        this.storeService.dispatchLog(JSON.stringify(response));
      })
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public requestFullCalendarAccess(): void {
    CapacitorCalendar.requestFullCalendarAccess()
      .then((response) => {
        const update: Partial<PluginPermissionsMap> = {
          [PluginPermission.READ_CALENDAR]: response.result,
          [PluginPermission.WRITE_CALENDAR]: response.result,
        };
        this.storeService.updateState({ permissions: update });
        this.storeService.dispatchLog(JSON.stringify(response));
      })
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public requestFullRemindersAccess(): void {
    CapacitorCalendar.requestFullRemindersAccess()
      .then((response) => {
        const update: Partial<PluginPermissionsMap> = {
          [PluginPermission.READ_REMINDERS]: response.result,
          [PluginPermission.WRITE_REMINDERS]: response.result,
        };
        this.storeService.updateState({ permissions: update });
        this.storeService.dispatchLog(JSON.stringify(response));
      })
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public modifyEventWithPrompt(id: string, update: EventUpdate): void {
    void CapacitorCalendar.modifyEventWithPrompt({
      id: id,
      update: update,
    })
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public modifyEvent(id: string, update: EventUpdate): void {
    void CapacitorCalendar.modifyEvent({
      id: id,
      update: update,
    }).catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public fetchAllCalendarSources(): void {
    void CapacitorCalendar.fetchAllCalendarSources()
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

  public fetchAllRemindersSources(): void {
    void CapacitorCalendar.fetchAllRemindersSources()
      .then((response) =>
        this.storeService.dispatchLog(JSON.stringify(response)),
      )
      .catch((error) => this.storeService.dispatchLog(JSON.stringify(error)));
  }

}
