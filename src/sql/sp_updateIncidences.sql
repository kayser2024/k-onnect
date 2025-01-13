-- PROCEDURE
DELIMITER $$

DROP PROCEDURE IF	EXISTS sp_UpdateIncidences$$ 

CREATE PROCEDURE sp_UpdateIncidences (
		IN p_UserID INT,
		IN p_IncidenceID INT,
		IN p_Nc VARCHAR ( 20 ),
		IN p_Invoice VARCHAR ( 20 ),
		OUT p_Result VARCHAR ( 255 ) 
) 
	update_proc: BEGIN
	
	-- Declarar una variable para contar filas afectadas
    DECLARE v_RowCount INT DEFAULT 0;
	
	
	-- Iniciar TRANSACTION
	START TRANSACTION;
	
	-- Actualizar en la tabla Incidence el Invoice, NC	
	UPDATE Incidence
	SET NCIncidence = p_Nc , InvoiceIncidence = p_Invoice , UserUpdater = p_UserID, UpdatedAt = NOW()
	WHERE IncidenceID = p_IncidenceID;
	
	 -- Verificar si la actualización afectó filas
   SET v_RowCount = ROW_COUNT();
   IF v_RowCount = 0 THEN
       -- Si no se encontró registro, revertir cambios y establecer mensaje de error
       ROLLBACK;
       SET p_Result = 'ERROR: No se encontró incidencia con el ID especificado.';
       LEAVE update_proc;
   END IF;
		
		

	-- Actualizar a todos los que coiciden con el nroOrden en IncidenceLogs
	UPDATE IncidenceLogs
	SET NCIncidence = p_Nc, InvoiceIncidence = p_Invoice
	WHERE IncidenceID = p_IncidenceID;
	
	
	    -- Verificar si la actualización afectó filas
    SET v_RowCount = ROW_COUNT();
    IF v_RowCount = 0 THEN
        -- Si no se encontró registro, revertir cambios y establecer mensaje de error
        ROLLBACK;
        SET p_Result = 'ERROR: No se encontraron registros en IncidenceLogs con el ID especificado.';
        LEAVE update_proc;
    END IF;

	
	
	-- si todo fue exitoso, confirmar los cambios
	COMMIT;	
	-- Asignar un mensaje de resultado
  SET p_Result = 'OK: Actualización completada con éxito.';
	
END$$
DELIMITER;



CALL sp_UpdateIncidences(1,96,"NC-001","B0-001",@result)

SELECT @result AS message