import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Department } from './pages/department/department';
import { Employee } from './pages/employee/employee';

export const routes: Routes = [
    {
        path:"",
        component:Home
    },
    {
        path:"departments",
        component:Department
    },
    {
        path:"employee",
        component:Employee
    }

];
