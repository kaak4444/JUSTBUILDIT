// src/core/kernel/KernelMonitor.ts
export class KernelMonitor {
  log(event: string, data: any) {
    console.log(`[KERNEL] ${event}`, data);
  }

  error(event: string, data: any) {
    console.error(`[KERNEL ERROR] ${event}`, data);
  }
}

export const kernelMonitor = new KernelMonitor();
