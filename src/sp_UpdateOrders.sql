-- PROCEDURE
DELIMITER $$

DROP PROCEDURE IF	EXISTS sp_UpdateOrders$$ CREATE PROCEDURE sp_UpdateOrders (
		IN p_OrderNumber VARCHAR ( 50 ),
		IN p_StatusID INT,
		IN p_UserID INT,
		IN p_PickupPoint VARCHAR ( 100 ),
		IN p_status VARCHAR ( 20 ),
		IN p_CommentText TEXT,
		
			-- parámentro en JSON
		IN p_InfoShipping JSON, 
		
		
		OUT p_Result VARCHAR ( 255 ) 
) 
	BEGIN

	-- Declaraciones de variables al inicio		
	DECLARE currentStatusID INT;
	DECLARE findID INT;
	DECLARE currentStatusDescription VARCHAR ( 50 );
	
	
		-- Extraer datos_envio de JSON
	SET v_Name= JSON_UNQUOTE(JSON_EXTRACT(p_InfoShipping,'$.nombres_envio'));
	SET v_LastName= JSON_UNQUOTE(JSON_EXTRACT(p_InfoShipping,'$.apellidos_envio'));
	SET v_Address= JSON_UNQUOTE(JSON_EXTRACT(p_InfoShipping,'$.direccion_envio'));
	SET v_Reference= JSON_UNQUOTE(JSON_EXTRACT(p_InfoShipping,'$.referencia_envio'));
	SET v_Phone= JSON_UNQUOTE(JSON_EXTRACT(p_InfoShipping,'$.telefono_envio'));	
	SET v_Country= JSON_UNQUOTE(JSON_EXTRACT(p_InfoShipping,'$.pais'));	
	SET v_Department= JSON_UNQUOTE(JSON_EXTRACT(p_InfoShipping,'$.departamento'));
	SET v_Province= JSON_UNQUOTE(JSON_EXTRACT(p_InfoShipping,'$.provincia'));	
	SET v_District= JSON_UNQUOTE(JSON_EXTRACT(p_InfoShipping,'$.distrito'));
	SET v_Dni= JSON_UNQUOTE(JSON_EXTRACT(p_InfoShipping,'$.dni_envio'));
	SET v_Service= JSON_UNQUOTE(JSON_EXTRACT(p_InfoShipping,'$.servicio_envio'));
	SET v_LocationCode= JSON_UNQUOTE(JSON_EXTRACT(p_InfoShipping,'$.ubigeo'));
	SET v_TypeShipping= JSON_UNQUOTE(JSON_EXTRACT(p_InfoShipping,'$.tipo_envio'));
	
	
	-- Asignar un valor predeterminado si p_CommentText es NULL
	SET p_CommentText = IFNULL( p_CommentText, '' );

		
			-- Insertar la orden si el status = 'preparacion'
			IF p_status = 'en_preparacion' THEN
				-- Verificar si la orden ya existe
				IF EXISTS ( SELECT 1 FROM Orders WHERE OrderNumber = p_OrderNumber ) THEN
					-- Obtener el estado actual de la orden
					SELECT StatusID INTO currentStatusID FROM Orders WHERE OrderNumber = p_OrderNumber;
					
					-- Asignar una descripción al estado actual
					IF currentStatusID = 1 THEN SET currentStatusDescription = 'Pendiente';						
					ELSEIF currentStatusID = 2 THEN SET currentStatusDescription = 'En Preparación';						
					ELSEIF currentStatusID = 3 THEN SET currentStatusDescription = 'En Ruta';						
					ELSEIF currentStatusID = 4 THEN SET currentStatusDescription = 'Recibido en Tienda';						
					ELSEIF currentStatusID = 5 THEN SET currentStatusDescription = 'Entregado al Cliente';
					ELSE SET currentStatusDescription = 'Estado Desconocido';
						
					END IF;
					
					-- Informar al usuario si ya está en el estado esperado
					IF currentStatusID = 2 THEN							
						SET p_Result = CONCAT( 'ERROR: La orden ya está en estado: ', currentStatusDescription );
					ELSE 
						SET p_Result = CONCAT( 'ERROR: La orden ya existe en estado: ', currentStatusDescription, ' y no puede ser reiniciada a En Preparación.' );						
					END IF;

				ELSE		

						-- Validar existencia del PickupPoint
						IF EXISTS ( SELECT 1 FROM PickupPoints WHERE Description = p_PickupPoint ) THEN
							-- Obtener el ID del PickupPoint
							SELECT PickupPointID INTO findID FROM PickupPoints WHERE Description = p_PickupPoint;
							
							-- Insertar la orden si no existe en la tabla "Orders"
							INSERT INTO Orders ( OrderNumber, PickupPointID, StatusID, UserID, PickupPoint,  CreatedAt )
							VALUES (p_OrderNumber,findID,2,p_UserID,p_PickupPoint, NOW());
							
							
							-- Insertar en la Table: InfoShipping
							INSERT INTO InfoShipping ()
							VALUES ();
							
							
							
							INSERT INTO OrderLogs ( OrderNumber, StatusOld, StatusID, UserID, CommentText, CreatedAt )
							VALUES (p_OrderNumber,1,2,p_UserID,'CREACIÓN DE LA ORDEN',NOW());
							
							
							
							
							SET p_Result = 'OK: Orden insertada correctamente';
						
						
						ELSE 
							-- Verificar si es Delivery o Recojo en tienda
							IF v_TypeShipping = 'delivery' THEN						
								INSERT INTO Orders ( OrderNumber, StatusID, UserID, PickupPoint,Name,LastName,Address,Reference,Phone,Department,Province,District,Dni,Service,LocationCode,ShippingType, CreatedAt )
								VALUES ( p_OrderNumber,2,p_UserID,p_PickupPoint,v_Name,v_LastName,v_Address,v_Reference,v_Phone,v_Department,v_Province,v_District,v_Dni,v_Service,v_LocationCode,v_ShippingType, NOW());
								
								-- Insertar en la Tabla InfoShipping
								
								
								SET p_Result = 'OK: Orden creada correctamente con entrega a domicilio.';
							ELSE
								SET p_Result = CONCAT( 'ERROR: Establecimiento "', p_PickupPoint, '" no encontrado en la BD' );								
							END IF;							
						END IF;						
				END IF;				
			END IF;
			
	-- Resetear el estado de la orden
	IF p_status = 'reset_status' THEN
		-- Verificar si la orden existe
		IF NOT EXISTS ( SELECT 1 FROM Orders WHERE OrderNumber = p_OrderNumber ) THEN			
			SET p_Result = 'ERROR: La orden no existe para resetear el estado';
		ELSE 
			-- Obtener el estado Actual
			SELECT StatusID INTO currentStatusID FROM Orders WHERE OrderNumber = p_OrderNumber;
			UPDATE Orders 
			SET StatusID = 2, UserUpdaterID = p_UserID, UpdatedAt = NOW() 
			WHERE OrderNumber = p_OrderNumber;
			-- Insertar el log del estado
			INSERT INTO OrderLogs ( OrderNumber, StatusOld, StatusID, UserID, CommentText, CreatedAt )
			VALUES (p_OrderNumber,currentStatusID,1,p_UserID,p_CommentText,NOW());
			
			SET p_Result = 'OK: Estado de la orden reseteado correctamente';
			
		END IF;		
	END IF;
	
	-- Cambiar el estado de la orden en 'en_ruta', 'recibido_tienda', 'entregado_cliente'
	IF p_status IN ( 'en_ruta', 'recibido_tienda', 'entregado_cliente' ) THEN
		-- Verificar si la orden existe
		IF NOT EXISTS ( SELECT 1 FROM Orders WHERE OrderNumber = p_OrderNumber ) THEN				
			SET p_Result = 'ERROR: La orden no existe para actualizar el estado';
		ELSE 
			SELECT StatusID INTO currentStatusID FROM Orders WHERE OrderNumber = p_OrderNumber;

			-- Asignar una descripción al estado actual
			IF currentStatusID = 1 THEN					
					SET currentStatusDescription = 'Pendiente';				
			ELSEIF currentStatusID = 2 THEN				
				SET currentStatusDescription = 'En Preparación';				
			ELSEIF currentStatusID = 3 THEN				
				SET currentStatusDescription = 'En Ruta';				
			ELSEIF currentStatusID = 4 THEN				
				SET currentStatusDescription = 'Recibido en Tienda';				
			ELSEIF currentStatusID = 5 THEN				
				SET currentStatusDescription = 'Entregado al Cliente';
			ELSE 
				SET currentStatusDescription = 'Estado Desconocido';				
			END IF;
			
			-- Validar transición de estados
			IF
				( currentStatusID = 1 AND p_StatusID != 2 ) 
				OR ( currentStatusID = 2 AND p_StatusID != 3 ) 
				OR ( currentStatusID = 3 AND p_StatusID != 4 ) 
				OR ( currentStatusID = 4 AND p_StatusID != 5 ) THEN
					
				SET p_Result = CONCAT( 'ERROR: La transición de estado no es válida. Estado actual: ', currentStatusDescription );
			ELSE 
				-- Actualizar el estado
				UPDATE Orders 
				SET StatusID = p_StatusID, UserUpdaterID = p_UserID, UpdatedAt = NOW() 
				WHERE OrderNumber = p_OrderNumber;

				-- Insertar el log del estado
				INSERT INTO OrderLogs ( OrderNumber, StatusOld, StatusID, UserID, CommentText, CreatedAt )
				VALUES (p_OrderNumber,currentStatusID,p_StatusID,p_UserID,p_CommentText,NOW());
				
				SET p_Result = 'OK: Estado de la orden actualizado correctamente y log registrado';				
			END IF;			
		END IF;		
	END IF;
	
	-- Manejar estados no reconocidos
	IF p_status NOT IN ( 'en_preparacion', 'reset_status', 'en_ruta', 'recibido_tienda', 'entregado_cliente' ) THEN			
		SET p_Result = 'ERROR: Estado no reconocido';		
	END IF;
	
END$$
DELIMITER;











-- sp_UpdateOrders(p_OrderNumber, p_StatusID, p_UserID, p_PickupPoint, p_status, p_CommentText) 

-- CREACION DE ORDER
-- CALL sp_UpdateOrders('ss1731949702653bwzj',NULL,1,'Tienda Mall del SUR','en_preparacion',NULL,@result)
CALL sp_UpdateOrders('ss1734528236439zsdg',NULL,1,'Tienda Mall del SUR','en_preparacion',NULL,@result)

-- EN RUTA
CALL sp_UpdateOrders('ss1731949702653bwzj',3,1,'Tienda Mall del SUR','en_ruta',NULL,@result)

CALL sp_UpdateOrders('ssssss',3,1,'Tienda Mall del SUR','en_ruta',NULL,@result)


--RECIBIDO_TIENDA
CALL sp_UpdateOrders('ss1731949702653bwzj',4,1,'Tienda Mall del SUR','recibido_tienda',NULL,@result)

-- ENTREGADO_CLIENTE
CALL sp_UpdateOrders('ss1731949702653bwzj',5,1,'Tienda Mall del SUR','entregado_cliente',NULL,@result)

-- RESETEAR
CALL sp_UpdateOrders('ss1731949702653bwzj',NULL,1,NULL,'reset_status',NULL,@result)



SELECT @result AS message