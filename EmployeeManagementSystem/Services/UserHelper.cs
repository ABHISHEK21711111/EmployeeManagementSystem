using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Entity;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace EmployeeManagementSystem.Services
{
    public class UserHelper
    {
        private readonly IRepository<User> userRepo;
        private readonly IRepository<Employee> empRepo;

        public UserHelper(IRepository<User> userRepo,IRepository<Employee> empRepo)
        {
            this.userRepo = userRepo;
            this.empRepo = empRepo;
        }

        public async Task<int> GetUserId(ClaimsPrincipal userClaim)
        {
            var email = userClaim!.FindFirstValue(ClaimTypes.Name);
            var user = (await userRepo.GetAll(x => x.Email == email)).FirstOrDefault();
            return user.Id;
        }
        public async Task<int?> GetEmployeeId(ClaimsPrincipal userClaim)
        {
            var email = userClaim!.FindFirstValue(ClaimTypes.Name);
            var user = (await userRepo.GetAll(x => x.Email == email)).FirstOrDefault();
            var employee = (await empRepo.GetAll(x => x.UserId == user.Id)).FirstOrDefault();
            return employee?.Id;
        }
        public async Task<bool> IsAdmin(ClaimsPrincipal userClaim)
        {
            var role = userClaim!.FindFirstValue(ClaimTypes.Role);
            return role == "Admin";
        }
    }
}
