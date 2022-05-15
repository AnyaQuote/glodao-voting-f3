import Web3 from 'web3'
import Account from './Account'

class Application {
  constructor({ test = false, mainnet = true, network = 'BSC' }) {
    this.test = test
    this.mainnet = mainnet
    if (network != 'BSC') {
      throw new Error('Network has to be BSC')
    }
    this.network = network
    this.isMetamask = false
  }
  start = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.web3 = this.web3
      this.isMetamask = true
    } else {
      if (!this.test) {
        this.isMetamask = false
        throw new Error('Please Use an Ethereum Enabled Browser like Metamask or Coinbase Wallet')
      }
    }
  }
  login = async () => {
    if (typeof window === 'undefined') {
      return false
    }
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      this.web3 = window.web3
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      return true
    }
    return false
  }
  /* Get User Address */
  getAddress = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    if (accounts.length) return Web3.utils.toChecksumAddress(accounts[0])
    return null
  }

  /* Get User Balance in Ethereum */
}

export default Application
