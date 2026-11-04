export default class AppError extends Error {
  constructor(status, payload) {
    super(payload.mensaje);
    this.status = status;
    this.payload = payload;
  }
}
