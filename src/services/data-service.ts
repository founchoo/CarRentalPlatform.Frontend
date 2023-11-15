import http from '@/utils/http'

class DataService {

  private baseURL: string

  public constructor(baseURL: string = '') {
    this.baseURL = baseURL
  }

  public setBaseURL(url: string) {
    this.baseURL = url
  }

  async getByIdAsync(id: string) {
    return await http.get(`${this.baseURL}/getById?id=${id}`)
  }

  async getAllAsync() {
    return await http.get(`${this.baseURL}/getAll`)
  }

  async getAllByPageAsync(start: Number, size: Number) {
    return await http.get(`${this.baseURL}/getAllByPage?start=${start}&size=${size}`)
  }

  async getAllSortedByPageAsync(start: Number, size: Number, sort: string, asc: boolean) {
    return await http.get(`${this.baseURL}/getAllSortedByPage?start=${start}&size=${size}&sort=${sort}&asc=${asc}`)
  }

  async fuzzySearchByPageAsync(start: Number, size: Number, key: string) {
    return await http.get(`${this.baseURL}/fuzzySearchByPage?start=${start}&size=${size}&key=${key}`)
  }

  async fuzzySearchByColumnByPageAsync(start: number, size: number, key: string, column: string) {
    return await http.get(`${this.baseURL}/fuzzySearchByColumnByPage?start=${start}&size=${size}&key=${key}&column=${column}`)
  }

  async filterRangeByPageAsync(start: Number, size: Number, min: any, max: any, column: string) {
    return await http.get(`${this.baseURL}/filterRangeByPage?start=${start}&size=${size}&min=${min}&max=${max}&column=${column}`)
  }

  async addAsync(data: {}) {
    return await http.post(`${this.baseURL}/add`, data)
  }

  async updateAsync(data: {}) {
    return await http.put(`${this.baseURL}/update`, data)
  }

  async deleteAsync(id: string) {
    return await http.delete(`${this.baseURL}/delete?id=${id}`)
  }

  async deleteBatchAsync(ids: any[]) {
    return await http.delete(`${this.baseURL}/deleteBatch`, {
      data: ids
    })
  }

  async exportToExcel() {
    return await http.get(`${this.baseURL}/exportToExcel`, {
      responseType: 'arraybuffer'
    })
  }

  async importFromExcel(data: any) {
    return await http.post(`${this.baseURL}/importFromExcel`, data, {
      headers: {
        'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime()
      },
      // @ts-ignore
      isNative: true
    })
  }

  async login(data: {}) {
    return await http.post('/user/login', data)
  }
}

export default DataService