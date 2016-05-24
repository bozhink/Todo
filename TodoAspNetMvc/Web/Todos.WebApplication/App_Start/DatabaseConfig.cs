namespace Todos.WebApplication
{
    using System.Data.Entity;

    public static class DatabaseConfig
    {
        public static void Initialize()
        {
            Database.SetInitializer(
                new MigrateDatabaseToLatestVersion<Todos.Data.ApplicationDbContext, Todos.Data.Migrations.Configuration>());
        }
    }
}