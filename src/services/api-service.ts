import { authStore } from '@/stores/auth-store'
import Axios from 'axios'
import qs from 'qs'

export type ApiRouteType = 'applies' | 'hunters' | 'logs' | 'pool-regists' | 'pools' | 'tasks' | 'users' | 'campaigns'

const axios = Axios.create({ baseURL: process.env.VUE_APP_API_STRAPI_ENDPOINT })
axios.interceptors.request.use((config) => {
  config.paramsSerializer = (params) => {
    if ('_where' in params) return qs.stringify(params)
    else return qs.stringify(params, { arrayFormat: 'repeat' })
  }
  return config
})
export class ApiHandler<T> {
  constructor(private axios, private route: ApiRouteType) {}

  async count(params?: any): Promise<number> {
    const res = await this.axios.get(`${this.route}/count`, { params })
    return res.data
  }

  async create(model: T): Promise<T> {
    const res = await this.axios.post(this.route, model)
    return res.data
  }

  async delete(id: any): Promise<T> {
    const res = await this.axios.delete(`${this.route}/${id}`)
    return res.data
  }

  async find<T>(params?: any, settings: { _sort?: string; _limit?: number; _start?: number } = {}): Promise<T[]> {
    const settingDefault = { _sort: 'createdAt:DESC', _limit: 25, _start: 0 }
    params = { ...settingDefault, ...settings, ...(params ?? {}) }
    const res = await this.axios.get(this.route, { params })
    const lst = res.data
    if (this.route === 'pools') {
      lst.forEach((element) => {
        if (element.data?.chainId) {
          element.chainId = element.data.chainId
        } else if (isNaN(+element.chainId)) {
          element.chainId = +element.chainId
        }
      })
    }
    return lst
  }

  async findOne<T>(id: any): Promise<T> {
    let res: any
    if (id) {
      res = await this.axios.get(`${this.route}/${id}`)
    } else {
      res = await this.axios.get(`${this.route}`)
    }
    const result = res.data
    if (this.route === 'pools') {
      if (result.data?.chainId) {
        result.chainId = result.data.chainId
      } else if (isNaN(+result.chainId)) {
        result.chainId = +result.chainId
      }
    }
    return result
  }

  async update(id: any, model: T): Promise<T> {
    let res: any
    if (id) {
      res = await this.axios.put(`${this.route}/${id}`, model)
    } else {
      res = await this.axios.put(`${this.route}`, model)
    }
    return res.data
  }
}

export class ApiHandlerJWT<T> {
  private headers = {}
  private jwtOptions = {
    count: true,
    create: true,
    delete: true,
    find: true,
    findOne: true,
    update: true,
  }
  constructor(
    private axios,
    private route: ApiRouteType,
    private options: {
      count?: boolean
      create?: boolean
      delete?: boolean
      find?: boolean
      findOne?: boolean
      update?: boolean
    } = {
      count: true,
      create: true,
      delete: true,
      find: true,
      findOne: true,
      update: true,
    }
  ) {
    this.headers = {
      ...axios.defaults.headers,
    }
    this.jwtOptions = { ...this.jwtOptions, ...options }
  }
  async count(params?: any): Promise<number> {
    let headers = this.headers
    if (this.jwtOptions.count) headers = { ...headers, Authorization: `Bearer ${authStore.jwt}` }
    const res = await this.axios.get(`${this.route}/count`, {
      params,
      headers,
    })
    return res.data
  }

  async create(model: T, jwt?: string): Promise<T> {
    const res = await this.axios.post(this.route, model, {
      headers: {
        ...axios.defaults.headers,
        Authorization: `Bearer ${jwt ?? authStore.jwt}`,
      },
    })
    return res.data
  }

  async delete(id: any): Promise<T> {
    const res = await this.axios.delete(`${this.route}/${id}`, {
      headers: { Authorization: `Bearer ${authStore.jwt}` },
    })
    return res.data
  }

  async find<T>(params?: any, settings: { _sort?: string; _limit?: number; _start?: number } = {}): Promise<T[]> {
    const settingDefault = { _sort: 'createdAt:DESC', _limit: 25, _start: 0 }
    params = { ...settingDefault, ...settings, ...(params ?? {}) }
    let headers = this.headers
    if (this.jwtOptions.find) headers = { ...headers, Authorization: `Bearer ${authStore.jwt}` }
    const res = await this.axios.get(this.route, {
      params,
      headers,
    })
    const lst = res.data
    return lst
  }

  async findOne<T>(id: any, jwt?: string): Promise<T> {
    let res: any
    let headers = this.headers
    if (this.jwtOptions.findOne) headers = { ...headers, Authorization: `Bearer ${jwt ?? authStore.jwt}` }
    if (id) {
      res = await this.axios.get(`${this.route}/${id}`, { headers })
    } else {
      res = await this.axios.get(`${this.route}`, { headers })
    }
    const result = res.data
    return result
  }

  async update(id: any, model?: any): Promise<T> {
    let res: any
    let headers = this.headers
    if (this.jwtOptions.update) headers = { ...headers, Authorization: `Bearer ${authStore.jwt}` }
    if (id) {
      res = await this.axios.put(`${this.route}/${id}`, model, {
        headers,
      })
    } else {
      res = await this.axios.put(`${this.route}`, model, { headers })
    }
    return res.data
  }

  async register(publicAddress: string) {
    const res = await this.axios.post(`auth/local/register`, { publicAddress })
    return res.data
  }

  async login(username: string, password: string) {
    const res = await this.axios.post(`auth/local`, { identifier: username, password })
    return res.data
  }
}

export class ApiService {
  // fixedPool = new ApiHandler<FixedPoolModel>(axios, 'pool')
  applies = new ApiHandlerJWT<any>(axios, 'applies', { find: false, count: false })
  users = new ApiHandlerJWT<any>(axios, 'users')
  hunters = new ApiHandlerJWT<any>(axios, 'hunters', { count: false })
  tasks = new ApiHandlerJWT<any>(axios, 'tasks', { find: false, count: false, findOne: false })
  campaigns = new ApiHandlerJWT<any>(axios, 'campaigns')

  async getFile(id: any) {
    const res = await axios.get(`upload/files/${id}`)
    return res.data
  }

  async fetchUser(access_token: string, access_secret: string, referrerCode?) {
    const res = await axios.get('auth/twitter/callback', {
      params: { access_token: access_token, access_secret: access_secret, referrerCode },
    })
    return res.data
  }

  async verifySignMessage(walletAddress: string, signature: string, chain: string, id: string) {
    const res = await axios.post(
      'hunters/verifySignMessage',
      {
        walletAddress,
        signature,
        chain,
        id,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.jwt}`,
        },
      }
    )
    return res.data
  }

  async updateWalletAddress(walletAddress: string, signature: string, chain: string, id: string) {
    const res = await axios.patch(
      'hunters/updateWalletAddress',
      {
        walletAddress,
        signature,
        chain,
        id,
        hunterId: id,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.jwt}`,
        },
      }
    )
    return res.data
  }

  async checkStakeStatus(walletAddress: string, hunterId: string, poolId = 0) {
    const res = await axios.get('checkUserStaked', {
      params: {
        address: walletAddress,
        poolId,
        id: hunterId,
      },
      headers: {
        Authorization: `Bearer ${authStore.jwt}`,
      },
    })
    return res.data
  }

  async getReferrals(hunterId: string) {
    const res = await axios.get('hunters/referrals', {
      params: {
        id: hunterId,
      },
      headers: {
        Authorization: `Bearer ${authStore.jwt}`,
      },
    })
    return res.data
  }

  async applyForPriorityPool(
    walletAddress: string,
    signature: string,
    chain: string,
    applyId: string,
    hunterId: string,
    taskId: string,
    poolId: number
  ) {
    const res = await axios.patch(
      'applies/applyForPriority',
      {
        walletAddress,
        applyId,
        hunterId,
        taskId,
        poolId,
        id: applyId,
        signature,
        chain,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.jwt}`,
        },
      }
    )
    return res.data
  }

  async updateTaskProcess(id: string, type: string, taskData?, optional?) {
    const res = await axios.put(
      `applies/${id}/task`,
      {
        taskData,
        type,
        optional,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.jwt}`,
        },
      }
    )
    return res.data
  }
}

export const apiService = new ApiService()
