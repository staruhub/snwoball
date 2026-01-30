export const isIframe = () =>
  typeof window !== "undefined" && window.self !== window.top;

export const getParentOrigin = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const referrer = document.referrer;
  if (!referrer) {
    return "";
  }

  try {
    return new URL(referrer).origin;
  } catch {
    return "";
  }
};

export const getAllowedParentOrigins = () => {
  const raw = process.env.NEXT_PUBLIC_IFRAME_PARENT_ORIGINS;
  if (raw) {
    return raw
      .split(",")
      .map((origin) => origin.trim())
      .filter((origin) => origin && origin !== "*");
  }

  const inferred = getParentOrigin();
  return inferred ? [inferred] : [];
};

export const notifyParent = (payload: unknown) => {
  if (!isIframe()) {
    return;
  }

  const allowedOrigins = getAllowedParentOrigins();
  const parentOrigin = getParentOrigin();
  const targetOrigin = parentOrigin
    ? allowedOrigins.find((origin) => origin === parentOrigin) || allowedOrigins[0]
    : allowedOrigins[0];

  if (!targetOrigin) {
    return;
  }

  window.parent.postMessage(payload, targetOrigin);
};
