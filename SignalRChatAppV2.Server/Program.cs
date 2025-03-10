using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SignalRChatAppV2.Server.Data.Contexts;
using SignalRChatAppV2.Server.Data.Entities;
using SignalRChatAppV2.Server.Hubs;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

// Configure the database context to use SQLite with a connection string from the configuration.
builder.Services.AddDbContext<ChatContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("ChatDbConnection")));

// Configure Identity services for user management and authentication.
builder.Services.AddDefaultIdentity<UserEntity>(x =>
{
    x.User.RequireUniqueEmail = true;
    x.SignIn.RequireConfirmedEmail = false;
    x.Password.RequiredLength = 8;

}).AddEntityFrameworkStores<ChatContext>();

// Configure CORS to allow requests from the specified origin (React client URL).
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
        builder.WithOrigins("https://localhost:5174")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials());
});

// Configure JWT authentication.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Set token validation parameters.
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("d5df9b30d5891d6e19c3eda79aef6fa0181cb5f0da195f2bbb54022c7d217b1b"))
        };

        // Configure SignalR to support token authentication via the query string.
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // Retrieve the access token from the query string.
                var accessToken = context.Request.Query["access_token"];

                // If the token is present and the request is for the "/chathub" endpoint, set the token.
                if (!string.IsNullOrEmpty(accessToken) && context.HttpContext.Request.Path.StartsWithSegments("/chathub"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });
// Configure Kestrel web server to listen on specific ports.
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5052); // HTTP port
    options.ListenAnyIP(7128, listenOptions => // HTTPS port
    {
        listenOptions.UseHttps(); // Enable HTTPS for secure communication.
    });
});

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapFallbackToFile("/index.html");
app.MapControllers();

app.MapHub<ChatHub>("/chathub"); // Map the SignalR hub to the "/chathub" endpoint.

app.Run();
