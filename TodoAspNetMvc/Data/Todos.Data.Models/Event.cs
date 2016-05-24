namespace Todos.Data.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    using Todos.Common.Constants;

    public class Event
    {
        private ICollection<User> users;

        public Event()
        {
            this.Id = Guid.NewGuid().ToString();
            this.Category = ModelConstants.DefaultCategoryName;
            this.Date = DateTime.UtcNow;
            this.DateCreated = DateTime.UtcNow;
            this.users = new HashSet<User>();
        }

        [Key]
        public string Id { get; set; }

        [Required]
        [MaxLength(ModelConstants.MaximalLengthOfEventTitle)]
        public string Title { get; set; }

        [MaxLength(ModelConstants.MaximalLengthOfEventDescription)]
        public string Description { get; set; }

        [MaxLength(ModelConstants.MaximalLengthOfCategoryName)]
        public string Category { get; set; }

        public DateTime Date { get; set; }

        public DateTime DateCreated { get; set; }

        public virtual string UserId { get; set; }

        public virtual User User { get; set; }

        public virtual ICollection<User> Users
        {
            get
            {
                return this.users;
            }

            set
            {
                this.users = value;
            }
        }
    }
}