namespace Todos.Services.DataServices
{
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    using Contracts;
    using Models;

    using Todos.Common.Extensions;
    using Todos.Data.Models;
    using Todos.Data.Repositories.Contracts;

    public class TodoesDataService : ITodoesDataService
    {
        private readonly IApplicationDataRepositoryProvider<Todo> repositoryProvider;

        public TodoesDataService(IApplicationDataRepositoryProvider<Todo> repositoryProvider)
        {
            if (repositoryProvider == null)
            {
                throw new ArgumentNullException(nameof(repositoryProvider));
            }

            this.repositoryProvider = repositoryProvider;
        }

        private Expression<Func<Todo, TodoServiceModel>> MapDataToServiceModel => t => new TodoServiceModel
        {
            Id = t.Id,
            Category = t.Category,
            State = t.State,
            Text = t.Text,
            UserId = t.UserId
        };

        private Func<TodoServiceModel, Todo> MapServiceToDataModel => t => new Todo
        {
            Id = t.Id,
            Category = t.Category,
            State = t.State,
            Text = t.Text,
            UserId = t.UserId
        };

        public async Task<object> Add(TodoServiceModel todo, string userId)
        {
            if (todo == null)
            {
                throw new ArgumentNullException(nameof(todo));
            }

            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new ArgumentNullException(nameof(userId));
            }

            var entity = this.MapServiceToDataModel.Invoke(todo);
            entity.UserId = userId;

            var repository = this.repositoryProvider.Create();

            await repository.Add(entity);
            var result = await repository.SaveChanges();

            repository.TryDispose();

            return result;
        }

        public async Task<object> Delete(string id, string userId)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new ArgumentNullException(nameof(userId));
            }

            var repository = this.repositoryProvider.Create();
            var todo = (await repository.All())
                .FirstOrDefault(t => t.UserId == userId && t.Id == id);

            await repository.Delete(todo);
            var result = await repository.SaveChanges();

            repository.TryDispose();

            return result;
        }

        public async Task<IQueryable<TodoServiceModel>> Get(int page, int numberOfItemsPerPage, string userId)
        {
            if (page < 0)
            {
                throw new ArgumentException(nameof(page));
            }

            if (numberOfItemsPerPage < 1)
            {
                throw new ArgumentException(nameof(numberOfItemsPerPage));
            }

            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new ArgumentNullException(nameof(userId));
            }

            var repository = this.repositoryProvider.Create();

            var todoes = (await repository.All())
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.DateCreated)
                .Skip(page * numberOfItemsPerPage)
                .Take(numberOfItemsPerPage)
                .Select(this.MapDataToServiceModel)
                .ToList();

            repository.TryDispose();

            return todoes.AsQueryable();
        }

        public async Task<TodoServiceModel> GetById(string id, string userId)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new ArgumentNullException(nameof(userId));
            }

            var repository = this.repositoryProvider.Create();

            var todo = (await repository.All())
                .Where(t => t.UserId == userId && t.Id == id)
                .Select(this.MapDataToServiceModel)
                .FirstOrDefault();

            repository.TryDispose();

            return todo;
        }

        public async Task<object> Update(TodoServiceModel todo, string userId)
        {
            if (todo == null)
            {
                throw new ArgumentNullException(nameof(todo));
            }

            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new ArgumentNullException(nameof(userId));
            }

            var entity = this.MapServiceToDataModel.Invoke(todo);
            entity.UserId = userId;

            var repository = this.repositoryProvider.Create();

            await repository.Update(entity);
            var result = await repository.SaveChanges();

            repository.TryDispose();

            return result;
        }
    }
}