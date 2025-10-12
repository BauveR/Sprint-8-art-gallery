mysqldump: [Warning] Using a password on the command line interface can be insecure.

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
mysqldump: Error: 'Access denied; you need (at least one of) the PROCESS privilege(s) for this operation' when trying to dump tablespaces
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exposiciones` (
  `id_expo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `url_expo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_expo`),
  KEY `idx_expos_fecha` (`fecha_inicio`,`fecha_fin`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obra_exposicion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_obra` int NOT NULL,
  `id_expo` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_obra_expo` (`id_obra`,`id_expo`),
  KEY `fk_oe_expo` (`id_expo`),
  KEY `idx_obra_expo_obra` (`id_obra`),
  CONSTRAINT `fk_oe_expo` FOREIGN KEY (`id_expo`) REFERENCES `exposiciones` (`id_expo`) ON DELETE CASCADE,
  CONSTRAINT `fk_oe_obra` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obra_imagenes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_obra` int NOT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_obra_imagenes_obra` (`id_obra`),
  CONSTRAINT `fk_img_obra` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE,
  CONSTRAINT `fk_obra_imagenes_obra` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obra_tienda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_obra` int NOT NULL,
  `id_tienda` int NOT NULL,
  `fecha_entrada` date DEFAULT NULL,
  `fecha_salida` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ot_tienda` (`id_tienda`),
  KEY `idx_obra_tienda_obra` (`id_obra`),
  KEY `idx_ot_obra_salida` (`id_obra`,`fecha_salida`),
  CONSTRAINT `fk_ot_obra` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE,
  CONSTRAINT `fk_ot_tienda` FOREIGN KEY (`id_tienda`) REFERENCES `tiendas` (`id_tienda`) ON DELETE CASCADE,
  CONSTRAINT `chk_fechas` CHECK (((`fecha_salida` is null) or (`fecha_entrada` is null) or (`fecha_salida` >= `fecha_entrada`)))
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obras` (
  `id_obra` int NOT NULL AUTO_INCREMENT,
  `autor` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `anio` int DEFAULT NULL,
  `medidas` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tecnica` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `precio_salida` decimal(12,2) DEFAULT NULL,
  `estado_venta` enum('disponible','en_carrito','procesando_envio','enviado','entregado','pendiente_devolucion','nunca_entregado') COLLATE utf8mb4_unicode_ci DEFAULT 'disponible',
  `numero_seguimiento` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_seguimiento` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comprador_nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comprador_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_compra` datetime DEFAULT NULL,
  PRIMARY KEY (`id_obra`),
  KEY `idx_obras_autor` (`autor`),
  KEY `idx_obras_numero_seguimiento` (`numero_seguimiento`),
  KEY `idx_obras_estado_venta` (`estado_venta`),
  KEY `idx_obras_comprador_email` (`comprador_email`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `obras_estado_actual` AS SELECT 
 1 AS `id_obra`,
 1 AS `autor`,
 1 AS `titulo`,
 1 AS `anio`,
 1 AS `medidas`,
 1 AS `tecnica`,
 1 AS `precio_salida`,
 1 AS `estado_venta`,
 1 AS `numero_seguimiento`,
 1 AS `link_seguimiento`,
 1 AS `comprador_nombre`,
 1 AS `comprador_email`,
 1 AS `fecha_compra`,
 1 AS `ubicacion`,
 1 AS `id_expo`,
 1 AS `expo_nombre`,
 1 AS `expo_lat`,
 1 AS `expo_lng`,
 1 AS `expo_url`,
 1 AS `id_tienda`,
 1 AS `tienda_nombre`,
 1 AS `tienda_lat`,
 1 AS `tienda_lng`,
 1 AS `url_tienda`,
 1 AS `tienda_es_online`*/;
SET character_set_client = @saved_cs_client;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiendas` (
  `id_tienda` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `url_tienda` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `es_online` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_tienda`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50001 DROP VIEW IF EXISTS `obras_estado_actual`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`arte_user`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `obras_estado_actual` AS select `o`.`id_obra` AS `id_obra`,`o`.`autor` AS `autor`,`o`.`titulo` AS `titulo`,`o`.`anio` AS `anio`,`o`.`medidas` AS `medidas`,`o`.`tecnica` AS `tecnica`,`o`.`precio_salida` AS `precio_salida`,`o`.`estado_venta` AS `estado_venta`,`o`.`numero_seguimiento` AS `numero_seguimiento`,`o`.`link_seguimiento` AS `link_seguimiento`,`o`.`comprador_nombre` AS `comprador_nombre`,`o`.`comprador_email` AS `comprador_email`,`o`.`fecha_compra` AS `fecha_compra`,(case when (`ex1`.`id_expo` is not null) then 'en_exposicion' when ((`ti1`.`id_tienda` is not null) and (`ti1`.`es_online` = 1)) then 'tienda_online' when ((`ti1`.`id_tienda` is not null) and (`ti1`.`es_online` = 0)) then 'en_tienda' else 'almacen' end) AS `ubicacion`,`ex1`.`id_expo` AS `id_expo`,`ex1`.`nombre` AS `expo_nombre`,`ex1`.`lat` AS `expo_lat`,`ex1`.`lng` AS `expo_lng`,`ex1`.`url_expo` AS `expo_url`,`ti1`.`id_tienda` AS `id_tienda`,`ti1`.`nombre` AS `tienda_nombre`,`ti1`.`lat` AS `tienda_lat`,`ti1`.`lng` AS `tienda_lng`,`ti1`.`url_tienda` AS `url_tienda`,`ti1`.`es_online` AS `tienda_es_online` from ((`obras` `o` left join (select `t`.`id_obra` AS `id_obra`,`t`.`id_expo` AS `id_expo`,`t`.`nombre` AS `nombre`,`t`.`lat` AS `lat`,`t`.`lng` AS `lng`,`t`.`url_expo` AS `url_expo` from (select `oe`.`id_obra` AS `id_obra`,`e`.`id_expo` AS `id_expo`,`e`.`nombre` AS `nombre`,`e`.`lat` AS `lat`,`e`.`lng` AS `lng`,`e`.`url_expo` AS `url_expo`,row_number() OVER (PARTITION BY `oe`.`id_obra` ORDER BY `e`.`fecha_inicio` desc,`e`.`id_expo` desc )  AS `rn` from (`obra_exposicion` `oe` join `exposiciones` `e` on((`e`.`id_expo` = `oe`.`id_expo`)))) `t` where (`t`.`rn` = 1)) `ex1` on((`ex1`.`id_obra` = `o`.`id_obra`))) left join (select `z`.`id_obra` AS `id_obra`,`z`.`id_tienda` AS `id_tienda`,`z`.`nombre` AS `nombre`,`z`.`lat` AS `lat`,`z`.`lng` AS `lng`,`z`.`url_tienda` AS `url_tienda`,`z`.`es_online` AS `es_online` from (select `ot`.`id_obra` AS `id_obra`,`t`.`id_tienda` AS `id_tienda`,`t`.`nombre` AS `nombre`,`t`.`lat` AS `lat`,`t`.`lng` AS `lng`,`t`.`url_tienda` AS `url_tienda`,`t`.`es_online` AS `es_online`,row_number() OVER (PARTITION BY `ot`.`id_obra` ORDER BY `ot`.`fecha_entrada` desc,`ot`.`id_tienda` desc )  AS `rn` from (`obra_tienda` `ot` join `tiendas` `t` on((`t`.`id_tienda` = `ot`.`id_tienda`))) where (`ot`.`fecha_salida` is null)) `z` where (`z`.`rn` = 1)) `ti1` on((`ti1`.`id_obra` = `o`.`id_obra`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

