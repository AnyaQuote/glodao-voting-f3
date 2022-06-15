import { authStore } from '@/stores/auth-store'
import Axios from 'axios'
import qs from 'qs'
import { get } from 'lodash-es'

export type ApiRouteType =
  | 'applies'
  | 'hunters'
  | 'logs'
  | 'pool-regists'
  | 'pools'
  | 'tasks'
  | 'users'
  | 'campaigns'
  | 'voting-pools'
  | 'quizzes'

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
    // if (this.route === 'pools') {
    //   lst.forEach((element) => {
    //     if (element.data?.chainId) {
    //       element.chainId = element.data.chainId
    //     } else if (isNaN(+element.chainId)) {
    //       element.chainId = +element.chainId
    //     }
    //   })
    // }
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
    // if (this.route === 'pools') {
    //   if (result.data?.chainId) {
    //     result.chainId = result.data.chainId
    //   } else if (isNaN(+result.chainId)) {
    //     result.chainId = +result.chainId
    //   }
    // }
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
    let headers = this.headers
    if (this.jwtOptions.create) headers = { ...headers, Authorization: `Bearer ${authStore.jwt}` }
    const res = await this.axios.post(this.route, model, {
      headers,
    })
    return res.data
  }

  async delete(id: any): Promise<T> {
    let headers = this.headers
    if (this.jwtOptions.delete) headers = { ...headers, Authorization: `Bearer ${authStore.jwt}` }
    const res = await this.axios.delete(`${this.route}/${id}`, {
      headers,
    })
    return res.data
  }

  async find<T>(
    params?: any,
    settings: { _sort?: string; _limit?: number; _start?: number } = {},
    overrideJwtUsage = false
  ): Promise<T[]> {
    let headers = this.headers
    const settingDefault = { _sort: 'createdAt:DESC', _limit: 25, _start: 0 }
    params = { ...settingDefault, ...settings, ...(params ?? {}) }
    if (this.jwtOptions.find || overrideJwtUsage) headers = { ...headers, Authorization: `Bearer ${authStore.jwt}` }
    const res = await this.axios.get(this.route, {
      params,
      headers,
    })
    // const lst = res.data
    return res.data
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
    // const result = res.data
    return res.data
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
}

export class ApiService {
  axios = Axios.create({ baseURL: process.env.VUE_APP_API_STRAPI_ENDPOINT })

  users = new ApiHandlerJWT<any>(this.axios, 'users', { find: false })
  tasks = new ApiHandlerJWT<any>(this.axios, 'tasks', { find: false, count: false })
  voting = new ApiHandlerJWT<any>(this.axios, 'voting-pools', { find: false, count: false, findOne: false })
  quizzes = new ApiHandlerJWT<any>(this.axios, 'quizzes', { find: false, count: false })

  constructor() {
    this.setupAuthInjection()
  }

  async fetchUser(access_token: string, access_secret: string, referrerCode?) {
    const res = await this.axios.get('auth/twitter/callback', {
      params: { access_token: access_token, access_secret: access_secret, referrerCode, userType: 'voting' },
    })
    return res.data
  }

  async updateProjectOwnerAddress(walletAddress: string, signature: string, chain: string, id: string) {
    const res = await this.axios.patch(
      'project-owners/updateProjectOwnerAddress',
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

  setupAuthInjection() {
    this.axios.interceptors.request.use((config) => {
      config.paramsSerializer = (params) => {
        if ('_where' in params) return qs.stringify(params)
        else return qs.stringify(params, { arrayFormat: 'repeat' })
      }
      return config
    })

    this.axios.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        authStore.checkEmptyJwt()
        if (get(error, 'response.status') === 401) {
          authStore.checkJwtExpiration()
        }
        return Promise.reject(error)
      }
    )
  }

  async createOrUpdateVotingPool(data) {
    const res = await this.axios.post(
      'voting-pools/createOrUpdateVotingPool',
      {
        ...data,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.jwt}`,
        },
      }
    )

    return res.data
  }

  async updateStatusToApproved(data) {
    const res = await this.axios.put('updateStatusToApproved', data)
    return res.data
  }

  async cancelVotingPool(data) {
    const res = await this.axios.put('cancelVotingPool', data)
    return res.data
  }

  // MARK FOR REMOVAL
  async updateVotingPoolInfo(model) {
    const res = await this.axios.post('voting-pools/updateVotingPoolInfo', model, {
      headers: {
        Authorization: `Bearer ${authStore.jwt}`,
      },
    })
    return res.data
  }

  async createQuiz(model) {
    const res = await this.axios.post('quizzes/createQuiz', model, {
      headers: {
        Authorization: `Bearer ${authStore.jwt}`,
      },
    })
    return res.data
  }

  async createTask(model) {
    const res = await this.axios.post('tasks/createTask', model, {
      headers: {
        Authorization: `Bearer ${authStore.jwt}`,
      },
    })
    return res.data
  }

  async getFile(id: any) {
    const res = await this.axios.get(`upload/files/${id}`)
    return res.data
  }

  async uploadFile(model: any) {
    const res = await this.axios.post('upload', model)
    return res.data
  }

  async signUp(publicAddress: string) {
    const res = await this.axios.post(`auth/local/register`, { publicAddress })
    return res.data
  }

  async signIn(model) {
    const { publicAddress, signature } = model
    const res = await this.axios.post(`auth/signin`, { publicAddress, signature })
    return res.data
  }
}
export const apiService = new ApiService()
