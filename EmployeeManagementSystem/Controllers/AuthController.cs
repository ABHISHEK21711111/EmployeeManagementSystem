using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Entity;
using EmployeeManagementSystem.Model;
using EmployeeManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EmployeeManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IRepository<User> userRepo;
        private readonly IConfiguration configuration;
        private readonly IRepository<Employee> empRepo;

        public AuthController(IRepository<User> userRepo,IConfiguration configuration, IRepository<Employee>empRepo) 
        {
            this.userRepo = userRepo;
            this.configuration = configuration;
            this.empRepo = empRepo;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthDto model)
        {
            var user = (await userRepo.GetAll(X => X.Email == model.Email)).FirstOrDefault();
            if (user == null)
            {
                return new BadRequestObjectResult(new { message = "user not found" });
            }

            var passwordHelper = new PasswordHelper();

            if (!passwordHelper.VerifyPassword(user.Password,model.Password))
            {
                return new BadRequestObjectResult(new { message = "email or password incorrect" });
            }
            var token = GenerateToken(user.Email, user.Role);
            return Ok(new AuthTokenDto()
            {
                Id = user.Id,
                Email =user.Email,
                Token = token,
                Role = user.Role,
            });

        }
        private string GenerateToken(string email,string role)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtKey"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name,email),
                new Claim(ClaimTypes.Role,role),
            };
             var token = new JwtSecurityToken(
                claims : claims, 
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials : credentials
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [Authorize]
        [HttpPost("profile")] 
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileDto modle)
        {
            var email = User.FindFirstValue(ClaimTypes.Name);
            var user =(await userRepo.GetAll(x=>x.Email == email)).FirstOrDefault();
            var employee =(await empRepo.GetAll(x=>x.UserId == user.Id)).FirstOrDefault();
            if (employee != null)
            {
                if (!string.IsNullOrEmpty(modle.Name))
                {
                    employee.Name = modle.Name;
                }
                if (!string.IsNullOrEmpty(modle.Phone))
                {
                    employee.Phone = modle.Phone;
                }
                empRepo.Update(employee);
            }
            if (!string.IsNullOrEmpty(modle.ProfileImage))
            {
                user.ProfileImage = modle.ProfileImage;
            }
            if (!string.IsNullOrEmpty(modle.Password))
            {
                var passwordHelper = new PasswordHelper();
                user.Password = passwordHelper.HashPassword(modle.Password);
            }
            userRepo.Update(user);
            await userRepo.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var email = User.FindFirstValue(ClaimTypes.Name);
            var user = (await userRepo.GetAll(x => x.Email == email)).FirstOrDefault();
            var employee = (await empRepo.GetAll(x => x.UserId == user.Id)).FirstOrDefault();
            return Ok(new ProfileDto()
            {
                Salary = employee?.Salary,
                Name = employee?.Name,
                Email = user.Email,
                Phone = employee?.Phone,
                ProfileImage = user.ProfileImage,
            });
        }
    }
}
