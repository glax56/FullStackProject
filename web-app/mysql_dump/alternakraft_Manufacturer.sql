-- MySQL dump 10.13  Distrib 8.0.29, for macos12 (x86_64)
--
-- Host: 127.0.0.1    Database: alternakraft
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Manufacturer`
--

DROP TABLE IF EXISTS `Manufacturer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Manufacturer` (
  `manufacturerID` int NOT NULL AUTO_INCREMENT,
  `manufacturer_name` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`manufacturerID`),
  UNIQUE KEY `manufacturer_name` (`manufacturer_name`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Manufacturer`
--

LOCK TABLES `Manufacturer` WRITE;
/*!40000 ALTER TABLE `Manufacturer` DISABLE KEYS */;
INSERT INTO `Manufacturer` VALUES (1,'ABB'),(12,'ABB Group'),(22,'ABB India'),(28,'Bosch'),(18,'Crompton Greaves'),(16,'Danaher Corporation'),(26,'Delta Electronics'),(4,'Eaton'),(37,'Ebara Corporation'),(9,'Emerson Electric'),(19,'Fanuc'),(33,'Fuji Electric'),(40,'Fuji Heavy Industries'),(5,'General Electric'),(25,'Hitachi'),(6,'Honeywell'),(39,'Hubbell Incorporated'),(10,'Johnson Controls'),(36,'Konecranes'),(13,'Legrand'),(29,'LG Electronics'),(8,'Mitsubishi Electric'),(27,'Nexans'),(23,'Nidec'),(17,'Omron'),(15,'Panasonic'),(38,'Pentair'),(11,'Philips'),(32,'Prysmian Group'),(41,'Rexel'),(7,'Rockwell Automation'),(24,'S&C Electric Company'),(34,'Schaffner Holding AG'),(3,'Schneider Electric'),(21,'Schweitzer Engineering Laboratories'),(2,'Siemens'),(31,'TE Connectivity'),(30,'Toshiba'),(20,'WEG'),(14,'Yaskawa Electric'),(35,'Yokogawa Electric');
/*!40000 ALTER TABLE `Manufacturer` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-14 21:20:09
