import {
  defineAdminNav,
  defineCommand,
  definePage,
  defineWorkspace,
  type AdminContributionRegistry
} from "@platform/admin-contracts";

import { BusinessAdminPage } from "./admin/main.page";

export const adminContributions: Pick<AdminContributionRegistry, "workspaces" | "nav" | "pages" | "commands"> = {
  workspaces: [
    defineWorkspace({
      id: "manufacturing",
      label: "Manufacturing",
      icon: "factory",
      description: "Production plans, work orders, and WIP-aware manufacturing execution.",
      permission: "manufacturing.boms.read",
      homePath: "/admin/business/manufacturing",
      quickActions: ["manufacturing-core.open.control-room"]
    })
  ],
  nav: [
    defineAdminNav({
      workspace: "manufacturing",
      group: "control-room",
      items: [
        {
          id: "manufacturing-core.overview",
          label: "Control Room",
          icon: "factory",
          to: "/admin/business/manufacturing",
          permission: "manufacturing.boms.read"
        }
      ]
    })
  ],
  pages: [
    definePage({
      id: "manufacturing-core.page",
      kind: "dashboard",
      route: "/admin/business/manufacturing",
      label: "Manufacturing Control Room",
      workspace: "manufacturing",
      group: "control-room",
      permission: "manufacturing.boms.read",
      component: BusinessAdminPage
    })
  ],
  commands: [
    defineCommand({
      id: "manufacturing-core.open.control-room",
      label: "Open Manufacturing Core",
      permission: "manufacturing.boms.read",
      href: "/admin/business/manufacturing",
      keywords: ["manufacturing core","manufacturing","business"]
    })
  ]
};
