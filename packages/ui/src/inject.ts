import type { QRCodeDisplay } from './scaffolding/qrcode';
import type { QRCodeControls } from './scaffolding/controls';

export class QRCodeInjector {
  private container: HTMLElement;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with ID ${containerId} not found`);
    }
    this.container = container;
  }

  inject(data: string) {
    // Clear existing content
    this.container.innerHTML = '';

    // Create and append the QR code display component
    const qrElement = document.createElement('qr-code-display');
    qrElement.setAttribute('data', data);
    this.container.appendChild(qrElement);

    // Optionally append controls
    const controlsElement = document.createElement('qr-code-controls');
    controlsElement.setAttribute('value', data);
    this.container.appendChild(controlsElement);

    // Listen for updates from controls
    controlsElement.addEventListener('update-qr-data', (e: Event) => {
      const customEvent = e as CustomEvent<{ data: string }>;
      qrElement.setAttribute('data', customEvent.detail.data);
    });
  }

  clear() {
    this.container.innerHTML = '';
  }
}
