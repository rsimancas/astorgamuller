using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using MullerWA.Models;
using Utilidades;

namespace MullerWA.Controllers
{
    [AllowAnonymous]
    public class AuthController : ApiController
    {
        static readonly IUsuariosRepository userRepository = new UsuariosRepository();

        
        public HttpResponseMessage PostAuth(JObject jsonRequest)
        {

            var userName = (string)jsonRequest["data"]["UsuarioNombre"];
            var userPassword = (string)jsonRequest["data"]["UsuarioPassword"];

            var userLogged = userRepository.ValidLogon(userName, userPassword);


            if (userLogged == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No Existe");
            }

            string token = userRepository.GenToken(userLogged);

            // Limpiamos el password para no devolverlo como objeto
            userLogged.UsuarioPassword = "";

            object json = new
            {
                data = userLogged,
                security = token
            };

            return Request.CreateResponse(HttpStatusCode.OK, json);
        }
    }
}