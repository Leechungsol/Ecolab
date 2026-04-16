export const formatPhoneNumber = (e) => {
  const cleaned = e.event.currentTarget.value.replace(/\D/g, "");

  let formatted;
  if (cleaned.length <= 8) {
    formatted = cleaned.replace(/(\d+)(\d{4})/, "$1-$2");
  } else if (cleaned.length <= 12) {
    formatted = cleaned.replace(/(\d+)(\d{4})(\d{4})/, "$1-$2-$3");
  } else if (cleaned.length <= 16) {
    formatted = cleaned.replace(/(\d+)(\d{4})(\d{4})(\d{4})/, "$1-$2-$3-$4");
  } else {
    formatted = cleaned.replace(
      /(\d+)(\d{4})(\d{4})(\d{4})(\d{4})/,
      "$1-$2-$3-$4-$5",
    );
  }

  e.component.option("value", formatted);
};
