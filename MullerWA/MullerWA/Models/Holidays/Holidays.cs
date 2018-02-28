using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace MullerWA.Models
{
    public class Holiday
    {
        public int HolidayId { get; set; }
        public string HolidayName { get; set; }
        public int HolidayYear { get; set; }
        public int HolidayMonth { get; set; }
        public int HolidayDay { get; set; }
        public bool HolidayIsWorkDay { get; set; }
        public Nullable<DateTime> x_HolidayDate { get; set;}
    }
}