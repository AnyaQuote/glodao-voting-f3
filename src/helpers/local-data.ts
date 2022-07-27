import { ChainType } from '@/blockchainHandlers'

class LocalData {
  get user(): any {
    return JSON.parse(localStorage.getItem('gloDaoUser') || '{}')
  }
  set user(value: any) {
    localStorage.setItem('gloDaoUser', JSON.stringify(value))
  }

  get jwt(): string {
    if (localStorage.getItem('gloDaoJwt')) return JSON.parse(localStorage.getItem('gloDaoJwt') || '')
    return ''
  }
  set jwt(value: string) {
    localStorage.setItem('gloDaoJwt', JSON.stringify(value))
  }

  get referralCode(): string {
    if (localStorage.getItem('ref')) return JSON.parse(localStorage.getItem('ref') || '')
    return ''
  }

  set referralCode(value: string) {
    if (value) localStorage.setItem('ref', JSON.stringify(value))
    else localStorage.removeItem('ref')
  }

  resetAuth() {
    localStorage.removeItem('gloDaoUser')
    localStorage.removeItem('gloDaoJwt')
  }

  reset() {
    localStorage.clear()
  }

  get lastChain(): ChainType | null {
    return localStorage.getItem('lastChain') as ChainType
  }
  set lastChain(value: ChainType | null) {
    if (value) localStorage.setItem('lastChain', value)
    else localStorage.removeItem('lastChain')
  }

  get walletConnect() {
    return localStorage.getItem('walletconnect')
  }

  set web3Provider(value: any) {
    localStorage.setItem('web3Provider', JSON.stringify(value))
  }

  get web3Provider() {
    return JSON.parse(localStorage.getItem('web3Provider') || '{}')
  }

  removeWalletConnect() {
    localStorage.removeItem('walletconnect')
  }
}

export const localdata = new LocalData()
