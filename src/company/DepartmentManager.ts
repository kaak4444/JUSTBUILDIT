/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IDepartmentKPI {
  kpiName: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: "ON_TRACK" | "AT_RISK" | "ACHIEVED";
}

export interface IDepartmentManager {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  kpis: IDepartmentKPI[];
}

export class DepartmentManagerRegistry {
  private static managers: IDepartmentManager[] = [
    {
      id: "mgr_research",
      name: "Dr. Alistair Vance",
      title: "VP of Strategic Research & Gap Discovery",
      departmentId: "research",
      kpis: [
        { kpiName: "Niche Discovered Success Rate", targetValue: 90, currentValue: 94.2, unit: "%", status: "ON_TRACK" },
        { kpiName: "Verification Loop Efficiency", targetValue: 85, currentValue: 88, unit: "%", status: "ACHIEVED" }
      ]
    },
    {
      id: "mgr_engineering",
      name: "Elena Rostova",
      title: "VP of Engineering & Fullstack Sandbox Delivery",
      departmentId: "engineering",
      kpis: [
        { kpiName: "Zero-Latency HMR Build Stability", targetValue: 95, currentValue: 91, unit: "%", status: "AT_RISK" },
        { kpiName: "Sandbox Task Isolation Coverage", targetValue: 100, currentValue: 100, unit: "%", status: "ACHIEVED" }
      ]
    },
    {
      id: "mgr_commerce",
      name: "Marcus Sterling",
      title: "Chief Revenue & Compliance Officer",
      departmentId: "commerce",
      kpis: [
        { kpiName: "EU German Tariff Compliant Audits", targetValue: 100, currentValue: 100, unit: "%", status: "ACHIEVED" },
        { kpiName: "Dropshipping Net Margin Average", targetValue: 35, currentValue: 42.5, unit: "%", status: "ON_TRACK" }
      ]
    }
  ];

  public static listManagers(): IDepartmentManager[] {
    return this.managers;
  }

  public static getManagerForDepartment(deptId: string): IDepartmentManager | undefined {
    return this.managers.find(m => m.departmentId === deptId);
  }

  public static reportKPIMetadata(deptId: string, kpiName: string, newValue: number) {
    const mgr = this.getManagerForDepartment(deptId);
    if (mgr) {
      const kpi = mgr.kpis.find(k => k.kpiName === kpiName);
      if (kpi) {
        kpi.currentValue = newValue;
        kpi.status = kpi.currentValue >= kpi.targetValue ? "ACHIEVED" : kpi.currentValue >= kpi.targetValue * 0.9 ? "ON_TRACK" : "AT_RISK";
      }
    }
  }
}
