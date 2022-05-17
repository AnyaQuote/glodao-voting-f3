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

  resetUser() {
    localStorage.removeItem('gloDaoUser')
    localStorage.removeItem('gloDaoJwt')
  }

  reset() {
    localStorage.clear()
  }
}

export const localdata = new LocalData()
