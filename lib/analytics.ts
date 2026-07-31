export type AnalyticsEvent="landing_view"|"pricing_view"|"demo_started"|"onboarding_started"|"onboarding_completed"|"signup_started"|"signup_completed"|"login"|"employee_created"|"simulation_completed"|"quote_created"|"booking_created"|"handoff_created";
export interface AnalyticsProvider{track(event:AnalyticsEvent,properties?:Record<string,string|number|boolean>):void|Promise<void>}
class DisabledAnalytics implements AnalyticsProvider{track(){/* External tracking is intentionally disabled until consent and a provider are configured. */}}
let provider:AnalyticsProvider=new DisabledAnalytics();
export function configureAnalytics(next:AnalyticsProvider){provider=next}
export function track(event:AnalyticsEvent,properties?:Record<string,string|number|boolean>){return provider.track(event,properties)}
