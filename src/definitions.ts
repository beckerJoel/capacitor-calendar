import type { PermissionState } from '@capacitor/core';

/**
 * Represents a calendar object with an ID and title.
 *
 * @interface Calendar
 * @property {string} id - The unique identifier of the calendar.
 * @property {string} title - The title or name of the calendar.
 */
export interface Calendar {
  id: string;
  title: string;
}

/**
 * Describes the permission status for reading from the calendar.
 *
 * @interface
 */
export interface CalendarPermissionStatus {
  readCalendar: PermissionState;
  writeCalendar: PermissionState;
}

export interface CapacitorCalendarPlugin {
  /**
   * Checks the current authorization status of a specific permission.
   *
   * @method
   * @param options An object with the name of the permission
   * @returns {Promise&lt;{ result: PermissionState }&gt;} – A promise that resolves with the current status of the requested permission.
   * @example
   * const status = await this.checkPermission({ alias: 'readCalendar' });
   */
  checkPermission(options: { alias: keyof CalendarPermissionStatus }): Promise<{ result: PermissionState }>;

  /**
   * Checks the current authorization status of all the required permissions for the plugin.
   *
   * @method
   * @returns {Promise&lt;CalendarPermissionStatus&gt;} – A promise that resolves with an object containing all the permissions and their status.
   * @example
   * const permissionsStatus = await this.checkAllPermissions();
   */
  checkAllPermissions(): Promise<CalendarPermissionStatus>;

  /**
   * Requests authorization to a specific permission, if not already granted.
   * If the permission is already granted, it will directly return the status.
   *
   * @method
   * @param options An object with the name of the permission
   * @returns {Promise&lt;{ result: PermissionState }&gt;} – A promise that resolves with the new permission status after the request is made.
   * @example
   * const result = await this.requestPermission({ alias: 'readCalendar' });
   */
  requestPermission(options: { alias: keyof CalendarPermissionStatus }): Promise<{ result: PermissionState }>;

  /**
   * Requests authorization to all the required permissions for the plugin, if they have not already been granted.
   *
   * @method
   * @returns {Promise&lt;CalendarPermissionStatus&gt;} – A promise that resolves with the new permission statuses after the request is made.
   * @example
   * const permissionResults = await this.requestAllPermissions();
   */
  requestAllPermissions(): Promise<CalendarPermissionStatus>;

  /**
   * Creates an event in the calendar by using the native calendar.
   * On iOS opens a native sheet and on Android opens an intent.
   * This method does not need any read or write authorization from the user on iOS. However, the entries in the Info.plist file are still needed.
   * On Android, the user has to authorize for read access.
   *
   * @method
   * @returns {Promise&lt;{ eventCreated: boolean }&gt;} – A promise that resolves with the result of the action.
   * @example
   * let result: CalendarEventActionResult;
   * if (capacitor.getPlatform() === 'android') {
   *     const readCalendarStatus = (await this.requestPermission({ alias: 'readCalendar' })).result;
   *     if (readCalendarStatus === 'granted') {
   *         result = await this.createEventWithPrompt();
   *     } else {
   *         //  handle the case when user rejects the permission
   *     }
   * } else {
   *     result = await this.createEventWithPrompt();
   * }
   */
  createEventWithPrompt(): Promise<{ eventCreated: boolean }>;

  /**
   * Presents a prompt to the user to select calendars. This method is available only on iOS.
   *
   * @method selectCalendarsWithPrompt
   * @async
   * @returns { Promise<{ result: Calendar[] }> } A promise that resolves with an array of selected calendars,
   * where each calendar object contains an ID and a title.
   * @example
   * if (capacitor.getPlatform() === 'ios') {
   *     const selectedCalendars = await selectCalendarsWithPrompt();
   *     console.log(selectedCalendars); // [{ id: '1', title: 'Work Calendar' }]
   * }
   */
  selectCalendarsWithPrompt(): Promise<{ result: Calendar[] }>
}
