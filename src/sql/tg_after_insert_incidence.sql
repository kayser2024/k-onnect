CREATE TRIGGER after_insert_incidence
AFTER INSERT ON Incidence
FOR EACH ROW
BEGIN
    UPDATE Orders
    SET 
        QtyIncidence = QtyIncidence + 1,
        HasIncidence = TRUE
    WHERE  OrderID = NEW.OrdenID;
END;