import { Component, inject } from '@angular/core';
import { HttpService } from '../../services/http';
import { IDepartment } from '../../types/department';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-department',
  imports: [MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './department.html',
  styleUrl: './department.css',
})
export class Department {
  httpService = inject(HttpService);
  departments: IDepartment[] = [];
  isFormOpen = false;
  departmentName!: string;
  editId = 0;
  ngOnInit() {
    this.getLatesData();
  }

  getLatesData() {
    this.httpService.getDepartments().subscribe((result) => {
      this.departments = result;
    });
  }

  addDepartment() {
    this.httpService.addDepartment(this.departmentName).subscribe(() => {
      alert('Records Saved.');
      this.isFormOpen = false;
      this.getLatesData();
    });
  }

  editDepartment(department:IDepartment){
   this.departmentName = department.name
   this.isFormOpen = true;
   this.editId =department.id;
  }

  updateDepartment(){
    this.httpService.updateDepartment(this.editId,this.departmentName).subscribe(() => {
      alert('Records Saved.');
      this.isFormOpen = false;
      this.getLatesData();
      this.editId = 0;
    });
  }

  delete(id:number){
    this.httpService.deleteDepartment(id).subscribe(() => {
      alert('Records Delete.');
      this.isFormOpen = false;
      this.getLatesData();
    });

  }
}