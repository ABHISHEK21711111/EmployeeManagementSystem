import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { dashboardService } from '../../services/dashboard';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { IDepartmentData } from '../../types/dashboard';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, BaseChartDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  salaryForMonth!: number;
  employeeCount!: number;
  departmentCount!: number;
  dashboardService = inject(dashboardService);

  public barChartLegend = true;
  public barChartPlugins = [];
  departmentData!: IDepartmentData[];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Department Count' }],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  ngOnInit() {
    this.dashboardService.getDashboardData().subscribe((result) => {
      this.salaryForMonth = result.totalSalary;
      this.employeeCount = result.employeeCount;
      this.departmentCount = result.departmentCount;
    });

    this.dashboardService.getDepartmentData().subscribe((result) => {
      console.log(result);
      this.barChartData.labels = result.map((x) => x.name);
      this.barChartData.datasets[0].data = result.map((x) => x.employeeCount);
      this.departmentData = result;
    });

    // this.dashboardService.getTodayLeaveData().subscribe((result) => {
    //   console.log(result);
    // });
  }
}
