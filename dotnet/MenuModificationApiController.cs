using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain;
using Sabio.Models;
using Sabio.Models.Domain.MenuModifications;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System.Drawing.Printing;
using System;
using System.Collections.Generic;
using Sabio.Models.Requests.MenuModifications;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/menumodifications")]
    [ApiController]
    public class MenuModificationApiController : BaseApiController
    {
        private IMenuModificationService _service = null;
        private IAuthenticationService<int> _authService = null;
        public MenuModificationApiController(IMenuModificationService service, ILogger<MenuModificationApiController> logger, IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("menuitems/{id:int}")]
        public ActionResult<ItemsResponse<MenuModificationWithIngredients>> GetByMenuItemId(int id)
        {
            int code = 200;
            BaseResponse response = null;
            List<MenuModificationWithIngredients> menuModification = null;

            try
            {
                menuModification = _service.GetByMenuItemId(id);

                if (menuModification == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<MenuModificationWithIngredients> { Items = menuModification };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("orgs/{id:int}")]
        public ActionResult<ItemsResponse<MenuModificationWithAllOptions>> GetByOrgId(int id)
        {
            int code = 200;
            BaseResponse response = null;
            List<MenuModificationWithAllOptions> menuModification = null;

            try
            {
                menuModification = _service.GetByOrgId(id);

                if (menuModification == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<MenuModificationWithAllOptions> { Items = menuModification };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<MenuModification>> GetById(int id)
        {
            int code = 200;
            BaseResponse response = null;
            MenuModification menuModification = null;

            try
            {
                menuModification = _service.GetById(id);

                if (menuModification == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<MenuModification> { Item = menuModification };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> AddModification(MenuModificationAddRequest model)
        {
            int userId = _authService.GetCurrentUserId();
            int code = 201;
            BaseResponse response = null;
            try
            {
                int id = _service.Add(model, userId);
                response = new ItemResponse<int> { Item = id };
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(MenuModificationUpdateRequest model)
        {
            int userId = _authService.GetCurrentUserId();
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Update(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPut("delete/{id:int}")]
        public ActionResult<ItemResponse<int>> DeleteModification(int id)
        {
            int userId = _authService.GetCurrentUserId();
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(id, userId);
                response = new ItemResponse<int> { Item = id };
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPost("batch")]
        public ActionResult<SuccessResponse> AddModifications(MenuModificationsBatchAddRequest model)
        {
            int userId = _authService.GetCurrentUserId();
            int code = 201;
            BaseResponse response = null;
            try
            {
                 _service.BatchInsertMenuModifications(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
    }
}