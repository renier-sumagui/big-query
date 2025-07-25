import axios, { AxiosInstance } from 'axios'
import dotenv from 'dotenv'

class MasterConnectivity {
    private api: AxiosInstance
    private uri: string
    public actions: any
    response: any
    public serviceName: string = 'bigquery-service'
    public language: string = 'en'
    constructor() {
        dotenv.config()

        this.uri = process.env.MASTERS_URI as string
        this.api = axios.create({ baseURL: this.uri })
        this.getActions()
        this.getResponse(this.serviceName, this.language)
    }

    public async getActions() {
        return new Promise(async (resolve, reject) => {
            try {
                const response: any = await this.api.get('/action/query?serviceName=*')
                let res = response.data
                this.actions = {}
                for (let i = 0; i < res['response'].length; i++) {
                    this.actions[res['response'][i].actionCode] = res['response'][i].actionName
                }
                resolve(res)
            } catch (err) {
                // bypassing if connection to master data service is not established
                resolve({})
            }
        })
    }

    public async getResponse(serviceName: string, language: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const response: any = await this.api.get('/response/listing', {
                    params: { serviceName, language }
                })
                let res = response.data

                if (res.success) this.response = res.data

                resolve(this.response)
            } catch (err) {
                // bypassing if connection to master data service is not established
                resolve({})
            }
        })
    }

    public async getMayaReply(params: any) {
        return new Promise(async (resolve, reject) => {
            try {
                
                const response: any = await this.api.get('/maya-content/reply', {
                    params
                })
                let res = response.data

                if (res.success) this.response = res.response

                //console.log('this.response', this.response)

                resolve(this.response)
            } catch (err: any) {
                console.log(err.message)
                
                // bypassing if connection to master data service is not established
                resolve({})
            }
        })
    }
}
//export default MasterConnectivity
export default new MasterConnectivity();