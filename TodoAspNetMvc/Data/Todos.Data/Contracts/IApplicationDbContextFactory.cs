namespace Todos.Data.Contracts
{
    using System.Data.Entity.Infrastructure;

    public interface IApplicationDbContextFactory : IDbContextFactory<ApplicationDbContext>
    {
        string ConnectionString { get; set; }
    }
}