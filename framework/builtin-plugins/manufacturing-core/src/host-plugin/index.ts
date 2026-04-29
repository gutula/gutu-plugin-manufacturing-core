/** Host-plugin contribution for manufacturing-core.
 *
 *  Mounts at /api/<routes> via the shell's plugin loader. */
import type { HostPlugin } from "@gutu-host/plugin-contract";

import { manufacturingRoutes } from "./routes/manufacturing";


export const hostPlugin: HostPlugin = {
  id: "manufacturing-core",
  version: "1.0.0",
  
  routes: [
    { mountPath: "/manufacturing", router: manufacturingRoutes }
  ],
  resources: [
    "manufacturing.bom",
    "manufacturing.bom-line",
    "manufacturing.job-card",
    "manufacturing.material-consumption",
    "manufacturing.operation",
    "manufacturing.order",
    "manufacturing.routing",
    "manufacturing.work-center",
  ],
};

// Re-export the lib API so other plugins can `import` from
// "@gutu-plugin/manufacturing-core".
export * from "./lib";
