using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MullerWA.Models
{
    interface IUsuariosRepository
    {
        IList<Usuario> GetAll(int page, int start, int limit, ref int totalRecord);
        Usuario Get(string id);
        Usuario Add(Usuario usuario);
        void Remove(Usuario usuario);
        bool Update(Usuario usuario);
        Usuario ValidLogon(string userName, string userPassword);
        string GenToken(Usuario usuario);
    }
}
