// Minimal non-blocking toast utility used across the app.
// This is intentionally tiny to avoid adding new libraries.
export function showNotification(message, duration = 5000) {
  try {
    const containerId = "app-toast-container";
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      container.style.position = "fixed";
      container.style.right = "16px";
      container.style.top = "16px";
      container.style.zIndex = 9999;
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "8px";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.background = "rgba(17,24,39,0.95)"; // gray-900
    toast.style.color = "#fff";
    toast.style.padding = "10px 14px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    toast.style.maxWidth = "320px";
    toast.style.fontSize = "14px";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 200ms ease, transform 200ms ease";
    toast.style.transform = "translateY(-4px)";

    container.appendChild(toast);

    // Force a frame so transition runs
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });

    const timeout = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-4px)";
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
        // remove container when empty
        if (container && container.childElementCount === 0 && container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }, 220);
    }, duration);

    // Allow click to dismiss immediately
    toast.addEventListener("click", () => {
      clearTimeout(timeout);
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-4px)";
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 220);
    });

    return () => {
      clearTimeout(timeout);
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    };
  } catch (e) {
    // Swallow any errors to avoid breaking main flows
    // (e.g., server-side rendering where document isn't defined)
    return () => {};
  }
}
