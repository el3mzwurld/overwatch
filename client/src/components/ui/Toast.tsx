interface Toast {
  message: string;
  open: boolean;
  mode: "error" | "success" | "danger";
}
