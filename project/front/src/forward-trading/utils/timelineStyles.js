export const statusStyles = {
  past: {
    bubble: "bg-feedback-background-success",
    line: "bg-feedback-background-success",
    text: "text-subtle",
    label: "text-subtle",
  },
  current: {
    bubble: "bg-info",
    line: "bg-info",
    text: "text-neutral",
    label: "text-neutral",
  },
  future: {
    bubble: "bg-feedback-background-neutral",
    line: "bg-feedback-background-neutral",
    text: "text-subtle",
    label: "text-subtle",
  },
};

export const getStatusConfig = (status) => {
  const normalized = status?.toLowerCase();
  return statusStyles[normalized] || statusStyles.future;
};
