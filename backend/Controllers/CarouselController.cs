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
        public async Task<ActionResult<Carousel>> AddCarousel(Carousel carousel)
        {
            _context.Carousels.Add(carousel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCarousel), new { id = carousel.Id }, carousel);
        }

        // PUT: api/Carousel/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCarousel(int id, Carousel carousel)
        {
            if (id != carousel.Id)
            {
                return BadRequest();
            }

            _context.Entry(carousel).State = EntityState.Modified;
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