ALTER PROC [dbo].[MenuModifications_Select_ByMenuItemId]
									@MenuItemId int


AS


/*

	DECLARE @MenuItemId int = 117

	Execute dbo.MenuModifications_Select_ByMenuItemId
									@MenuItemId


*/



BEGIN


	SELECT m.[Id]
		  ,m.[OtherText]
		  ,m.[ModificationParentId]
		  ,m.[AlternateIngredientId]
		  ,m.[MenuModificationTypeId]
		  ,m.[EntityId]
		  ,m.[MenuItemId]
		  ,m.[Count]
		  ,m.[CostChange]
		  ,m.[IsDeleted]
		  ,m.[CreatedBy]
		  ,m.[ModifiedBy]
		  ,m.[DateCreated]
		  ,m.[DateModified]
		  ,Ingredients = 
		  (

			SELECT i.Id
				  ,i.Name
				  ,i.Description
				  ,i.ImageUrl
				  ,i.UnitCost
				  ,i.IsInStock
				  ,i.IsDeleted
				  ,i.RestrictionId
				  ,i.Measure
			  FROM dbo.Ingredients as i
			  inner join dbo.MenuItemIngredients as mii
			  on i.Id = mii.IngredientId
			  WHERE @MenuItemId = mii.MenuItemId
			  FOR JSON AUTO
		  )
		  

	  FROM [dbo].[MenuModifications] as m
	  WHERE m.MenuItemId = @MenuItemId
	 
	  


END