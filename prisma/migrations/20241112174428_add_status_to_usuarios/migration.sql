-- CreateTable
CREATE TABLE `OSF_PEDIDOS` (
    `FECHA_REGISTRO` DATE NULL,
    `SS_NUMERO_ORDEN` VARCHAR(150) NULL,
    `OSF_SERIE_DOCUMENTO` VARCHAR(15) NOT NULL,
    `BS_URL_PDF` VARCHAR(4000) NULL,

    PRIMARY KEY (`OSF_SERIE_DOCUMENTO`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OSF_PROMOTORA` (
    `CODIGO_DOCIDEN` VARCHAR(5) NOT NULL,
    `NRO_DOCIDEN_CLIENTE` VARCHAR(15) NOT NULL,
    `APELLIDO` VARCHAR(75) NULL,
    `NOMBRES` VARCHAR(75) NULL,
    `CLIENTE` VARCHAR(75) NOT NULL,
    `CODIGO_UBIGEO` VARCHAR(8) NULL,
    `DIRECCION` VARCHAR(100) NULL,
    `PUNTOS_KAYSER` INTEGER NULL,

    PRIMARY KEY (`NRO_DOCIDEN_CLIENTE`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ubigeo_peru_departments` (
    `id` VARCHAR(2) NOT NULL,
    `name` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ubigeo_peru_districts` (
    `id` VARCHAR(6) NOT NULL,
    `name` VARCHAR(45) NULL,
    `province_id` VARCHAR(4) NULL,
    `department_id` VARCHAR(2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ubigeo_peru_provinces` (
    `id` VARCHAR(4) NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    `department_id` VARCHAR(2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OSF_Product` (
    `codigoEan` VARCHAR(100) NOT NULL,
    `codigoSap` VARCHAR(100) NULL,
    `url_foto` VARCHAR(300) NULL,

    PRIMARY KEY (`codigoEan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `dni` VARCHAR(10) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `lastName` VARCHAR(150) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `emailVerified` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `image` VARCHAR(150) NOT NULL,
    `rolId` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `email`(`email`),
    INDEX `rolId`(`rolId`),
    PRIMARY KEY (`dni`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rolId`) REFERENCES `roles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
