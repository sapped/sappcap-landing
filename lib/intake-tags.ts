// Resource fulfillment precedes the common nurture. Never infer routing from UTMs.
export function intakeTags(kind: "email-capture" | "application", campaign: string) {
 const tags = [{name:`sca-source-${campaign}`,status:"active"}];
 if(kind === "application") return [...tags,{name:"sca-application-submitted",status:"active"}];
 return [...tags,{name:campaign === "website-starter" ? "sca-website-starter-v1" : "sca-application-funnel-v1",status:"active"}];
}
