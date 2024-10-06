using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SignalRChatAppV2.Server.Data.Entities;
using SignalRChatAppV2.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SignalRChatAppV2.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(SignInManager<UserEntity> signInManager, UserManager<UserEntity> userManager, ILogger<AuthController> logger) : ControllerBase
    {
        private readonly SignInManager<UserEntity> _signInManager = signInManager;
        private readonly UserManager<UserEntity> _userManager = userManager;
        private readonly ILogger<AuthController> _logger;

        [HttpPost]
        [Route("signup")]

        public async Task<IActionResult> Register(UserDto userDto)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (!await _userManager.Users.AnyAsync(x => x.Email == userDto.Email))
                    {
                        var chatUser = new UserEntity
                        {
                            UserName = userDto.UserName,
                            Email = userDto.Email,
                        };
                        var registerResult = await _userManager.CreateAsync(chatUser, userDto.Password);
                        if (registerResult.Succeeded)
                        {
                            return Ok();
                        }
                    }
                }
                return BadRequest();

            }
            catch (Exception ex)
            {
                _logger.LogError($"ERROR : AuthController:Register() :: {ex.Message}");
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = await _userManager.FindByNameAsync(loginDto.UserName);
                    if (user == null)
                    {
                        return Unauthorized("Invalid username or password");
                    }

                    var signInResult = await _signInManager.PasswordSignInAsync(user.UserName!, loginDto.Password, false, false);
                    if (signInResult.Succeeded)
                    {
                        var token = GenerateJwtToken(user);

                        return Ok(new { token });
                    }
                }
                return Unauthorized("Invalid username or password");
            }
            catch (Exception ex)
            {
                _logger.LogError($"ERROR : AuthController:Login() :: {ex.Message}");
                return BadRequest();
            }
        }


        private static string GenerateJwtToken(UserEntity user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("d5df9b30d5891d6e19c3eda79aef6fa0181cb5f0da195f2bbb54022c7d217b1b");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
