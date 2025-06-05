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
using Microsoft.AspNetCore.Http;

namespace backend.Helpers
{
    public interface IFileConfig 
    {
        
    }
    public class FileConfig : IFileConfig
    {

    }
}
