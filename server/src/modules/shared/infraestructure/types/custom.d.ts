import express from "express";

declare global {
  namespace Express {
    interface Request {
      payload?: any;
      user?: any;
      auth?: any;
    }
  }
}
