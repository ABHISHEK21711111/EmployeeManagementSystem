import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { IDashboard, IDepartmentData } from '../types/dashboard';
import { ILeave } from '../types/leave';

@Injectable({
  providedIn: 'root',
})
export class dashboardService {
  http = inject(HttpClient)
  constructor(){}

  getDashboardData(){
    return this.http.get<IDashboard>(environment.apiUrl+"/api/Dashboard");
  }

  getDepartmentData(){
    return this.http.get<IDepartmentData[]>(
      environment.apiUrl+'/api/Dashboard/department-data'
    );
  }
  
  // getTodayLeaveData(){
  //   return this.http.get<ILeave[]>(
  //     environment.apiUrl+'/api/Dashboard/employee-leave-today'
  //   );
  // }
}
