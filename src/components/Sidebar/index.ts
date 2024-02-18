import SidebarPanel from "./SidebarPanel.vue";
import SidebarToggle from "./SidebarToggle.vue";
import type { Ref } from "vue";

interface SidebarInjectI {
  isExpanded: Ref<boolean>;
  toggle: () => void;
}

export { SidebarPanel, SidebarToggle };
export type { SidebarInjectI };
