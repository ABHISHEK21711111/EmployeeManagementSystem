import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Department } from './pages/department/department';
import { Employee } from './pages/employee/employee';
import { Login } from './pages/login/login';
import { Employeedashboard } from './pages/employeedashboard/employeedashboard';
import { Profile } from './pages/profile/profile';
import { Leaves } from './pages/leaves/leaves';
import { Attendace } from './pages/attendace/attendace';

export const routes: Routes = [
    {
        path:"",
        component:Home
    },
    {
        path:"employee-dashbaord",
        component:Employeedashboard
    },
    {
        path:"departments",
        component:Department
    },
    {
        path:"employee",
        component:Employee
    },
    {
        path:"login",
        component:Login
    },
    {
        path:"profile",
        component:Profile
    },
    {
        path:"leaves",
        component:Leaves
    },
    {
        path:"attendace",
        component:Attendace
    },
    {
        path:"attendace/:id",
        component:Attendace
    }
];
