export function mock<T>(service: new (...args: any[]) => T, properties: () => Partial<T>) {
  // const cloned = { ...properties } as Partial<T> & { resetMock: () => Partial<T> };
  // const initialProperties = { ...properties };

  // const resetMock = () => {
  //   Object.keys(initialProperties).forEach(key => {
  //     (cloned as any)[key] = initialProperties[key];
  //   });
  //   return cloned;
  // };

  // cloned.resetMock = resetMock;
  return () => ({ provide: service, useValue: properties() });
}
