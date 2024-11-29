using Sabio.Models.Domain.AlternateIngredients;
using Sabio.Models.Domain.MenuItems;
using Sabio.Models.Ingredients;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.MenuModifications
{
    public class MenuModificationWithAllOptions
    {
        public int Id { get; set; }
        public string OtherText { get; set; }
        public int ModificationParentId { get; set; }
        public int AlternateIngredientId { get; set; }
        public int MenuModificationTypeId { get; set; }
        public int EntityId { get; set; }
        public int MenuItemId { get; set; }
        public int Count { get; set; }
        public decimal CostChange { get; set; }
        public bool IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public List<IngredientsForAlternateIngredientsCall> Ingredients { get; set; }
        public List<MenuItemAlternateIngredientOptions> AlternateIngredients { get; set; }
    }
}
