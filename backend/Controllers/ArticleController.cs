using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTO;
using System.IO;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ArticleController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Article
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Article>>> GetArticles()
        {
            return await _context.Articles.ToListAsync();
        }

        // GET: api/Article/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Article>> GetArticle(int id, [FromQuery] bool count = true)
        {
            var article = await _context.Articles.FindAsync(id);

            if (count)
            {
                article.TotalViews += 1;
                await _context.SaveChangesAsync();
            }

            if (article == null)
            {
                return NotFound();
            }

            return article;
        }

        // PUT: api/Article/5
        [HttpPut("{id}")]
        public async Task<IActionResult> EditArticle(int id, [FromForm] ArticleCreateRequest article)
        {

            var prevArticle = await _context.Articles.FindAsync(id);
            if (prevArticle == null)
            {
                return NotFound();
            }

            DateTime articleDataPostedDate = article.PostedDate;
            DateTime articleDataExpiredDate = article.ExpiredDate;
            if (articleDataExpiredDate < articleDataPostedDate)
            {
                return BadRequest("The expired date supposed to be AFTER published date");
            }
            else if (articleDataPostedDate == null || articleDataExpiredDate == null)
            {
                return BadRequest("Please insert the posted / expired date");
            }
            
            prevArticle.Title = article.Title;
            prevArticle.Content = article.Content;
            prevArticle.CategoryId = article.CategoryId;
            prevArticle.PostedDate = articleDataPostedDate;
            prevArticle.ExpiredDate = articleDataExpiredDate;
            prevArticle.UpdatedBy = article.UpdatedBy;
            prevArticle.UpdatedAt = DateTime.Now;

            if (article.Image != null)
            {
                var extensions = new[] { ".jpg", ".jpeg", ".png" };
                if (!extensions.Contains(Path.GetExtension(article.Image.FileName).ToLower()))
                {
                    return BadRequest("Only Image Files are Allowed");
                }

                if (!string.IsNullOrEmpty(prevArticle.Image))
                {
                    var oldImagePath = Path.Combine("wwwroot", prevArticle.Image.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                var fileName = Path.GetRandomFileName() + Path.GetExtension(article.Image.FileName);
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await article.Image.CopyToAsync(stream);
                }
                prevArticle.Image = "/images/" + fileName;
            }
            
            _context.Entry(prevArticle).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Article
        [HttpPost]
        public async Task<ActionResult<Article>> AddArticle([FromForm] ArticleCreateRequest articleData)
        {
            DateTime articleDataPostedDate = articleData.PostedDate;
            DateTime articleDataExpiredDate = articleData.ExpiredDate;
            if (articleDataExpiredDate < articleDataPostedDate)
            {
                return BadRequest("The expired date supposed to be AFTER published date");
            }
            else if (articleDataPostedDate == null || articleDataExpiredDate == null)
            {
                return BadRequest("Please insert the posted / expired date");
            }

            var article = new Article
            {
                Title = articleData.Title,
                Content = articleData.Content,
                CategoryId = articleData.CategoryId,
                CreatedBy = articleData.CreatedBy,
                PostedDate = articleDataPostedDate,
                ExpiredDate = articleDataExpiredDate,
                CreatedDate = DateTime.Now,
            };

            if (articleData.Image != null)
            {
                var extensions = new[] { ".jpg", ".jpeg", ".png" };
                if (!extensions.Contains(Path.GetExtension(articleData.Image.FileName).ToLower()))
                {
                    return BadRequest("Only Image Files are Allowed");
                }
                
                var fileName = Path.GetRandomFileName() + Path.GetExtension(articleData.Image.FileName);
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await articleData.Image.CopyToAsync(stream);
                }
                article.Image = "/images/" + fileName;
            }

            _context.Articles.Add(article);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetArticle), new { id = article.Id }, article);
        }

        // DELETE: api/Article/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(article.Image))
            {
                var oldImagePath = Path.Combine("wwwroot", article.Image.TrimStart('/'));
                if (System.IO.File.Exists(oldImagePath))
                {
                    System.IO.File.Delete(oldImagePath);
                }
            }

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ArticleExists(int id)
        {
            return _context.Articles.Any(e => e.Id == id);
        }
    }
} 