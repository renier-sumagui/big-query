import master from '../connectivity/master'

class ResponseClass {
    lang: any
    response: any

    public getMessage(code: string, message: string) {
        this.response = master.response
        if (this.response)
            return this.response[code]
                ? this.response[code][this.lang]
                    ? this.response[code][this.lang]
                    : this.response[code]['en']
                : message
        else return message
    }
}
export default new ResponseClass();