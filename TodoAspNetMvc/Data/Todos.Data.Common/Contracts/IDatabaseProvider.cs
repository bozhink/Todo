namespace Todos.Data.Common.Contracts
{
    public interface IDatabaseProvider<T>
    {
        T Create();
    }
}