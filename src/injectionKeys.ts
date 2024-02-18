import type { InjectionKey } from "vue";
import type { SidebarInjectI } from "@/components/Sidebar";

const sidebarInjectionKey = Symbol() as InjectionKey<SidebarInjectI>;

export { sidebarInjectionKey };
