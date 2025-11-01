-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 01, 2025 at 06:43 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `citrix`
--
CREATE DATABASE IF NOT EXISTS `citrix` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `citrix`;

-- --------------------------------------------------------

--
-- Table structure for table `boss`
--

CREATE TABLE `boss` (
  `bossId` int(11) NOT NULL,
  `bossName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctor activities`
--

CREATE TABLE `doctor activities` (
  `recordId` int(11) NOT NULL,
  `docId` int(11) NOT NULL,
  `empId` int(11) NOT NULL,
  `Employee Name` varchar(100) NOT NULL,
  `Feedback` varchar(5000) NOT NULL,
  `Order Status` varchar(100) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `docId` int(11) NOT NULL,
  `Doctor Name` varchar(100) NOT NULL,
  `Phone` bigint(10) NOT NULL,
  `Address` varchar(150) NOT NULL,
  `exId` int(11) NOT NULL,
  `Status` varchar(100) NOT NULL DEFAULT 'Active',
  `Stage` varchar(100) NOT NULL,
  `Date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `empId` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `empName` varchar(100) NOT NULL,
  `hqId` int(11) NOT NULL,
  `password` varchar(100) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `expId` int(11) NOT NULL,
  `empId` int(11) NOT NULL,
  `exId` int(11) NOT NULL,
  `Normal Expense` int(11) NOT NULL,
  `Extension Expense` int(11) NOT NULL,
  `Total Expense` int(11) NOT NULL,
  `Paid Status` text NOT NULL,
  `Travel Bill` varchar(100) NOT NULL,
  `Stay Bill` varchar(100) NOT NULL,
  `Date` date NOT NULL DEFAULT current_timestamp(),
  `Paid on` date DEFAULT NULL,
  `Method` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `extensions`
--

CREATE TABLE `extensions` (
  `exId` int(11) NOT NULL,
  `extensionName` varchar(100) NOT NULL,
  `hqId` int(11) NOT NULL,
  `stockId` int(11) DEFAULT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `headquarters`
--

CREATE TABLE `headquarters` (
  `hqId` int(11) NOT NULL,
  `hqName` varchar(100) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `manager`
--

CREATE TABLE `manager` (
  `manId` int(11) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `manName` varchar(100) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--

CREATE TABLE `meetings` (
  `metId` int(11) NOT NULL,
  `Meeting Link` varchar(1000) NOT NULL,
  `Count` int(10) NOT NULL,
  `Date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ordered products`
--

CREATE TABLE `ordered products` (
  `opId` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `pId` int(11) NOT NULL,
  `Strips` int(11) NOT NULL,
  `Free Strips` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL,
  `empId` int(11) NOT NULL,
  `Employee Name` varchar(110) NOT NULL,
  `docId` int(11) NOT NULL,
  `Doctor Name` varchar(100) NOT NULL,
  `exId` int(11) NOT NULL,
  `DL Copy` text NOT NULL,
  `Prescription` varchar(100) NOT NULL,
  `Total` float NOT NULL,
  `Date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `pId` int(11) NOT NULL,
  `Product Name` varchar(110) NOT NULL,
  `Price` float NOT NULL,
  `Date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stockists`
--

CREATE TABLE `stockists` (
  `stockId` int(11) NOT NULL,
  `Stockist Name` varchar(100) NOT NULL,
  `Phone` bigint(10) NOT NULL,
  `Date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stocks`
--

CREATE TABLE `stocks` (
  `Invoice` varchar(100) NOT NULL,
  `stockId` int(11) NOT NULL,
  `Amount` int(11) NOT NULL,
  `Date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tourplan`
--

CREATE TABLE `tourplan` (
  `tId` int(11) NOT NULL,
  `empId` int(11) NOT NULL,
  `hqId` int(11) NOT NULL,
  `exId` int(11) NOT NULL,
  `Extension Name` varchar(100) NOT NULL,
  `Out Station` text NOT NULL,
  `Joint Work` varchar(100) NOT NULL,
  `Date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `boss`
--
ALTER TABLE `boss`
  ADD PRIMARY KEY (`bossId`),
  ADD UNIQUE KEY `password` (`password`);

--
-- Indexes for table `doctor activities`
--
ALTER TABLE `doctor activities`
  ADD PRIMARY KEY (`recordId`),
  ADD KEY `docActTodoc` (`docId`),
  ADD KEY `docActToemp` (`empId`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`docId`),
  ADD KEY `docToEx` (`exId`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`empId`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `password` (`password`),
  ADD KEY `empTohq` (`hqId`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`expId`),
  ADD KEY `expToemp` (`empId`),
  ADD KEY `expToex` (`exId`);

--
-- Indexes for table `extensions`
--
ALTER TABLE `extensions`
  ADD PRIMARY KEY (`exId`),
  ADD KEY `exTohq` (`hqId`),
  ADD KEY `extoStock` (`stockId`);

--
-- Indexes for table `headquarters`
--
ALTER TABLE `headquarters`
  ADD PRIMARY KEY (`hqId`);

--
-- Indexes for table `manager`
--
ALTER TABLE `manager`
  ADD PRIMARY KEY (`manId`),
  ADD UNIQUE KEY `password` (`password`),
  ADD UNIQUE KEY `uniqueEmailManager` (`email`);

--
-- Indexes for table `meetings`
--
ALTER TABLE `meetings`
  ADD PRIMARY KEY (`metId`);

--
-- Indexes for table `ordered products`
--
ALTER TABLE `ordered products`
  ADD PRIMARY KEY (`opId`),
  ADD KEY `opToord` (`orderId`),
  ADD KEY `opToprd` (`pId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`),
  ADD KEY `ordToemp` (`empId`),
  ADD KEY `ordTodoc` (`docId`),
  ADD KEY `ordToex` (`exId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`pId`);

--
-- Indexes for table `stockists`
--
ALTER TABLE `stockists`
  ADD PRIMARY KEY (`stockId`);

--
-- Indexes for table `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`Invoice`),
  ADD KEY `rectosto` (`stockId`);

--
-- Indexes for table `tourplan`
--
ALTER TABLE `tourplan`
  ADD PRIMARY KEY (`tId`),
  ADD KEY `tpToemp` (`empId`),
  ADD KEY `tpTohq` (`hqId`),
  ADD KEY `tpToex` (`exId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `boss`
--
ALTER TABLE `boss`
  MODIFY `bossId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doctor activities`
--
ALTER TABLE `doctor activities`
  MODIFY `recordId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `docId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `empId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `extensions`
--
ALTER TABLE `extensions`
  MODIFY `exId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `headquarters`
--
ALTER TABLE `headquarters`
  MODIFY `hqId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `manager`
--
ALTER TABLE `manager`
  MODIFY `manId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meetings`
--
ALTER TABLE `meetings`
  MODIFY `metId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ordered products`
--
ALTER TABLE `ordered products`
  MODIFY `opId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `pId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stockists`
--
ALTER TABLE `stockists`
  MODIFY `stockId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tourplan`
--
ALTER TABLE `tourplan`
  MODIFY `tId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `doctor activities`
--
ALTER TABLE `doctor activities`
  ADD CONSTRAINT `docActTodoc` FOREIGN KEY (`docId`) REFERENCES `doctors` (`docId`),
  ADD CONSTRAINT `docActToemp` FOREIGN KEY (`empId`) REFERENCES `employees` (`empId`);

--
-- Constraints for table `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `docToEx` FOREIGN KEY (`exId`) REFERENCES `extensions` (`exId`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `empTohq` FOREIGN KEY (`hqId`) REFERENCES `headquarters` (`hqId`);

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expToemp` FOREIGN KEY (`empId`) REFERENCES `employees` (`empId`),
  ADD CONSTRAINT `expToex` FOREIGN KEY (`exId`) REFERENCES `extensions` (`exId`);

--
-- Constraints for table `extensions`
--
ALTER TABLE `extensions`
  ADD CONSTRAINT `exTohq` FOREIGN KEY (`hqId`) REFERENCES `headquarters` (`hqId`),
  ADD CONSTRAINT `extoStock` FOREIGN KEY (`stockId`) REFERENCES `stockists` (`stockId`);

--
-- Constraints for table `ordered products`
--
ALTER TABLE `ordered products`
  ADD CONSTRAINT `opToord` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`),
  ADD CONSTRAINT `opToprd` FOREIGN KEY (`pId`) REFERENCES `products` (`pId`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `ordTodoc` FOREIGN KEY (`docId`) REFERENCES `doctors` (`docId`),
  ADD CONSTRAINT `ordToemp` FOREIGN KEY (`empId`) REFERENCES `employees` (`empId`),
  ADD CONSTRAINT `ordToex` FOREIGN KEY (`exId`) REFERENCES `extensions` (`exId`);

--
-- Constraints for table `stocks`
--
ALTER TABLE `stocks`
  ADD CONSTRAINT `rectosto` FOREIGN KEY (`stockId`) REFERENCES `stockists` (`stockId`);

--
-- Constraints for table `tourplan`
--
ALTER TABLE `tourplan`
  ADD CONSTRAINT `tpToemp` FOREIGN KEY (`empId`) REFERENCES `employees` (`empId`),
  ADD CONSTRAINT `tpToex` FOREIGN KEY (`exId`) REFERENCES `extensions` (`exId`),
  ADD CONSTRAINT `tpTohq` FOREIGN KEY (`hqId`) REFERENCES `headquarters` (`hqId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
