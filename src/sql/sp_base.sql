DELIMITER $$

DROP PROCEDURE IF	EXISTS sp_nombre_procedure $$ CREATE PROCEDURE sp_nombre_procedure()
BEGIN
    -- Aquí va el código SQL que deseas ejecutar en el procedimiento
    -- Por ejemplo, seleccionar todos los registros de una tabla
    SELECT * FROM nombre_de_la_tabla;
END $$

DELIMITER ;