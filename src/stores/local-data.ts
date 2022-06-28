export class LocalData {
  set lightmode(enable: boolean) {
    if (enable) {
      localStorage.setItem('lightmode', 'enable')
    } else {
      localStorage.setItem('lightmode', 'disable')
    }
  }

  get lightmode() {
    if (!localStorage.getItem('lightmode') || localStorage.getItem('lightmode') === 'enable') return true
    return false
  }
}

export const localData = new LocalData()
