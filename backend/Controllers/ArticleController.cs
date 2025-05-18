using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

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
        public async Task<ActionResult<Article>> GetArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);

            if (article == null)
            {
                return NotFound();
            }

            return article;
        }

        // PUT: api/Article/5
        [HttpPut("{id}")]
        public async Task<IActionResult> EditArticle(int id, Article article)
        {
            if (id != article.Id)
            {
                return BadRequest();
            }

            var existingArticle = await _context.Articles.FindAsync(id);
            
            if (existingArticle == null)
            {
                return NotFound();
            }
            
            // Update properties individually
            existingArticle.Title = article.Title;
            existingArticle.Image = article.Image;
            existingArticle.Content = article.Content;
            existingArticle.CategoryId = article.CategoryId;
            existingArticle.PostedDate = article.PostedDate;
            existingArticle.ExpiredDate = article.ExpiredDate;
            existingArticle.UpdatedBy = article.UpdatedBy;
            existingArticle.UpdatedAt = DateTime.Now;
            
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Article
        [HttpPost]
        public async Task<ActionResult<Article>> AddArticle(Article articleData)
        {
            DateTime articleDataPostedDate = articleData.PostedDate;
            DateTime articleDataExpiredDate = articleData.ExpiredDate;
            DateTime articlePublishedAt = DateTime.Now;

            var article = new Article(
                title: articleData.Title,
                image: articleData.Image,
                content: articleData.Content,
                categoryId: articleData.CategoryId,
                publishedBy: articleData.PublishedBy,
                publishedAt: articlePublishedAt,
                updatedBy: articleData.UpdatedBy,
                updatedAt: articleData.UpdatedAt,
                postedDate: articleDataPostedDate,
                expiredDate: articleDataExpiredDate
            );
            
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