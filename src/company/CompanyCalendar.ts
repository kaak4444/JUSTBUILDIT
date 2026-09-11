/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ICalendarEvent {
  id: string;
  title: string;
  type: "PROJECT" | "MAINTENANCE" | "RESEARCH_SWEEP" | "HOLIDAY";
  startTime: string;
  endTime: string;
  status: "SCHEDULED" | "ACTIVE" | "COMPLETED";
}

export class CompanyCalendar {
  private static events: ICalendarEvent[] = [
    {
      id: "cal_01",
      title: "TOEFL AMOLED E-reader continuous background crawl",
      type: "RESEARCH_SWEEP",
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
      status: "ACTIVE"
    },
    {
      id: "cal_02",
      title: "Weekly Sandboxed Tool Container updates & sanitization",
      type: "MAINTENANCE",
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 28).toISOString(),
      status: "SCHEDULED"
    },
    {
      id: "cal_03",
      title: "German Tariff Declaration automated compliance test",
      type: "PROJECT",
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      endTime: new Date(Date.now() - 1000 * 60 * 60 * 44).toISOString(),
      status: "COMPLETED"
    }
  ];

  public static listCalendarEvents(): ICalendarEvent[] {
    return this.events;
  }

  public static scheduleEvent(event: Omit<ICalendarEvent, "id">): ICalendarEvent {
    const newEvent: ICalendarEvent = {
      ...event,
      id: `cal_auto_${Date.now()}`
    };
    this.events.push(newEvent);
    return newEvent;
  }

  public static isWorkingHours(): boolean {
    // Autonomic companies work 24/7/365, but can enforce synthetic pauses for maintenance
    return true;
  }
}
