import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://0aefcadbc958668f32c92384224821f8@o4506904130093056.ingest.us.sentry.io/4506904135467008",
  enabled: process.env.NODE_ENV === "production",
  serverName: process.env.SERVER_NAME || undefined,
});

if (process.env.NODE_ENV === "production") {
  Sentry.onUncaughtExceptionIntegration()
  Sentry.onUnhandledRejectionIntegration()
}

export const captureError = (error: Error) => {
    Sentry.captureException(error);
};
