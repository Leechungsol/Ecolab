const getMimeType = (base64) => {
  if (base64.startsWith("/9j/")) {
    return "image/jpeg";
  } else if (base64.startsWith("iVBORw0KGgo")) {
    return "image/png";
  } else if (base64.startsWith("UklGRi4=")) {
    return "image/webp";
  } else if (base64.startsWith("PHN2Zy")) {
    return "image/svg+xml";
  }
  return "image/jpeg";
};

export const getFullBase64 = (base64) => {
  const mimeType = getMimeType(base64);
  return `data:${mimeType};base64,${base64}`;
};
