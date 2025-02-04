DELIMITER $$

DROP PROCEDURE IF	EXISTS sp_insertProductsReceptionGuide $$ 
CREATE PROCEDURE sp_insertProductsReceptionGuide(
    IN p_UserID INT,
	IN p_NumberDoc VARCHAR(15),
	IN p_PickupPoint INT,
	IN p_DataProductGuide JSON,
	OUT p_Result VARCHAR ( 255 ) 

)
BEGIN
    DECLARE v_ExistProduct INT;
    DECLARE v_NotesGuideID INT;
    DECLARE v_CurrentQuantity INT;

    -- Declarar Variables para p_DataProductGuide
    DECLARE v_Description VARCHAR(255);
    DECLARE v_CodProd VARCHAR(30);
    DECLARE v_CodBar VARCHAR(30);
    DECLARE v_ImageURL VARCHAR(255);

    -- Manejo de excepciones
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SET p_Result = 'ERROR: Error en la operación.';
    END;

    START TRANSACTION;

    -- Extraer los Datos del JSON
	 SET v_Description = JSON_UNQUOTE(JSON_EXTRACT(p_DataProductGuide,'$.Description'));
	 SET v_CodProd = JSON_UNQUOTE(JSON_EXTRACT(p_DataProductGuide,'$.ProductCode'));
	 SET v_CodBar = JSON_UNQUOTE(JSON_EXTRACT(p_DataProductGuide,'$.BarCode'));
	 SET v_ImageURL = JSON_UNQUOTE(JSON_EXTRACT(p_DataProductGuide,'$.Image1'));


    -- Verificar si existe en la Tabla NotesGuides 
    SELECT NoteGuideID INTO v_NotesGuideID
    FROM NotesGuides 
    WHERE PickupPointID = p_PickupPoint AND NumberDoc = p_NumberDoc;

    -- si existe, validar en la tabla ProdReceptionGuia
    IF v_NotesGuideID IS NOT NULL THEN
        -- obtener la cantidad del producto encontrado
        SELECT Quantity INTO v_CurrentQuantity FROM ProdReceptionGuia 
        WHERE  NumberDoc = p_NumberDoc AND CodProd = v_CodProd;

        IF v_CurrentQuantity IS NOT NULL THEN 
            -- Actualizar los datos
            UPDATE ProdReceptionGuia SET  Quantity = v_CurrentQuantity + 1
            WHERE  NumberDoc = p_NumberDoc AND CodProd = v_CodProd;
        ELSE 
        -- si el producto no existe, insertar cantidad 1
        INSERT INTO ProdReceptionGuia (NotesGuideID, CodBar, CodProd, Description, ImageURL, Quantity, CreatedAt)
        VALUES (v_NotesGuideID, v_CodBar, v_CodProd, v_Description, v_ImageURL, 1, NOW());
        END IF;
    ELSE
        -- si no existe, insertar en la tabla NotesGuides y ProdReceptionGuia
        INSERT INTO NotesGuides (NumberDoc, UserID, PickupPointID, Observation, CreatedAt)
        VALUES (p_NumberDoc, p_UserID, p_PickupPoint, NULL, NOW());

        -- Obtener el id de la nueva nota de guía
        SET v_NotesGuideID = LAST_INSERT_ID();

        INSERT INTO ProdReceptionGuia (NotesGuideID, CodBar, CodProd, Description, ImageURL, Quantity, CreatedAt)
        VALUES (v_NotesGuideID, v_CodBar, v_CodProd, v_Description, v_ImageURL, 1, NOW());
    END IF;

    COMMIT;

    SET p_Result = 'OK: Operación completada exitosamente.';

END $$

DELIMITER ;