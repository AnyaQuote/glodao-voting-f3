import { FixedNumber } from "@ethersproject/bignumber";
import { bigNumberHelper } from '../../helpers/bignumber-helper';
import { ierc20 } from "../interfaces";
import Numbers from "../utils/Numbers";
import contract from "./Contract";
let self;

class ERC20TokenContract {
	constructor({ decimals, contractAddress, web3, acc }) {
		if (acc) {
			this.acc = acc;
		}
		this.params = {
			web3: web3,
			contractAddress: contractAddress,
			contract: new contract(web3, ierc20, contractAddress),
			decimals: decimals
		};
		self = {
			contract: new contract(web3, ierc20, contractAddress)
		};
	}

	async init() {
		const decimals = await this.getContract().methods.decimals().call()
		this.params.decimals = decimals
	}

	__metamaskCall = async ({ f, acc, value, callback = () => { 
		//
	} }) => {
		return new Promise((resolve, reject) => {
			f.send({
				from: acc,
				value: value,
			})
				.on("confirmation", (confirmationNumber, receipt) => {
					callback(confirmationNumber);
					if (confirmationNumber > 0) {
						resolve(receipt);
					}
				})
				.on("error", (err) => {
					reject(err);
				});
		});
	};


	__sendTx = async (f, call = false, value, callback = () => { 
		//
	}) => {
		var res;
		if (!this.acc && !call) {
			const accounts = await this.params.web3.eth.getAccounts();
			res = await this.__metamaskCall({ f, acc: accounts[0], value, callback });
		} else if (this.acc && !call) {
			let data = f.encodeABI();
			res = await this.params.contract.send(
				this.acc.getAccount(),
				data,
				value
			);
		} else if (this.acc && call) {
			res = await f.call({ from: this.acc.getAddress() });
		} else {
			res = await f.call();
		}
		return res;
	};

	__assert () {
		this.params.contract.use(ierc20, this.getAddress());
	}

	getContract () {
		return this.params.contract.getContract();
	}

	getAddress () {
		return this.params.contractAddress;
	}

	setNewOwner = async ({ address }) => {
		try {
			return await this.__sendTx(
				this.params.contract
					.getContract()
					.methods.transferOwnership(address)
			);
		} catch (err) {
			console.log(err);
		}
	};

	async transferTokenAmount ({ toAddress, tokenAmount }) {
		let amountWithDecimals = Numbers.toSmartContractDecimals(
			tokenAmount,
			this.getDecimals()
		);
		return await this.__sendTx(
			this.params.contract
				.getContract()
				.methods.transfer(toAddress, amountWithDecimals)
		);
	}

	async getTokenAmount (address) {
		return Numbers.fromDecimals(
			await this.getContract().methods.balanceOf(address).call(),
			this.getDecimals()
		);
	}

	async balanceOf (address) {
		return await this.getContract().methods.balanceOf(address).call();
	}

	async totalSupply () {
		return await this.getContract().methods.totalSupply().call();
	}

	getABI () {
		return self.contract;
	}

	getDecimals () {
		return this.params.decimals;
	}

	async getName () {
		return await self.contract.contract.methods.name().call()
	}
	async isApproved ({ address, amount, spenderAddress }) {
		try {
			let approvedAmount = Numbers.fromDecimals(
				await this.getContract().methods.allowance(address, spenderAddress).call(),
				this.getDecimals()
			);
			return bigNumberHelper.gt(FixedNumber.from(approvedAmount), FixedNumber.from(`${amount || '999999'}`));
		} catch (err) {
			console.log("err: "+ err.message || err.msg)
			throw err;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async approve ({ address, amount, callback }) {
		try {
			let amountWithDecimals = Numbers.toSmartContractDecimals(
				`${2 ** 64 - 1}`,
				this.getDecimals()
			);
			return await this.__sendTx(
				this.params.contract
					.getContract()
					.methods.approve(address, amountWithDecimals),
				null,
				null,
				callback
			);
		} catch (err) {
			console.log("err: "+ err.message || err.msg)
			throw err;
		}
	}
}

export default ERC20TokenContract;
