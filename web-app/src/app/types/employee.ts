export interface IEmployee {
  id: number;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  gender: number;
  departmentId: string;
  joiningDate: string;
  lastWorkingDate: string;
  dataOfBirth: string;
}

export enum Gender {
  Male = 1,
  FeMale = 2,
}
