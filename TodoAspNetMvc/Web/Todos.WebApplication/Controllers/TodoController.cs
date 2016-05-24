namespace Todos.WebApplication.Controllers
{
    using System;
    using System.Data;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Mvc;

    using Constants;

    using Microsoft.AspNet.Identity;

    using Todos.Common.Extensions;
    using Todos.Services.Contracts;
    using Todos.Services.Models;

    using ViewModels.Todo;

    [Authorize]
    public class TodoController : Controller
    {
        private readonly IUsersDataService usersDataService;
        private readonly ITodoesDataService todoesDataService;

        public TodoController(ITodoesDataService todoesDataService, IUsersDataService usersDataService)
        {
            if (todoesDataService == null)
            {
                throw new ArgumentNullException(nameof(todoesDataService));
            }

            if (usersDataService == null)
            {
                throw new ArgumentNullException(nameof(usersDataService));
            }

            this.todoesDataService = todoesDataService;
            this.usersDataService = usersDataService;
        }

        private Expression<Func<TodoServiceModel, TodoViewModel>> MapServiceToViewModel => t => new TodoViewModel
        {
            Id = t.Id,
            Category = t.Category,
            State = t.State,
            Text = t.Text,
            UserId = t.UserId
        };

        private Func<TodoViewModel, TodoServiceModel> MapViewToServiceModel => t => new TodoServiceModel
        {
            Id = t.Id,
            Category = t.Category,
            State = t.State,
            Text = t.Text,
            UserId = t.UserId
        };

        // GET: Todo
        public async Task<ActionResult> Index()
        {
            try
            {
                var userId = User.Identity.GetUserId();
                var todoes = (await this.todoesDataService.Get(0, 10, userId))
                    .Select(this.MapServiceToViewModel)
                    .ToList();

                return this.View(todoes);
            }
            catch
            {
                return this.View(ViewConstants.ErrorViewName);
            }
        }

        // GET: Todo/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            try
            {
                var todo = await this.GetViewModelById(id);

                if (todo == null)
                {
                    return this.HttpNotFound();
                }

                return this.View(todo);
            }
            catch
            {
                return this.View(ViewConstants.ErrorViewName);
            }
        }

        // GET: Todo/Create
        public async Task<ActionResult> Create()
        {
            try
            {
                var users = (await this.usersDataService.GetAllUsers()).ToList();
                ViewBag.UserId = new SelectList(users, "Id", "Email");
                return this.View();
            }
            catch
            {
                return this.View(ViewConstants.ErrorViewName);
            }
        }

        // POST: Todo/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,Text,Category,State,UserId")] TodoViewModel todo)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var userId = User.Identity.GetUserId();
                    var serviceModel = this.MapViewToServiceModel.Invoke(todo);
                    await this.todoesDataService.Add(serviceModel, userId);
                    return this.RedirectToAction(nameof(this.Index));
                }

                var users = (await this.usersDataService.GetAllUsers()).ToList();
                ViewBag.UserId = new SelectList(users, "Id", "Email", todo.UserId);
                return this.View(todo);
            }
            catch
            {
                return this.View(ViewConstants.ErrorViewName);
            }
        }

        // GET: Todo/Edit/5
        public async Task<ActionResult> Edit(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            try
            {
                var todo = await this.GetViewModelById(id);

                if (todo == null)
                {
                    return this.HttpNotFound();
                }

                var users = (await this.usersDataService.GetAllUsers()).ToList();
                ViewBag.UserId = new SelectList(users, "Id", "Email", todo.UserId);
                return this.View(todo);
            }
            catch
            {
                return this.View(ViewConstants.ErrorViewName);
            }
        }

        // POST: Todo/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,Text,Category,State,UserId")] TodoViewModel todo)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var userId = User.Identity.GetUserId();
                    var serviceModel = this.MapViewToServiceModel.Invoke(todo);
                    await this.todoesDataService.Update(serviceModel, userId);
                    return this.RedirectToAction(nameof(this.Index));
                }

                var users = (await this.usersDataService.GetAllUsers()).ToList();
                ViewBag.UserId = new SelectList(users, "Id", "Email", todo.UserId);
                return this.View(todo);
            }
            catch
            {
                return this.View(ViewConstants.ErrorViewName);
            }
        }

        // GET: Todo/Delete/5
        public async Task<ActionResult> Delete(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            try
            {
                var todo = await this.GetViewModelById(id);

                if (todo == null)
                {
                    return this.HttpNotFound();
                }

                return this.View(todo);
            }
            catch
            {
                return this.View(ViewConstants.ErrorViewName);
            }
        }

        // POST: Todo/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            try
            {
                var userId = User.Identity.GetUserId();
                await this.todoesDataService.Delete(id, userId);
                return this.RedirectToAction(nameof(this.Index));
            }
            catch
            {
                return this.View(ViewConstants.ErrorViewName);
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                this.usersDataService.TryDispose();
                this.todoesDataService.TryDispose();
            }

            base.Dispose(disposing);
        }

        private async Task<TodoViewModel> GetViewModelById(string id)
        {
            var userId = User.Identity.GetUserId();
            var todo = this.MapServiceToViewModel.Compile()
                .Invoke(await this.todoesDataService.GetById(id, userId));
            return todo;
        }
    }
}