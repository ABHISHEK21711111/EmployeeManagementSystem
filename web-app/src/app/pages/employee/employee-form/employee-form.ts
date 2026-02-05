import { Component, Inject, inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { IDepartment } from '../../../types/department';
import { HttpService } from '../../../services/http';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-employee-form',
  imports: [
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatIconModule
  ],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeForm {
  fb = inject(FormBuilder);
  dailogRef = inject(MatDialogRef<EmployeeForm>)
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  this.data = this.data || {};  
}
  @Input() employeeId!:number;

  employeeForm = this.fb.group({
    id: [0],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    gender: [1, Validators.required],
    salary:[],
    departmentId: ['', Validators.required],
    jobTitle: ['', Validators.required],
    joiningDate:[null, Validators.required],
    lastWorkingDate:[null],
    dateOfBirth:[null, Validators.required],
  });

  departments:IDepartment[]=[];
  httpService = inject(HttpService)
  ngOnInit(){
    this.httpService.getDepartments({}).subscribe(result=>{
      this.departments = result.data;
    });
    if(this.data.employeeId){
      this.httpService.getEmployeeById(this.data.employeeId).subscribe(result=>{
        console.log(result);
        const employee = result as any;
       employee.gender = employee.gender !== null
       ? Number(employee.gender)
       : null;
        this.employeeForm.patchValue(employee);
        this.employeeForm.get('gender')?.disable();
        this.employeeForm.get('joiningDate')?.disable();
        this.employeeForm.get('dateOfBirth')?.disable();
      })
    }else{
    }
  }

  
  onSubmit() {
   if(this.data.employeeId){
    let value:any = this.employeeForm.value;
    this.httpService.updateEmployee(this.data.employeeId,value).subscribe(()=>{
      alert("Record Updated");
      this.dailogRef.close();
    })
   }else{
    let value:any = this.employeeForm.value;
    this.httpService.addEmployee(value).subscribe(()=>{
      alert("Record save");
      this.dailogRef.close();
    })
  }
  }
}
