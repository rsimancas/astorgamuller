﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface IUploadsRepository
    {
        /*Tabulador Get(int id, ref string errMsg);
        Tabulador Add(Tabulador estatus, ref string errMsg);
        bool Remove(Tabulador estatus, ref string errMsg);
        Tabulador Update(Tabulador estatus, ref string errMsg);
        IList<Tabulador> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);*/

        bool InsertUpdateData(int movId, string filename, string contenttype, Byte[] bytes, ref string errMsg);

        byte[] GetImage(int movId, ref string contentType, ref string errMsg);
    }
}
