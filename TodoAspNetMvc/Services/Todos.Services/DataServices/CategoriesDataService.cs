namespace Todos.Services.DataServices
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Contracts;
    using Models;

    using Todos.Common.Extensions;
    using Todos.Data.Models;
    using Todos.Data.Repositories.Contracts;

    public class CategoriesDataService : ICategoriesDataService
    {
        private readonly IApplicationDataRepositoryProvider<Todo> todoesRepositoryProvider;
        private readonly IApplicationDataRepositoryProvider<Event> eventsRepositoryProvider;

        public CategoriesDataService(IApplicationDataRepositoryProvider<Todo> todoesRepositoryProvider, IApplicationDataRepositoryProvider<Event> eventsRepositoryProvider)
        {
            if (todoesRepositoryProvider == null)
            {
                throw new ArgumentNullException(nameof(todoesRepositoryProvider));
            }

            if (eventsRepositoryProvider == null)
            {
                throw new ArgumentNullException(nameof(eventsRepositoryProvider));
            }

            this.todoesRepositoryProvider = todoesRepositoryProvider;
            this.eventsRepositoryProvider = eventsRepositoryProvider;
        }

        public async Task<IQueryable<CategoryServiceModel>> GetCategories()
        {
            var todoesRepository = this.todoesRepositoryProvider.Create();

            var todoesCategories = (await todoesRepository.All())
                .Select(t => t.Category)
                .ToList();

            todoesRepository.TryDispose();

            var eventsRepository = this.eventsRepositoryProvider.Create();

            var eventsCategories = (await eventsRepository.All())
                .Select(e => e.Category)
                .ToList();

            eventsRepository.TryDispose();

            todoesCategories.AddRange(eventsCategories);

            return new HashSet<string>(todoesCategories)
                .OrderBy(t => t)
                .Select(t => new CategoryServiceModel
                {
                    Text = t
                })
                .AsQueryable();
        }
    }
}