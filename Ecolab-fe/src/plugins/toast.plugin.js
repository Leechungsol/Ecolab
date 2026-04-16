import notify from "devextreme/ui/notify";

/**
 * A plugin that provides a set of utility functions for displaying toast notifications.
 *
 * The plugin adds the following methods to the global properties of the Vue app:
 *
 * - `$toast.error(message)`: Displays an error toast notification with the provided message.
 * - `$toast.success(message)`: Displays a success toast notification with the provided message.
 * - `$toast.info(message)`: Displays an informational toast notification with the provided message.
 * - `$toast.warning(message)`: Displays a warning toast notification with the provided message.
 *
 * All toast notifications are displayed with a width of 350 pixels and a timeout of 3 seconds.
 */
export default {
  install: (app) => {
    app.config.globalProperties.$toast = {
      error: (message) => notify({ message, width: 350 }, "error", 3000),
      success: (message) => notify({ message, width: 350 }, "success", 3000),
      info: (message) => notify({ message, width: 350 }, "info", 3000),
      warning: (message) => notify({ message, width: 350 }, "warning", 3000),
    };
  },
};
