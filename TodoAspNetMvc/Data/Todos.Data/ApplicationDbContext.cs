namespace Todos.Data
{
    using System.Data.Entity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Models;

    using Todos.Common.Constants;

    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext()
            : base(DataConstants.DefaultConnectionKey, throwIfV1Schema: false)
        {
        }

        public IDbSet<Todo> Todoes { get; set; }

        public IDbSet<Event> Events { get; set; }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }
}