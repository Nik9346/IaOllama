import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map, Observable } from 'rxjs';
import { IResponseRunningModel } from '../models/responseRunningModel.model';
import { IResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  path: string = '/tags';
  pathDefaultModel: string = '/ps';
  pathLoadDefaultModel: string = '/generate';
  constructor(private apiService: ApiService) {}

  loadDefaultModel(defaultModel: Object): Observable<IResponse> {
    return this.apiService
      .post(this.pathLoadDefaultModel, defaultModel)
      .pipe(map((data: IResponse) => data));
  }

  getModelAvailable(): Observable<IResponseRunningModel> {
    return this.apiService
      .get(this.path)
      .pipe(map((data: IResponseRunningModel) => data));
  }
  getDefaultModel(): Observable<IResponseRunningModel> {
    return this.apiService
      .get(this.pathDefaultModel)
      .pipe(map((data: IResponseRunningModel) => data));
  }
}
