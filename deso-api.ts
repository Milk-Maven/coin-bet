
import { configure } from 'deso-protocol';
configure({
  // Here we indicate the permissions a user will be asked to approve when they
  // log into your application. You may specify as many or as few permissions up
  // front as you want. You may choose not to request any permissions up front
  // and that's okay! Just remember that you will need to request them in your
  // app progressively, and you can always request as many or as few as you want
  // using the `requestPermissions` method described in the usage section.
  //
  // See more about the spending limit options object here
  // https://docs.deso.org/for-developers/backend/blockchain-data/basics/data-types#transactionspendinglimitresponse
  // And See an exhaustive list of transaction types here:
  // https://github.com/deso-protocol/core/blob/a836e4d2e92f59f7570c7a00f82a3107ec80dd02/lib/network.go#L244
  spendingLimitOptions: {
    // NOTE: this value is in Deso nanos, so 1 Deso * 1e9
    GlobalDESOLimit: 1 * 1e9, // 1 Deso
    // Map of transaction type to the number of times this derived key is
    // allowed to perform this operation on behalf of the owner public key
    TransactionCountLimitMap: {
      BASIC_TRANSFER: 2, // 2 basic transfer transactions are authorized
      SUBMIT_POST: 4, // 4 submit post transactions are authorized
    },
  },

  // Optional node uri. Sets the uri for the node that will be used for all
  // subsequent requests. If not passed it will default to https://node.deso.org
  nodeURI: 'https://mynode.com',

  // Optional redirect URI. This is mostly useful for native mobile use cases.
  // Most web applications will not want to use it. If provided, we do a full
  // redirect to the identity domain and pass data via query params back to the
  // provided uri.
  redirectURI: 'https://mydomain.com/my-redirect-path',

  // This will be associated with all of the derived keys that your application
  // authorizes.
  appName: 'My Cool App',

  // this is optional, if not passed the default of 1500 will be used.
  MinFeeRateNanosPerKB: 1000,


  // THE FOLLOWING CONFIGURATIONS ARE ONLY NEEDED IN A REACT NATIVE CONTEXT

  /**
   * An optional storage provider. If not provided, we will assume we're running
   * in a browser context and localStorage is available. In react native you must
   * set a storage provider which is likely an async storage instance.
   */
  //storageProvider?: Storage | AsyncStorage,

  /**
   * An optional function that can be used to customize how the identity url is opened. For
   * example, if you are using react native, you might want to use the WebBrowser
   * API to open the url in a system browser window.
   * @example
   * ```ts
   * identityPresenter: async (url) => {
   *   const result = await WebBrowser.openAuthSessionAsync(url);
   *   if (result.type === 'success') {
   *     identity.handleRedirectURI(result.url);
   *   }
   * },
   * ```
   */
  // identityPresenter?: (url: string) => void
})
interface App {
  attrb: string
}
const app: App = { attrb: 'adsf' }
console.log('hello', app.attrb);
