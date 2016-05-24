namespace Todos.Data.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    using Todos.Common.Constants;

    public class Todo
    {
        public Todo()
        {
            this.Id = Guid.NewGuid().ToString();
            this.Category = ModelConstants.DefaultCategoryName;
            this.State = false;
        }

        [Key]
        public string Id { get; set; }

        [Required]
        [MaxLength(ModelConstants.MaximalLengthOfTodoText)]
        public string Text { get; set; }

        [MaxLength(ModelConstants.MaximalLengthOfCategoryName)]
        public string Category { get; set; }

        public bool State { get; set; }

        public virtual string UserId { get; set; }

        public virtual User User { get; set; }
    }
}