class ErrorCustomize extends Error {
    constructor(payload) {
        super(payload.message)

        this.statusCode = payload.statusCode || 500
        this.errorCode = payload.errorCode
        this.options = payload.options || null
    }
}

const responseToClient = (res, payload) => {
    const status = payload.statusCode || 200
    return res.status(status).json({
        success: payload.success || true,
        data: payload.data || {},
        options: payload.options || null
    })
}

const throwError = (payload) => {
    throw new ErrorCustomize(payload)
}

module.exports = {
    responseToClient,
    throwError
}