ALTER PROC [dbo].[MenuModifications_Insert_Batch]
					@batchModifications dbo.MenuModificationBatchUDT READONLY
									
							
								  

AS


/*
SELECT * From dbo.MenuModifications

		Declare @batchModification dbo.MenuModificationBatchUDT
		Insert Into @batchModification (
				OtherText
			   ,ModificationParentId
			   ,AlternateIngredientId
			   ,MenuModificationTypeId
			   ,EntityId
			   ,MenuItemId
			   ,Count
			   ,CostChange
			   ,UserId

				)
		Values  (
				 null,
				 1,
				 71,
				 1,
				 1005,
				 117,
				 1,
				 1.00,
				 164
				 ),
				 (
				 'Crispy',
				 1,
				 71,
				 1,
				 1006,
				 117,
				 3,
				 7.00,
				 164
				 )

				

				Execute dbo.MenuModifications_Insert_Batch @batchModification
										
										

*/



BEGIN

		

	INSERT INTO [dbo].[MenuModifications]
			   (
			   [OtherText]
			   ,[ModificationParentId]
			   ,[AlternateIngredientId]
			   ,[MenuModificationTypeId]
			   ,[EntityId]
			   ,[MenuItemId]
			   ,[Count]
			   ,[CostChange]
			   ,[IsDeleted]
			   ,[CreatedBy]
			   ,[ModifiedBy]
			   ,[DateCreated]
			   ,[DateModified]
			   )
		 
			SELECT m.OtherText
				,m.ModificationParentId
				,m.AlternateIngredientId
				,m.MenuModificationTypeId
				,m.EntityId
				,m.MenuItemId
				,m.Count
				,m.CostChange
				,0
				,m.UserId
				,m.UserId
				,GETUTCDATE()
				,GETUTCDATE()
				From @batchModifications as m

END