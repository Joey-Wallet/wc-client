export enum EProviderEvents {
  /**
   * Emitted when a wallet proposes a new session to the DApp.
   * Contains session proposal details (e.g., namespaces, chains, methods).
   * Example: Show a QR code with the `display_uri` for the user to scan.
   */
  PROPOSAL = 'session_proposal',

  /**
   * Emitted when a session is extended, typically to update its expiration time.
   * Example: Update session metadata or notify the user of an extended session.
   */
  EXTEND = 'session_extend',

  /**
   * Emitted when a session expires, indicating it is no longer valid.
   * Example: Display a "Session Expired" message and initiate a new connection.
   */
  EXPIRE = 'session_expire',

  /**
   * Emitted when the wallet sends a request to the DApp (e.g., sign a transaction).
   * Example: Handle an XRPL `xrpl_signTransaction` request from Joey Wallet.
   */
  REQUEST = 'session_request',

  /**
   * Emitted when the DApp sends a request to the wallet.
   * Confirms the request was sent, but not yet approved by the wallet.
   * Example: Update UI to show a pending transaction approval in the wallet.
   */
  REQUEST_SENT = 'session_request_sent', // Verify if specific to @joey-wallet/wc-core

  /**
   * Emitted during session authentication, typically for wallet login flows.
   * Example: Process authentication payloads for secure DApp access (e.g., SIWE, CAIP-122).
   */
  AUTHENTICATE = 'session_authenticate',

  /**
   * Emitted when a session proposal expires before being approved.
   * Example: Notify the user to retry the connection process.
   */
  PROPOSAL_EXPIRE = 'proposal_expire',

  /**
   * Emitted when a session request (e.g., transaction signing) expires.
   * Example: Show an error message and allow the user to resend the request.
   */
  REQUEST_EXPIRE = 'session_request_expire',

  /**
   * Emitted when a WalletConnect session is successfully established.
   * Example: Enable XRPL request buttons (e.g., `wc.server_info`) in the UI.
   */
  CONNECT = 'session_connect',

  /**
   * Emitted when the DApp or wallet sends a ping to check session health.
   * Example: Log ping responses to monitor connection stability.
   */
  PING = 'session_ping',

  /**
   * Emitted when the wallet sends a custom event (e.g., chain or account changes).
   * Example: Update the DApp state when the user switches XRPL accounts.
   */
  EVENT = 'session_event',

  /**
   * Emitted when a session is updated (e.g., namespaces or permissions change).
   * Example: Refresh available XRPL methods after a session update.
   */
  UPDATE = 'session_update',

  /**
   * Emitted when a session is deleted, either by the DApp or wallet.
   * Example: Clear session data and prompt the user to reconnect.
   */
  DELETE = 'session_delete',

  /**
   * Emitted when a WalletConnect URI is generated for session initiation.
   * Example: On mobile, redirect to `yourdapp://wc?uri=<uri>`; on desktop, show a QR code.
   */
  URI = 'display_uri',

  /**
   * Emitted when an error occurs in the provider or session.
   * Example: Log errors or display error messages to the user.
   */
  PROVIDER_ERROR = 'error',

  /**
   * Emitted when the Universal Provider establishes a connection to the Relay.
   * Example: Log Relay connection success or enable connection-dependent UI.
   */
  PROVIDER_CONNECT = 'connect', // Provider-specific, consider merging with SESSION_CONNECT

  /**
   * Emitted when the Universal Provider disconnects from the Relay.
   * Example: Handle network issues or prompt the user to reconnect.
   */
  PROVIDER_DISCONNECT = 'disconnect',

  /**
   * Emitted when the provider or session state updates (provider-specific).
   * Example: Handle provider-level updates outside of session changes.
   */
  PROVIDER_UPDATE = 'update',

  /**
   * Emitted when a provider-level resource is deleted (provider-specific).
   * Example: Handle cleanup after a provider-level disconnection.
   */
  PROVIDER_DELETE = 'delete',

  /**
   * Emitted when the Universal Provider is fully initialized and ready.
   * Example: Enable UI elements or trigger initial connection logic.
   */
  WC_READY = 'wc_ready',

  /**
   * Emitted when session data is synchronized between the DApp and wallet.
   * Example: Update session state after a sync operation.
   */
  WC_SESSION_SYNC = 'wc_sessionSync',
}
