import { Component, inject } from '@angular/core';
import { HttpService } from '../../services/http';
import { Table } from '../../components/table/table';
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
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounce, debounceTime } from 'rxjs';
import { PagedData } from '../../types/paged-data';
import { Router } from '@angular/router';


@Component({
  selector: 'app-employee',
  imports: [
    Table,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee {
  
  httpService = inject(HttpService);
  pageEmployeeData!: PagedData<IEmployee>
  totalData!:number;
  router =inject(Router);
  showCols = ['id', 'name', 'email', 'phone', 
    {
      key:'action',
      format:()=>{
        return ["Edit","Delete","Attendace"]
      }
    }
  ];
  searchControl = new FormControl('');
  filter:any ={
    pageIndex :0,
    pageSize:2,
  };
  ngOnInit() {
    this.getLatestData();
    this.searchControl.valueChanges.pipe(debounceTime(350))
    .subscribe((result:string | null)=>{
      console.log(result);
      this.filter.search = result;
      this.filter.pageIndex = 0;
      this.getLatestData();
    })
  }
   

  getLatestData(){
    this.httpService.getEmployeeList(this.filter).subscribe((result) => {
      this.pageEmployeeData = result;
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

  pageChange(event:any){
    this.filter.pageIndex = event.pageIndex;
    this.getLatestData();
  }
  OnRowClick(event:any){
    if(event.btn==="Edit"){
      this.edit(event.rowData)
    }
    if(event.btn==="Delete"){
      this.delete(event.rowData)
    }
    if(event.btn==="Attendace"){
      this.router.navigateByUrl("/attendace/"+event.rowData.id);
    }
  }
}
