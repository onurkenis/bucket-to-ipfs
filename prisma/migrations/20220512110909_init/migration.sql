-- CreateTable
CREATE TABLE `person_t` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(128) NOT NULL,
    `last_name` VARCHAR(128) NOT NULL,
    `created_timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_timestamp` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
