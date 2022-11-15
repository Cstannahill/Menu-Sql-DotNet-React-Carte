	ALTER PROC [dbo].[MenuModifications_Select_ByOrgId]
									@OrgId int


AS


/*

	DECLARE @OrgId int = 44

	Execute dbo.MenuModifications_Select_ByOrgId
									@OrgId

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
				WHERE i.OrganizationId = @OrgId
				FOR JSON AUTO
		  )
		  ,AlternateIngredients = 
		  (

			SELECT ai.[Id]
				  ,ai.[Name]
				  ,ai.[Description]
				  ,ai.[MenuItemId]
				  ,ai.[OriginalId]
				  ,ai.[ReplacementId]
				  ,ai.[MinQuantity]
				  ,ai.[MaxQuantity]
				  ,ai.[CostOverride]
				  ,ai.[IsPublished]
				  ,ai.[IsDeleted]
				  FROM dbo.AlternateIngredients as ai
				  inner join dbo.MenuItems as mi
					on ai.MenuItemId = mi.Id
				FOR JSON AUTO
		  )
	  FROM [dbo].[MenuModifications] as m
	  inner join dbo.MenuItems as mi
	  on mi.Id = m.MenuItemId
	  WHERE mi.OrganizationId = @OrgId
END