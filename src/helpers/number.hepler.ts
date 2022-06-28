class NumberHelper {
  usdFormat = (number: any, minimumFractionDigits: any = 2, maximumFractionDigits: any = 6) => {
    if (!isNaN(+number) && +number !== 0) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits,
        maximumFractionDigits,
      })
      return formatter.format(+number)
    }
    return number
  }
  formatNumber = (number: any, maximumFractionDigits = 5, minimumFractionDigits = 2) => {
    const nf = new Intl.NumberFormat('en-US', {
      maximumFractionDigits,
      minimumFractionDigits:
        minimumFractionDigits > maximumFractionDigits ? maximumFractionDigits : minimumFractionDigits,
    })
    return nf.format(number)
  }
  isFloatNumber = (input) => {
    return /^(?!0\d)\d*(\.\d+)?$/gi.test(input)
  }
  /**
   * Generate random nonce number
   * @returns A random nonce number
   */
  generateRandomNonce = () => {
    return Math.floor(Math.random() * 1000000) + ''
  }
}

export const numberHelper = new NumberHelper()
