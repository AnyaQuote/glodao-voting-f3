import Web3 from 'web3'
import Account from './Account'
import ERC20TokenContract from './ERC20TokenContract'
import FixedSwapContractV4 from './FixedSwapContract.v4'

const ETH_URL_MAINNET = 'https://bsc-dataseed.binance.org'
const ETH_URL_TESTNET = 'https://eth-ropsten.alchemyapi.io/v2/4szhG-FVK337Gq63VnnPoB3VH2BLYIQE'

const MOONBEAM_TESTNET_URL = 'https://rpc.testnet.moonbeam.network'
const TEST_PRIVATE_KEY = '0x7f76de05082c4d578219ca35a905f8debe922f1f00b99315ebf0706afc97f132'

const networksEnum = Object.freeze({
  1: 'Main',
  2: 'Morden',
  3: 'Ropsten',
  4: 'Rinkeby',
  42: 'Kovan',
})

class Application {
  constructor({ test = false, mainnet = true, network = 'ETH' }) {
    this.test = test
    this.mainnet = mainnet
    if (network != 'ETH' && network != 'DOT') {
      throw new Error('Network has to be ETH or DOT')
    }
    this.network = network
    if (this.test) {
      this.start()
      this.login()
      this.account = new Account(this.web3, this.web3.eth.accounts.privateKeyToAccount(TEST_PRIVATE_KEY))
    }
  }

  start = () => {
    if (this.network == 'DOT') {
      this.web3 = new Web3(MOONBEAM_TESTNET_URL)
    } else {
      this.web3 = new Web3(new Web3.providers.HttpProvider(this.mainnet == true ? ETH_URL_MAINNET : ETH_URL_TESTNET))
    }

    if (typeof window !== 'undefined') {
      window.web3 = this.web3
    } else {
      if (!this.test) {
        throw new Error('Please Use an Ethereum Enabled Browser like Metamask or Coinbase Wallet')
      }
    }
  }

  login = async () => {
    try {
      if (typeof window === 'undefined') {
        return false
      }
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        this.web3 = window.web3
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        return true
      } else {
        throw new Error('Plugin Metamask is not installed!')
      }
    } catch (err) {
      console.log('err: ' + err.message || err.msg)
      throw err
    }
  }

  __getUserAccount = ({ privateKey }) => {
    return new Account(this.web3, this.web3.eth.accounts.privateKeyToAccount(privateKey))
  }

  getFixedSwapContractV4 = ({ tokenAddress, decimals = 18, contractAddress = null }) => {
    try {
      return new FixedSwapContractV4({
        web3: this.web3,
        tokenAddress: tokenAddress,
        decimals: decimals,
        contractAddress: contractAddress,
        acc: this.test ? this.account : null,
      })
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  /* getERC20TokenContract */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getERC20TokenContract = async ({ tokenAddress, decimals }) => {
    try {
      const contract = new ERC20TokenContract({
        web3: this.web3,
        contractAddress: tokenAddress,
        acc: this.test ? this.account : null,
      })
      await contract.init()
      return contract
    } catch (err) {
      console.log(err?.message || err?.msg)
      throw err
    }
  }

  /* Get Network of Platform Web3 */
  getETHNetwork = async () => {
    const netId = await this.web3.eth.net.getId()
    const networkName = Object.prototype.hasOwnProperty.call(networksEnum, netId) ? networksEnum[netId] : 'Unknown'
    return networkName
  }

  /* Get User Address */
  getAddress = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    if (accounts.length) return Web3.utils.toChecksumAddress(accounts[0])
    return null
  }

  /* Get User Balance in Ethereum */
  getETHBalance = async () => {
    let wei = await this.web3.eth.getBalance(await this.getAddress())
    return this.web3.utils.fromWei(wei, 'ether')
  }
}

export default Application
