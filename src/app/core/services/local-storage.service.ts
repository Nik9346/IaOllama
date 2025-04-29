import { Injectable } from "@angular/core";
import { v4 as uuidv4 } from "uuid";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  constructor() {}

  setToken(): void {
    let tkn = localStorage.getItem("token");
    if (!tkn) {
      tkn = uuidv4();
      localStorage.setItem("token", tkn);
    }
    return;
  }

  getToken(): string | null {
    let token = localStorage.getItem("token");
    if (!token) {
      token = uuidv4();
      localStorage.setItem("token", token);
    }
    return token;
  }

  removeToken(): void {
    return localStorage.removeItem("token");
  }

  saveData(id: string, data: any): void {
    localStorage.setItem(`history_${id}`, JSON.stringify(data));
  }
  getData(id: string): any {
    let data = localStorage.getItem(`history_${id}`);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }
}
