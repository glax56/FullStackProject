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
-- Table structure for table `Appliance`
--

DROP TABLE IF EXISTS `Appliance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Appliance` (
  `householdID` int NOT NULL,
  `applianceID` int NOT NULL,
  `applianceType` varchar(12) NOT NULL,
  `manufacturerID` int NOT NULL,
  `model_name` varchar(150) DEFAULT NULL,
  `btu_rating` int NOT NULL,
  PRIMARY KEY (`householdID`,`applianceID`),
  KEY `fk_Manufacturer_manufacturerID_Household_manufacturerID` (`manufacturerID`),
  CONSTRAINT `fk_Appliance_householdID_Household_householdID` FOREIGN KEY (`householdID`) REFERENCES `Household` (`householdID`) ON DELETE CASCADE,
  CONSTRAINT `fk_Manufacturer_manufacturerID_Household_manufacturerID` FOREIGN KEY (`manufacturerID`) REFERENCES `Manufacturer` (`manufacturerID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Appliance`
--

LOCK TABLES `Appliance` WRITE;
/*!40000 ALTER TABLE `Appliance` DISABLE KEYS */;
INSERT INTO `Appliance` VALUES (1,1,'Air handler',1,'Model 1',5000),(1,2,'Water heater',2,'Model 2',8000),(2,1,'Air handler',3,'Model 3',3000),(2,2,'Air handler',1,'Model 4',6000),(3,1,'Water heater',2,'Model 5',7000),(3,2,'Air handler',3,'Model 3',3600),(4,1,'Water heater',3,'Model 6',4000),(5,1,'Air handler',3,'Model 1',3000),(8,1,'Water heater',1,'Model 2',2900),(10,1,'Air handler',2,'Model 1',5000),(14,2,'Water heater',29,'THIS IS LONG',12),(15,1,'Air handler',3,'TESLA',12),(16,1,'Air handler',16,NULL,5001),(17,1,'Air handler',16,NULL,1234),(19,1,'Air handler',16,NULL,1234),(20,1,'Water heater',28,NULL,123);
/*!40000 ALTER TABLE `Appliance` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-14 21:20:06
