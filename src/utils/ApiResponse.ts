class apiReponse {
  constructor(
    public success: boolean,
    public statusCode: number,
    public data: any,
    public message = "Default message"
  ) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.data = data;
    this.message = message;
  }
}

export { apiReponse };
