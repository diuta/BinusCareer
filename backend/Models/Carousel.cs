using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Carousel
    {
        [Key] 
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public int Id { get; set; }
        public string Image { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        [ForeignKey("CategoryId")]
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        #nullable enable
        public string? UpdatedBy { get; set; }
        #nullable enable
        public DateTime? UpdatedAt { get; set; }
        public DateTime PostedDate { get; set; }
        public DateTime ExpiredDate { get; set; }

        public Carousel(string title, string image, string description, int categoryId, string createdBy, DateTime createdDate, DateTime postedDate, DateTime expiredDate, string? updatedBy = null, DateTime? updatedAt = null)
        {
            Title = title;
            Image = image;
            Description = description;
            CategoryId = categoryId;
            CreatedBy = createdBy;
            CreatedDate = createdDate;
            UpdatedBy = updatedBy;
            UpdatedAt = updatedAt;
            PostedDate = postedDate;
            ExpiredDate = expiredDate;
        }

        public Carousel()
        {
        }
    }
}
