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
    public class CarouselController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CarouselController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Carousel
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Carousel>>> GetCarousels()
        {
            return await _context.Carousels.ToListAsync();
        }

        // GET: api/Carousel/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Carousel>> GetCarousel(int id)
        {
            var carousel = await _context.Carousels.FindAsync(id);

            if (carousel == null)
            {
                return NotFound();
            }

            return carousel;
        }

        // POST: api/Carousel
        [HttpPost]
        public async Task<ActionResult<Carousel>> AddCarousel([FromForm] CarouselCreateRequest carouselData)
        {
            DateTime carouselDataPostedDate = carouselData.PostedDate;
            DateTime carouselDataExpiredDate = carouselData.ExpiredDate;
            if (carouselDataExpiredDate < carouselDataPostedDate)
            {
                return BadRequest("The expired date supposed to be AFTER published date");
            }
            else if (carouselDataPostedDate == null || carouselDataExpiredDate == null)
            {
                return BadRequest("Please insert the posted / expired date");
            }

            var carousel = new Carousel
            {
                Title = carouselData.Title,
                Description = carouselData.Description,
                CategoryId = carouselData.CategoryId,
                CreatedBy = carouselData.CreatedBy,
                PostedDate = carouselDataPostedDate,
                ExpiredDate = carouselDataExpiredDate,
                CreatedDate = DateTime.Now,
            };

            if (carouselData.Image != null)
            {
                var extensions = new[] { ".jpg", ".jpeg", ".png" };
                if (!extensions.Contains(Path.GetExtension(carouselData.Image.FileName).ToLower()))
                {
                    return BadRequest("Only Image Files are Allowed");
                }

                var fileName = Path.GetRandomFileName() + Path.GetExtension(carouselData.Image.FileName);
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await carouselData.Image.CopyToAsync(stream);
                }
                carousel.Image = "/images/" + fileName;
            }
            
            _context.Carousels.Add(carousel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCarousel), new { id = carousel.Id }, carousel);
        }

        // PUT: api/Carousel/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCarousel(int id, [FromForm] CarouselCreateRequest carousel)
        {

            var prevCarousel = await _context.Carousels.FindAsync(id);
            if (prevCarousel == null)
            {
                return NotFound();
            }
            
            DateTime carouselDataPostedDate = carousel.PostedDate;
            DateTime carouselDataExpiredDate = carousel.ExpiredDate;
            if (carouselDataExpiredDate < carouselDataPostedDate)
            {
                return BadRequest("The expired date supposed to be AFTER published date");
            }
            else if (carouselDataPostedDate == null || carouselDataExpiredDate == null)
            {
                return BadRequest("Please insert the posted / expired date");
            }

            prevCarousel.Title = carousel.Title;
            prevCarousel.Description = carousel.Description;
            prevCarousel.CategoryId = carousel.CategoryId;
            prevCarousel.UpdatedBy = carousel.UpdatedBy;
            prevCarousel.UpdatedAt = DateTime.Now;
            prevCarousel.PostedDate = carouselDataPostedDate;
            prevCarousel.ExpiredDate = carouselDataExpiredDate;

            if (carousel.Image != null)
            {
                var extensions = new[] { ".jpg", ".jpeg", ".png" };
                if (!extensions.Contains(Path.GetExtension(carousel.Image.FileName).ToLower()))
                {
                    return BadRequest("Only Image Files are Allowed");
                }
                
                if (!string.IsNullOrEmpty(prevCarousel.Image))
                {
                    var oldImagePath = Path.Combine("wwwroot", prevCarousel.Image.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                var fileName = Path.GetRandomFileName() + Path.GetExtension(carousel.Image.FileName);
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await carousel.Image.CopyToAsync(stream);
                }
                prevCarousel.Image = "/images/" + fileName;
            }

            _context.Entry(prevCarousel).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        

        // DELETE: api/Carousel/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCarousel(int id)
        {
            var carousel = await _context.Carousels.FindAsync(id);
            if (carousel == null)
            {
                return NotFound(); 
            }

            if (!string.IsNullOrEmpty(carousel.Image))
            {
                var oldImagePath = Path.Combine("wwwroot", carousel.Image.TrimStart('/'));
                if (System.IO.File.Exists(oldImagePath))
                {
                    System.IO.File.Delete(oldImagePath);
                }
            }

            _context.Carousels.Remove(carousel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CarouselExists(int id)
        {
            return _context.Carousels.Any(e => e.Id == id);
        }
    }
} 