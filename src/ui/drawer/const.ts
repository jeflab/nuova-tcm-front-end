export type DrawerState =
  | "success"
  | "danger"
  | "waiting"
  | "active"
  | "loading";

export const drawerColors: Record<DrawerState, string> = {
  success: "success",
  danger: "danger",
  waiting: "cancel",
  active: "primary",
  loading: "default",
};
