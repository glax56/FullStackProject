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
-- Table structure for table `PublicUtilityLinkage`
--

DROP TABLE IF EXISTS `PublicUtilityLinkage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PublicUtilityLinkage` (
  `householdID` int NOT NULL,
  `public_utility_id` int NOT NULL,
  PRIMARY KEY (`householdID`,`public_utility_id`),
  KEY `fk_PublicUtilityLinkage_p_u_id_PublicUtilities_p_u_id` (`public_utility_id`),
  CONSTRAINT `fk_PublicUtilityLinkage_householdID_Household_householdID` FOREIGN KEY (`householdID`) REFERENCES `Household` (`householdID`) ON DELETE CASCADE,
  CONSTRAINT `fk_PublicUtilityLinkage_p_u_id_PublicUtilities_p_u_id` FOREIGN KEY (`public_utility_id`) REFERENCES `PublicUtilities` (`public_utility_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PublicUtilityLinkage`
--

LOCK TABLES `PublicUtilityLinkage` WRITE;
/*!40000 ALTER TABLE `PublicUtilityLinkage` DISABLE KEYS */;
INSERT INTO `PublicUtilityLinkage` VALUES (1,1),(3,1),(4,1),(14,1),(15,1),(20,1),(1,2),(3,2),(5,2),(14,2),(3,3),(4,3),(17,3),(2,4),(5,4),(18,4);
/*!40000 ALTER TABLE `PublicUtilityLinkage` ENABLE KEYS */;
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
