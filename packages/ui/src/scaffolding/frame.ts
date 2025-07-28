import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('qr-code-scaffold')
export class QRCodeScaffold extends LitElement {
  static styles = css`
    .scaffold {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }
    h1 {
      font-size: 24px;
      margin: 0;
      color: #333;
    }
  `;

  render() {
    return html`
      <div class="scaffold">
        <h1>QR Code Generator</h1>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'qr-code-scaffold': QRCodeScaffold;
  }
}
