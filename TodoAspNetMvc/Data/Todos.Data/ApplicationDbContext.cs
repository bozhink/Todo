namespace Todos.Data
{
    using System.Data.Entity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Models;

    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(string connectionString)
            : base(connectionString, throwIfV1Schema: false)
        {
        }

        public IDbSet<Todo> Todoes { get; set; }

        public IDbSet<Event> Events { get; set; }
    }
}