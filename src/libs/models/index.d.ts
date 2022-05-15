export default Application
declare class Application {
    constructor({ test, mainnet, network }: { test?: boolean; mainnet?: boolean; network?: string })
    test: boolean
    mainnet: boolean
    network: string
    account: Account
    start: () => void
    web3: any
    login: () => Promise<boolean>
    __getUserAccount: ({ privateKey }: { privateKey: any }) => Account
    getFixedSwapContractV4: ({
        tokenAddress,
        decimals,
        contractAddress
    }: {
        tokenAddress?: any
        decimals?: number
        contractAddress: any
    }) => FixedSwapContract
    getERC20TokenContract: ({ tokenAddress }: { tokenAddress: any; }) => Primise<ERC20TokenContract>
    getETHNetwork: () => Promise<any>
    getAddress: () => Promise<any>
    getETHBalance: () => Promise<any>
}
import Account from './Account'
import FixedSwapContract from './FixedSwapContract'
import ERC20TokenContract from './ERC20TokenContract'
