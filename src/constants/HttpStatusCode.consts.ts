/**
 * HTTP response status codes.
 */
export enum HttpStatusCode {
   BAD_REQUEST = 400,
   UNAUTHORIZED = 401,
   NOT_FOUND = 402,
   FORBIDDEN = 403,
   PAYMENT_REQUIRED = 404,
   METHOD_NOT_ALLOWED = 405,
   NOT_ACCEPTABLE = 406,
   PROXY_AUTHENTICATION_REQUIRED = 407,
   REQUEST_TIMEOUT = 408,
   CONFLICT = 409,
   GONE = 410,
   LENGTH_REQUIRED = 411,
   PRECONDITION_FAILED = 412,
   PAYLOAD_TOO_LARGE = 413,
   URI_TOO_LONG = 414,
   UN_SUPPORTED_MEDIA_TYPE = 415,
   RANGE_NOT_SATISFIABLE = 416,
   EXPECTATION_FAILED = 417,
   IMA_TEAPOT = 418,
   INTERNAL_SERVER_ERROR = 500,
   NOT_IMPLEMENTED = 501,
   BAD_GATEWAY = 502,
   SERVICE_UNAVAILABLE = 503,
   GATEWAY_TIMEOUT = 504,
   NETWORK_AUTHENTICATION_REQUIRED = 511,
}
