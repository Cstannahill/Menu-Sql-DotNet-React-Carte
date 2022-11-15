using Sabio.Models.Domain.MenuModifications;
using Sabio.Models.Requests.MenuModifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IMenuModificationService
    {
        public List<MenuModificationWithIngredients> GetByMenuItemId(int menuItemId);
        public List<MenuModificationWithAllOptions> GetByOrgId(int orgId);
        public MenuModification GetById(int id);
        public void Update(MenuModificationUpdateRequest model, int userId);
        public int Add(MenuModificationAddRequest model, int userId);
        public int Delete(int id, int userId);
        public void BatchInsertMenuModifications(MenuModificationsBatchAddRequest model, int userId);
    }
}
