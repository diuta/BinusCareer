using System;
using Microsoft.AspNetCore.Http;

namespace backend.DTO
{
    public class ArticleCreateRequest
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public IFormFile Image { get; set; }
        public int CategoryId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime PostedDate { get; set; }
        public DateTime ExpiredDate { get; set; }
    }
}