export function metaLoginAppId() {
  return process.env.META_LOGIN_APP_ID;
}

export function metaLoginAppSecret() {
  return process.env.META_LOGIN_APP_SECRET;
}

export function metaBusinessAppId() {
  return process.env.META_BUSINESS_APP_ID || process.env.META_APP_ID;
}

export function metaBusinessAppSecret() {
  return process.env.META_BUSINESS_APP_SECRET || process.env.META_APP_SECRET;
}

export function metaBusinessConfigId() {
  return process.env.META_BUSINESS_CONFIG_ID || process.env.META_CONFIG_ID;
}

export function separatedMetaCredentialsReady() {
  return Boolean(
    metaLoginAppId() &&
      metaLoginAppSecret() &&
      process.env.META_BUSINESS_APP_ID &&
      process.env.META_BUSINESS_APP_SECRET &&
      process.env.META_BUSINESS_CONFIG_ID,
  );
}
