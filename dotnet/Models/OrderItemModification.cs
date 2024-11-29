using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.MenuModifications
{
    public class OrderItemModification
    {
        public string MenuItem { get; set; }
        public int OriginalIngredientId { get; set; }
        public string OriginalIngredient { get; set; }
        public string TypeOfModification { get; set; }
        public int AlternateIngredientId { get; set; }
        public string AlternateIngredient { get; set; }
    }
}
