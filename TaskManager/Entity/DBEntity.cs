using Microsoft.EntityFrameworkCore;

namespace TaskManager.Entity
{
    public class DBEntity : DbContext
    {
        public DBEntity(DbContextOptions<DBEntity> options): base(options)
        {

        }
        
        public DbSet<Tasks> Tasks { get; set; }
    }
}
