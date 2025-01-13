CREATE TRIGGER after_update_incidence
AFTER UPDATE ON Incidence
FOR EACH ROW
BEGIN
    -- Verificar si el campo is_completed cambió a TRUE
    IF OLD.IsCompleted = FALSE AND NEW.IsCompleted = TRUE THEN
        -- Disminuir el contador de incidencias
        UPDATE Orders
        SET 
            QtyIncidence = QtyIncidence - 1,
            HasIncidence = IF(QtyIncidence - 1 <= 0, FALSE, TRUE)
        WHERE OrderID = NEW.OrdenID;
    END IF;
END;