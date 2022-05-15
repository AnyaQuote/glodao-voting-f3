import Web3 from 'web3'
import { isNumber } from 'lodash-es'

const getChainConfig = (chainId: any) => {
  chainId = isNumber(+chainId) ? +chainId : chainId
  let rpc = ''
  let name = ''
  // let explorer = "";
  switch (chainId) {
    // case 1:
    // case 'eth':
    //   name = 'Ethereum Mainnet'
    //   rpc = 'https://speedy-nodes-nyc.moralis.io/1cbc67e7252c9ef1e7e63dc8/eth/mainnet'
    //   break
    // case 3:
    //   name = 'Ropsten Test Network'
    //   rpc = 'https://speedy-nodes-nyc.moralis.io/1cbc67e7252c9ef1e7e63dc8/eth/ropsten'
    //   break
    case 56:
    case 'bsc':
      name = 'BSC MainNET'
      rpc = 'https://bsc-dataseed.binance.org/'
      break
    case 97:
      name = 'BSC TestNET'
      rpc = 'https://data-seed-prebsc-2-s2.binance.org:8545/'
      break
    // case 137:
    //   name = 'Matic Mainnet'
    //   rpc = 'https://speedy-nodes-nyc.moralis.io/dbdd48ee7b4652ac0d44fd74/polygon/mainnet'
    //   // rpc = 'https://rpc-mainnet.maticvigil.com'
    //   // rpc = 'https://rpc-mainnet.matic.network'
    //   explorer = 'https://polygonscan.com/'
    //   break
    // case 80001:
    //   name = 'Matic Testnet Mumbai'
    //   rpc = 'https://rpc-mumbai.maticvigil.com'
    //   explorer = 'https://mumbai.polygonscan.com//'
    //   break
  }
  return { rpc, name }
}

const getWeb3 = (chainId: any) => {
  chainId = isNumber(+chainId) ? +chainId : chainId
  const { rpc, name } = getChainConfig(chainId)
  if (rpc) return new Web3(new Web3.providers.HttpProvider(rpc))
  else return null
}

function etherBatchRequest(web3: Web3, methods: any[]) {
  if (!methods.length) return []
  const batch = new web3.BatchRequest()
  const tasks = Promise.all(
    methods.map(
      method =>
        new Promise((resolve, reject) => {
          batch.add(
            method.call.request({}, function(error, result) {
              if (error) {
                console.error('Errror=', method, error)
                reject(error)
              } else {
                resolve(result)
              }
            })
          )
        })
    )
  )
  batch.execute()
  return tasks
}

export const blockchainHandler = {
  getChainConfig,
  getWeb3,
  etherBatchRequest
}
