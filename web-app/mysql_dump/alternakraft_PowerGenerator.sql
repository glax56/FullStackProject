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
-- Table structure for table `PowerGenerator`
--

DROP TABLE IF EXISTS `PowerGenerator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PowerGenerator` (
  `householdID` int NOT NULL,
  `powerGeneratorID` int NOT NULL,
  `generatorTypeID` int NOT NULL,
  `monthly_kilowatt` int NOT NULL,
  `battery_storage` int DEFAULT NULL,
  PRIMARY KEY (`householdID`,`powerGeneratorID`),
  KEY `fk_PowerGenerator_genTypeID_PowerGeneratorType_genTypeID` (`generatorTypeID`),
  CONSTRAINT `fk_PowerGenerator_genTypeID_PowerGeneratorType_genTypeID` FOREIGN KEY (`generatorTypeID`) REFERENCES `PowerGeneratorType` (`generatorTypeID`) ON DELETE CASCADE,
  CONSTRAINT `fk_PowerGenerator_householdID_Household_householdID` FOREIGN KEY (`householdID`) REFERENCES `Household` (`householdID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PowerGenerator`
--

LOCK TABLES `PowerGenerator` WRITE;
/*!40000 ALTER TABLE `PowerGenerator` DISABLE KEYS */;
INSERT INTO `PowerGenerator` VALUES (1,1,1,300,NULL),(6,1,1,500,NULL),(7,1,2,300,200),(7,2,2,350,150),(8,1,1,800,125),(9,1,1,150,NULL),(9,2,2,755,325),(10,1,1,800,490),(14,1,1,45,56);
/*!40000 ALTER TABLE `PowerGenerator` ENABLE KEYS */;
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
