export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message?: string;
  data?: T | T[] | string | null;
}

/* Example IValidationErrors:
  "password": {
            "type": "field",
            "msg": "El password es obligatorio",
            "path": "password",
            "location": "body"
        }
  */
export interface IValidationError {
  [key: string]: {
    type: string;
    msg: string;
    path: string;
    location: string;
  };
}
