function getDataLayer(): Array<Object> {
  // tslint:disable-next-line:no-any
  const w: any = window;
  return (w && w.dataLayer) || [];
}

export function userID(id?: string) {
  getDataLayer().push({ userID: id });
}