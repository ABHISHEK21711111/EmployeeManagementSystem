import { Component, inject } from '@angular/core';
import { HttpService } from '../../services/http';
import { Table } from '../../compnents/table/table';
import { IEmployee } from '../../types/employee';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { EmployeeForm } from './employee-form/employee-form';

@Component({
  selector: 'app-employee',
  imports: [
    Table,
    MatButtonModule,
  ],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee {
  
  httpService = inject(HttpService);
  employeeList: IEmployee[] = [];
  showCols = ['id', 'name', 'email', 'phone', 'action'];

  ngOnInit() {
    this.getLatestData();
  }

  getLatestData(){
    this.httpService.getEmployeeList().subscribe((result) => {
      this.employeeList = result;
    });
  }

  edit(employee: IEmployee) {
     let ref = this.dialog.open(EmployeeForm, {
      panelClass:'m-auto',
      data:{
        employeeId : employee.id,
      },
    });
    ref.afterClosed().subscribe(result=>{
      this.getLatestData();
    })
  }
  delete(employee: IEmployee) {
    console.log(employee);
    this.httpService.deleteEmployee(employee.id).subscribe(()=>{
     alert("Record Deleted");
     this.getLatestData();
    })
  }
  
  add() {
    this.openDialog();
  }

  readonly dialog = inject(MatDialog);

  openDialog(): void {
    let ref = this.dialog.open(EmployeeForm, {
      panelClass:'m-auto'
    });
    ref.afterClosed().subscribe(result=>{
      this.getLatestData();
    })
  }


}
