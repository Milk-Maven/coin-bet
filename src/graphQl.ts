
import axios from 'axios';
import { BetGet } from './validation.js';
const executeGraphQl = (payload) => {
  const graphQlEndpoint = 'https://graphql-prod.deso.com/graphql'
  axios.post(graphQlEndpoint, payload)
}
export const getBetQl = (getBet: BetGet) => {
  const payload = {
    "operationName": "Transactions", "variables": {
      "first": 10, "orderBy": ["TIMESTAMP_DESC", "INDEX_IN_BLOCK_ASC"], "offset": 0,
      "filter": { "blockHeight": { "isNull": false }, "publicKey": { "equalTo": getBet.PosterPublicKeyBase58Check } }, "withTotal": false
    }, "query": "query Transactions($first: Int, $condition: TransactionCondition, $orderBy: [TransactionsOrderBy!], $offset: Int, $filter: TransactionFilter, $withTotal: Boolean!) {\n  transactions(\n    first: $first\n    condition: $condition\n    orderBy: $orderBy\n    offset: $offset\n    filter: $filter\n  ) {\n    nodes {\n      ...CoreTransactionFields\n      block {\n        ...CoreBlockFields\n        __typename\n      }\n      __typename\n    }\n    pageInfo {\n      hasPreviousPage\n      hasNextPage\n      __typename\n    }\n    totalCount @include(if: $withTotal)\n    __typename\n  }\n}\n\nfragment CoreAccountFields on Account {\n  publicKey\n  username\n  __typename\n}\n\nfragment CoreTransactionFields on Transaction {\n  transactionHash\n  blockHash\n  version\n  inputs\n  outputs\n  feeNanos\n  nonceExpirationBlockHeight\n  noncePartialId\n  txnMeta\n  txnMetaBytes\n  txIndexMetadata\n  txIndexBasicTransferMetadata\n  transactionId\n  txnType\n  publicKey\n  extraData\n  signature\n  txnBytes\n  indexInBlock\n  account {\n    ...CoreAccountFields\n    __typename\n  }\n  affectedPublicKeys {\n    nodes {\n      publicKey\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment CoreBlockFields on Block {\n  blockHash\n  height\n  timestamp\n  __typename\n}"
  }
  return executeGraphQl(payload)

}
