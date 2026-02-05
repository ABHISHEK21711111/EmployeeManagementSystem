import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ApplyLeave } from '../../components/apply-leave/apply-leave';
import { MatDialog } from '@angular/material/dialog';
import { LeaveService } from '../../services/leave';

@Component({
  selector: 'app-employeedashboard',
  imports: [MatCardModule,MatButtonModule],
  templateUrl: './employeedashboard.html',
  styleUrl: './employeedashboard.css',
})
export class Employeedashboard {
readonly dialog = inject(MatDialog);
leaveService =inject(LeaveService);
  applyLeave(){
   this.openDialog();
  }
   openDialog(): void {
      let ref = this.dialog.open(ApplyLeave, {
        panelClass:'m-auto'
      });
      ref.afterClosed().subscribe(result=>{
       // this.getLatestData();
      })
    }

    markAttendance(){
     this.leaveService.markPresent().subscribe({
      next: result=>{
         alert('Your are marked present for today.');
      },
      error:(e:any)=>{
        console.log(e);
        alert(e.error);
      },
     })
    }
}
