import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LeaveService } from '../../services/leave';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-apply-leave',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './apply-leave.html',
  styleUrl: './apply-leave.css',
})
export class ApplyLeave {
  fb = inject(FormBuilder)
  leaveService = inject(LeaveService);
  dialogRef =inject(MatDialogRef<ApplyLeave>);
  leaveForm = this.fb.group({
   type:[,Validators.required],
   leaveDate:[,Validators.required],
   reason:[]
  })

  onSubmit(){
    if(this.leaveForm.invalid){
      alert("Please select and provide all the field");
    }
     let leave:any =this.leaveForm.value;
     this.leaveService.applyLeave(leave.type,leave.reason,leave.leaveDate).subscribe((result)=>{
        alert('leave applied');
        this.dialogRef.close();
     });
  }
}
