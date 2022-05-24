import { VotingPool } from '@/models/VotingModel'
import { MyAnchorWallet, walletStore } from '@/stores/wallet-store'
import { FixedNumber } from '@ethersproject/bignumber'
import { ProgramError, Provider } from '@project-serum/anchor'
import { ENV as SOL_CHAINID } from '@solana/spl-token-registry'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl, ConfirmOptions, Connection, SendTransactionError } from '@solana/web3.js'
import { isNumber, last } from 'lodash-es'
import Web3 from 'web3'
import { IVotingContract } from './ido-contract-interface'
import { VotingHandler } from './voting-contract-solidity'

export interface MarketplaceOrder {
  id: any
  seller: string
  keyId: number
  price: FixedNumber
  buyer: string
  createdAt: moment.Moment
  finished: boolean
  market: string
}

const getChainConfig = (chainId: any) => {
  chainId = isNumber(chainId) ? chainId : +chainId
  let rpc = ''
  let name = ''
  let explorer = ''
  switch (chainId) {
    case 1:
    case 'eth':
      name = 'Ethereum Mainnet'
      rpc = 'https://speedy-nodes-nyc.moralis.io/d2e931da4619b9acf870755d/eth/mainnet'
      explorer = 'https://etherscan.io/'
      // rpc = 'https://cloudflare-eth.com'
      break
    case 3:
      name = 'Ropsten Test Network'
      rpc = 'https://eth-ropsten.alchemyapi.io/v2/4szhG-FVK337Gq63VnnPoB3VH2BLYIQE'
      explorer = 'https://ropsten.etherscan.io/'
      break
    case 56:
    case 'bsc':
      name = 'BSC MainNET'
      rpc = 'https://bsc-dataseed.binance.org'
      explorer = 'https://bscscan.com/'
      break
    case 97:
      name = 'BSC TestNET'
      rpc = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
      explorer = 'https://testnet.bscscan.com/'
      break
    case 103:
      name = 'Solana DevNET'
      rpc = 'https://api.devnet.solana.com'
      explorer = 'https://solscan.io/'
      break
    case 102:
      name = 'Solana TestNET'
      rpc = 'https://api.testnet.solana.com'
      explorer = 'https://solscan.io/'
      break
    case 101:
      name = 'Solana MainNET'
      rpc = getSolanaMainNetRpc()
      explorer = 'https://solscan.io/'
      break
  }
  return { rpc, name, explorer }
}
const getSolanaMainNetRpc = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://lively-snowy-violet.solana-mainnet.quiknode.pro/327065b3a0efb376a35b57d1a13d4381ed8ddec0/'
    : 'https://solana-api.projectserum.com'
}
const getWeb3 = (chainId: any) => {
  chainId = isNumber(chainId) ? +chainId : chainId
  const { rpc } = getChainConfig(chainId)
  if (rpc) {
    const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
    ;(web3 as any).chainId = chainId
    return web3
  } else return null
}
const getSolanaConfig = (chainId) => {
  const anchorWallet = new MyAnchorWallet(undefined)
  const opts: ConfirmOptions = {
    preflightCommitment: 'recent',
    commitment: 'recent',
  }
  let connection: Connection

  switch (+chainId) {
    case SOL_CHAINID.MainnetBeta:
      connection = new Connection(getSolanaMainNetRpc(), opts.preflightCommitment)
      break
    case SOL_CHAINID.Testnet:
      connection = new Connection(clusterApiUrl(WalletAdapterNetwork.Testnet), opts.preflightCommitment)
      break
    case SOL_CHAINID.Devnet:
    default:
      connection = new Connection(clusterApiUrl(WalletAdapterNetwork.Devnet), opts.preflightCommitment)
      break
  }
  return new Provider(connection, anchorWallet, opts)
}

function throwSolanaAnchorError(error, idl) {
  let translatedErr
  if (error instanceof ProgramError) {
    translatedErr = error
  } else {
    translatedErr = ProgramError.parse(error, parseIdlErrors(idl))
  }
  if (translatedErr === null) {
    if (error instanceof SendTransactionError) {
      const components = error.toString().split('custom program error: ')
      const errorLog = (error.logs || [])
        .filter((x) => x.includes('Program log: '))
        .map((x) => x.replace('Program log: ', ''))
        .join(', ')
      if (components.length || errorLog) {
        throw new Error(`Error=${last(components || [])}, ${errorLog}`)
      }
    }
    throw error
  }
  throw translatedErr
}
function parseIdlErrors(idl) {
  const errors = new Map()
  if (idl.errors) {
    idl.errors.forEach((e) => {
      const msg = e.msg ?? e.name
      errors.set(e.code, msg)
    })
  }
  return errors
}
function etherBatchRequest(web3: Web3, methods: any[]) {
  if (!methods.length) return []
  const batch = new web3.BatchRequest()
  const tasks = Promise.all(
    methods.map(
      (method) =>
        new Promise((resolve, reject) => {
          batch.add(
            method.call.request({}, function (error, result) {
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
function fixAnchorAccounts(accounts) {
  const result: { [id: string]: string } = {}
  return Object.entries(accounts).reduce(
    (prev, [key, value]) => ({ ...prev, [key]: (value as any).toString() }),
    result
  )
}

const cachedContracts: { [id: string]: IVotingContract } = {}
function votingContractFactory(): IVotingContract | undefined {
  const chainType = walletStore.chainType
  const chainId = walletStore.chainId
  const contractAddress = chainType === 'sol' ? '' : process.env.VUE_APP_VOTING_SOLIDITY
  let result: any = undefined

  if (contractAddress) {
    result = cachedContracts[contractAddress]
    if (!result) {
      switch (chainId) {
        // case 'sol':
        //   result = new SolanaIdoContract(contractAddress, getSolanaConfig(chainId))
        //   break
        case 56:
        case 97:
        default:
          result = new VotingHandler(contractAddress, getWeb3(chainId)!)
          break
      }
      cachedContracts[contractAddress] = result
    }
  }
  return result
}

export const blockchainHandler = {
  getChainConfig,
  getWeb3,
  getSolanaConfig,
  throwSolanaAnchorError,
  ETHER_ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
  etherBatchRequest,
  getSolanaMainNetRpc,
  fixAnchorAccounts,
  votingContractFactory,
}
export type ChainType = 'eth' | 'bsc' | 'sol'
