class ErrorArgumentInvalid extends Error {
  constructor(message) {
    super(message)
    this.name = 'ErrorArgumentInvalid'
  }
}

class InternalServerError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InternalServerError'
  }
}

module.exports = {
  ErrorArgumentInvalid,
  InternalServerError,
}
