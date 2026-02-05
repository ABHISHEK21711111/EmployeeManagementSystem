import { Component, inject } from '@angular/core';
import { LeaveService } from '../../services/leave';
import { ILeave, LeaveStatus, LeaveType } from '../../types/leave';
import { PagedData } from '../../types/paged-data';
import { Table } from '../../components/table/table';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-leaves',
  imports: [Table],
  templateUrl: './leaves.html',
  styleUrl: './leaves.css',
})
export class Leaves {
  leaveService = inject(LeaveService);
  authServics = inject(AuthService);
  showCols = [
    'id',
    {
      key: 'type',
      format: (rowData: ILeave) => {
        switch (rowData.type) {
          case LeaveType.Casual:
            return 'Casual leave';
          case LeaveType.Sick:
            return 'Sick leave';
          case LeaveType.Earned:
            return 'Earned leave';
        }
      },
    },
    'reason',
    'leaveDate',
    {
      key: 'status',
      format: (rowData: ILeave) => {
        switch (rowData.status) {
          case LeaveStatus.Pending:
            return 'Pending';
          case LeaveStatus.Rejected:
            return 'Rejected';
          case LeaveStatus.Accepted:
            return 'Accepted';
          case LeaveStatus.Cancelled:
            return 'Cancelled';
        }
      },
    },
    {
      key: 'action',
      format: (rowData: ILeave) => {
        if (this.authServics.isEmployee) {
          if (rowData.status == LeaveStatus.Pending) return ['Cancel'];
          else [];
        } else if (rowData.status == LeaveStatus.Pending)
          return ['Reject', 'Accept'];
        return [];
      },
    },
  ];
  filter = {
    pageIndex: 0,
    pageSize: 5,
  };
  data!: PagedData<ILeave>;
  ngOnInit() {
    this.getLeavesData();
  }

  getLeavesData() {
    this.leaveService.getLeaves(this.filter).subscribe((result) => {
      this.data = result;
      console.log(this.data);
    });
  }
  pageChange(event: any) {
    this.filter.pageIndex = event.pageIndex;
    this.getLeavesData();
  }
  onRowClick(event: any) {
    console.log(event);
    switch (event.btn) {
      case 'Cancel':
        this.leaveService
          .updateLeaveStatus(event.rowData.id, LeaveStatus.Cancelled)
          .subscribe(() => {
            this.getLeavesData();
          });
        break;
      case 'Accept':
        this.leaveService
          .updateLeaveStatus(event.rowData.id, LeaveStatus.Accepted)
          .subscribe(() => {
            this.getLeavesData();
          });
        break;
      case 'Reject':
        this.leaveService
          .updateLeaveStatus(event.rowData.id, LeaveStatus.Rejected)
          .subscribe(() => {
            this.getLeavesData();
          });
        break;
    }
  }
}
