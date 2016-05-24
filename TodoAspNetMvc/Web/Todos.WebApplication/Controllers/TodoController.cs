namespace Todos.WebApplication.Controllers
{
    using System;
    using System.Data;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Net;
    using Microsoft.AspNet.Identity;
    using System.Web.Mvc;
    using Todos.Common.Extensions;
    using Todos.Data.Models;
    using Todos.Data.Repositories.Contracts;

    [Authorize]
    public class TodoController : Controller
    {
        private readonly IApplicationDataRepository<User> usersRepository;
        private readonly IApplicationDataRepository<Todo> todoesRepository;

        public TodoController(IApplicationDataRepositoryProvider<Todo> todoesRepositoryProvider, IApplicationDataRepositoryProvider<User> usersRepositoryProvider)
        {
            if (todoesRepositoryProvider == null)
            {
                throw new ArgumentNullException(nameof(todoesRepositoryProvider));
            }

            if (usersRepositoryProvider == null)
            {
                throw new ArgumentNullException(nameof(usersRepositoryProvider));
            }

            this.todoesRepository = (IApplicationDataRepository<Todo>)todoesRepositoryProvider.Create();
            this.usersRepository = (IApplicationDataRepository<User>)usersRepositoryProvider.Create();
        }

        // GET: Todo
        public async Task<ActionResult> Index()
        {
            var userId = User.Identity.GetUserId();
            var todoes = (await this.todoesRepository.All())
                .Where(t => t.UserId == userId)
                .ToList();

            return this.View(todoes);
        }

        // GET: Todo/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            var userId = User.Identity.GetUserId();
            var todo = (await this.todoesRepository.All())
                .FirstOrDefault(t => t.UserId == userId && t.Id == id);

            if (todo == null)
            {
                return this.HttpNotFound();
            }

            return this.View(todo);
        }

        // GET: Todo/Create
        public async Task<ActionResult> Create()
        {
            var users = (await this.usersRepository.All()).ToList();
            ViewBag.UserId = new SelectList(users, "Id", "Email");
            return this.View();
        }

        // POST: Todo/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,Text,Category,State,UserId")] Todo todo)
        {
            if (ModelState.IsValid)
            {
                await this.todoesRepository.Add(todo);
                await this.todoesRepository.SaveChanges();
                return this.RedirectToAction(nameof(this.Index));
            }

            var users = (await this.usersRepository.All()).ToList();
            ViewBag.UserId = new SelectList(users, "Id", "Email", todo.UserId);
            return this.View(todo);
        }

        // GET: Todo/Edit/5
        public async Task<ActionResult> Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            var userId = User.Identity.GetUserId();
            var todo = (await this.todoesRepository.All())
                .FirstOrDefault(t => t.UserId == userId && t.Id == id);

            if (todo == null)
            {
                return this.HttpNotFound();
            }

            var users = (await this.usersRepository.All()).ToList();
            ViewBag.UserId = new SelectList(users, "Id", "Email", todo.UserId);
            return this.View(todo);
        }

        // POST: Todo/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,Text,Category,State,UserId")] Todo todo)
        {
            if (ModelState.IsValid)
            {
                await this.todoesRepository.Update(todo);
                await this.todoesRepository.SaveChanges();

                return this.RedirectToAction(nameof(this.Index));
            }

            var users = (await this.usersRepository.All()).ToList();
            ViewBag.UserId = new SelectList(users, "Id", "Email", todo.UserId);
            return this.View(todo);
        }

        // GET: Todo/Delete/5
        public async Task<ActionResult> Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            var userId = User.Identity.GetUserId();
            var todo = (await this.todoesRepository.All())
                .FirstOrDefault(t => t.UserId == userId && t.Id == id);

            if (todo == null)
            {
                return this.HttpNotFound();
            }

            return this.View(todo);
        }

        // POST: Todo/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(string id)
        {
            var userId = User.Identity.GetUserId();
            var todo = (await this.todoesRepository.All())
                .FirstOrDefault(t => t.UserId == userId && t.Id == id);

            await this.todoesRepository.Delete(todo);
            await this.todoesRepository.SaveChanges();

            return this.RedirectToAction(nameof(this.Index));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                this.usersRepository.TryDispose();
                this.todoesRepository.TryDispose();
            }

            base.Dispose(disposing);
        }
    }
}
