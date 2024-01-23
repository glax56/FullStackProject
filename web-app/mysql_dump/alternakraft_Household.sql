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
-- Table structure for table `Household`
--

DROP TABLE IF EXISTS `Household`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Household` (
  `householdID` int NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `postalCode` char(5) NOT NULL,
  `household_type` varchar(12) NOT NULL,
  `square_footage` int NOT NULL,
  `heating` int DEFAULT NULL,
  `cooling` int DEFAULT NULL,
  PRIMARY KEY (`householdID`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_Household_postalCode_PostalCode_postalCode` (`postalCode`),
  CONSTRAINT `fk_Household_postalCode_PostalCode_postalCode` FOREIGN KEY (`postalCode`) REFERENCES `PostalCode` (`postalCode`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Household`
--

LOCK TABLES `Household` WRITE;
/*!40000 ALTER TABLE `Household` DISABLE KEYS */;
INSERT INTO `Household` VALUES (1,'email1@example.com','19193','House',1900,69,75),(2,'email2@example.com','19192','Apartment',800,68,74),(3,'email3@example.com','08505','Townhome',1200,72,77),(4,'email4@example.com','08076','Condominium',900,70,72),(5,'email5@example.com','08073','House',1776,70,71),(6,'email6@example.com','19193','House',1900,69,72),(7,'email7@example.com','19192','House',800,68,71),(8,'email8@example.com','08505','House',1200,72,73),(9,'email9@example.com','08076','House',20000,75,70),(10,'email10@example.com','08073','House',1776,74,70),(13,'email11@example.com','30096','Modular home',1200,NULL,NULL),(14,'email12@example.com','30044','Apartment',1400,78,78),(15,'princeorji@admin.com','30360','Modular home',1200,NULL,NULL),(16,'dahalfamilydf@gmail.com','30077','House',1289,NULL,NULL),(17,'ydahal3@gatech.edu','30360','Townhome',1234,NULL,NULL),(18,'ydahals3@gatech.edu','20033','Condominium',1234,NULL,NULL),(19,'nirmaladkl@gmail.com','20033','Townhome',1234,NULL,NULL),(20,'dahalfamssilydf@gmail.com','30044','Townhome',123,NULL,NULL);
/*!40000 ALTER TABLE `Household` ENABLE KEYS */;
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
