export function setURLQuery(name, value) {
   const url = new URL(window.location.href);
   url.searchParams.set(name, value ?? '');
   window.history.pushState(undefined, undefined, url);
}

export function getURLQuery(name) {
   const url = new URL(window.location.href);
   if (url.searchParams.has(name)) return url.searchParams.get(name);
   else return null;
}
