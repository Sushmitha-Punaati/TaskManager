using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using TaskManager.Entity;
using TaskManager.Entity.DL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews().AddJsonOptions(o => o.JsonSerializerOptions.NumberHandling = JsonNumberHandling.AllowReadingFromString); ;
builder.Services.AddMvcCore();

builder.Services.AddDbContext<DBEntity>(options =>
    options.UseSqlite("Data Source=Tasks.db"));

builder.Services.AddScoped<TaskService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=TaskManager}/{action=Index}/{id?}");

app.Run();
