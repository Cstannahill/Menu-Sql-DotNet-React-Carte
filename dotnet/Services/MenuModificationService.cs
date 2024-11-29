using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain.MenuModifications;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Sabio.Models.Domain.MenuItems;
using Sabio.Models.Requests.MenuModifications;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using Sabio.Models.Domain.AlternateIngredients;

namespace Sabio.Services
{
    public class MenuModificationService : IMenuModificationService
    {
        IDataProvider _data = null;
        public MenuModificationService(IDataProvider data)
        {
            _data = data;
        }
        public List<MenuModificationWithIngredients> GetByMenuItemId(int menuItemId)
        {
            List<MenuModificationWithIngredients> list = null;
            string procName = "dbo.MenuModifications_Select_ByMenuItemId";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@MenuItemId", menuItemId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIdx = 0;
                MenuModificationWithIngredients modification = MapSingleModificationWithIngredients(reader, ref startingIdx);
                if (list == null)
                {
                    list = new List<MenuModificationWithIngredients>();
                }
                list.Add(modification);
            });
            return list;
        }

        public List<MenuModificationWithAllOptions> GetByOrgId(int orgId)
        {
            List<MenuModificationWithAllOptions> list = null;
            string procName = "dbo.MenuModifications_Select_ByOrgId";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@OrgId", orgId);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIdx = 0;
                MenuModificationWithAllOptions modification = MapSingleModificationWithAllOptions(reader, ref startingIdx);
                if (list == null)
                {
                    list = new List<MenuModificationWithAllOptions>();
                }
                list.Add(modification);
            });
            return list;
        }

        public MenuModification GetById(int id)
        {
            MenuModification modification = null;
            string procName = "dbo.MenuModifications_Select_ById";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIdx = 0;
                modification = MapSingleModification(reader, ref startingIdx);
            });
            return modification;
        }

        public void Update(MenuModificationUpdateRequest model, int userId)
        {
            string procName = "dbo.MenuModifications_Update";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@UserId", userId);
            },
            returnParameters: null);
        }

        public int Add(MenuModificationAddRequest model, int userId)
        {
            int id = 0;
            string procName = "dbo.MenuModifications_Insert";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                AddCommonParams(model, col);
                col.AddWithValue("@UserId", userId);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }
        public int Delete(int id, int userId)
        {
            string procName = "dbo.MenuModifications_Delete_ById";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
                col.AddWithValue("@UserId", userId);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }

        public void BatchInsertMenuModifications(MenuModificationsBatchAddRequest model, int userId)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("OtherText", typeof(string));
            dt.Columns.Add("ModificationParentId", typeof(int));
            dt.Columns.Add("AlternateIngredientId", typeof(int));
            dt.Columns.Add("MenuModificationTypeId", typeof(int));
            dt.Columns.Add("EntityId", typeof(int));
            dt.Columns.Add("MenuItemId", typeof(int));
            dt.Columns.Add("Count", typeof(int));
            dt.Columns.Add("CostChange", typeof(Decimal));
            dt.Columns.Add("UserId", typeof(int));
            int i = 0;
            foreach (MenuModificationAddRequest Item in model.MenuModifications)
            {
                DataRow dr = dt.NewRow();
                dr.SetField(0, model.MenuModifications[i].OtherText);
                dr.SetField(1, model.MenuModifications[i].ModificationParentId);
                dr.SetField(2, model.MenuModifications[i].AlternateIngredientId);
                dr.SetField(3, model.MenuModifications[i].MenuModificationTypeId);
                dr.SetField(4, model.MenuModifications[i].EntityId);
                dr.SetField(5, model.MenuModifications[i].MenuItemId);
                dr.SetField(6, model.MenuModifications[i].Count);
                dr.SetField(7, model.MenuModifications[i].CostChange);
                dr.SetField(8, userId);

                dt.Rows.Add(dr);
                i++;
            }
            string procName = "dbo.MenuModifications_Insert_Batch";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@batchModifications", dt);
            }, returnParameters: null);
        }
        private static void AddCommonParams(MenuModificationAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@OtherText", model.OtherText);
            col.AddWithValue("@ModificationParentId", model.ModificationParentId);
            col.AddWithValue("@AlternateIngredientId", model.AlternateIngredientId);
            col.AddWithValue("@MenuModificationTypeId", model.MenuModificationTypeId);
            col.AddWithValue("@EntityId", model.EntityId);
            col.AddWithValue("@MenuItemId", model.MenuItemId);
            col.AddWithValue("@Count", model.Count);
            col.AddWithValue("@CostChange", model.CostChange);
        }
        private static MenuModification MapSingleModification(IDataReader reader, ref int startingIdx)
        {
            MenuModification modification = new MenuModification();

            modification.Id = reader.GetSafeInt32(startingIdx++);
            modification.OtherText = reader.GetSafeString(startingIdx++);
            modification.ModificationParentId = reader.GetSafeInt32(startingIdx++);
            modification.AlternateIngredientId = reader.GetSafeInt32(startingIdx++);
            modification.MenuModificationTypeId = reader.GetSafeInt32(startingIdx++);
            modification.EntityId = reader.GetSafeInt32(startingIdx++);
            modification.MenuItemId = reader.GetSafeInt32(startingIdx++);
            modification.Count = reader.GetSafeInt32(startingIdx++);
            modification.CostChange = reader.GetSafeDecimal(startingIdx++);
            modification.IsDeleted = reader.GetSafeBool(startingIdx++);
            modification.CreatedBy = reader.GetSafeInt32(startingIdx++);
            modification.ModifiedBy = reader.GetSafeInt32(startingIdx++);
            modification.DateCreated = reader.GetSafeDateTime(startingIdx++);
            modification.DateModified = reader.GetSafeDateTime(startingIdx++);
            return modification;
        }
        private static MenuModificationWithIngredients MapSingleModificationWithIngredients(IDataReader reader, ref int startingIdx)
        {
            MenuModificationWithIngredients modification = new MenuModificationWithIngredients();

            modification.Id = reader.GetSafeInt32(startingIdx++);
            modification.OtherText = reader.GetSafeString(startingIdx++);
            modification.ModificationParentId = reader.GetSafeInt32(startingIdx++);
            modification.AlternateIngredientId = reader.GetSafeInt32(startingIdx++);
            modification.MenuModificationTypeId = reader.GetSafeInt32(startingIdx++);
            modification.EntityId = reader.GetSafeInt32(startingIdx++);
            modification.MenuItemId = reader.GetSafeInt32(startingIdx++);
            modification.Count = reader.GetSafeInt32(startingIdx++);
            modification.CostChange = reader.GetSafeDecimal(startingIdx++);
            modification.IsDeleted = reader.GetSafeBool(startingIdx++);
            modification.CreatedBy = reader.GetSafeInt32(startingIdx++);
            modification.ModifiedBy = reader.GetSafeInt32(startingIdx++);
            modification.DateCreated = reader.GetSafeDateTime(startingIdx++);
            modification.DateModified = reader.GetSafeDateTime(startingIdx++);
            modification.Ingredients = reader.DeserializeObject<List<IngredientsForAlternateIngredientsCall>>(startingIdx++);
            return modification;
        }
        private static MenuModificationWithAllOptions MapSingleModificationWithAllOptions(IDataReader reader, ref int startingIdx)
        {
            MenuModificationWithAllOptions modification = new MenuModificationWithAllOptions();

            modification.Id = reader.GetSafeInt32(startingIdx++);
            modification.OtherText = reader.GetSafeString(startingIdx++);
            modification.ModificationParentId = reader.GetSafeInt32(startingIdx++);
            modification.AlternateIngredientId = reader.GetSafeInt32(startingIdx++);
            modification.MenuModificationTypeId = reader.GetSafeInt32(startingIdx++);
            modification.EntityId = reader.GetSafeInt32(startingIdx++);
            modification.MenuItemId = reader.GetSafeInt32(startingIdx++);
            modification.Count = reader.GetSafeInt32(startingIdx++);
            modification.CostChange = reader.GetSafeDecimal(startingIdx++);
            modification.IsDeleted = reader.GetSafeBool(startingIdx++);
            modification.CreatedBy = reader.GetSafeInt32(startingIdx++);
            modification.ModifiedBy = reader.GetSafeInt32(startingIdx++);
            modification.DateCreated = reader.GetSafeDateTime(startingIdx++);
            modification.DateModified = reader.GetSafeDateTime(startingIdx++);
            modification.Ingredients = reader.DeserializeObject<List<IngredientsForAlternateIngredientsCall>>(startingIdx++);
            modification.AlternateIngredients = reader.DeserializeObject<List<MenuItemAlternateIngredientOptions>>(startingIdx++);
            return modification;
        }
    }
}
