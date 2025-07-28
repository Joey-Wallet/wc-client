import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('qr-code-controls')
export class QRCodeControls extends LitElement {
  addEventListener(arg0: string, arg1: (e: Event) => void) {
    throw new Error('Method not implemented.');
  }
  setAttribute(arg0: string, data: string) {
    throw new Error('Method not implemented.');
  }
  static styles = css`
    .controls {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      max-width: 300px;
    }
    input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    }
    button {
      padding: 8px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
  `;

  @property({ type: String }) value = '';
  @state() private inputValue = '';

  private handleInput(e: Event) {
    this.inputValue = (e.target as HTMLInputElement).value;
  }

  private handleSubmit() {
    this.dispatchEvent(
      new CustomEvent('update-qr-data', {
        detail: { data: this.inputValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="controls">
        <input
          type="text"
          .value=${this.inputValue || this.value}
          @input=${this.handleInput}
          placeholder="Enter text for QR code" />
        <button @click=${this.handleSubmit}>Generate QR Code</button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'qr-code-controls': QRCodeControls;
  }
}
