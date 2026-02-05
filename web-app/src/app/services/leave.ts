import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ILeave } from '../types/leave';
import { PagedData } from '../types/paged-data';
import { AuthService } from './auth';
import { IAttendace } from '../types/attendace';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  http = inject(HttpClient);

  constructor(){}

  applyLeave(type:number,reason:string,date:string,){
   return this.http.post(environment.apiUrl+'/api/Leave/apply',{
      type,
      reason,
      leaveDate:date,
    })
  } 

  getLeaves(filter:any){
    var parmams =new HttpParams({ fromObject : filter});
    return this.http.get<PagedData<ILeave>>(environment.apiUrl+'/api/Leave?'+parmams.toString());
  }
  updateLeaveStatus(id:number,status:number){
    return this.http.post(environment.apiUrl+'/api/leave/update-status',{
      id,
      status,
    })
  }

  markPresent(){
    return this.http.post(environment.apiUrl+'/api/Attendance/mark-present',{
     })
  }

  getAttendaceHistory(filter:any){
    var parmams =new HttpParams({ fromObject : filter});
    return this.http.get<PagedData<IAttendace>>(
      environment.apiUrl+'/api/Attendance?'+parmams.toString());
  }
}
