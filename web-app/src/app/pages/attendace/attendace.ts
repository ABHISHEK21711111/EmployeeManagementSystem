import { Component, inject } from '@angular/core';
import { Table } from '../../components/table/table';
import { LeaveService } from '../../services/leave';
import { PagedData } from '../../types/paged-data';
import { AttendaceType, IAttendace } from '../../types/attendace';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attendace',
  imports: [Table],
  templateUrl: './attendace.html',
  styleUrl: './attendace.css',
})
export class Attendace {
  filter = {
    pageIndex: 0,
    pageSize: 5,
    employeeId:'',
  };
  data!: PagedData<IAttendace>;
  employeeId!:string | null;
  route = inject(ActivatedRoute);
  showCols: any[] = [
    {
      key:"date",
      format:(rowData:IAttendace)=>{
        let date = new Date(rowData.date);
        return date.getDate() + "/" + (date.getMonth()+1) +"/" + date.getFullYear(); 
      }
    },
    {
      key: 'type',
      format:(rowData:IAttendace)=>{
        switch(rowData.type){
          case AttendaceType.Leave:
            return "Leave";
          case AttendaceType.Present:
            return "Present";
        }
      }
    },
  ];
  leaveServics = inject(LeaveService);
  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get("id");
    this.getLeavesData();
  }

  getLeavesData() {
    if(this.employeeId){
    this.filter.employeeId =this.employeeId as string;
    }
    this.leaveServics.getAttendaceHistory(this.filter).subscribe((result) => {
      this.data = result;
    });
  }
  pageChange(event: any) {
    this.filter.pageIndex = event.pageIndex;
    this.getLeavesData();
  }
}
