import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import QRCode from 'qrcode';

@customElement('qr-code-display')
export class QRCodeDisplay extends LitElement {
  setAttribute(arg0: string, data: string) {
    throw new Error('Method not implemented.');
  }
  static styles = css`
    .qr-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    canvas {
      max-width: 100%;
    }
  `;

  @property({ type: String }) data = '';

  private canvasRef: HTMLCanvasElement | null = null;

  protected async firstUpdated() {
    this.canvasRef = this.shadowRoot?.querySelector('canvas') || null;
    await this.updateQRCode();
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('data')) {
      this.updateQRCode();
    }
  }

  private async updateQRCode() {
    if (this.canvasRef && this.data) {
      try {
        await QRCode.toCanvas(this.canvasRef, this.data, {
          width: 200,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' },
        });
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    }
  }

  render() {
    return html`
      <div class="qr-container">
        <canvas></canvas>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'qr-code-display': QRCodeDisplay;
  }
}
