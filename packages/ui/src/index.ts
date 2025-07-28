import { QRCodeInjector } from './inject';

export function create(containerId: string, data: string) {
  const injector = new QRCodeInjector(containerId);
  injector.inject(data);
  return injector;
}
