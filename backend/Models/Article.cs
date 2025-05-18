using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Article
    {
        [Key] 
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public int Id { get; set; }
        public string Title { get; set; }
        public string Image { get; set; }
        public string Content { get; set; }
        [ForeignKey("CategoryId")]
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public string PublishedBy { get; set; }
        public DateTime PublishedAt { get; set; }
        #nullable enable
        public string? UpdatedBy { get; set; }
        #nullable enable
        public DateTime? UpdatedAt { get; set; }
        public DateTime PostedDate { get; set; }
        public DateTime ExpiredDate { get; set; }

        public Article(string title, string image, string content, int categoryId, string publishedBy, DateTime publishedAt, DateTime postedDate, DateTime expiredDate, string? updatedBy = null, DateTime? updatedAt = null)
        {
            Title = title;
            Image = image;
            Content = content;
            CategoryId = categoryId;
            PublishedBy = publishedBy;
            PublishedAt = publishedAt;
            UpdatedBy = updatedBy;
            UpdatedAt = updatedAt;
            PostedDate = postedDate;
            ExpiredDate = expiredDate;
        }
        
        public Article()
        {
        }
    }
}
