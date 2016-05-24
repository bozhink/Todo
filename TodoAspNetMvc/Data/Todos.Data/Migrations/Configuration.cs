namespace Todos.Data.Migrations
{
    using System.Data.Entity.Migrations;

    using Todos.Common.Constants;

    public sealed class Configuration : DbMigrationsConfiguration<ApplicationDbContext>
    {
        public Configuration()
        {
            this.AutomaticMigrationsEnabled = true;
            this.ContextKey = DataConstants.DataContextKey;
        }

        protected override void Seed(ApplicationDbContext context)
        {
        }
    }
}