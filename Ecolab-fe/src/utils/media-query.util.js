const breakpoints = {
  XSmall: "(max-width: 768px)",
  Small: "(min-width: 768px) and (max-width: 992px)",
  Medium: "(min-width: 992px) and (max-width: 1200px)",
  Large: "(min-width: 1200px)",
};

let handlers = [];
const xSmallMedia = window.matchMedia(breakpoints.XSmall);
const smallMedia = window.matchMedia(breakpoints.Small);
const mediumMedia = window.matchMedia(breakpoints.Medium);
const largeMedia = window.matchMedia(breakpoints.Large);

[xSmallMedia, smallMedia, mediumMedia, largeMedia].forEach((media) => {
  media.addListener(() => {
    handlers.forEach((handler) => handler());
  });
});

export const sizes = () => {
  return {
    "screen-x-small": xSmallMedia.matches,
    "screen-small": smallMedia.matches,
    "screen-medium": mediumMedia.matches,
    "screen-large": largeMedia.matches,
  };
};

export const locateInMenu = sizes()["screen-large"] ? "never" : "always";

export const subscribe = (handler) => handlers.push(handler);

export const unsubscribe = (handler) => {
  handlers = handlers.filter((item) => item !== handler);
};
