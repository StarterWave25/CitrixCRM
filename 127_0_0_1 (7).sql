-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 20, 2025 at 01:20 PM
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
  `Status` varchar(100) NOT NULL,
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

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`empId`, `email`, `empName`, `hqId`, `password`, `date`) VALUES
(1, 'harsha@gmail.com', 'Harsha Vardhan', 3, '$2b$10$k', '2025-10-15'),
(2, 'prudvi@gmail.com', 'Prudvi', 4, '$2b$10$s', '2025-10-15'),
(3, 'jasu@gmail.com', 'Jasu', 5, '$2b$10$c', '2025-10-15'),
(4, 'ramu@gmail.com', 'Ram', 5, '$2b$10$q', '2025-10-15'),
(8, 'prudvi2@gmail.com', 'Prudvi', 3, '$2b$10$Yj3ZAEPZNUp3r1yOZzJ5ledKbAUgoVDc.XKtf7QzUkGDT1G.Bs6NS', '2025-10-18');

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
  `Date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`expId`, `empId`, `exId`, `Normal Expense`, `Extension Expense`, `Total Expense`, `Paid Status`, `Travel Bill`, `Stay Bill`, `Date`) VALUES
(9, 8, 3, 200, 224, 424, 'Not Paid', 'https://res.cloudinary.com/dikzz3qtt/image/upload/v1760958805/iax71csrkjceashv7kpn.png', '', '2025-10-20');

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

--
-- Dumping data for table `extensions`
--

INSERT INTO `extensions` (`exId`, `extensionName`, `hqId`, `stockId`, `date`) VALUES
(3, 'Pileru', 3, NULL, '2025-10-15');

-- --------------------------------------------------------

--
-- Table structure for table `headquarters`
--

CREATE TABLE `headquarters` (
  `hqId` int(11) NOT NULL,
  `hqName` varchar(100) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `headquarters`
--

INSERT INTO `headquarters` (`hqId`, `hqName`, `date`) VALUES
(3, 'Tirupati', '2025-10-15'),
(4, 'Kadapa', '2025-10-15'),
(5, 'Kurnool', '2025-10-15'),
(6, 'Anantapur', '2025-10-15');

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

--
-- Dumping data for table `meetings`
--

INSERT INTO `meetings` (`metId`, `Meeting Link`, `Count`, `Date`) VALUES
(1, 'lksdajfkslfjlalklasjflk', 1, '2025-10-13'),
(2, 'sdfsafasfas', 2, '2025-10-13'),
(3, 'https://meet.google.com/ona-gjkd-kpy', 1, '2025-10-14'),
(4, 'https://meet.google.com/vmq-vqpk-efy', 2, '2025-10-14'),
(5, 'https://meet.google.com/vmq-vqpk-efy', 1, '2025-10-19');

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
  `Employee Name` int(11) NOT NULL,
  `docId` int(11) NOT NULL,
  `Doctor Name` varchar(100) NOT NULL,
  `exId` int(11) NOT NULL,
  `DL Copy` text NOT NULL,
  `Prescription` varchar(100) NOT NULL,
  `Total` int(11) NOT NULL,
  `Date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `pId` int(11) NOT NULL,
  `Product Name` int(11) NOT NULL,
  `Price` int(11) NOT NULL,
  `Date` int(11) NOT NULL
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
-- Dumping data for table `tourplan`
--

INSERT INTO `tourplan` (`tId`, `empId`, `hqId`, `exId`, `Extension Name`, `Out Station`, `Joint Work`, `Date`) VALUES
(8, 2, 3, 3, 'Pileru', 'No', 'Yes with Harsha', '2025-10-15'),
(10, 2, 3, 3, 'Pileru', 'Yes', 'No', '2025-10-15'),
(11, 2, 3, 3, 'Pileru', 'No', 'No', '2025-10-14'),
(12, 8, 3, 3, 'Pileru', 'No', '', '2025-10-19'),
(13, 8, 3, 3, 'Pileru', 'No', 'no', '2025-10-20'),
(14, 8, 3, 3, 'Pileru', 'No', 'no', '2025-10-20');

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
  ADD PRIMARY KEY (`docId`);

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
  MODIFY `recordId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `docId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `empId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `extensions`
--
ALTER TABLE `extensions`
  MODIFY `exId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `headquarters`
--
ALTER TABLE `headquarters`
  MODIFY `hqId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `manager`
--
ALTER TABLE `manager`
  MODIFY `manId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `meetings`
--
ALTER TABLE `meetings`
  MODIFY `metId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ordered products`
--
ALTER TABLE `ordered products`
  MODIFY `opId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `tId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
--
-- Database: `food_delivery`
--
CREATE DATABASE IF NOT EXISTS `food_delivery` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `food_delivery`;

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `Username` varchar(35) NOT NULL,
  `mobile-number` varchar(15) NOT NULL,
  `issue` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`Username`, `mobile-number`, `issue`) VALUES
('Jasu', '7981629173', 'the issue is this socitydsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss'),
('', '7981629173', 'i mkhjsfhjaghfjkalhdjxbcvgjvhscdgaeyuvcrf vgjxdgv'),
('', '7981629173', 'i mkhjsfhjaghfjkalhdjxbcvgjvhscdgaeyuvcrf vgjxdgv'),
('harsha', '9014709040', 'issuee');

-- --------------------------------------------------------

--
-- Table structure for table `delivery_activity`
--

CREATE TABLE `delivery_activity` (
  `id` int(11) NOT NULL,
  `dmobile` varchar(15) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `duration_seconds` int(11) DEFAULT 0,
  `activity_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `delivery_activity`
--

INSERT INTO `delivery_activity` (`id`, `dmobile`, `start_time`, `end_time`, `duration_seconds`, `activity_date`) VALUES
(59, '9398927019', '2025-05-02 12:51:33', '2025-05-02 12:51:53', 20, '2025-05-02'),
(60, '9398927019', '2025-05-02 12:51:54', NULL, 0, '2025-05-02'),
(61, '9398927019', '2025-05-02 13:02:28', '2025-05-02 13:04:47', 139, '2025-05-02'),
(62, '9398927019', '2025-05-02 13:04:48', NULL, 0, '2025-05-02'),
(63, '9398927019', '2025-05-02 13:04:50', NULL, 0, '2025-05-02'),
(64, '9398927019', '2025-05-02 13:04:53', NULL, 0, '2025-05-02'),
(65, '9398927019', '2025-05-02 13:04:54', NULL, 0, '2025-05-02'),
(66, '9398927019', '2025-05-02 13:04:55', NULL, 0, '2025-05-02'),
(67, '9398927019', '2025-05-02 13:05:09', '2025-05-02 13:21:28', 979, '2025-05-02'),
(68, '9398927019', '2025-05-02 13:05:10', '2025-05-02 13:05:11', 1, '2025-05-02'),
(69, '9398927019', '2025-05-02 13:05:12', '2025-05-02 13:20:17', 905, '2025-05-02'),
(70, '9398927019', '2025-05-02 13:21:43', NULL, 0, '2025-05-02'),
(71, '9398927019', '2025-05-02 13:22:15', '2025-05-02 13:22:24', 9, '2025-05-02'),
(72, '9398927019', '2025-05-02 13:26:11', '2025-05-02 13:26:17', 6, '2025-05-02'),
(73, '9398927019', '2025-05-02 13:26:18', NULL, 0, '2025-05-02'),
(74, '9398927019', '2025-05-02 13:26:47', NULL, 0, '2025-05-02'),
(75, '9398927019', '2025-05-02 13:30:28', NULL, 0, '2025-05-02'),
(76, '9398927019', '2025-05-02 13:41:10', NULL, 0, '2025-05-02'),
(77, '9398927019', '2025-05-02 13:47:38', '2025-05-02 13:50:27', 169, '2025-05-02'),
(78, '9398927019', '2025-05-03 11:41:10', '2025-05-03 11:41:49', 39, '2025-05-03'),
(79, '9398927019', '2025-05-03 11:41:49', NULL, 0, '2025-05-03'),
(80, '9398927019', '2025-05-03 12:32:47', '2025-05-03 12:32:49', 2, '2025-05-03'),
(81, '9398927019', '2025-05-03 12:32:50', '2025-05-03 12:39:15', 385, '2025-05-03'),
(82, '9398927019', '2025-05-03 12:39:18', NULL, 0, '2025-05-03'),
(83, '9014709040', '2025-05-05 05:01:32', NULL, 0, '2025-05-05'),
(84, '9014709040', '2025-05-05 05:02:28', NULL, 0, '2025-05-05'),
(85, '9014709040', '2025-05-05 05:02:40', '2025-05-05 05:02:53', 13, '2025-05-05'),
(86, '9014709040', '2025-05-05 05:03:12', '2025-05-05 05:09:18', 366, '2025-05-05'),
(87, '9398927019', '2025-05-05 05:03:39', '2025-05-05 05:09:11', 332, '2025-05-05'),
(88, '9014709040', '2025-05-05 12:26:39', NULL, 0, '2025-05-05'),
(89, '9398927019', '2025-05-05 15:17:32', NULL, 0, '2025-05-05'),
(90, '9398927019', '2025-05-07 07:52:27', '2025-05-07 13:00:05', 18458, '2025-05-07'),
(91, '9398927019', '2025-05-10 05:28:35', '2025-05-10 05:28:38', 3, '2025-05-10'),
(92, '9398927019', '2025-05-10 05:28:39', NULL, 0, '2025-05-10'),
(93, '9398927019', '2025-05-10 05:33:49', '2025-05-10 05:33:52', 3, '2025-05-10'),
(94, '9398927019', '2025-05-10 05:33:53', '2025-05-10 07:14:30', 6037, '2025-05-10'),
(95, '9014709040', '2025-05-10 05:37:52', '2025-05-10 05:37:53', 1, '2025-05-10'),
(96, '9014709040', '2025-05-10 05:37:54', NULL, 0, '2025-05-10'),
(97, '', '2025-05-10 07:14:18', '2025-05-10 07:14:18', 0, '2025-05-10'),
(98, '9398927019', '2025-05-10 07:14:31', '2025-05-10 07:14:32', 1, '2025-05-10'),
(99, '9398927019', '2025-05-10 07:14:32', NULL, 0, '2025-05-10'),
(100, '9398927019', '2025-05-10 11:32:27', '2025-05-10 11:32:28', 1, '2025-05-10'),
(101, '9398927019', '2025-05-10 11:32:29', NULL, 0, '2025-05-10'),
(102, '9398927019', '2025-05-15 11:55:48', NULL, 0, '2025-05-15'),
(103, '9398927019', '2025-05-15 11:55:49', '2025-05-15 11:55:51', 2, '2025-05-15'),
(104, '9398927019', '2025-05-15 11:55:52', '2025-05-15 11:57:14', 82, '2025-05-15'),
(105, '9398927019', '2025-05-15 12:00:10', '2025-05-15 12:00:12', 2, '2025-05-15'),
(106, '9398927019', '2025-05-15 12:00:13', '2025-05-15 12:00:17', 4, '2025-05-15'),
(107, '9398927019', '2025-05-15 12:05:05', '2025-05-15 12:08:11', 186, '2025-05-15'),
(108, '9398927019', '2025-05-15 12:08:37', '2025-05-15 12:15:09', 392, '2025-05-15'),
(109, '9398927019', '2025-05-15 12:15:10', '2025-05-15 12:15:11', 1, '2025-05-15'),
(110, '9398927019', '2025-05-15 12:15:12', '2025-05-15 12:15:16', 4, '2025-05-15'),
(111, '9398927019', '2025-05-15 12:15:17', '2025-05-15 12:15:18', 1, '2025-05-15'),
(112, '9398927019', '2025-05-15 12:15:20', NULL, 0, '2025-05-15'),
(113, '9398927019', '2025-05-15 12:29:41', '2025-05-15 12:29:53', 12, '2025-05-15'),
(114, '9398927019', '2025-05-15 12:29:54', NULL, 0, '2025-05-15'),
(115, '9398927019', '2025-05-15 12:57:06', '2025-05-15 12:57:07', 1, '2025-05-15'),
(116, '9398927019', '2025-05-15 12:57:08', NULL, 0, '2025-05-15'),
(117, '9398927019', '2025-05-21 13:27:24', '2025-05-21 13:27:27', 3, '2025-05-21'),
(118, '9398927019', '2025-05-21 13:27:28', NULL, 0, '2025-05-21'),
(119, '9398927019', '2025-05-21 13:32:16', '2025-05-21 13:32:20', 4, '2025-05-21'),
(120, '9398927019', '2025-05-21 13:32:20', '2025-05-23 10:14:49', 160949, '2025-05-21'),
(121, '9014709040', '2025-05-22 05:04:06', '2025-05-22 05:04:07', 1, '2025-05-22'),
(122, '9014709040', '2025-05-22 05:04:08', '2025-05-22 05:05:42', 94, '2025-05-22'),
(123, '9014709040', '2025-05-22 05:05:42', NULL, 0, '2025-05-22'),
(124, '9014709040', '2025-05-22 05:07:13', '2025-05-22 05:07:14', 1, '2025-05-22'),
(125, '9014709040', '2025-05-22 05:07:15', NULL, 0, '2025-05-22'),
(126, '9014709040', '2025-05-22 05:15:27', '2025-05-22 05:15:28', 1, '2025-05-22'),
(127, '9014709040', '2025-05-22 05:15:29', NULL, 0, '2025-05-22'),
(128, '9014709040', '2025-05-22 05:31:51', NULL, 0, '2025-05-22'),
(129, '9398927019', '2025-05-23 10:14:53', '2025-05-23 11:43:07', 5294, '2025-05-23'),
(130, '8977241079', '2025-05-24 06:01:49', '2025-05-24 06:12:14', 625, '2025-05-24'),
(131, '9014709040', '2025-05-25 12:10:15', NULL, 0, '2025-05-25'),
(132, '9014709040', '2025-06-25 17:52:57', '2025-06-25 17:53:00', 3, '2025-06-25'),
(133, '9014709040', '2025-06-25 17:57:50', '2025-06-25 17:59:44', 114, '2025-06-25'),
(134, '9014709040', '2025-06-25 17:59:45', '2025-06-25 17:59:53', 8, '2025-06-25'),
(135, '9014709040', '2025-06-25 17:59:54', '2025-06-25 18:00:12', 18, '2025-06-25'),
(136, '9014709040', '2025-06-25 18:00:13', NULL, 0, '2025-06-25'),
(137, '8977241079', '2025-07-08 11:16:15', NULL, 0, '2025-07-08'),
(138, '8977241079', '2025-07-08 11:17:46', '2025-07-08 11:17:47', 1, '2025-07-08'),
(139, '8977241079', '2025-07-08 11:20:14', NULL, 0, '2025-07-08');

-- --------------------------------------------------------

--
-- Table structure for table `delivery_agent`
--

CREATE TABLE `delivery_agent` (
  `dmobile` bigint(10) NOT NULL,
  `dname` text NOT NULL,
  `dpassword` varchar(8) NOT NULL,
  `status` text NOT NULL,
  `orders` int(11) NOT NULL,
  `total_earnings` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `delivery_agent`
--

INSERT INTO `delivery_agent` (`dmobile`, `dname`, `dpassword`, `status`, `orders`, `total_earnings`) VALUES
(8977241079, 'Tharun', 'thar1079', 'inactive', 10, 100),
(9014709040, 'Harsha', 'Hars9040', 'inactive', 1, 0),
(9090909090, 'Ramu', 'Ramu0909', 'inactive', 90, 10),
(9398927019, 'PRUDVI', 'PRUD7019', 'inactive', 1000, 0);

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `item_id` int(11) NOT NULL,
  `item_name` text NOT NULL,
  `res_id` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `dprice` int(11) NOT NULL,
  `ratings` float NOT NULL,
  `rperson` int(11) NOT NULL,
  `status` text NOT NULL DEFAULT 'Available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `item_name`, `res_id`, `price`, `dprice`, `ratings`, `rperson`, `status`) VALUES
(701, 'Idli(3) & Sambar', 6901, 40, 60, 4.5, 120, 'Available'),
(702, 'Vada(3) & Sambar', 6902, 30, 45, 4.3, 150, 'Available'),
(703, 'Dosa', 6902, 50, 75, 4.7, 200, 'Available'),
(704, 'Upma', 6901, 35, 52, 4.2, 80, 'Unavailable'),
(705, 'Gobi Rice', 6903, 70, 100, 4.6, 15, 'Available'),
(706, 'Masala Dosa', 6904, 70, 105, 4.8, 250, 'Available'),
(707, 'Rava Dosa', 6903, 65, 97, 4.6, 180, 'Available'),
(708, 'Karam Dosa', 6904, 60, 90, 4.5, 140, 'Available'),
(709, 'Gobi Rice', 6901, 80, 120, 4.7, 220, 'Available'),
(710, 'Lemon Rice', 6902, 50, 75, 4.3, 130, 'Available'),
(711, 'Rava Idli', 6905, 50, 80, 4.4, 20, 'Available'),
(712, 'Chapathi(2)', 6905, 40, 70, 4.2, 15, 'Available'),
(713, 'Poori(3)', 6902, 50, 90, 3.8, 4, 'Available'),
(714, 'Onion Uttapam', 6904, 80, 120, 4.1, 9, 'Available'),
(715, 'Veg rice', 6901, 100, 140, 4.2, 12, 'Available'),
(716, 'Jeera rice ', 6901, 50, 70, 4.3, 15, 'Available'),
(717, 'Paneer Rice', 6905, 160, 200, 4.5, 14, 'Available'),
(718, 'Kaju Rice', 6901, 165, 220, 4.5, 9, 'Available'),
(719, 'Veg Noodles', 6903, 90, 140, 4.3, 10, 'Available'),
(720, 'Gobi Noodles', 6903, 100, 150, 4.8, 15, 'Available'),
(721, 'Paneer Noodles', 6903, 120, 180, 4.2, 8, 'Available'),
(722, 'Gobi manchuria', 6902, 110, 160, 4.4, 13, 'Available'),
(723, 'Paneer Butter Masala', 6902, 160, 220, 4.5, 14, 'Available'),
(724, 'Curd Rice', 6905, 80, 110, 4.2, 16, 'Available'),
(725, 'Onion Dosa', 6904, 70, 100, 4.2, 11, 'Available'),
(726, 'Maggi', 6901, 50, 70, 0, 0, 'Available'),
(727, 'Pulihora', 6901, 60, 90, 0, 0, 'Available'),
(728, 'Maggi', 6901, 70, 50, 0, 0, 'Available');

-- --------------------------------------------------------

--
-- Table structure for table `most_ordered_items`
--

CREATE TABLE `most_ordered_items` (
  `mid` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `item_name` text NOT NULL,
  `res_id` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `dprice` int(11) NOT NULL,
  `ratings` float NOT NULL,
  `rperson` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `most_ordered_items`
--

INSERT INTO `most_ordered_items` (`mid`, `item_id`, `item_name`, `res_id`, `price`, `dprice`, `ratings`, `rperson`) VALUES
(1, 701, 'Idli', 6901, 40, 60, 4.5, 120),
(2, 702, 'Vada', 6902, 30, 45, 4.3, 150),
(3, 705, 'Gobi Rice', 6903, 70, 100, 4.6, 15),
(4, 706, 'Masala Dosa', 6904, 70, 105, 4.8, 250),
(5, 712, 'Chapathi', 6905, 50, 70, 4.5, 30);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` varchar(17) NOT NULL,
  `mobile` bigint(10) NOT NULL,
  `username` text NOT NULL,
  `ptype` varchar(5) NOT NULL,
  `res_id` int(11) NOT NULL,
  `items` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `dtotal` int(11) NOT NULL,
  `dname` text NOT NULL,
  `dmobile` bigint(10) NOT NULL,
  `location` longtext NOT NULL,
  `status` text NOT NULL,
  `res_status` text NOT NULL DEFAULT 'requested',
  `Time` datetime NOT NULL DEFAULT current_timestamp(),
  `delivered_time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `mobile`, `username`, `ptype`, `res_id`, `items`, `total`, `dtotal`, `dname`, `dmobile`, `location`, `status`, `res_status`, `Time`, `delivered_time`) VALUES
('ORD297052BT733242', 7729842970, 'K Varalakshmi', 'cash', 6901, 2, 220, 290, 'Tharun', 8977241079, 'https://www.google.com/maps/place/17.4358528+78.4400384', 'delivered', 'delivered', '2025-05-24 09:38:53', '2025-05-24 09:40:19'),
('ORD29708DIF369171', 7729842970, 'K Varalakshmi', 'upi', 6901, 3, 300, 410, 'Tharun', 8977241079, 'https://www.google.com/maps/place/17.4358528+78.4400384', 'delivered', 'delivered', '2025-05-24 09:32:49', '2025-05-24 09:34:29'),
('ORD904010QP151182', 9014709040, 'Harsha Vardhan', '', 6901, 1, 80, 120, '', 0, 'https://www.google.com/maps/place/17.4358528+78.4400384', 'cancelled', 'cancelled', '2025-05-23 14:35:51', '2025-05-23 14:35:51'),
('ORD904011UR257432', 9014709040, 'Harsha Vardhan', '', 6901, 1, 80, 120, '', 0, 'https://www.google.com/maps/place/17.4358528+78.4400384', 'cancelled', 'cancelled', '2025-05-23 14:37:37', '2025-05-23 14:37:37'),
('ORD904039NG398753', 9014709040, 'Harsha Vardhan', 'cash', 6901, 1, 80, 120, 'PRUDVI', 9398927019, 'https://www.google.com/maps/place/17.4358528+78.4400384', 'delivered', 'delivered', '2025-05-23 14:56:38', '2025-05-23 15:12:12'),
('ORD9040G3XR752729', 9014709040, 'Harsha Vardhan', '', 6904, 2, 130, 195, 'Harsha', 9014709040, 'https://www.google.com/maps/place/13.640022137224326+79.42119604143461', 'accept', 'requested', '2025-06-25 21:55:52', '2025-06-25 21:55:52'),
('ORD9040ICTM055094', 9014709040, 'Harsha Vardhan', '', 6901, 1, 80, 120, '', 0, 'https://www.google.com/maps/place/17.4358528+78.4400384', 'cancelled', 'cancelled', '2025-05-23 14:34:15', '2025-05-23 14:34:15'),
('ORD9040JAR7919193', 9014709040, 'Harsha Vardhan', '', 6904, 2, 130, 195, '', 0, 'https://www.google.com/maps/place/13.640022137224326+79.42119604143461', 'pending', 'requested', '2025-06-25 21:58:39', '2025-06-25 21:58:39'),
('ORD9040M6ZO478557', 9014709040, 'Harsha Vardhan', 'cash', 6901, 1, 80, 120, 'PRUDVI', 9398927019, 'https://www.google.com/maps/place/17.4358528+78.4400384', 'delivered', 'delivered', '2025-05-23 14:24:38', '2025-05-23 14:25:45'),
('ORD9040OMZ0021256', 9014709040, 'Harsha Vardhan', '', 6904, 2, 130, 195, 'Harsha', 9014709040, 'https://www.google.com/maps/place/13.640022137224326+79.42119604143461', 'accept', 'requested', '2025-06-25 21:27:01', '2025-06-25 21:27:01'),
('ORD9040UB31932361', 9014709040, 'Harsha Vardhan', 'cash', 6901, 1, 80, 120, 'PRUDVI', 9398927019, 'https://www.google.com/maps/place/17.4358528+78.4400384', 'delivered', 'delivered', '2025-05-23 14:48:52', '2025-05-23 14:51:35'),
('ORD9040ZDS1337058', 9014709040, 'Harsha Vardhan', '', 6901, 1, 80, 120, '', 0, 'https://www.google.com/maps/place/17.4358528+78.4400384', 'cancelled', 'cancelled', '2025-05-23 14:38:57', '2025-05-23 14:38:57'),
('ORD9040ZF9T577887', 9014709040, 'Harsha Vardhan', '', 6901, 1, 80, 120, '', 0, 'https://www.google.com/maps/place/17.4358528+78.4400384', 'cancelled', 'cancelled', '2025-05-23 14:26:17', '2025-05-23 14:26:17'),
('ORD9173AGMG465969', 7981629173, 'Jasu', '', 6901, 1, 80, 120, '', 0, 'https://www.google.com/maps/place/13.6183808+79.413248', 'pending', 'requested', '2025-07-08 14:51:05', '2025-07-08 14:51:05'),
('ORD9173L206336637', 7981629173, 'Jasu', '', 6901, 1, 80, 120, 'Tharun', 8977241079, 'https://www.google.com/maps/place/13.6183808+79.413248', 'accept', 'ready', '2025-07-08 14:48:56', '2025-07-08 14:48:56'),
('ORD9340Y7IH779652', 9515219340, 'K Mahitha', 'upi', 6904, 1, 80, 120, 'Harsha', 9014709040, 'https://www.google.com/maps/place/17.4358528+78.4400384', 'delivered', 'delivered', '2025-05-25 15:39:39', '2025-05-25 15:42:12');

-- --------------------------------------------------------

--
-- Table structure for table `orders_help`
--

CREATE TABLE `orders_help` (
  `token` varchar(100) NOT NULL,
  `order_id` text NOT NULL,
  `issue` text NOT NULL,
  `description` longtext NOT NULL,
  `status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders_help`
--

INSERT INTO `orders_help` (`token`, `order_id`, `issue`, `description`, `status`) VALUES
('82 ORD297052BT733242', 'ORD297052BT733242', 'missingItems', '{\"fullOrder\":\"Veg rice, Jeera rice\",\"missingItemsList\":\"Veg rice\",\"packageCondition\":\"Package was damaged\"}', 'Responded by Vasuki'),
('89 ORD297052BT733242', 'ORD297052BT733242', 'missingItems', '{\"fullOrder\":\"Veg rice, Jeeera rice\",\"missingItemsList\":\"Jeera rice\",\"packageCondition\":\"Package was opened\"}', 'Responded by Vasuki'),
('96 ORD297052BT733242', 'ORD297052BT733242', 'missingItems', '{\"fullOrder\":\"Veg rice, Jeera rice\",\"missingItemsList\":\"Jeera rice\",\"packageCondition\":\"Package was opened\"}', 'Responded by Vasuki');

-- --------------------------------------------------------

--
-- Table structure for table `orders_status`
--

CREATE TABLE `orders_status` (
  `sno` int(11) NOT NULL,
  `order_id` varchar(17) NOT NULL,
  `dmobile` bigint(10) NOT NULL,
  `res_id` int(11) NOT NULL,
  `res_name` mediumtext NOT NULL,
  `res_location` text NOT NULL,
  `username` text NOT NULL,
  `mobile` bigint(10) NOT NULL,
  `location` text NOT NULL,
  `total` int(11) NOT NULL,
  `status` text NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders_status`
--

INSERT INTO `orders_status` (`sno`, `order_id`, `dmobile`, `res_id`, `res_name`, `res_location`, `username`, `mobile`, `location`, `total`, `status`, `time`) VALUES
(378, 'ORD9040M6ZO478557', 9398927019, 6901, 'Saarangi Fine Dine restaurant', 'https://maps.app.goo.gl/8QuPibsDuQPJAk9S9', 'Harsha Vardhan', 9014709040, 'https://www.google.com/maps/place/17.4358528+78.4400384', 80, 'delivered', '2025-05-23 14:25:08'),
(379, 'ORD904010QP151182', 9398927019, 6901, 'Saarangi Fine Dine restaurant', 'https://maps.app.goo.gl/8QuPibsDuQPJAk9S9', 'Harsha Vardhan', 9014709040, 'https://www.google.com/maps/place/17.4358528+78.4400384', 80, 'reject', '2025-05-23 14:36:21'),
(382, 'ORD9040UB31932361', 9398927019, 6901, 'Saarangi Fine Dine restaurant', 'https://maps.app.goo.gl/8QuPibsDuQPJAk9S9', 'Harsha Vardhan', 9014709040, 'https://www.google.com/maps/place/17.4358528+78.4400384', 80, 'delivered', '2025-05-23 14:50:44'),
(383, 'ORD904039NG398753', 9398927019, 6901, 'Saarangi Fine Dine restaurant', 'https://maps.app.goo.gl/8QuPibsDuQPJAk9S9', 'Harsha Vardhan', 9014709040, 'https://www.google.com/maps/place/17.4358528+78.4400384', 80, 'delivered', '2025-05-23 14:57:09'),
(384, 'ORD29708DIF369171', 8977241079, 6901, 'Saarangi Fine Dine restaurant', 'https://maps.app.goo.gl/8QuPibsDuQPJAk9S9', 'K Varalakshmi', 7729842970, 'https://www.google.com/maps/place/17.4358528+78.4400384', 300, 'delivered', '2025-05-24 09:33:19'),
(385, 'ORD297052BT733242', 8977241079, 6901, 'Saarangi Fine Dine restaurant', 'https://maps.app.goo.gl/8QuPibsDuQPJAk9S9', 'K Varalakshmi', 7729842970, 'https://www.google.com/maps/place/17.4358528+78.4400384', 220, 'reject', '2025-05-24 09:39:23'),
(386, 'ORD297052BT733242', 8977241079, 6901, 'Saarangi Fine Dine restaurant', 'https://maps.app.goo.gl/8QuPibsDuQPJAk9S9', 'K Varalakshmi', 7729842970, 'https://www.google.com/maps/place/17.4358528+78.4400384', 220, 'delivered', '2025-05-24 09:39:35'),
(387, 'ORD9340Y7IH779652', 9014709040, 6904, 'Gufha Restaurant', 'https://maps.app.goo.gl/YGJNNp2M6tKSbi2k8', 'K Mahitha', 9515219340, 'https://www.google.com/maps/place/17.4358528+78.4400384', 80, 'delivered', '2025-05-25 15:40:20'),
(388, 'ORD9040OMZ0021256', 9014709040, 6904, 'Gufha Restaurant', 'https://maps.app.goo.gl/YGJNNp2M6tKSbi2k8', 'Harsha Vardhan', 9014709040, 'https://www.google.com/maps/place/13.640022137224326+79.42119604143461', 130, 'accept', '2025-06-25 21:27:52'),
(390, 'ORD9040G3XR752729', 9014709040, 6904, 'Gufha Restaurant', 'https://maps.app.goo.gl/YGJNNp2M6tKSbi2k8', 'Harsha Vardhan', 9014709040, 'https://www.google.com/maps/place/13.640022137224326+79.42119604143461', 130, 'accept', '2025-06-25 21:56:22'),
(391, 'ORD9040JAR7919193', 9014709040, 6904, 'Gufha Restaurant', 'https://maps.app.goo.gl/YGJNNp2M6tKSbi2k8', 'Harsha Vardhan', 9014709040, 'https://www.google.com/maps/place/13.640022137224326+79.42119604143461', 130, 'accept', '2025-06-25 21:59:09'),
(392, 'ORD9173L206336637', 8977241079, 6901, 'Saarangi Fine Dine restaurant', 'https://maps.app.goo.gl/8QuPibsDuQPJAk9S9', 'Jasu', 7981629173, 'https://www.google.com/maps/place/13.6183808+79.413248', 80, 'accept', '2025-07-08 14:50:10'),
(393, 'ORD9173AGMG465969', 8977241079, 6901, 'Saarangi Fine Dine restaurant', 'https://maps.app.goo.gl/8QuPibsDuQPJAk9S9', 'Jasu', 7981629173, 'https://www.google.com/maps/place/13.6183808+79.413248', 80, 'accept', '2025-07-08 14:51:36');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `sno` int(11) NOT NULL,
  `order_id` varchar(17) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `dprice` int(11) NOT NULL,
  `created at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`sno`, `order_id`, `item_id`, `quantity`, `price`, `dprice`, `created at`) VALUES
(2299, 'ORD9040M6ZO478557', 709, 1, 80, 120, '2025-05-23 14:24:38'),
(2300, 'ORD9040ZF9T577887', 709, 1, 80, 120, '2025-05-23 14:26:17'),
(2302, 'ORD9040ICTM055094', 709, 1, 80, 120, '2025-05-23 14:34:15'),
(2303, 'ORD904010QP151182', 709, 1, 80, 120, '2025-05-23 14:35:51'),
(2304, 'ORD904011UR257432', 709, 1, 80, 120, '2025-05-23 14:37:37'),
(2305, 'ORD9040ZDS1337058', 709, 1, 80, 120, '2025-05-23 14:38:57'),
(2309, 'ORD9040UB31932361', 709, 1, 80, 120, '2025-05-23 14:48:52'),
(2310, 'ORD904039NG398753', 709, 1, 80, 120, '2025-05-23 14:56:38'),
(2311, 'ORD29708DIF369171', 715, 1, 100, 140, '2025-05-24 09:32:49'),
(2312, 'ORD29708DIF369171', 709, 1, 80, 120, '2025-05-24 09:32:49'),
(2313, 'ORD29708DIF369171', 716, 1, 120, 150, '2025-05-24 09:32:49'),
(2314, 'ORD297052BT733242', 715, 1, 100, 140, '2025-05-24 09:38:53'),
(2315, 'ORD297052BT733242', 716, 1, 120, 150, '2025-05-24 09:38:53'),
(2316, 'ORD9340Y7IH779652', 714, 1, 80, 120, '2025-05-25 15:39:39'),
(2317, 'ORD9040OMZ0021256', 706, 1, 70, 105, '2025-06-25 21:27:01'),
(2318, 'ORD9040OMZ0021256', 708, 1, 60, 90, '2025-06-25 21:27:01'),
(2321, 'ORD9040G3XR752729', 706, 1, 70, 105, '2025-06-25 21:55:52'),
(2322, 'ORD9040G3XR752729', 708, 1, 60, 90, '2025-06-25 21:55:52'),
(2323, 'ORD9040JAR7919193', 706, 1, 70, 105, '2025-06-25 21:58:39'),
(2324, 'ORD9040JAR7919193', 708, 1, 60, 90, '2025-06-25 21:58:39'),
(2325, 'ORD9173L206336637', 701, 2, 40, 60, '2025-07-08 14:48:56'),
(2326, 'ORD9173AGMG465969', 701, 2, 40, 60, '2025-07-08 14:51:06');

-- --------------------------------------------------------

--
-- Table structure for table `restaurants`
--

CREATE TABLE `restaurants` (
  `res_id` int(11) NOT NULL,
  `password` varchar(8) NOT NULL,
  `res_name` mediumtext NOT NULL,
  `ratings` float NOT NULL,
  `res_location` text NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `near_to` text NOT NULL,
  `best_item` int(11) NOT NULL,
  `offer` mediumtext NOT NULL,
  `status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `restaurants`
--

INSERT INTO `restaurants` (`res_id`, `password`, `res_name`, `ratings`, `res_location`, `latitude`, `longitude`, `near_to`, `best_item`, `offer`, `status`) VALUES
(6901, 'saar6901', 'Saarangi Fine Dine restaurant', 3.9, 'https://maps.app.goo.gl/8QuPibsDuQPJAk9S9', 13.6787482, 79.3387567, 'Sri Venkateswara Guest House', 701, 'Starts at ₹40', 'inactive'),
(6902, 'sout6902', 'Southern Spice', 4.3, 'https://maps.app.goo.gl/YGJNNp2M6tKSbi2k8', 13.6787482, 79.3387567, 'Avilala Circle', 702, 'Starts at ₹70', 'inactive'),
(6903, 'sril6903', 'Sri Lakshmi Varaha Hotel', 4.1, 'https://maps.app.goo.gl/YGJNNp2M6tKSbi2k8', 13.6787482, 79.3387567, 'SMC bus Stop', 705, 'Starts at ₹80', 'inactive'),
(6904, 'gufh6904', 'Gufha Restaurant', 4.6, 'https://maps.app.goo.gl/YGJNNp2M6tKSbi2k8', 13.6787482, 79.3387567, 'Hotel Orion Stay', 706, 'Starts at ₹90', 'inactive'),
(6905, 'mahe6905', 'Mahesh Family Restaurant', 4.5, 'https://maps.app.goo.gl/YGJNNp2M6tKSbi2k8', 13.6787482, 79.3387567, 'Varaha Swamy Guest House', 703, 'Starts at ₹90', 'inactive');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `order_id` varchar(20) NOT NULL,
  `stars` int(5) NOT NULL,
  `description` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`order_id`, `stars`, `description`) VALUES
('ORD7019JAOW279125', 5, 'nx,cZXnc,zxcnskdf'),
('ORD7019JAOW279125', 5, 'nx,cZXnc,zxcnskdf'),
('ORD29708DIF369171', 3, 'Nice !'),
('ORD297052BT733242', 4, 'Improve the UI.'),
('ORD904039NG398753', 4, '');

-- --------------------------------------------------------

--
-- Table structure for table `search_items`
--

CREATE TABLE `search_items` (
  `Sno` int(11) NOT NULL,
  `item_name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `search_items`
--

INSERT INTO `search_items` (`Sno`, `item_name`) VALUES
(1, 'Idli'),
(2, 'Dosa'),
(3, 'Vada'),
(4, 'Upma'),
(5, 'Pongal'),
(6, 'Rice Items'),
(7, 'Noodles'),
(8, 'Uttapam'),
(9, 'Gobi Rice'),
(10, 'Curd Rice'),
(11, 'Roti'),
(12, 'Chapathi');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `mobile` bigint(10) NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `room_no` text NOT NULL,
  `area` text NOT NULL,
  `landmark` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`mobile`, `name`, `email`, `room_no`, `area`, `landmark`, `created_at`) VALUES
(6304506106, 'PRASANTH', '', '12-2', 'railway colony,tirupati', 'NTR auto stand', '2025-03-31 16:18:53'),
(7187270173, 'reddy', '', 'wwa', 'sgfaf', 'gds', '2025-03-31 19:14:58'),
(7729842970, 'K Varalakshmi', '', 'Room no 2332', 'Varaha Nivasam', 'Near Vengamamba Annaprasadham', '2025-03-30 20:57:34'),
(7777777777, 'jesari', 'kjflja@gmi.com', 'aaasda', 'asdf', 'asslkdfadczd', '2025-04-29 11:35:10'),
(7981629173, 'Jasu', '', 'zfsd', 'cfgd', 'ggg', '2025-07-08 14:46:51'),
(8341734115, 'mohan', '', 'efevbfv', 'efevffv', 'evfevfefv', '2025-04-07 11:32:28'),
(9014709040, 'Harsha Vardhan', 'harsha@gmail.com', 'Room no 6969', 'Vishnu Nivasam', 'Near Railway station', '2025-03-02 10:27:18'),
(9090909090, 'jlfsflka', '', '', '', '', '2025-04-29 11:22:38'),
(9154491031, 'Mahitha', '', '', '', '', '2025-05-24 19:55:21'),
(9398927019, 'Prudvi', 'Prudvi@ceo.com', '5-302, bharat bekary line', 'sri nagar colony, bethamcherla', 'manohar store', '2025-03-23 11:46:34'),
(9494801709, 'venki', '', 'xfedx', 'rbgr', 'bgr', '2025-04-29 06:48:06'),
(9515219340, 'K Mahitha', '', '245', 'enikepadu', 'vijayawada', '2025-05-25 15:31:03'),
(9550744529, 'Pulivendula vijay', '', '2/168', 'kt road ', 'saimedagate', '2025-03-31 19:04:12'),
(9652066979, 'Manvi', '', 'narasapuram', 'veldurthi', 'chitamanu', '2025-05-10 10:44:58'),
(9848247279, 'jagan', 'jaganachari2006@gmail.com', 'hghj', 'hjvjy', 'yfyvjh', '2025-03-28 22:08:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `delivery_activity`
--
ALTER TABLE `delivery_activity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `delivery_agent`
--
ALTER TABLE `delivery_agent`
  ADD PRIMARY KEY (`dmobile`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `res_id` (`res_id`);

--
-- Indexes for table `most_ordered_items`
--
ALTER TABLE `most_ordered_items`
  ADD PRIMARY KEY (`mid`),
  ADD KEY `res_id` (`res_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `orders_help`
--
ALTER TABLE `orders_help`
  ADD PRIMARY KEY (`token`);

--
-- Indexes for table `orders_status`
--
ALTER TABLE `orders_status`
  ADD PRIMARY KEY (`sno`),
  ADD KEY `fk_order_id` (`order_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`sno`),
  ADD UNIQUE KEY `mobile` (`order_id`,`item_id`);

--
-- Indexes for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`res_id`);

--
-- Indexes for table `search_items`
--
ALTER TABLE `search_items`
  ADD PRIMARY KEY (`Sno`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`mobile`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `delivery_activity`
--
ALTER TABLE `delivery_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=732;

--
-- AUTO_INCREMENT for table `most_ordered_items`
--
ALTER TABLE `most_ordered_items`
  MODIFY `mid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orders_status`
--
ALTER TABLE `orders_status`
  MODIFY `sno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=394;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `sno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2327;

--
-- AUTO_INCREMENT for table `search_items`
--
ALTER TABLE `search_items`
  MODIFY `Sno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`res_id`) REFERENCES `restaurants` (`res_id`),
  ADD CONSTRAINT `items_ibfk_2` FOREIGN KEY (`res_id`) REFERENCES `restaurants` (`res_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `most_ordered_items`
--
ALTER TABLE `most_ordered_items`
  ADD CONSTRAINT `most_ordered_items_ibfk_1` FOREIGN KEY (`res_id`) REFERENCES `restaurants` (`res_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `most_ordered_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders_status`
--
ALTER TABLE `orders_status`
  ADD CONSTRAINT `fk_ordddid` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_orddid` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Database: `partconnectdb`
--
CREATE DATABASE IF NOT EXISTS `partconnectdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `partconnectdb`;

-- --------------------------------------------------------

--
-- Table structure for table `applied_job`
--

CREATE TABLE `applied_job` (
  `applied_jobid` int(11) NOT NULL,
  `seeker_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `provider_name` int(11) NOT NULL,
  `company_name` varchar(30) NOT NULL,
  `applied_date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applied_job`
--

INSERT INTO `applied_job` (`applied_jobid`, `seeker_id`, `job_id`, `provider_name`, `company_name`, `applied_date`) VALUES
(41, 18, 22, 23, 'jastechcrop', '2025-10-12'),
(42, 18, 24, 23, 'jastechcrop', '2025-10-12'),
(43, 5, 22, 23, 'jastechcrop', '2025-10-12'),
(44, 5, 24, 23, 'jastechcrop', '2025-10-12'),
(45, 5, 28, 22, 'Jasstech', '2025-10-12'),
(46, 5, 23, 23, 'jastechcrop', '2025-10-12'),
(47, 5, 21, 19, 'starterwave', '2025-10-13'),
(48, 11, 24, 23, 'jastechcrop', '2025-10-18'),
(49, 5, 30, 23, 'jastechcrop', '2025-10-18'),
(50, 11, 21, 19, 'starterwave', '2025-10-18');

-- --------------------------------------------------------

--
-- Table structure for table `hired`
--

CREATE TABLE `hired` (
  `hired_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `seeker_id` int(11) NOT NULL,
  `hired_at` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hired`
--

INSERT INTO `hired` (`hired_id`, `job_id`, `provider_id`, `seeker_id`, `hired_at`) VALUES
(4, 24, 23, 18, '2025-10-14'),
(6, 24, 23, 11, '2025-10-18'),
(7, 24, 23, 5, '2025-10-18'),
(8, 30, 23, 5, '2025-10-18');

-- --------------------------------------------------------

--
-- Table structure for table `posted_jobs`
--

CREATE TABLE `posted_jobs` (
  `job_id` int(11) NOT NULL,
  `provider_name` int(11) NOT NULL,
  `job_title` varchar(30) NOT NULL,
  `job_type` varchar(15) NOT NULL,
  `job_location` varchar(30) NOT NULL,
  `job_salary` int(11) NOT NULL,
  `job_salary_time` varchar(14) NOT NULL,
  `job_experience` varchar(30) NOT NULL,
  `job_posted` varchar(20) NOT NULL,
  `job_description` varchar(200) NOT NULL,
  `job_benifits` varchar(200) NOT NULL,
  `job_status` varchar(15) NOT NULL,
  `company_name` varchar(35) NOT NULL,
  `work_load` int(11) NOT NULL,
  `work_period` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posted_jobs`
--

INSERT INTO `posted_jobs` (`job_id`, `provider_name`, `job_title`, `job_type`, `job_location`, `job_salary`, `job_salary_time`, `job_experience`, `job_posted`, `job_description`, `job_benifits`, `job_status`, `company_name`, `work_load`, `work_period`) VALUES
(21, 19, 'team', 'part-time', 'tirupati', 200, 'per-day', 'entry-level', '2025-09-06', 'ths is my discrption', '• Flexible working hours', 'open', 'starterwave', 3, 'per day'),
(22, 23, 'helper', 'part-time', 'Tirupati , Andhrapardesh', 200, 'per-day', 'entry-level', '2025-09-09', 'The maker should know  how to make the french fries and it should be perfect in that field and know how to make other type of snakes item', '• Flexible working hours', 'open', 'jastechcrop', 5, 'per-day'),
(23, 23, 'Teashop', 'part-time', 'Tirupati , Andhrapardesh', 200, 'per-day', 'entry-level', '2025-09-10', 'you should know well how to make tea', '• Free meals and snacks', 'open', 'jastechcrop', 2, 'per-day'),
(24, 23, 'frenchfries ', 'part-time', 'Renigunta', 400, 'per-day', 'entry-level', '2025-09-12', 'The maker should know  how to make the french fries and it should be perfect in that field and know how to make other type of snakes item', '• Free meals and snacks\n• Flexible working hours\n• Health insurance coverage\n• Remote work options', 'open', 'jastechcrop', 3, 'per-day'),
(25, 23, 'waffle maker', 'part-time', 'renigunta', 200, 'per-day', 'entry-level', '2025-09-12', 'The maker should know  how to make the french fries and it should be perfect in that field and know how to make other type of snakes item', '• Free meals and snacks', 'close', 'jastechcrop', 3, 'per-day'),
(26, 19, 'watchman', 'part-time', 'palasa', 100, 'per-day', 'entry-level', '2025-09-13', 'watch man should ne very carefull', '• Free meals and snacks', 'open', 'starterwave', 2, 'per-day'),
(27, 22, 'Fastfood maker', 'part-time', 'srikalasthi', 200, 'per-day', 'entry-level', '2025-09-16', 'the worker should know all type of fastfoods like gobi rice chicken rice and chicken snakes like burger chicken popcorn', '• Flexible working hours\n• Health insurance coverage\n• Free ', 'close', 'Jasstech', 3, 'per-day'),
(28, 22, 'blood collectoe', 'part-time', 'Tirupati', 100, 'per-day', 'entry-level', '2025-09-17', 'asdfghm the worker should know all type of fastfoods like gobi rice chicken rice and chicken snakes like burger chicken popcorn', '• Flexible working hours\n• Health insurance coverage\n• Free meals and snacks\n• Remote work options\n• Professional development opportunities\n• Paid time off\n• Performance bonuses', 'open', 'Jasstech', 4, 'per-day'),
(30, 23, 'teas', 'part-time', 'Tirupati', 233, 'per-day', 'entry-level', '2025-10-13', 'hsfhfcgvrtbjybdn;gcn bfydy', '• Flexible working hours\n• Free meals and snacks', 'open', 'jastechcrop', 2, 'per-day');

-- --------------------------------------------------------

--
-- Table structure for table `providers`
--

CREATE TABLE `providers` (
  `provider_id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `company_description` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `providers`
--

INSERT INTO `providers` (`provider_id`, `company_name`, `email`, `password`, `location`, `contact_number`, `company_description`, `created_at`) VALUES
(1, 'buddy', 'asma@gmal.com', '$2y$10$6SvvzMSNUD.aPgkAjuz/P.GEg127czddQvUKC5K0BGcHL1fUWNf92', 'nandyal', '8688543238', '', '2025-08-31 18:31:10'),
(2, 'Nani', 'k2482230@gmail.com', '$2y$10$KHUMaW4i4uav1Sd8lB2rg.SfS2G7jM5zXiYhvdugqC1lojYH6oCdG', 'karakambadi', '66304506106', '', '2025-09-01 09:51:39'),
(3, 'Wolswagen', 'mithin1617@gmail.com', '$2y$10$7fAa/OziKnNZONBSjbGAse7fDxzavq2JErDxzG/6ximtgU47tL1q.', 'karakambadi', '564234685412', '', '2025-09-01 15:27:58'),
(7, 'T3x', 'vyshnavinarala25@gmail.com', '$2y$10$eAAhsU5tDBBvv7xX9dSH7Of5mCFP6dXdrtg0GYE8HL8fNiTvbpGR2', 'tirupati', '8512318938', '', '2025-09-01 15:52:30'),
(8, 'Wolswagen', 'ravi@gmail.com', '$2y$10$5hc9EkEG8Fp6Vb5ri8iyD.CoOTuNnXJAr27uESj8oC0fI9YrAxgwC', 'tpt', '3521152153', '', '2025-09-01 16:01:29'),
(11, 'TechCrop', 'fdsfs@gmail.com', '$2y$10$51Kz2/xGJaCRzEed1fhtku3F3DmtYuBJonJw6hm/tBwSXhN/sa4w.', 'dsf', '54353', '', '2025-09-01 17:30:15'),
(15, 'Wolswagen', 'fgfd@gmail.com', '$2y$10$YRdXkckSzPJJrzbjKyn2OOVUFrOO6iJlwRPeRYDJBcBQtKEjtEYCW', 'gdf', '42342443534', '', '2025-09-01 17:54:33'),
(17, 'Wolswagen', 'dfdsnmm@gmail.com', '$2y$10$RbOzbT.MVc.3dewhJdc9OuxEc4OWWW8XfyaPLrbuz8hM0FlRG25iC', 'gdf', '42342443534', '', '2025-09-01 17:55:16'),
(18, 'T3x', 'jghjd@gmail.com', '$2y$10$CEXxfPtIy13gisS63gTPfuIZJWeA6imB3AAUtYHUFgnC1IbE5aImm', 'fsdf', '3521152153', '', '2025-09-01 17:55:46'),
(19, 'starterwave', 'starterwave25@gmail.com', '$2y$10$aJxZFqJKKhtBzEmi1Eq3Ne1H811v.oRZCRAnBs/74XNfFCaRsZHMu', 'tirupati', '0', '', '2025-09-02 10:23:04'),
(20, 'PET ', 'vennela@gmail.com', '$2y$10$GRUAHOvVXWEnd3PiJatcg.23fe9hdH4.kofbh4IhTpnobvjX94pjq', 'grfdc', '8512318938', '', '2025-09-02 19:46:08'),
(21, 'sdfg', 'error@gmail.com', '$2y$10$CHbfanrzhfn5ndH43zaF.OmpgbkuM6qBjGEdDVO95/xIGhJFbWJ52', 'dsfgh', '23456', '', '2025-09-05 10:19:12'),
(22, 'Jasstech', 'jasu5511246@gmail.com', '$2y$10$CxXDlxZUQWhmPGTldLQguOEem8mJx0UHgC.1apRdVrooJ6YLyBzI2', 'Tirupati', '7981629173', 'We are a leading technology company focused on innovation and excellence in software development.', '2025-09-07 12:03:43'),
(23, 'jastechcrop', 'abcd5511246@gmail.com', '$2y$10$4N1onDLkRDss7JWgEaxOw.ekkcEItJOqoiYe17tDmDr5nyfz.h21K', 'Tirupati , Andhrapardesh', '7981629173', 'MY company is to provider the all type of services', '2025-09-07 12:12:41'),
(24, 'sharuktech', 'sharuk12345678@gmail.com', '$2y$10$oDWChxVOH5bP6n3xE.gKqeY/0x71fU7Tv5artqHXq8eYYTh8ZU58u', 'Adoni', '1234567890', 'this is hightly professional company', '2025-09-14 16:31:05'),
(28, 'alpha', 'alpha1234567@gmail.com', '$2y$10$8oujYkHTJc7Z9IiOriQIfuwlDY3EAQLOfKNSQxAhCHoSv9HLRdOf6', 'Palasa', '123', 'This is my company', '2025-09-14 16:45:43'),
(33, 'alpha', 'alpha123456711@gmail.com', '$2y$10$MFE.6uLiq6n5meVWsuWbX.meT8Gz/kcMLes72FoK2UfAQd9byhgP.', 'Tirupati', '1234567890', 'this is my alpha', '2025-09-14 18:00:59');

-- --------------------------------------------------------

--
-- Table structure for table `reset_tokens`
--

CREATE TABLE `reset_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` enum('seeker','provider') NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `reset_token` varchar(64) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reset_tokens`
--

INSERT INTO `reset_tokens` (`id`, `user_id`, `user_type`, `email`, `otp`, `reset_token`, `expires_at`, `created_at`) VALUES
(1, 2, 'seeker', 'vyshnavinarala25@gmail.com', '259732', NULL, '2025-09-04 00:24:31', '2025-09-03 18:44:31'),
(2, 2, 'seeker', 'vyshnavinarala25@gmail.com', '992112', NULL, '2025-09-04 00:24:38', '2025-09-03 18:44:38'),
(3, 2, 'seeker', 'vyshnavinarala25@gmail.com', '908698', NULL, '2025-09-04 00:24:39', '2025-09-03 18:44:39'),
(4, 2, 'seeker', 'vyshnavinarala25@gmail.com', '832020', NULL, '2025-09-04 00:24:39', '2025-09-03 18:44:39'),
(5, 2, 'seeker', 'vyshnavinarala25@gmail.com', '548114', NULL, '2025-09-04 00:24:39', '2025-09-03 18:44:39'),
(6, 2, 'seeker', 'vyshnavinarala25@gmail.com', '891833', NULL, '2025-09-04 00:24:40', '2025-09-03 18:44:40'),
(7, 2, 'seeker', 'vyshnavinarala25@gmail.com', '617221', NULL, '2025-09-04 00:24:48', '2025-09-03 18:44:48'),
(8, 2, 'seeker', 'vyshnavinarala25@gmail.com', '788585', NULL, '2025-09-04 00:24:50', '2025-09-03 18:44:50'),
(9, 2, 'seeker', 'vyshnavinarala25@gmail.com', '393188', NULL, '2025-09-04 00:24:51', '2025-09-03 18:44:51'),
(10, 2, 'seeker', 'vyshnavinarala25@gmail.com', '435173', NULL, '2025-09-04 00:24:53', '2025-09-03 18:44:53'),
(11, 2, 'seeker', 'vyshnavinarala25@gmail.com', '498231', NULL, '2025-09-04 00:24:54', '2025-09-03 18:44:54'),
(12, 2, 'seeker', 'vyshnavinarala25@gmail.com', '996709', NULL, '2025-09-04 00:24:55', '2025-09-03 18:44:55'),
(13, 2, 'seeker', 'vyshnavinarala25@gmail.com', '636386', NULL, '2025-09-04 00:24:57', '2025-09-03 18:44:57'),
(14, 2, 'seeker', 'vyshnavinarala25@gmail.com', '793828', NULL, '2025-09-04 00:24:58', '2025-09-03 18:44:58'),
(15, 2, 'seeker', 'vyshnavinarala25@gmail.com', '454878', NULL, '2025-09-04 00:25:00', '2025-09-03 18:45:00'),
(16, 2, 'seeker', 'vyshnavinarala25@gmail.com', '452293', NULL, '2025-09-04 00:25:02', '2025-09-03 18:45:02'),
(17, 2, 'seeker', 'vyshnavinarala25@gmail.com', '813468', NULL, '2025-09-04 00:54:19', '2025-09-03 19:14:19'),
(18, 2, 'seeker', 'vyshnavinarala25@gmail.com', '973385', NULL, '2025-09-04 01:37:32', '2025-09-03 19:57:32'),
(19, 2, 'seeker', 'vyshnavinarala25@gmail.com', '743115', NULL, '2025-09-04 01:48:21', '2025-09-03 20:08:21'),
(20, 2, 'seeker', 'vyshnavinarala25@gmail.com', '169824', NULL, '2025-09-04 01:48:21', '2025-09-03 20:08:21'),
(23, 10, 'seeker', 'bhavanaendrathi@gmail.com', '840571', NULL, '2025-09-06 15:19:44', '2025-09-06 09:39:44'),
(24, 10, 'seeker', 'bhavanaendrathi@gmail.com', '492966', NULL, '2025-09-06 15:19:49', '2025-09-06 09:39:49'),
(25, 10, 'seeker', 'bhavanaendrathi@gmail.com', '547462', NULL, '2025-09-06 15:19:49', '2025-09-06 09:39:49'),
(26, 10, 'seeker', 'bhavanaendrathi@gmail.com', '948123', NULL, '2025-09-06 15:19:52', '2025-09-06 09:39:52'),
(27, 5, 'seeker', 'jasu5511246@gmail.com', '793235', NULL, '2025-09-14 01:37:38', '2025-09-13 19:57:38'),
(28, 5, 'seeker', 'jasu5511246@gmail.com', '576663', NULL, '2025-09-14 01:37:39', '2025-09-13 19:57:39'),
(29, 5, 'seeker', 'jasu5511246@gmail.com', '263003', NULL, '2025-09-14 01:37:49', '2025-09-13 19:57:49'),
(30, 5, 'seeker', 'jasu5511246@gmail.com', '502551', NULL, '2025-09-14 01:37:50', '2025-09-13 19:57:50'),
(31, 5, 'seeker', 'jasu5511246@gmail.com', '341524', NULL, '2025-09-14 01:37:51', '2025-09-13 19:57:51'),
(32, 5, 'seeker', 'jasu5511246@gmail.com', '851001', NULL, '2025-09-14 01:37:51', '2025-09-13 19:57:51'),
(33, 5, 'seeker', 'jasu5511246@gmail.com', '401273', NULL, '2025-09-14 01:37:51', '2025-09-13 19:57:51');

-- --------------------------------------------------------

--
-- Table structure for table `saved_jobs`
--

CREATE TABLE `saved_jobs` (
  `saved_id` int(11) NOT NULL,
  `seeker_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `job_title` varchar(35) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `saved_jobs`
--

INSERT INTO `saved_jobs` (`saved_id`, `seeker_id`, `job_id`, `job_title`) VALUES
(73, 5, 22, 'helper'),
(75, 16, 22, 'helper'),
(76, 5, 28, 'blood collectoe'),
(80, 11, 26, 'watchman'),
(84, 5, 30, 'teas');

-- --------------------------------------------------------

--
-- Table structure for table `seekers`
--

CREATE TABLE `seekers` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` bigint(10) NOT NULL,
  `age` int(5) NOT NULL,
  `skills` text NOT NULL,
  `location` varchar(100) NOT NULL,
  `about` varchar(500) NOT NULL,
  `education` varchar(200) NOT NULL,
  `availability` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `seekers`
--

INSERT INTO `seekers` (`id`, `name`, `email`, `password`, `phone`, `age`, `skills`, `location`, `about`, `education`, `availability`, `created_at`) VALUES
(1, 'bhavana', 'djbcskdjc@gmail.com', '$2y$10$AbyUJLwAYQgkTXbTTtvJi.81ERg8yN5TdT.gKuNjl2GlE0Y2TF/gG', 1234567890, 18, 'programming', 'Tirupati', '', '', '', '2025-09-01 05:52:21'),
(2, 'Vyshnavi Narala', 'vyshnavinarala25@gmail.com', '$2y$10$aYoSABQzHEHpWyRnN5gyTOcNTIdUkIlGl9ygwuIoXMzaLL77lY3wK', 2147483647, 18, 'programming', 'Tirupati', '', '', '', '2025-09-01 18:55:39'),
(3, 'Kanithi', 'ravi@gmail.com', '$2y$10$9sLmdORZRvHQ8H9zd9kaYOquHztUctkn4a/8GxI335t3gWXH6yAiG', 2147483647, 17, 'programming', 'Tirupati', '', '', '', '2025-09-02 06:52:55'),
(4, 'abcd', 'ebz@gmail.com', '$2y$10$BU1BRCcAqPZrjMgeukb2uOiwhWeDi4gAwkOYJiSkFhS78K4lZWp0i', 1234567890, 18, 'programming', 'Tirupati', '', '', '', '2025-09-02 10:20:05'),
(5, 'Jaswant', 'jasu5511246@gmail.com', '$2y$10$HaK963.bc7I/fDqyTpaBfenhL9GnhzCrx7A73WQtQxBdhCi/Oa/iK', 7981629173, 25, 'Bike repair, bike riding', 'Tirupati , Andhrapardesh', 'i am a good developer and i have completed my Btech from JNTUK \n                            \n                            \n                            ', 'Diploma of Computer Science , S.V.goverment polythechnic college , 2023-2026\nBtech , JNTUK , 2026-2029\n', 'immediate', '2025-09-02 10:29:23'),
(6, 'Vyshnavi Narala bmn', 'vyshnavinarala25@gmail.com', '$2y$10$iWIe0558Ij.UtRr6KR8y3esHnHYTqM4uEhCms5e6PyM.0669yLsKm', 2147483647, 18, 'programming', 'Tirupati', '', '', '', '2025-09-02 10:37:38'),
(7, 'Vyshnavi Narala bmn', 'vyshnavinarala25@gmail.com', '$2y$10$iWIe0558Ij.UtRr6KR8y3esHnHYTqM4uEhCms5e6PyM.0669yLsKm', 2147483647, 18, 'programming', 'Tirupati', '', '', '', '2025-09-02 10:38:04'),
(8, 'Vyshnavi Narala bmn', 'vyshnavinarala25@gmail.com', '$2y$10$iWIe0558Ij.UtRr6KR8y3esHnHYTqM4uEhCms5e6PyM.0669yLsKm', 2147483647, 18, 'programming', 'Tirupati', '', '', '', '2025-09-02 10:39:46'),
(9, 'PAGDIMANU MOUNIKA', 'pagidimanumounika@gmail.com', '$2y$10$Hn/e77ZSj7AExafxpHHEGuEh0sdsQ53lSDSl0cMw5.SVjvvKpdwbe', 2147483647, 17, 'running', 'Tirupati', '', '', '', '2025-09-02 16:55:33'),
(10, 'Bhavana', 'bhavanaendrathi@gmail.com', '$2y$10$IyvpBMlrvEFDHlhLCldUQugzOHr3n.Y2q6SNdsOXVgn4zcMfY46jO', 2147483647, 18, 'programming', 'Tirupati', '', '', '', '2025-09-06 09:38:21'),
(11, 'Jaswant Karri', 'abcd5511246@gmail.com', '$2y$10$TK7teU04pZEnrYiO.9DL/OAhK2Zc3Y9RjKbRwKPFRjMgsN5hoP4HW', 7981629173, 18, 'mechanic work', 'Tirupati', 'i am jaswant karri i have completed my diploma in computer science                    \n                            \n                            \n                            \n                            \n                            ', 'Diploma in computer science , svgp , 2026-2029\nBtech , JNTUK , 2026-2029\nMtech , IITBombay , 2029-2031\n', 'immediate', '2025-09-09 10:19:44'),
(18, 'abhi', 'abhi12345678@gmail.com', '$2y$10$6oRGpZ4g2OpLbCyAAa0PiODSS4ZFqTXtjwny7vKgRNYPzl5HhLg6K', 7981629173, 25, '', 'Palasa', '', '', '', '2025-10-12 05:39:12');

-- --------------------------------------------------------

--
-- Table structure for table `shortlisted`
--

CREATE TABLE `shortlisted` (
  `shortlist_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `seeker_id` int(11) NOT NULL,
  `shortlisted_time` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shortlisted`
--

INSERT INTO `shortlisted` (`shortlist_id`, `job_id`, `provider_id`, `seeker_id`, `shortlisted_time`) VALUES
(8, 24, 23, 5, '2025-10-14'),
(9, 24, 23, 18, '2025-10-14'),
(10, 22, 23, 18, '2025-10-14'),
(12, 24, 23, 11, '2025-10-18'),
(13, 30, 23, 5, '2025-10-18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applied_job`
--
ALTER TABLE `applied_job`
  ADD PRIMARY KEY (`applied_jobid`);

--
-- Indexes for table `hired`
--
ALTER TABLE `hired`
  ADD PRIMARY KEY (`hired_id`);

--
-- Indexes for table `posted_jobs`
--
ALTER TABLE `posted_jobs`
  ADD PRIMARY KEY (`job_id`);

--
-- Indexes for table `providers`
--
ALTER TABLE `providers`
  ADD PRIMARY KEY (`provider_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `reset_tokens`
--
ALTER TABLE `reset_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD PRIMARY KEY (`saved_id`);

--
-- Indexes for table `seekers`
--
ALTER TABLE `seekers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shortlisted`
--
ALTER TABLE `shortlisted`
  ADD PRIMARY KEY (`shortlist_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applied_job`
--
ALTER TABLE `applied_job`
  MODIFY `applied_jobid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `hired`
--
ALTER TABLE `hired`
  MODIFY `hired_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `posted_jobs`
--
ALTER TABLE `posted_jobs`
  MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `providers`
--
ALTER TABLE `providers`
  MODIFY `provider_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `reset_tokens`
--
ALTER TABLE `reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  MODIFY `saved_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `seekers`
--
ALTER TABLE `seekers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `shortlisted`
--
ALTER TABLE `shortlisted`
  MODIFY `shortlist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- Database: `phpmyadmin`
--
CREATE DATABASE IF NOT EXISTS `phpmyadmin` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `phpmyadmin`;

-- --------------------------------------------------------

--
-- Table structure for table `pma__bookmark`
--

CREATE TABLE `pma__bookmark` (
  `id` int(10) UNSIGNED NOT NULL,
  `dbase` varchar(255) NOT NULL DEFAULT '',
  `user` varchar(255) NOT NULL DEFAULT '',
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `query` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Bookmarks';

-- --------------------------------------------------------

--
-- Table structure for table `pma__central_columns`
--

CREATE TABLE `pma__central_columns` (
  `db_name` varchar(64) NOT NULL,
  `col_name` varchar(64) NOT NULL,
  `col_type` varchar(64) NOT NULL,
  `col_length` text DEFAULT NULL,
  `col_collation` varchar(64) NOT NULL,
  `col_isNull` tinyint(1) NOT NULL,
  `col_extra` varchar(255) DEFAULT '',
  `col_default` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Central list of columns';

-- --------------------------------------------------------

--
-- Table structure for table `pma__column_info`
--

CREATE TABLE `pma__column_info` (
  `id` int(5) UNSIGNED NOT NULL,
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `column_name` varchar(64) NOT NULL DEFAULT '',
  `comment` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `mimetype` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `transformation` varchar(255) NOT NULL DEFAULT '',
  `transformation_options` varchar(255) NOT NULL DEFAULT '',
  `input_transformation` varchar(255) NOT NULL DEFAULT '',
  `input_transformation_options` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Column information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__designer_settings`
--

CREATE TABLE `pma__designer_settings` (
  `username` varchar(64) NOT NULL,
  `settings_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Settings related to Designer';

-- --------------------------------------------------------

--
-- Table structure for table `pma__export_templates`
--

CREATE TABLE `pma__export_templates` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL,
  `export_type` varchar(10) NOT NULL,
  `template_name` varchar(64) NOT NULL,
  `template_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved export templates';

-- --------------------------------------------------------

--
-- Table structure for table `pma__favorite`
--

CREATE TABLE `pma__favorite` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Favorite tables';

-- --------------------------------------------------------

--
-- Table structure for table `pma__history`
--

CREATE TABLE `pma__history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db` varchar(64) NOT NULL DEFAULT '',
  `table` varchar(64) NOT NULL DEFAULT '',
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp(),
  `sqlquery` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='SQL history for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__navigationhiding`
--

CREATE TABLE `pma__navigationhiding` (
  `username` varchar(64) NOT NULL,
  `item_name` varchar(64) NOT NULL,
  `item_type` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Hidden items of navigation tree';

-- --------------------------------------------------------

--
-- Table structure for table `pma__pdf_pages`
--

CREATE TABLE `pma__pdf_pages` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `page_nr` int(10) UNSIGNED NOT NULL,
  `page_descr` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='PDF relation pages for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__recent`
--

CREATE TABLE `pma__recent` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Recently accessed tables';

--
-- Dumping data for table `pma__recent`
--

INSERT INTO `pma__recent` (`username`, `tables`) VALUES
('root', '[{\"db\":\"partconnectdb\",\"table\":\"posted_jobs\"},{\"db\":\"partconnectdb\",\"table\":\"saved_jobs\"},{\"db\":\"partconnectdb\",\"table\":\"providers\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `pma__relation`
--

CREATE TABLE `pma__relation` (
  `master_db` varchar(64) NOT NULL DEFAULT '',
  `master_table` varchar(64) NOT NULL DEFAULT '',
  `master_field` varchar(64) NOT NULL DEFAULT '',
  `foreign_db` varchar(64) NOT NULL DEFAULT '',
  `foreign_table` varchar(64) NOT NULL DEFAULT '',
  `foreign_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Relation table';

-- --------------------------------------------------------

--
-- Table structure for table `pma__savedsearches`
--

CREATE TABLE `pma__savedsearches` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `search_name` varchar(64) NOT NULL DEFAULT '',
  `search_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved searches';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_coords`
--

CREATE TABLE `pma__table_coords` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `pdf_page_number` int(11) NOT NULL DEFAULT 0,
  `x` float UNSIGNED NOT NULL DEFAULT 0,
  `y` float UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table coordinates for phpMyAdmin PDF output';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_info`
--

CREATE TABLE `pma__table_info` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `display_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_uiprefs`
--

CREATE TABLE `pma__table_uiprefs` (
  `username` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `prefs` text NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Tables'' UI preferences';

-- --------------------------------------------------------

--
-- Table structure for table `pma__tracking`
--

CREATE TABLE `pma__tracking` (
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `version` int(10) UNSIGNED NOT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `schema_snapshot` text NOT NULL,
  `schema_sql` text DEFAULT NULL,
  `data_sql` longtext DEFAULT NULL,
  `tracking` set('UPDATE','REPLACE','INSERT','DELETE','TRUNCATE','CREATE DATABASE','ALTER DATABASE','DROP DATABASE','CREATE TABLE','ALTER TABLE','RENAME TABLE','DROP TABLE','CREATE INDEX','DROP INDEX','CREATE VIEW','ALTER VIEW','DROP VIEW') DEFAULT NULL,
  `tracking_active` int(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Database changes tracking for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__userconfig`
--

CREATE TABLE `pma__userconfig` (
  `username` varchar(64) NOT NULL,
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `config_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User preferences storage for phpMyAdmin';

--
-- Dumping data for table `pma__userconfig`
--

INSERT INTO `pma__userconfig` (`username`, `timevalue`, `config_data`) VALUES
('root', '2025-09-12 03:07:49', '{\"Console\\/Mode\":\"collapse\"}');

-- --------------------------------------------------------

--
-- Table structure for table `pma__usergroups`
--

CREATE TABLE `pma__usergroups` (
  `usergroup` varchar(64) NOT NULL,
  `tab` varchar(64) NOT NULL,
  `allowed` enum('Y','N') NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User groups with configured menu items';

-- --------------------------------------------------------

--
-- Table structure for table `pma__users`
--

CREATE TABLE `pma__users` (
  `username` varchar(64) NOT NULL,
  `usergroup` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Users and their assignments to user groups';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pma__central_columns`
--
ALTER TABLE `pma__central_columns`
  ADD PRIMARY KEY (`db_name`,`col_name`);

--
-- Indexes for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `db_name` (`db_name`,`table_name`,`column_name`);

--
-- Indexes for table `pma__designer_settings`
--
ALTER TABLE `pma__designer_settings`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_user_type_template` (`username`,`export_type`,`template_name`);

--
-- Indexes for table `pma__favorite`
--
ALTER TABLE `pma__favorite`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__history`
--
ALTER TABLE `pma__history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`,`db`,`table`,`timevalue`);

--
-- Indexes for table `pma__navigationhiding`
--
ALTER TABLE `pma__navigationhiding`
  ADD PRIMARY KEY (`username`,`item_name`,`item_type`,`db_name`,`table_name`);

--
-- Indexes for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  ADD PRIMARY KEY (`page_nr`),
  ADD KEY `db_name` (`db_name`);

--
-- Indexes for table `pma__recent`
--
ALTER TABLE `pma__recent`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__relation`
--
ALTER TABLE `pma__relation`
  ADD PRIMARY KEY (`master_db`,`master_table`,`master_field`),
  ADD KEY `foreign_field` (`foreign_db`,`foreign_table`);

--
-- Indexes for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_savedsearches_username_dbname` (`username`,`db_name`,`search_name`);

--
-- Indexes for table `pma__table_coords`
--
ALTER TABLE `pma__table_coords`
  ADD PRIMARY KEY (`db_name`,`table_name`,`pdf_page_number`);

--
-- Indexes for table `pma__table_info`
--
ALTER TABLE `pma__table_info`
  ADD PRIMARY KEY (`db_name`,`table_name`);

--
-- Indexes for table `pma__table_uiprefs`
--
ALTER TABLE `pma__table_uiprefs`
  ADD PRIMARY KEY (`username`,`db_name`,`table_name`);

--
-- Indexes for table `pma__tracking`
--
ALTER TABLE `pma__tracking`
  ADD PRIMARY KEY (`db_name`,`table_name`,`version`);

--
-- Indexes for table `pma__userconfig`
--
ALTER TABLE `pma__userconfig`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__usergroups`
--
ALTER TABLE `pma__usergroups`
  ADD PRIMARY KEY (`usergroup`,`tab`,`allowed`);

--
-- Indexes for table `pma__users`
--
ALTER TABLE `pma__users`
  ADD PRIMARY KEY (`username`,`usergroup`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__history`
--
ALTER TABLE `pma__history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  MODIFY `page_nr` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Database: `quizai`
--
CREATE DATABASE IF NOT EXISTS `quizai` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `quizai`;

-- --------------------------------------------------------

--
-- Table structure for table `chapters`
--

CREATE TABLE `chapters` (
  `id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `order_index` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chapters`
--

INSERT INTO `chapters` (`id`, `subject_id`, `title`, `order_index`) VALUES
(1, 1, 'Principles of Management', 1),
(2, 1, 'Organization Structure & Organizational Behaviour', 2),
(3, 1, 'Production Management', 3),
(4, 1, 'Engineering Ethics & Safety and Labour Codes', 4),
(5, 1, 'Entrepreneurship & Start-ups', 5),
(6, 2, 'Over View of Data Mining', 1),
(7, 2, 'Over View Of Data Ware Housing', 2),
(8, 2, 'Introduction to Big Data', 3),
(9, 2, 'Big Data Analytics', 4),
(10, 2, 'Cloud Computing', 5),
(11, 3, 'Android Basics and Anatomy', 1),
(12, 3, 'Components, Activity Life Cycle, Intents', 2),
(13, 3, 'Android – User Interface', 3),
(14, 3, 'Android Advanced Concepts', 4),
(15, 3, 'Data Base connectivity in Android', 5),
(16, 4, 'Introduction of IOT', 1),
(17, 4, 'Data Protocols', 2),
(18, 4, 'Communication Technologies', 3),
(19, 4, 'Wireless Sensor Networks', 4),
(20, 4, 'Role Of IOT', 5),
(21, 5, 'Introduction to Python Programming', 1),
(22, 5, 'Control Flow and Loops', 2),
(23, 5, 'Functions and Arrays', 3),
(24, 5, 'Data Structures', 4),
(25, 5, 'Object Oriented Programming in Python and File Handling and Exception Handling', 5);

-- --------------------------------------------------------

--
-- Table structure for table `daily_attempts`
--

CREATE TABLE `daily_attempts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `attempts` int(11) NOT NULL DEFAULT 0,
  `streak_awarded` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard`
--

CREATE TABLE `leaderboard` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_score` int(11) DEFAULT 0,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `topic_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `option_a` varchar(255) NOT NULL,
  `option_b` varchar(255) NOT NULL,
  `option_c` varchar(255) NOT NULL,
  `option_d` varchar(255) NOT NULL,
  `correct_option` enum('option_a','option_b','option_c','option_d') NOT NULL,
  `explanation` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `topic_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `explanation`, `created_at`) VALUES
(1, 1, 'What is the primary purpose of controlling in management?', 'To plan and organize work', 'To lead and motivate employees', 'To monitor and correct performance', 'To staff and train employees', 'option_c', 'Controlling is the process of monitoring and correcting performance to ensure that it is in line with the organization\'s goals and objectives.', '2025-09-15 16:19:01'),
(2, 1, 'Which of the following is a characteristic of an effective control system?', 'It is rigid and inflexible', 'It is based on historical data', 'It provides timely and accurate feedback', 'It is focused on punishing errors', 'option_c', 'An effective control system provides timely and accurate feedback to managers, enabling them to take corrective action promptly.', '2025-09-15 16:19:03'),
(3, 1, 'What is the difference between a preventive control and a corrective control?', 'A preventive control prevents errors from occurring, while a corrective control corrects errors after they have occurred', 'A preventive control corrects errors after they have occurred, while a corrective control prevents errors from occurring', 'A preventive control is used for minor errors, while a corrective control is used for major errors', 'A preventive control is used for major errors, while a corrective control is used for minor errors', 'option_a', 'A preventive control is designed to prevent errors from occurring in the first place, while a corrective control is used to correct errors after they have occurred.', '2025-09-15 16:19:05'),
(4, 1, 'Which of the following control techniques is used to measure performance against predetermined standards?', 'Budgetary control', 'Standard cost accounting', 'Break-even analysis', 'Variance analysis', 'option_d', 'Variance analysis is a control technique used to measure performance against predetermined standards by analyzing the difference between actual and standard costs or quantities.', '2025-09-15 16:19:07'),
(5, 1, 'What is the purpose of a control chart?', 'To display data in a graphical format', 'To identify trends and patterns in data', 'To monitor and control processes', 'To predict future outcomes', 'option_c', 'A control chart is a graphical tool used to monitor and control processes by displaying the performance of a process over time and identifying any deviations from the norm.', '2025-09-15 16:19:10'),
(6, 1, 'Which of the following is a limitation of using historical data for control purposes?', 'It is not relevant to current performance', 'It is not accurate or reliable', 'It is not timely or up-to-date', 'All of the above', 'option_d', 'Historical data has several limitations, including not being relevant to current performance, not being accurate or reliable, and not being timely or up-to-date.', '2025-09-15 16:19:12'),
(7, 1, 'What is the difference between a feedback control and a feedforward control?', 'A feedback control uses historical data, while a feedforward control uses real-time data', 'A feedback control uses real-time data, while a feedforward control uses historical data', 'A feedback control is used to correct errors after they have occurred, while a feedforward control is used to prevent errors from occurring', 'A feedback control is used to prevent errors from occurring, while a feedforward control is used to correct errors after they have occurred', 'option_c', 'A feedback control is used to correct errors after they have occurred, while a feedforward control is used to prevent errors from occurring by anticipating and taking corrective action before the error occurs.', '2025-09-15 16:19:14'),
(8, 1, 'Which of the following control systems is used to regulate and control the production process?', 'Management by Objectives (MBO)', 'Management by Exception (MBE)', 'Just-in-Time (JIT) production', 'Total Quality Management (TQM)', 'option_c', 'Just-in-Time (JIT) production is a control system used to regulate and control the production process by producing and delivering products just in time to meet customer demand.', '2025-09-15 16:19:16'),
(9, 1, 'What is the purpose of a balanced scorecard?', 'To provide a comprehensive view of an organization\'s performance', 'To identify areas for improvement', 'To set goals and objectives', 'To evaluate employee performance', 'option_a', 'A balanced scorecard is a performance measurement system that provides a comprehensive view of an organization\'s performance by measuring four perspectives: financial, customer, internal processes, and learning and growth.', '2025-09-15 16:19:18'),
(10, 1, 'Which of the following is a benefit of using a computer-based control system?', 'It reduces the need for human judgment and decision-making', 'It increases the accuracy and speed of data processing', 'It improves communication and collaboration among employees', 'It reduces the risk of errors and exceptions', 'option_b', 'A computer-based control system can increase the accuracy and speed of data processing, enabling managers to make more informed decisions and respond quickly to changes in the organization\'s performance.', '2025-09-15 16:19:20'),
(11, 2, 'What is the first step in the decision-making process?', 'Identify the problem', 'Gather information', 'Evaluate alternatives', 'Select the best alternative', 'option_a', 'The first step in the decision-making process is to identify the problem or opportunity. This involves recognizing a need or a challenge and defining it clearly.', '2025-09-15 16:19:22'),
(12, 2, 'Which of the following is a characteristic of a good decision?', 'It is based on intuition', 'It is made quickly', 'It is based on relevant information', 'It is made by a single person', 'option_c', 'A good decision is one that is based on relevant information. This means that the decision-maker has gathered and analyzed all the necessary data before making a choice.', '2025-09-15 16:19:24'),
(13, 2, 'What is the purpose of evaluating alternatives in the decision-making process?', 'To select the best alternative', 'To identify the problem', 'To gather information', 'To determine the feasibility of each option', 'option_d', 'Evaluating alternatives involves assessing the pros and cons of each option. This helps the decision-maker to determine which alternative is the most feasible and effective.', '2025-09-15 16:19:26'),
(14, 2, 'Which of the following is a type of decision-making approach?', 'Rational approach', 'Intuitive approach', 'Behavioral approach', 'All of the above', 'option_d', 'There are several types of decision-making approaches, including the rational approach, intuitive approach, and behavioral approach. Each approach has its own strengths and weaknesses.', '2025-09-15 16:19:28'),
(15, 2, 'What is the role of feedback in the decision-making process?', 'To evaluate the effectiveness of the decision', 'To identify the problem', 'To gather information', 'To select the best alternative', 'option_a', 'Feedback is an essential part of the decision-making process. It helps the decision-maker to evaluate the effectiveness of the decision and make any necessary adjustments.', '2025-09-15 16:19:30'),
(16, 2, 'Which of the following is a constraint that can affect the decision-making process?', 'Time', 'Resources', 'Information', 'All of the above', 'option_d', 'There are several constraints that can affect the decision-making process, including time, resources, and information. These constraints can limit the options available to the decision-maker and impact the quality of the decision.', '2025-09-15 16:19:32'),
(17, 2, 'What is the difference between a programmed and non-programmed decision?', 'A programmed decision is routine and repetitive, while a non-programmed decision is unique and complex', 'A programmed decision is unique and complex, while a non-programmed decision is routine and repetitive', 'A programmed decision is made by a single person, while a non-programmed decision is made by a group', 'A programmed decision is based on intuition, while a non-programmed decision is based on analysis', 'option_a', 'A programmed decision is a routine and repetitive decision that is made using a standard procedure. A non-programmed decision, on the other hand, is a unique and complex decision that requires a custom approach.', '2025-09-15 16:19:34'),
(18, 2, 'Which of the following is a type of decision-making bias?', 'Confirmation bias', 'Anchoring bias', 'Availability bias', 'All of the above', 'option_d', 'There are several types of decision-making biases, including confirmation bias, anchoring bias, and availability bias. These biases can impact the quality of the decision by leading the decision-maker to rely on incomplete or inaccurate information.', '2025-09-15 16:19:36'),
(19, 2, 'What is the purpose of sensitivity analysis in the decision-making process?', 'To evaluate the effectiveness of the decision', 'To identify the problem', 'To gather information', 'To test the robustness of the decision', 'option_d', 'Sensitivity analysis involves testing the robustness of the decision by analyzing how it would be affected by changes in the underlying assumptions or variables. This helps the decision-maker to identify the key drivers of the decision and to develop a more robust solution.', '2025-09-15 16:19:38'),
(20, 2, 'Which of the following is a benefit of using a decision-making framework?', 'It provides a structured approach to decision-making', 'It reduces the risk of bias and error', 'It increases the speed of the decision-making process', 'All of the above', 'option_d', 'A decision-making framework provides a structured approach to decision-making, reduces the risk of bias and error, and increases the speed of the decision-making process. It also helps to ensure that all relevant factors are considered and that the decision is based on the best available information.', '2025-09-15 16:19:40'),
(21, 3, 'Which of the following is considered the primary goal of management?', 'Maximizing shareholder wealth', 'Achieving organizational objectives effectively and efficiently', 'Minimizing production costs', 'Ensuring employee satisfaction', 'option_b', 'The core purpose of management is to guide an organization towards its goals using resources optimally, balancing effectiveness (achieving goals) and efficiency (using resources wisely).', '2025-09-15 16:19:42'),
(22, 3, 'The process of management involves a series of interrelated functions. Which of these is NOT typically considered a core management function?', 'Planning', 'Organizing', 'Research & Development', 'Controlling', 'option_c', 'Planning, Organizing, Staffing, Directing (Leading), and Controlling are generally accepted as the five primary functions of management. Research & Development is a functional area, not a core management process function.', '2025-09-15 16:19:44'),
(23, 3, 'Management is often described as a universal process. What does this mean?', 'It applies only to large multinational corporations.', 'Its principles are applicable to all types of organizations, regardless of size or nature.', 'It is exclusively practiced in Western countries.', 'It only involves managing human resources.', 'option_b', 'The universality of management implies that its principles and practices are applicable across all types of organizations, be it business, government, or non-profit, and at all levels.', '2025-09-15 16:19:46'),
(24, 3, 'The statement \"Management is both an art and a science\" implies that:', 'It relies solely on intuition and personal skill.', 'It uses systematic knowledge and principles, combined with practical application and creative judgment.', 'It is exclusively about theoretical frameworks.', 'It requires only scientific expertise and no practical experience.', 'option_b', 'Management as a science incorporates principles and theories, while as an art, it involves the skillful, creative, and practical application of these principles in diverse situations.', '2025-09-15 16:19:48'),
(25, 3, 'In the context of management, \'efficiency\' primarily refers to:', 'Doing the right things.', 'Achieving organizational goals.', 'Doing things right, i.e., optimizing resource utilization.', 'Making ethical decisions.', 'option_c', 'Efficiency means using minimum resources to achieve objectives (doing things right), while effectiveness means achieving the stated objectives (doing the right things).', '2025-09-15 16:19:50'),
(26, 3, 'Which level of management is primarily concerned with formulating overall organizational goals and strategies?', 'Supervisory Management', 'Middle Management', 'Operational Management', 'Top Management', 'option_d', 'Top management (e.g., CEO, Board of Directors) is responsible for setting the long-term vision, mission, and strategic goals for the entire organization.', '2025-09-15 16:19:52'),
(27, 3, 'The scope of management extends to various functional areas within an organization. Which of the following is NOT typically considered a primary functional area of management?', 'Marketing Management', 'Financial Management', 'Production Management', 'Legal Compliance Management', 'option_d', 'While important, legal compliance is generally an aspect integrated into various functional areas or a support function, not a primary functional area of management like Marketing, Finance, HR, or Production.', '2025-09-15 16:19:54'),
(28, 3, 'According to Robert Katz, which managerial skill becomes less critical as a manager moves from lower to higher levels in the organizational hierarchy?', 'Conceptual Skills', 'Human Skills', 'Technical Skills', 'Communication Skills', 'option_c', 'Technical skills are most crucial for lower-level managers (supervisors) and become less critical for top managers, who rely more on conceptual and human skills for strategic thinking.', '2025-09-15 16:19:56'),
(29, 3, 'The debate concerning whether management is administration or a distinct activity often revolves around:', 'The nature of planning involved (strategic vs. operational).', 'The application of scientific principles versus artistic discretion.', 'The distinction between policy formulation (administration) and policy execution (management).', 'The focus on internal versus external stakeholders.', 'option_c', 'A classic view differentiates administration as concerning policy formulation and goal setting, while management focuses on implementing those policies to achieve objectives. Others view them as overlapping.', '2025-09-15 16:19:58'),
(30, 3, 'Which characteristic of management most strongly supports its claim as a \'profession\'?', 'Existence of a code of conduct.', 'Universality of application.', 'Focus on profit maximization.', 'Requirement for basic literacy.', 'option_a', 'For management to be considered a profession, it typically requires characteristics like a body of specialized knowledge, formal education, a representative professional association, and a code of conduct or ethics.', '2025-09-15 16:20:00'),
(31, 3, 'A manager\'s ability to think abstractly, analyze complex situations, and develop innovative solutions falls under which category of managerial skills?', 'Interpersonal Skills', 'Technical Skills', 'Conceptual Skills', 'Diagnostic Skills', 'option_c', 'Conceptual skills involve the mental ability to analyze and diagnose complex situations, understand the organization as a whole, and its relation to the external environment for strategic decision-making.', '2025-09-15 16:20:02'),
(32, 3, 'In the context of the scope of management, \'social responsibility\' primarily implies:', 'Focusing solely on maximizing profits for shareholders.', 'Adhering strictly to legal regulations.', 'Considering the impact of organizational decisions on society and the environment.', 'Providing maximum benefits to employees only.', 'option_c', 'Social responsibility within management\'s scope refers to an organization\'s ethical obligation to act in a way that benefits society, beyond just legal and economic requirements.', '2025-09-15 16:20:04'),
(33, 3, 'Effective coordination across different departments is crucial for achieving organizational goals. From a management perspective, this is primarily a function of:', 'Delegation of authority', 'Centralization of decision-making', 'Integration of various activities and resources', 'Strict adherence to individual department targets', 'option_c', 'Coordination is the process of integrating the activities of different departments and individuals to ensure that all efforts are aligned towards achieving common organizational objectives effectively.', '2025-09-15 16:20:06'),
(34, 3, 'Who among the following is widely recognized for identifying planning, organizing, commanding, coordinating, and controlling as the five functions of management?', 'Frederick Winslow Taylor', 'Max Weber', 'Henri Fayol', 'Peter Drucker', 'option_c', 'Henri Fayol is famous for his 14 Principles of Management and for defining the five primary functions of management: Planning, Organizing, Commanding, Coordinating, and Controlling.', '2025-09-15 16:20:08'),
(35, 3, 'The primary challenge in defining the exact \'scope\' of management lies in its:', 'Static nature and predictable environment.', 'Highly specialized and narrow functional applications.', 'Dynamic, pervasive, and interdisciplinary nature.', 'Exclusive focus on internal organizational processes.', 'option_c', 'The scope of management is broad because it is dynamic (constantly evolving), pervasive (applies everywhere), and interdisciplinary (draws from many fields), making it hard to confine to rigid boundaries.', '2025-09-15 16:20:10'),
(36, 4, 'What is a primary characteristic of globalization in the context of business?', 'Increased localization of production', 'Decreased interdependence among national economies', 'Integration of economies and societies worldwide', 'Stricter national trade barriers', 'option_c', 'Globalization involves the increasing integration and interdependence of economies, cultures, and societies across the world, leading to a more interconnected global market.', '2025-09-15 16:20:12'),
(37, 4, 'Which of the following best describes a multinational corporation (MNC)?', 'A company that exports goods to a single foreign country.', 'A company that operates in its home country and one foreign subsidiary.', 'A company that maintains significant operations in multiple countries simultaneously.', 'A company that focuses solely on domestic market expansion.', 'option_c', 'MNCs are characterized by their extensive operations, including production, marketing, and R&D, across several countries, not just exporting or having a single foreign presence.', '2025-09-15 16:20:15'),
(38, 4, 'Hofstede\'s cultural dimensions provide a framework for understanding cultural differences in global management. Which dimension primarily addresses the degree to which a society accepts unequal distribution of power?', 'Individualism vs. Collectivism', 'Uncertainty Avoidance', 'Power Distance', 'Masculinity vs. Femininity', 'option_c', 'Power Distance measures the extent to which less powerful members of organizations and institutions accept and expect that power is distributed unequally. High power distance cultures show deference to authority.', '2025-09-15 16:20:17'),
(39, 4, 'A manager adopting a \'transnational strategy\' for their global operations would primarily focus on:', 'Centralizing all decision-making at the home office.', 'Tailoring products and marketing to specific local markets independently.', 'Achieving both global efficiency and local responsiveness simultaneously.', 'Exporting standardized products with minimal local adaptation.', 'option_c', 'A transnational strategy aims to achieve high global efficiency and high local responsiveness, integrating operations worldwide while also adapting to local needs.', '2025-09-15 16:20:19'),
(40, 4, 'What is a common challenge for managers operating in a globalized environment regarding workforce management?', 'Decreased need for diversity training', 'Simplified legal and regulatory compliance', 'Managing cultural differences and language barriers', 'Reduced competition for talent', 'option_c', 'Cultural differences, language barriers, and varying work ethics pose significant challenges for managers in globalized settings, requiring adaptability and cultural sensitivity.', '2025-09-15 16:20:21'),
(41, 4, 'The \"liability of foreignness\" concept in international business refers to the inherent disadvantages that foreign firms experience in host countries relative to local firms. Which of the following is *least likely* to be a source of this liability?', 'Unfamiliarity with local customer preferences.', 'Higher administrative costs due to geographical distance.', 'Lack of established relationships with local suppliers.', 'Access to advanced technological capabilities from the home country.', 'option_d', 'Access to advanced technology is often an advantage, not a liability, for foreign firms. The other options represent common disadvantages stemming from being an outsider in a new market.', '2025-09-15 16:20:23'),
(42, 4, 'Which ethical consideration becomes more complex for managers in a global context compared to purely domestic operations?', 'Employee motivation', 'Local tax regulations', 'Varying labor laws and human rights standards', 'Product quality control', 'option_c', 'While all options have global implications, differing labor laws, wage standards, and human rights expectations across countries create significant ethical dilemmas for global managers regarding fair treatment of workers.', '2025-09-15 16:20:25'),
(43, 4, 'What role does technology primarily play in facilitating globalization for businesses?', 'Increasing the need for physical proximity of teams.', 'Hindering international communication.', 'Enabling faster communication and easier global coordination.', 'Limiting access to international markets.', 'option_c', 'Technology, especially communication and information technology, is a key enabler of globalization, allowing businesses to coordinate operations and communicate instantly across vast distances.', '2025-09-15 16:20:27'),
(44, 4, 'A company pursuing a \'global strategy\' would typically prioritize:', 'Extensive customization of products for each national market.', 'Standardization of products and marketing worldwide to achieve economies of scale.', 'Decentralized decision-making to local subsidiaries.', 'Focusing on niche markets with specialized local offerings.', 'option_b', 'A global strategy emphasizes standardization across markets to achieve cost advantages through economies of scale, often with centralized control, making it less responsive to local differences.', '2025-09-15 16:20:29'),
(45, 4, 'The rise of global supply chains has significantly increased the complexity of operations management due to:', 'Reduced reliance on a single source of raw materials.', 'Decreased transportation costs and logistics challenges.', 'Exposure to diverse political, economic, and natural risks across multiple countries.', 'Simplified inventory management processes.', 'option_c', 'Global supply chains, while offering efficiency, introduce complexities through exposure to varied political instabilities, economic fluctuations, natural disasters, and regulatory differences in each country involved.', '2025-09-15 16:20:31'),
(46, 4, 'Which of the following best exemplifies the concept of \"glocalization\"?', 'A car manufacturer selling the exact same model globally.', 'A fast-food chain offering a standardized menu worldwide.', 'A coffee shop chain offering its core products while introducing local food items and flavors specific to a region.', 'A clothing brand outsourcing all production to a low-cost country.', 'option_c', 'Glocalization is the practice of conducting business globally and simultaneously adapting products or services for local markets. The coffee shop example shows both global brand presence and local adaptation.', '2025-09-15 16:20:33'),
(47, 4, 'Consider a multinational corporation facing criticism for its labor practices in a developing country, where local laws allow for longer working hours than its home country. This scenario highlights the ethical dilemma associated with:', 'Power distance', 'Cultural relativism vs. ethical universalism', 'Uncertainty avoidance', 'Masculinity vs. femininity', 'option_b', 'This situation directly addresses the conflict between adopting local ethical norms (cultural relativism) versus adhering to universally accepted ethical principles (ethical universalism) when operating globally.', '2025-09-15 16:20:35'),
(48, 5, 'What is the primary objective of fostering innovation within an industrial enterprise?', 'To gain a competitive advantage and improve efficiency', 'To maintain the status quo and reduce operational costs', 'To strictly adhere to established procedures and regulations', 'To decrease production volume and market presence', 'option_a', 'Innovation aims to create new value, improve existing offerings, or develop novel processes, ultimately enhancing competitiveness and efficiency.', '2025-09-15 16:20:37'),
(49, 5, 'Which of the following is generally NOT considered a distinct category of innovation in business management?', 'Product Innovation', 'Process Innovation', 'Organizational Innovation', 'Disruptive Innovation', 'option_d', 'Product, process, marketing, and organizational innovations are recognized categories. Disruptive innovation is a concept related to the impact of innovation, not a primary category itself.', '2025-09-15 16:20:39'),
(50, 5, 'Which of the following is a common driver for organizations to initiate change management processes?', 'To decrease product quality', 'To reduce employee engagement', 'To adapt to market shifts or technological advancements', 'To limit the scope of business operations', 'option_c', 'Market demands, technological advancements, competitive pressures, and internal inefficiencies are all common drivers compelling organizations to undertake change initiatives.', '2025-09-15 16:20:41'),
(51, 5, 'According to Kurt Lewin\'s three-step model of change, what is the initial phase that involves preparing the organization for the change?', 'Unfreezing', 'Changing', 'Refreezing', 'Implementing', 'option_a', 'Lewin\'s model simplifies change into three phases: Unfreezing (preparing for change), Changing (implementing the change), and Refreezing (stabilizing the new state).', '2025-09-15 16:20:43'),
(52, 5, 'What is a common source of employee resistance to organizational change?', 'Enthusiasm for new challenges', 'Fear of the unknown or job loss', 'Belief in the necessity of the change', 'Clear communication from leadership', 'option_b', 'Fear of the unknown, loss of job security, and mistrust of management are common psychological and organizational factors that lead employees to resist changes.', '2025-09-15 16:20:45'),
(53, 5, 'Which of these activities best exemplifies Marketing Innovation?', 'Developing a new manufacturing technique', 'Introducing a completely new product to the market', 'Restructuring the company\'s internal departments', 'Creating novel packaging and promotional strategies for an existing product', 'option_d', 'Marketing innovation focuses on new ways to reach customers, present products, or communicate value, differing from product (the offering itself) or process (production methods) innovations.', '2025-09-15 16:20:47'),
(54, 5, 'How does effective communication contribute to successful change management?', 'Reduces uncertainty and builds buy-in', 'Increases the complexity of the change process', 'Discourages feedback from employees', 'Slows down the implementation of the change', 'option_a', 'Effective communication ensures clarity about the reasons for change, the expected benefits, and the process, thereby reducing uncertainty and building buy-in among stakeholders.', '2025-09-15 16:20:49'),
(55, 5, 'In Kotter\'s 8-step model, why is creating a sense of urgency considered a critical first step?', 'To immediately implement new policies without discussion', 'To allow employees time to gradually adjust to the changes', 'To motivate employees and stakeholders by highlighting the risks of inaction', 'To focus solely on the technical aspects of the change', 'option_c', 'Creating a sense of urgency motivates employees and stakeholders to embrace the change by highlighting the risks of inaction and the benefits of timely adoption, overcoming inertia.', '2025-09-15 16:20:51'),
(56, 5, 'An entrepreneur introduces a low-cost, simplified service that initially appeals to a niche market but eventually competes with established industry leaders. This is an example of what type of innovation?', 'Incremental Innovation', 'Disruptive Innovation', 'Process Innovation', 'Marketing Innovation', 'option_b', 'Introducing a product that creates a new market and serves unmet needs, thereby displacing existing market relationships, is the hallmark of disruptive innovation.', '2025-09-15 16:20:53'),
(57, 5, 'Which scenario best illustrates Organizational Innovation?', 'Implementing new management practices or workplace organization methods', 'Developing a significantly improved product design', 'Adopting a faster production line technology', 'Creating a new advertising campaign for an existing product', 'option_a', 'Organizational innovation involves implementing new organizational methods in business practices, workplace organization, or external relations, often involving structural or management changes.', '2025-09-15 16:20:55'),
(58, 5, 'A company that fails to invest in R&D and adopt new manufacturing technologies, leading to outdated products and higher production costs, is primarily suffering from a deficiency in managing which critical business aspect?', 'Marketing Strategy', 'Financial Investment', 'Human Resource Management', 'Innovation and Technological Adaptation', 'option_d', 'Failure to adopt new technologies and invest in R&D directly impacts a company\'s ability to innovate and remain competitive, leading to obsolescence.', '2025-09-15 16:20:57'),
(59, 5, 'When employees resist a new workflow system due to fear of incompetence with new software, what is the most effective initial approach for the manager according to change management principles?', 'Implement the change immediately to show decisiveness', 'Ignore employee concerns and proceed with the plan', 'Ask employees to develop their own solutions independently', 'Provide training, involve employees in planning, and communicate benefits clearly', 'option_d', 'Addressing employee fears by providing training, involving them in the process, and highlighting benefits directly tackles resistance stemming from uncertainty and perceived threats, making the change more palatable.', '2025-09-15 16:20:59'),
(60, 6, 'Which of Maslow\'s needs includes the desire for friendship, family, and a sense of belonging?', 'Physiological', 'Safety', 'Love/Belonging', 'Esteem', 'option_c', 'Love/Belonging needs, according to Maslow\'s hierarchy, encompass social connection, intimacy, and a feeling of being part of a group.', '2025-09-15 16:21:01'),
(61, 6, 'A manager who believes employees are inherently lazy, dislike work, and must be closely supervised and coerced most closely aligns with which of McGregor\'s theories?', 'Theory X', 'Theory Y', 'Maslow\'s Hierarchy', 'Herzberg\'s Two-Factor Theory', 'option_a', 'Theory X posits a negative view of employees, assuming they lack ambition and avoid responsibility, thus requiring external control.', '2025-09-15 16:21:03'),
(62, 6, 'Which level in Maslow\'s hierarchy is the highest, representing the fulfillment of one\'s potential?', 'Esteem', 'Self-Actualization', 'Cognitive', 'Aesthetic', 'option_b', 'Self-Actualization is the pinnacle of Maslow\'s hierarchy, representing the drive to become everything one is capable of becoming.', '2025-09-15 16:21:05'),
(63, 6, 'According to Herzberg\'s Two-Factor Theory, which of the following is a motivator and not just a hygiene factor?', 'Company Policy', 'Salary', 'Working Conditions', 'Recognition', 'option_d', 'Motivators like recognition, achievement, and challenging work lead to job satisfaction, while hygiene factors prevent dissatisfaction but don\'t drive satisfaction.', '2025-09-15 16:21:07'),
(64, 6, 'In Vroom\'s Expectancy Theory, what does the term \"instrumentality\" refer to?', 'The belief that effort will lead to performance', 'The belief that performance will lead to outcomes', 'The value an individual places on outcomes', 'The perceived fairness of rewards', 'option_b', 'Instrumentality is the perception that successful performance of a task will lead to a specific outcome or reward.', '2025-09-15 16:21:09'),
(65, 6, 'Which component of transformational leadership involves acting as a role model and instilling pride and a sense of mission?', 'Inspirational Motivation', 'Intellectual Stimulation', 'Idealized Influence', 'Individualized Consideration', 'option_c', 'Idealized Influence describes leaders who serve as positive role models, embodying high ethical standards and vision.', '2025-09-15 16:21:11'),
(66, 6, 'An employee perceives that their efforts (inputs) and results (outputs) are unfairly valued compared to a colleague with similar responsibilities but higher pay. According to Equity Theory, to restore balance, the employee might:', 'Increase their own input to match the colleague\'s output', 'Reduce their own input or seek a pay raise', 'Convince themselves the colleague\'s inputs are actually higher', 'Assume the colleague\'s outputs are lower than perceived.', 'option_b', 'Reducing inputs (e.g., effort) or seeking to increase outputs (e.g., demanding a raise) are common reactions to perceived underpayment inequity, aiming to restore balance.', '2025-09-15 16:21:13'),
(67, 6, 'Which of the following is considered a hygiene factor by Herzberg, meaning its absence causes dissatisfaction, but its presence does not necessarily motivate?', 'Achievement', 'Responsibility', 'Company Salary', 'Growth', 'option_c', 'Salary is a hygiene factor; while a lack of it causes dissatisfaction, merely having it does not guarantee motivation or satisfaction. The difficulty lies in the nuance that salary *can* be a motivator for some, but Herzberg\'s theory strictly classifies it.', '2025-09-15 16:21:15'),
(68, 6, 'A leader who challenges assumptions, encourages innovation, and fosters creative problem-solving is demonstrating which characteristic?', 'Idealized Influence', 'Individualized Consideration', 'Intellectual Stimulation', 'Contingent Reward', 'option_c', 'Intellectual Stimulation involves encouraging employees to think critically, question the status quo, and approach problems from new perspectives.', '2025-09-15 16:21:18'),
(69, 6, 'The \"Team Management\" style (9,9) on the Blake and Mouton Managerial Grid is characterized by:', 'High concern for production, low concern for people', 'Low concern for both production and people', 'Moderate concern for both production and people', 'High concern for both production and people.', 'option_d', 'Team Management (9,9) represents the ideal style, integrating high concern for both task completion and employee well-being through committed, high-performing teams.', '2025-09-15 16:21:20'),
(70, 6, 'Which leadership approach focuses on supervision, organization, and performance, often involving rewards and punishments for meeting or failing to meet goals?', 'Transformational Leadership', 'Transactional Leadership', 'Laissez-faire Leadership', 'Servant Leadership', 'option_b', 'Transactional leadership relies on clear exchanges between leaders and followers, using contingent rewards and management-by-exception to maintain order and performance.', '2025-09-15 16:21:22'),
(71, 6, 'According to Vroom\'s Expectancy Theory, if an employee believes that achieving a high performance level will lead to a promotion and a salary increase, this belief represents:', 'Expectancy', 'Instrumentality', 'Valence', 'Equity', 'option_b', 'This scenario describes instrumentality, which is the perceived link between performing at a certain level and receiving a particular outcome.', '2025-09-15 16:21:24'),
(72, 7, 'Which level of management is primarily responsible for setting long-term goals and strategic direction for an organization?', 'Top-level management', 'Middle-level management', 'Lower-level management', 'Supervisory management', 'option_a', 'Top-level management, including the board of directors and CEO, is responsible for defining the overall mission, vision, and strategic objectives of the organization.', '2025-09-15 16:21:26'),
(73, 7, 'Middle-level managers typically bridge the gap between which two levels of management?', 'Top-level and Supervisory management', 'Top-level and Lower-level management', 'Lower-level and Operational staff', 'Supervisory and Operational staff', 'option_b', 'Middle-level managers translate the strategies and goals set by top management into actionable plans and directives for lower-level management and operational staff.', '2025-09-15 16:21:28'),
(74, 7, 'What is the main focus of lower-level management?', 'Developing long-term strategies', 'Interpreting policies and plans', 'Directing and supervising daily operations', 'Analyzing market trends', 'option_c', 'Lower-level management, also known as supervisory or first-line management, is directly involved in overseeing the work of non-managerial employees and ensuring daily tasks are completed.', '2025-09-15 16:21:30'),
(75, 7, 'Which of the following is NOT a typical responsibility of top-level management?', 'Setting organizational vision and mission', 'Appointing divisional and departmental heads', 'Developing departmental work schedules', 'Making major investment decisions', 'option_c', 'Developing departmental work schedules is a task typically handled by lower-level or middle-level management, not top-level management, which focuses on broader strategic issues.', '2025-09-15 16:21:32'),
(76, 7, 'The role of a department head or a branch manager best exemplifies which level of management?', 'Top-level management', 'Middle-level management', 'Lower-level management', 'Operational management', 'option_b', 'Department heads and branch managers are key figures in middle management, responsible for implementing policies and plans within their specific departments or branches.', '2025-09-15 16:21:34'),
(77, 7, 'A production supervisor overseeing a team of assembly line workers is an example of:', 'Top-level management', 'Middle-level management', 'Lower-level management', 'Strategic management', 'option_c', 'A production supervisor is a first-line manager who directly manages operational employees, making them part of the lower-level management.', '2025-09-15 16:21:36'),
(78, 7, 'Which management level is most concerned with the efficient utilization of resources and the achievement of specific departmental goals?', 'Top-level management', 'Middle-level management', 'Lower-level management', 'All levels equally', 'option_b', 'Middle-level management plays a crucial role in translating broader organizational goals into specific departmental objectives and ensuring the efficient allocation and use of resources to achieve them.', '2025-09-15 16:21:38'),
(79, 7, 'The primary function of middle management can be described as:', 'Setting the overall strategic vision', 'Implementing policies and plans devised by top management', 'Directly overseeing the day-to-day work of employees', 'Interacting with external stakeholders and the public', 'option_b', 'Middle managers act as a crucial link, taking the broad strategies from top management and making them operational through lower-level management and staff.', '2025-09-15 16:21:40'),
(80, 7, 'Consider an organization with a CEO, VPs, Division Managers, Department Managers, and Supervisors. Which of these roles would LEAST likely be considered part of top-level management?', 'CEO', 'VP', 'Division Manager', 'Department Manager', 'option_d', 'While VPs and Division Managers are typically considered top or upper-middle management, Department Managers are usually situated in the middle management layer, responsible for specific departments.', '2025-09-15 16:21:42'),
(81, 7, 'In a hierarchical structure, who is most likely to be responsible for evaluating the performance of lower-level managers?', 'Top-level management', 'Middle-level management', 'Lower-level management', 'Peer-level management', 'option_b', 'Middle-level managers are typically responsible for overseeing the performance of lower-level managers and providing them with feedback and development support.', '2025-09-15 16:21:44'),
(82, 7, 'What is the key difference in focus between top-level and lower-level management?', 'Top-level focuses on operational efficiency, while lower-level focuses on long-term strategy.', 'Top-level focuses on external environment, while lower-level focuses on internal operations.', 'Top-level focuses on employee morale, while lower-level focuses on resource allocation.', 'Top-level focuses on specific task execution, while lower-level focuses on broad organizational goals.', 'option_b', 'Top-level management must be aware of and respond to external factors like market trends and competition, while lower-level management is primarily concerned with the internal execution of tasks and operations.', '2025-09-15 16:21:46'),
(83, 7, 'The \"span of control\" concept is most directly relevant to which aspect of management levels?', 'The strategic planning horizon', 'The number of subordinates a manager can effectively supervise', 'The degree of employee empowerment', 'The complexity of organizational structure', 'option_b', 'Span of control refers to the number of subordinates a manager can effectively manage, a key consideration in defining the layers and effectiveness of different management levels.', '2025-09-15 16:21:48'),
(84, 8, 'What is the most effective way to foster a strong ethical culture within an organization?', 'Financial incentives', 'Strict rules and regulations', 'Ethical leadership and culture', 'Employee surveillance', 'option_c', 'Ethical leadership sets the tone for the entire organization, influencing employee behavior and decision-making regarding ethical dilemmas.', '2025-09-15 16:21:50'),
(85, 8, 'Which of the following best describes corporate social responsibility (CSR)?', 'Maximizing profits at all costs', 'Voluntarily contributing to societal well-being', 'Strictly adhering to legal requirements', 'Focusing solely on shareholder interests', 'option_b', 'Social responsibility extends beyond legal obligations to encompass a commitment to contributing positively to society and minimizing negative impacts.', '2025-09-15 16:21:52'),
(86, 8, 'Who are considered the primary stakeholders in the context of corporate social responsibility?', 'Only shareholders and top management', 'Only employees and customers', 'Only government and regulatory bodies', 'All individuals and groups affected by the organization\'s operations', 'option_d', 'Stakeholders include anyone affected by the organization\'s actions, such as employees, customers, suppliers, and the community.', '2025-09-15 16:21:54'),
(87, 8, 'An action is considered ethical if it produces the greatest good for the greatest number of people. Which ethical theory best aligns with this statement?', 'Utilitarianism', 'Deontology', 'Virtue ethics', 'Ethical relativism', 'option_a', 'Utilitarianism focuses on the greatest good for the greatest number, meaning actions are judged by their overall consequences.', '2025-09-15 16:21:56'),
(88, 8, 'What does the concept of sustainability in business entail?', 'Focusing exclusively on short-term financial gains', 'Ignoring environmental impacts to reduce costs', 'Balancing economic, environmental, and social considerations', 'Prioritizing shareholder returns above all other factors', 'option_c', 'Sustainability in business refers to operating in a way that meets present needs without compromising the ability of future generations to meet their own needs.', '2025-09-15 16:21:58'),
(89, 8, 'What is whistleblowing in the context of management ethics?', 'Implementing new company policies', 'Reporting unethical behavior within the organization', 'Developing new marketing strategies', 'Negotiating with suppliers', 'option_b', 'Whistleblowing is the act of reporting unethical or illegal activities within an organization, often to an external authority.', '2025-09-15 16:22:00'),
(90, 8, 'Which ethical approach emphasizes the development of moral character and virtues?', 'Following a strict set of rules', 'Maximizing overall happiness', 'Adhering to contractual obligations', 'Cultivating good character traits like honesty and integrity', 'option_d', 'Virtue ethics focuses on the character of the moral agent rather than on the specific actions or consequences.', '2025-09-15 16:22:02'),
(91, 8, 'The idea that morality is subjective and depends on cultural norms or individual beliefs is most closely associated with which ethical perspective?', 'Ethical relativism', 'Ethical universalism', 'Ethical egoism', 'Utilitarianism', 'option_a', 'Ethical relativism suggests that ethical standards are not absolute but vary depending on cultural or individual perspectives.', '2025-09-15 16:22:04'),
(92, 8, 'What are the three key components of the \"triple bottom line\" in corporate social responsibility?', 'Profit, growth, and market share', 'Customer satisfaction, employee morale, and innovation', 'People, planet, and profit', 'Efficiency, productivity, and quality', 'option_c', 'The triple bottom line is a framework that includes social, environmental, and economic performance to measure sustainability.', '2025-09-15 16:22:06'),
(93, 8, 'An employee believes they must always tell the truth, even if it leads to negative consequences for the company. Which ethical framework most likely guides their decision?', 'Consequentialism', 'Deontology', 'Virtue Ethics', 'Ethical Relativism', 'option_b', 'Deontology is an ethical theory that judges the morality of an action based on adherence to rules or duties, regardless of the outcome.', '2025-09-15 16:22:08'),
(94, 8, 'Which of the following is an example of corporate philanthropy?', 'Reducing production costs', 'Increasing market share', 'Improving employee productivity', 'Donating to charitable causes', 'option_d', 'Corporate philanthropy involves a company donating money or resources to charitable causes, which is a form of social responsibility.', '2025-09-15 16:22:10'),
(95, 9, 'What is the primary focus of scientific management theory?', 'Increasing productivity through efficient use of resources', 'Improving employee morale and job satisfaction', 'Reducing costs and maximizing profits', 'Enhancing managerial control and authority', 'option_a', 'Scientific management theory, developed by Frederick Winslow Taylor, focuses on increasing productivity through the efficient use of resources.', '2025-09-15 16:22:12'),
(96, 9, 'Which management theory emphasizes the importance of understanding human behavior and social relationships in the workplace?', 'Classical management theory', 'Human relations theory', 'Contingency theory', 'Systems theory', 'option_b', 'Human relations theory, developed by Elton Mayo, emphasizes the importance of understanding human behavior and social relationships in the workplace.', '2025-09-15 16:22:14'),
(97, 9, 'What is the core idea of contingency theory?', 'There is one best way to manage an organization', 'The most effective management approach depends on the situation', 'Managers should focus on maximizing profits', 'Employees are the most important resource in an organization', 'option_b', 'Contingency theory suggests that the most effective management approach depends on the situation, and there is no one-size-fits-all solution.', '2025-09-15 16:22:16'),
(98, 9, 'Which of the following is a characteristic of a bureaucratic organization?', 'Flat organizational structure', 'Decentralized decision-making', 'Well-defined rules and procedures', 'High degree of flexibility and adaptability', 'option_c', 'A bureaucratic organization is characterized by well-defined rules and procedures, a clear hierarchy, and a focus on efficiency.', '2025-09-15 16:22:18'),
(99, 9, 'What is the main difference between a mechanistic and an organic organization?', 'Mechanistic organizations are more flexible, while organic organizations are more rigid', 'Mechanistic organizations are more centralized, while organic organizations are more decentralized', 'Mechanistic organizations are more formal, while organic organizations are more informal', 'Mechanistic organizations are more focused on efficiency, while organic organizations are more focused on innovation', 'option_d', 'Mechanistic organizations are more formal, rigid, and focused on efficiency, while organic organizations are more informal, flexible, and focused on innovation.', '2025-09-15 16:22:20'),
(100, 9, 'Which management theory is based on the idea that organizations are systems that interact with their environment?', 'Systems theory', 'Contingency theory', 'Human relations theory', 'Scientific management theory', 'option_a', 'Systems theory views organizations as systems that interact with their environment, and emphasizes the importance of understanding these interactions to achieve organizational goals.', '2025-09-15 16:22:23');
INSERT INTO `questions` (`id`, `topic_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `explanation`, `created_at`) VALUES
(101, 9, 'What is the primary goal of management according to the classical management theory?', 'Maximizing employee satisfaction', 'Minimizing costs and maximizing profits', 'Achieving organizational effectiveness and efficiency', 'Improving social responsibility and ethics', 'option_c', 'Classical management theory, developed by Henri Fayol, views the primary goal of management as achieving organizational effectiveness and efficiency.', '2025-09-15 16:22:25'),
(102, 9, 'Which of the following is a key concept in the theory of organizational behavior?', 'Motivation', 'Leadership', 'Communication', 'All of the above', 'option_d', 'The theory of organizational behavior encompasses various key concepts, including motivation, leadership, communication, and more.', '2025-09-15 16:22:27'),
(103, 9, 'What is the main criticism of the human relations theory?', 'It ignores the importance of productivity and efficiency', 'It overemphasizes the role of management in employee motivation', 'It neglects the impact of organizational structure on employee behavior', 'It fails to consider the external environment and its influence on organizational behavior', 'option_a', 'The human relations theory has been criticized for ignoring the importance of productivity and efficiency, and focusing too much on employee satisfaction and social relationships.', '2025-09-15 16:22:29'),
(104, 9, 'Which management theory emphasizes the importance of understanding the external environment and its impact on organizational behavior?', 'Classical management theory', 'Human relations theory', 'Contingency theory', 'Systems theory', 'option_d', 'Systems theory emphasizes the importance of understanding the external environment and its impact on organizational behavior, and views organizations as systems that interact with their environment.', '2025-09-15 16:22:31'),
(105, 10, 'Who defined management as getting things done through others?', 'Henri Fayol', 'Peter Drucker', 'Mary Parker Follett', 'George Terry', 'option_d', 'George Terry defined management as getting things done through others.', '2025-09-15 16:22:33'),
(106, 10, 'What are the three levels of management?', 'Top, Middle, and Lower', 'Upper, Middle, and Lower', 'High, Middle, and Low', 'First, Second, and Third', 'option_a', 'The three levels of management are Top, Middle, and Lower.', '2025-09-15 16:22:35'),
(107, 10, 'Which managerial function involves planning and decision-making?', 'Organizing', 'Staffing', 'Planning', 'Controlling', 'option_c', 'Planning is the managerial function that involves planning and decision-making.', '2025-09-15 16:22:37'),
(108, 10, 'What is the primary role of a manager in an organization?', 'To make profits', 'To manage people', 'To manage resources', 'To achieve organizational goals', 'option_d', 'The primary role of a manager is to achieve organizational goals.', '2025-09-15 16:22:39'),
(109, 10, 'Who proposed the 14 principles of management?', 'Henri Fayol', 'Peter Drucker', 'Mary Parker Follett', 'George Terry', 'option_a', 'Henri Fayol proposed the 14 principles of management.', '2025-09-15 16:22:41'),
(110, 10, 'What is the difference between leadership and management?', 'Leadership is about vision, while management is about planning', 'Leadership is about people, while management is about tasks', 'Leadership is about change, while management is about stability', 'Leadership is about strategy, while management is about tactics', 'option_c', 'Leadership is about change, while management is about stability.', '2025-09-15 16:22:43'),
(111, 10, 'What are the five managerial roles identified by Henry Mintzberg?', 'Figurehead, Leader, Liaison, Monitor, and Spokesperson', 'Figurehead, Leader, Liaison, Monitor, and Entrepreneur', 'Figurehead, Leader, Liaison, Monitor, and Strategist', 'Figurehead, Leader, Liaison, Monitor, and Coordinator', 'option_a', 'The five managerial roles identified by Henry Mintzberg are Figurehead, Leader, Liaison, Monitor, and Spokesperson.', '2025-09-15 16:22:45'),
(112, 10, 'Which of the following is NOT one of the managerial functions?', 'Planning', 'Organizing', 'Staffing', 'Marketing', 'option_d', 'Marketing is not one of the managerial functions.', '2025-09-15 16:22:47'),
(113, 10, 'What is the concept of management by exception?', 'It involves closely monitoring and controlling all aspects of an organization', 'It involves focusing on exceptions and deviations from standards', 'It involves delegating authority to subordinates', 'It involves using management information systems', 'option_b', 'Management by exception involves focusing on exceptions and deviations from standards.', '2025-09-15 16:22:49'),
(114, 10, 'Which of the following is a characteristic of a successful manager?', 'Being a specialist in a particular area', 'Having a narrow focus on a specific task', 'Being able to adapt to changing circumstances', 'Being a micromanager', 'option_c', 'A successful manager is able to adapt to changing circumstances.', '2025-09-15 16:22:51'),
(115, 11, 'Which organizational structure groups employees by similar tasks and expertise, such as marketing, finance, and operations?', 'Divisional', 'Functional', 'Matrix', 'Team-based', 'option_b', 'A functional structure groups jobs based on similar functions or tasks, promoting specialization within departments.', '2025-09-15 16:22:53'),
(116, 11, 'When a company organizes its departments based on distinct products or customer groups, what type of structure is it using?', 'Divisional', 'Functional', 'Matrix', 'Network', 'option_a', 'A divisional structure organizes activities around products, markets, or geographic locations, allowing for greater focus on specific business areas.', '2025-09-15 16:22:55'),
(117, 11, 'In which organizational design do employees report to two or more managers, typically a functional manager and a project manager?', 'Line', 'Functional', 'Matrix', 'Divisional', 'option_c', 'A matrix structure combines functional and divisional chains of command, where employees report to two managers: a functional manager and a project or product manager.', '2025-09-15 16:22:57'),
(118, 11, 'What term describes the number of subordinates a manager can effectively supervise?', 'Chain of command', 'Unity of command', 'Departmentalization', 'Span of control', 'option_d', 'Span of control refers to the number of subordinates a manager can efficiently and effectively manage. A wide span means a manager oversees many employees, while a narrow span means fewer.', '2025-09-15 16:22:59'),
(119, 11, 'In an organization with a high degree of centralization, where does the majority of decision-making power reside?', 'Centralization', 'Decentralization', 'Departmentalization', 'Formalization', 'option_a', 'Centralization means decision-making authority is concentrated at higher levels of management, leading to more top-down control.', '2025-09-15 16:23:01'),
(120, 11, 'Which organizational characteristic empowers lower-level managers and employees by delegating decision-making authority?', 'Centralization', 'Decentralization', 'Bureaucracy', 'Matrix structure', 'option_b', 'Decentralization distributes decision-making authority to lower levels, empowering employees and increasing responsiveness.', '2025-09-15 16:23:03'),
(121, 11, 'The extent to which an organization’s employees are guided by rules and procedures is known as what?', 'Span of control', 'Unity of command', 'Formalization', 'Centralization', 'option_c', 'Formalization refers to the degree to which jobs are standardized and employee behavior is guided by rules and procedures. High formalization means many rules.', '2025-09-15 16:23:05'),
(122, 11, 'What type of organizational structure involves a central core that outsources major business activities to other organizations to gain flexibility?', 'Functional', 'Divisional', 'Matrix', 'Network', 'option_d', 'A network structure is a small core organization that outsources major business functions to other companies, creating a flexible and adaptable virtual organization.', '2025-09-15 16:23:07'),
(123, 11, 'Which management principle ensures that an employee receives orders from only one superior?', 'Chain of command', 'Unity of command', 'Span of control', 'Scalar principle', 'option_b', 'Unity of command is a principle stating that each employee should report to only one supervisor to avoid conflicting instructions and confusion.', '2025-09-15 16:23:09'),
(124, 11, 'According to Max Weber\'s ideal type of organization, what structure is characterized by a strict hierarchy, formal rules, and a clear division of labor?', 'Bureaucracy', 'Organic structure', 'Team-based structure', 'Network structure', 'option_a', 'Bureaucracy, as described by Max Weber, is characterized by a clear hierarchy, detailed rules and procedures, and a division of labor, promoting efficiency and predictability.', '2025-09-15 16:23:11'),
(125, 11, 'Which organizational design is highly adaptive, flexible, and characterized by low formalization, wide span of control, and decentralization, thriving in uncertain environments?', 'Mechanistic structure', 'Bureaucracy', 'Organic structure', 'Functional structure', 'option_c', 'An organic organizational structure is characterized by flexibility, fluidity, and adaptability, with less emphasis on strict rules and hierarchy, often found in dynamic environments.', '2025-09-15 16:23:13'),
(126, 11, 'Which organizational structure is rigid, hierarchical, and characterized by specialization, formal rules, and centralized decision-making, ideal for stable environments?', 'Organic structure', 'Network structure', 'Matrix structure', 'Mechanistic structure', 'option_d', 'A mechanistic structure is rigid and tightly controlled, characterized by high formalization, a clear hierarchy, and specialized tasks, designed for efficiency in stable environments.', '2025-09-15 16:23:15'),
(127, 12, 'Which type of plan is developed at the highest level of management and sets the overall direction for the organization?', 'Operational plans', 'Strategic plans', 'Contingency plans', 'Tactical plans', 'option_b', 'Strategic plans are long-term and broad, guiding the entire organization, while operational plans are short-term and detailed, focusing on specific tasks and departments.', '2025-09-15 16:23:17'),
(128, 12, 'What is the initial step in the planning process, often involving the prediction of future conditions?', 'Forecasting', 'Setting objectives', 'Implementing the plan', 'Evaluating results', 'option_a', 'Forecasting involves predicting future conditions, which is a crucial first step in the planning process to anticipate challenges and opportunities.', '2025-09-15 16:23:19'),
(129, 12, 'When a manager creates a plan to be used if the original plan doesn\'t work or if an unexpected event occurs, what type of plan is being developed?', 'Strategic plans', 'Operational plans', 'Tactical plans', 'Contingency plans', 'option_d', 'Contingency plans are prepared for unexpected events or crises, providing a framework for how to respond if the primary plan fails or circumstances change drastically.', '2025-09-15 16:23:21'),
(130, 12, 'Plans that are designed to implement strategic plans and are typically shorter in duration and more specific than strategic plans are known as?', 'Strategic plans', 'Operational plans', 'Tactical plans', 'Standing plans', 'option_c', 'Tactical plans are mid-level plans that translate strategic goals into specific actions, often focusing on functional areas like marketing or finance.', '2025-09-15 16:23:23'),
(131, 12, 'Which type of plan is designed to be used repeatedly and for ongoing decision making in an organization?', 'Single-use plans', 'Standing plans', 'Contingency plans', 'Strategic plans', 'option_b', 'Standing plans are used repeatedly for recurring situations, providing a consistent approach to routine activities.', '2025-09-15 16:23:26'),
(132, 12, 'Identifying and evaluating various ways to achieve an objective is a critical part of which planning step?', 'Developing alternative courses of action', 'Implementing the plan', 'Evaluating results', 'Setting objectives', 'option_a', 'Developing alternative courses of action is a key step in planning, as it allows for flexibility and preparedness for different scenarios.', '2025-09-15 16:23:28'),
(133, 12, 'A plan developed for a unique situation or a specific project that is not expected to recur is called a(n):', 'Standing plans', 'Contingency plans', 'Single-use plans', 'Strategic plans', 'option_c', 'Single-use plans are created for a specific, one-time event or project and are discarded once completed, such as a specific marketing campaign for a new product launch.', '2025-09-15 16:23:30'),
(134, 12, 'Which of the following sequences best represents the logical flow of the planning process?', 'Implementing the plan, evaluating results, setting objectives, developing alternatives', 'Setting objectives, developing alternatives, implementing the plan, evaluating results', 'Evaluating results, setting objectives, developing alternatives, implementing the plan', 'Setting objectives, developing alternatives, evaluating results, implementing the plan', 'option_d', 'The planning process involves several sequential steps, beginning with setting objectives and ending with evaluating performance against those objectives.', '2025-09-15 16:23:32'),
(135, 12, 'In the context of the planning process, which step is most directly associated with assessing the degree to which goals have been achieved?', 'Measuring performance', 'Developing premises', 'Choosing a course of action', 'Establishing objectives', 'option_a', 'While all are related, \"measuring performance\" is the step where actual results are compared against the planned objectives to assess success and identify deviations.', '2025-09-15 16:23:34'),
(136, 12, 'Which step in the planning process involves creating a set of assumptions about the environment in which the plan will be carried out?', 'Setting objectives', 'Implementing the plan', 'Evaluating results', 'Developing premises', 'option_d', 'Developing premises involves establishing the assumptions and conditions under which the plan will operate, forming the basis for alternative course development.', '2025-09-15 16:23:36'),
(137, 12, 'After identifying various alternatives, what is the subsequent crucial step in effective planning?', 'Developing alternatives', 'Choosing a course of action', 'Developing premises', 'Setting objectives', 'option_b', 'Choosing the best course of action involves selecting the most suitable alternative based on feasibility, cost-effectiveness, and alignment with objectives.', '2025-09-15 16:23:38'),
(138, 12, 'Operational plans are primarily concerned with:', 'Setting broad organizational goals', 'Defining long-term market position', 'Outlining specific tasks for departments', 'Forecasting economic trends', 'option_c', 'Operational plans are detailed and short-term, focusing on the day-to-day activities required to achieve tactical objectives and thus contribute to the overall strategy.', '2025-09-15 16:23:40'),
(139, 12, 'If, during the implementation phase, market conditions change significantly, what is the most appropriate response according to the planning process?', 'Revising or creating new plans', 'Implementing the original plan rigidly', 'Ignoring the changes to maintain consistency', 'Seeking external consultants immediately', 'option_a', 'When a plan needs to be adjusted due to unforeseen circumstances, it indicates a need to revise or create new plans, which is an integral part of the dynamic planning process.', '2025-09-15 16:23:42'),
(140, 12, 'The final step in the planning process typically involves:', 'Developing alternative courses of action', 'Evaluating results', 'Developing premises', 'Implementing the plan', 'option_b', 'The effectiveness of a plan is evaluated by comparing the actual results achieved against the set objectives. This feedback loop is essential for future planning.', '2025-09-15 16:23:44'),
(141, 12, 'Standing plans are best suited for managing which of the following?', 'Unique, one-time projects', 'Short-term departmental actions', 'Routine, recurring activities', 'Crisis management protocols', 'option_c', 'Standing plans, such as policies and procedures, provide guidance for routine decisions, ensuring consistency and efficiency in operations.', '2025-09-15 16:23:46'),
(142, 12, 'The relationship between strategic and tactical plans is best described as one of:', 'Operational plans and single-use plans', 'Contingency plans and standing plans', 'Standing plans and operational plans', 'Strategic plans and tactical plans', 'option_d', 'Strategic planning defines long-term goals and the overall approach, while tactical plans detail how these strategies will be implemented in specific areas.', '2025-09-15 16:23:48'),
(143, 12, 'What are \"planning premises\" in the context of the planning process?', 'The assumptions and conditions under which the plan will operate', 'The specific tasks to be performed by employees', 'The final outcomes and performance metrics', 'The budget allocated for the project', 'option_a', 'The planning premises are the assumptions about the environment that form the basis of the plan. Accurate premises are crucial for an effective plan.', '2025-09-15 16:23:50'),
(144, 12, 'The primary purpose of the planning function in management is to:', 'Minimizing competition', 'Maximizing employee satisfaction', 'Achieving organizational objectives', 'Reducing operational costs', 'option_c', 'The core purpose of planning is to achieve organizational objectives by setting a clear direction and outlining the steps needed to get there.', '2025-09-15 16:23:52'),
(145, 12, 'Which step in the planning process allows for performance appraisal and identifies areas for improvement or deviation from the original plan?', 'Developing premises', 'Evaluating results', 'Choosing a course of action', 'Developing alternative courses of action', 'option_b', 'Evaluating results involves comparing actual performance against the set objectives. This step provides feedback for future planning and performance improvement.', '2025-09-15 16:23:54'),
(146, 12, 'The main function of tactical planning is to:', 'Translating strategies into specific actions', 'Setting long-term organizational vision', 'Forecasting future market trends', 'Establishing emergency procedures', 'option_a', 'Tactical plans bridge the gap between broad strategies and specific actions, often involving resource allocation and timelines for particular departments or projects.', '2025-09-15 16:23:56'),
(147, 13, 'What is centralization in an organization?', 'Decisions are made at the top level', 'Decisions are made at the lower level', 'Decisions are made by employees', 'Decisions are made by customers', 'option_a', 'Centralization refers to the concentration of decision-making authority at the top level of an organization.', '2025-09-15 16:23:58'),
(148, 13, 'What is decentralization in an organization?', 'Decisions are made at the lower level', 'Decisions are made at the top level', 'Decisions are made by employees', 'Decisions are made by customers', 'option_a', 'Decentralization refers to the dispersion of decision-making authority throughout an organization.', '2025-09-15 16:24:00'),
(149, 13, 'What is the advantage of centralization?', 'Increased employee morale', 'Improved communication', 'Faster decision-making', 'Better control and coordination', 'option_d', 'Centralization allows for better control and coordination of an organization\'s activities.', '2025-09-15 16:24:02'),
(150, 13, 'What is the disadvantage of centralization?', 'Slower decision-making', 'Poor communication', 'Lack of employee empowerment', 'All of the above', 'option_d', 'Centralization can lead to slower decision-making, poor communication, and a lack of employee empowerment.', '2025-09-15 16:24:04'),
(151, 13, 'What is the advantage of decentralization?', 'Better control and coordination', 'Faster decision-making', 'Increased employee morale', 'Improved innovation and creativity', 'option_d', 'Decentralization allows for improved innovation and creativity, as employees are empowered to make decisions and take action.', '2025-09-15 16:24:06'),
(152, 13, 'What is the disadvantage of decentralization?', 'Loss of control and coordination', 'Poor communication', 'Inconsistent decision-making', 'All of the above', 'option_d', 'Decentralization can lead to a loss of control and coordination, poor communication, and inconsistent decision-making.', '2025-09-15 16:24:08'),
(153, 13, 'How does centralization affect organizational culture?', 'It promotes a culture of innovation and risk-taking', 'It promotes a culture of control and stability', 'It has no impact on organizational culture', 'It depends on the organization\'s size and complexity', 'option_b', 'Centralization can promote a culture of control and stability, as decisions are made at the top level and employees are expected to follow established procedures.', '2025-09-15 16:24:10'),
(154, 13, 'How does decentralization affect organizational culture?', 'It promotes a culture of control and stability', 'It promotes a culture of innovation and risk-taking', 'It has no impact on organizational culture', 'It depends on the organization\'s size and complexity', 'option_b', 'Decentralization can promote a culture of innovation and risk-taking, as employees are empowered to make decisions and take action.', '2025-09-15 16:24:12'),
(155, 13, 'What is the impact of centralization on employee motivation?', 'It increases employee motivation and engagement', 'It decreases employee motivation and engagement', 'It has no impact on employee motivation', 'It depends on the organization\'s size and complexity', 'option_b', 'Centralization can lead to decreased employee motivation and engagement, as employees may feel micromanaged and lacking in autonomy.', '2025-09-15 16:24:14'),
(156, 13, 'What is the impact of decentralization on employee motivation?', 'It decreases employee motivation and engagement', 'It increases employee motivation and engagement', 'It has no impact on employee motivation', 'It depends on the organization\'s size and complexity', 'option_b', 'Decentralization can lead to increased employee motivation and engagement, as employees are empowered to make decisions and take action.', '2025-09-15 16:24:16'),
(157, 14, 'Which conflict management strategy involves a win-win approach where both parties\' concerns are fully addressed?', 'Competing', 'Collaborating', 'Avoiding', 'Accommodating', 'option_b', 'Collaborating aims to find a solution that satisfies everyone involved, focusing on mutual benefit and problem-solving.', '2025-09-15 16:24:18'),
(158, 14, 'The conflict resolution style where one party gives in to the demands of the other is known as:', 'Compromising', 'Avoiding', 'Accommodating', 'Collaborating', 'option_c', 'Accommodating means yielding to another party\'s needs or desires, often at one\'s own expense, to maintain harmony.', '2025-09-15 16:24:20'),
(159, 14, 'When individuals try to ignore or suppress a conflict, they are using which conflict management strategy?', 'Competing', 'Avoiding', 'Compromising', 'Collaborating', 'option_b', 'Avoiding involves sidestepping the conflict, postponing it, or withdrawing from the situation entirely.', '2025-09-15 16:24:22'),
(160, 14, 'Which of the following is a direct benefit of effective conflict management in an organization?', 'Increased employee turnover', 'Improved team cohesion', 'Decreased productivity', 'Strained relationships', 'option_b', 'Effective conflict management can resolve disputes constructively, leading to better understanding, trust, and stronger relationships among team members.', '2025-09-15 16:24:24'),
(161, 14, 'A situation where two departments have conflicting goals due to differing performance metrics is an example of:', 'Interpersonal conflict', 'Intragroup conflict', 'Structural conflict', 'Task conflict', 'option_c', 'Structural conflict arises from the way an organization is designed, including its systems, processes, and departmental goals.', '2025-09-15 16:24:26'),
(162, 14, 'The Thomas-Kilmann Conflict Mode Instrument (TKI) measures an individual\'s behavior in different conflict situations based on two dimensions: assertiveness and:', 'Cooperativeness', 'Competitiveness', 'Dominance', 'Negotiation', 'option_a', 'The TKI assesses conflict handling styles based on how assertive and how cooperative an individual is in a conflict.', '2025-09-15 16:24:28'),
(163, 14, 'Which conflict resolution technique involves each party giving up something to reach an agreement?', 'Collaborating', 'Competing', 'Compromising', 'Avoiding', 'option_c', 'Compromising is a give-and-take approach where both parties sacrifice some of their demands to find a middle ground.', '2025-09-15 16:24:30'),
(164, 14, 'Cognitive conflict, as opposed to affective conflict, is generally considered:', 'Destructive and personal', 'Constructive and task-focused', 'Always detrimental to relationships', 'Unrelated to work outcomes', 'option_b', 'Cognitive conflict refers to disagreements about the task or ideas, which can be beneficial for decision-making and innovation if managed well.', '2025-09-15 16:24:33'),
(165, 14, 'When conflict arises from differing values, beliefs, or personal styles among team members, it is primarily classified as:', 'Task conflict', 'Relationship conflict', 'Process conflict', 'Structural conflict', 'option_b', 'Relationship conflict stems from interpersonal incompatibilities, such as personal dislikes, differing communication styles, or clashes in personality and values.', '2025-09-15 16:24:35'),
(166, 14, 'The \'locus of conflict\' refers to where the conflict is occurring. Which type describes conflict between an individual and their manager over workload distribution?', 'Intrapersonal', 'Intragroup', 'Intergroup', 'Interpersonal', 'option_d', 'Interpersonal conflict occurs between two or more individuals, such as an employee and their manager, regarding issues like workload.', '2025-09-15 16:24:37'),
(167, 14, 'In managing intergroup conflict, superordinate goals are often employed. What is the primary purpose of such goals?', 'To emphasize differences between groups', 'To create a common objective that requires cooperation', 'To assign blame for the conflict', 'To reward the winning group', 'option_b', 'Superordinate goals are shared objectives that are so important that they require cooperation between groups to achieve, thus transcending their differences.', '2025-09-15 16:24:39'),
(168, 14, 'Which of the following is a potential downside of excessive \'avoiding\' as a conflict management strategy in the long term?', 'Quick resolution of all issues', 'Increased innovation and creativity', 'Escalation of unresolved issues and resentment', 'Stronger interpersonal bonds', 'option_c', 'Consistently avoiding conflict can lead to festering issues, unresolved tensions, and a buildup of resentment, which can eventually harm relationships and productivity.', '2025-09-15 16:24:41'),
(169, 14, 'A manager attempts to resolve a conflict by appealing to organizational rules and procedures. This approach most closely aligns with which conflict resolution tactic?', 'Negotiation', 'Mediation', 'Arbitration', 'Establishing authority', 'option_d', 'Appealing to rules or establishing authority is a way for a manager to impose a solution based on their position, often used when other methods fail or for quick compliance.', '2025-09-15 16:24:43'),
(170, 15, 'What is the primary purpose of an organization structure?', 'To establish communication channels', 'To define roles and responsibilities', 'To create a hierarchy of authority', 'To facilitate decision-making processes', 'option_b', 'The primary purpose of an organization structure is to define roles and responsibilities, which helps to clarify expectations and improve productivity.', '2025-09-15 16:24:45'),
(171, 15, 'Which of the following is a characteristic of a flat organization structure?', 'Many layers of management', 'Few layers of management', 'Decentralized decision-making', 'Centralized decision-making', 'option_b', 'A flat organization structure is characterized by few layers of management, which allows for faster decision-making and increased employee autonomy.', '2025-09-15 16:24:47'),
(172, 15, 'What is the term for the process of assigning tasks and responsibilities to individuals or teams?', 'Delegation', 'Decentralization', 'Departmentalization', 'Division of labor', 'option_a', 'Delegation is the process of assigning tasks and responsibilities to individuals or teams, which helps to distribute workload and develop employee skills.', '2025-09-15 16:24:49'),
(173, 15, 'Which of the following organization structures is best suited for a company with a diverse range of products and services?', 'Functional structure', 'Divisional structure', 'Matrix structure', 'Flat structure', 'option_b', 'A divisional structure is best suited for a company with a diverse range of products and services, as it allows for each division to operate independently and make decisions based on their specific needs.', '2025-09-15 16:24:51'),
(174, 15, 'What is the term for the hierarchical arrangement of authority and responsibility within an organization?', 'Chain of command', 'Span of control', 'Line and staff organization', 'Functional organization', 'option_a', 'The chain of command refers to the hierarchical arrangement of authority and responsibility within an organization, which helps to clarify lines of communication and decision-making authority.', '2025-09-15 16:24:53'),
(175, 15, 'Which of the following is a benefit of a matrix organization structure?', 'Improved communication between departments', 'Increased efficiency and productivity', 'Enhanced innovation and creativity', 'All of the above', 'option_d', 'A matrix organization structure can provide several benefits, including improved communication between departments, increased efficiency and productivity, and enhanced innovation and creativity.', '2025-09-15 16:24:55'),
(176, 15, 'What is the term for the process of creating a detailed outline of an organization\'s structure and roles?', 'Organizational design', 'Job analysis', 'Role definition', 'Departmentalization', 'option_a', 'Organizational design refers to the process of creating a detailed outline of an organization\'s structure and roles, which helps to clarify expectations and improve productivity.', '2025-09-15 16:24:57'),
(177, 15, 'Which of the following organization structures is best suited for a company that operates in a rapidly changing environment?', 'Mechanistic structure', 'Organic structure', 'Functional structure', 'Divisional structure', 'option_b', 'An organic structure is best suited for a company that operates in a rapidly changing environment, as it allows for flexibility and adaptability in response to changing circumstances.', '2025-09-15 16:24:59'),
(178, 15, 'What is the term for the relationship between a supervisor and their subordinates, in which the supervisor has authority and responsibility for the subordinates\' work?', 'Line relationship', 'Staff relationship', 'Functional relationship', 'Matrix relationship', 'option_a', 'A line relationship refers to the relationship between a supervisor and their subordinates, in which the supervisor has authority and responsibility for the subordinates\' work.', '2025-09-15 16:25:01'),
(179, 15, 'Which of the following is a limitation of a functional organization structure?', 'It can lead to a lack of coordination between departments', 'It can result in a lack of innovation and creativity', 'It can lead to a lack of accountability and responsibility', 'All of the above', 'option_d', 'A functional organization structure can have several limitations, including a lack of coordination between departments, a lack of innovation and creativity, and a lack of accountability and responsibility.', '2025-09-15 16:25:03'),
(180, 16, 'What is departmentation?', 'Division of work', 'Assignment of tasks', 'Grouping of activities', 'Delegation of authority', 'option_c', 'Departmentation refers to the process of grouping activities or tasks into manageable units or departments.', '2025-09-15 16:25:05'),
(181, 16, 'What are the different types of departmentation methods?', 'Functional, territorial, and customer', 'Functional, product, and territorial', 'Functional, product, and customer', 'Territorial, customer, and process', 'option_c', 'The different types of departmentation methods include functional, product, and customer departmentation.', '2025-09-15 16:25:07'),
(182, 16, 'Which departmentation method involves grouping activities based on the functions performed?', 'Functional departmentation', 'Product departmentation', 'Customer departmentation', 'Territorial departmentation', 'option_a', 'Functional departmentation involves grouping activities based on the functions performed, such as marketing, finance, or human resources.', '2025-09-15 16:25:09'),
(183, 16, 'What is the advantage of functional departmentation?', 'Improved communication', 'Increased efficiency', 'Enhanced innovation', 'All of the above', 'option_d', 'Functional departmentation can lead to improved communication, increased efficiency, and enhanced innovation, as employees with similar skills and expertise work together.', '2025-09-15 16:25:11'),
(184, 16, 'Which departmentation method involves grouping activities based on the products or services offered?', 'Functional departmentation', 'Product departmentation', 'Customer departmentation', 'Territorial departmentation', 'option_b', 'Product departmentation involves grouping activities based on the products or services offered, such as a department for each product line.', '2025-09-15 16:25:13'),
(185, 16, 'What is the advantage of product departmentation?', 'Improved communication', 'Increased efficiency', 'Enhanced innovation', 'All of the above', 'option_d', 'Product departmentation can lead to improved communication, increased efficiency, and enhanced innovation, as employees focus on a specific product or service.', '2025-09-15 16:25:15'),
(186, 16, 'Which departmentation method involves grouping activities based on the customers or market segments served?', 'Functional departmentation', 'Product departmentation', 'Customer departmentation', 'Territorial departmentation', 'option_c', 'Customer departmentation involves grouping activities based on the customers or market segments served, such as a department for each customer group.', '2025-09-15 16:25:17'),
(187, 16, 'What is the advantage of customer departmentation?', 'Improved communication', 'Increased efficiency', 'Enhanced innovation', 'All of the above', 'option_d', 'Customer departmentation can lead to improved communication, increased efficiency, and enhanced innovation, as employees focus on the specific needs of each customer group.', '2025-09-15 16:25:19'),
(188, 16, 'Which departmentation method involves grouping activities based on the geographic location?', 'Functional departmentation', 'Product departmentation', 'Customer departmentation', 'Territorial departmentation', 'option_d', 'Territorial departmentation involves grouping activities based on the geographic location, such as a department for each region or country.', '2025-09-15 16:25:21'),
(189, 16, 'What is the challenge of implementing departmentation in a large organization?', 'Coordinating activities across departments', 'Managing communication between departments', 'Balancing departmental goals with organizational goals', 'All of the above', 'option_d', 'Implementing departmentation in a large organization can be challenging due to the need to coordinate activities across departments, manage communication between departments, and balance departmental goals with organizational goals.', '2025-09-15 16:25:23'),
(190, 17, 'What is the primary difference between formal and informal organizational structures?', 'Formal structures are flexible, while informal structures are rigid', 'Formal structures are based on rules and procedures, while informal structures are based on personal relationships', 'Formal structures are used in small organizations, while informal structures are used in large organizations', 'Formal structures are used in non-profit organizations, while informal structures are used in for-profit organizations', 'option_b', 'Formal organizational structures are based on rules, procedures, and a clear hierarchy of authority, while informal structures are based on personal relationships and networks.', '2025-09-15 16:25:25'),
(191, 17, 'Which of the following is a characteristic of an informal organizational structure?', 'A clear hierarchy of authority', 'Well-defined roles and responsibilities', 'Flexibility and adaptability', 'A focus on rules and procedures', 'option_c', 'Informal organizational structures are characterized by flexibility and adaptability, as well as a lack of formal rules and procedures.', '2025-09-15 16:25:27'),
(192, 17, 'What is the advantage of a formal organizational structure?', 'It allows for more flexibility and autonomy', 'It provides a clear hierarchy of authority and well-defined roles and responsibilities', 'It is more suitable for small organizations', 'It is more suitable for non-profit organizations', 'option_b', 'A formal organizational structure provides a clear hierarchy of authority and well-defined roles and responsibilities, which can help to improve communication, coordination, and decision-making.', '2025-09-15 16:25:29'),
(193, 17, 'Which of the following is a disadvantage of an informal organizational structure?', 'It can lead to confusion and uncertainty', 'It can lead to a lack of accountability', 'It can lead to a lack of flexibility and adaptability', 'It can lead to a focus on rules and procedures', 'option_a', 'An informal organizational structure can lead to confusion and uncertainty, as well as a lack of clarity around roles and responsibilities.', '2025-09-15 16:25:31'),
(194, 17, 'What is the role of leadership in shaping an organization\'s structure?', 'Leadership has no role in shaping an organization\'s structure', 'Leadership plays a minor role in shaping an organization\'s structure', 'Leadership plays a significant role in shaping an organization\'s structure', 'Leadership is the sole determinant of an organization\'s structure', 'option_c', 'Leadership plays a significant role in shaping an organization\'s structure, as leaders can influence the design of the organization and the way it operates.', '2025-09-15 16:25:33'),
(195, 17, 'How do organizational structures impact employee behavior?', 'Organizational structures have no impact on employee behavior', 'Organizational structures can influence employee motivation and job satisfaction', 'Organizational structures can influence employee communication and coordination', 'Organizational structures can influence all of the above', 'option_d', 'Organizational structures can influence employee behavior in a variety of ways, including motivation, job satisfaction, communication, and coordination.', '2025-09-15 16:25:35'),
(196, 17, 'What is the relationship between organizational structure and organizational culture?', 'Organizational structure and culture are unrelated', 'Organizational structure influences organizational culture', 'Organizational culture influences organizational structure', 'Organizational structure and culture are interdependent', 'option_d', 'Organizational structure and culture are interdependent, as the design of the organization can influence the values, norms, and beliefs of its members, and vice versa.', '2025-09-15 16:25:37'),
(197, 17, 'How do external factors influence an organization\'s structure?', 'External factors have no influence on an organization\'s structure', 'External factors, such as technology and globalization, can influence an organization\'s structure', 'External factors, such as government regulations and industry trends, can influence an organization\'s structure', 'All of the above external factors can influence an organization\'s structure', 'option_d', 'External factors, such as technology, globalization, government regulations, and industry trends, can all influence an organization\'s structure, as organizations must adapt to their environment in order to survive and thrive.', '2025-09-15 16:25:39'),
(198, 17, 'What is the impact of a formal organizational structure on innovation?', 'A formal organizational structure can hinder innovation', 'A formal organizational structure can facilitate innovation', 'A formal organizational structure has no impact on innovation', 'The impact of a formal organizational structure on innovation depends on the context', 'option_d', 'The impact of a formal organizational structure on innovation depends on the context, as a formal structure can provide the stability and resources needed for innovation, but can also stifle creativity and risk-taking.', '2025-09-15 16:25:41'),
(199, 17, 'How can organizations balance the need for structure and flexibility?', 'By adopting a purely formal or informal structure', 'By using a combination of formal and informal structures', 'By constantly changing the organizational structure', 'By ignoring the need for structure and flexibility', 'option_b', 'Organizations can balance the need for structure and flexibility by using a combination of formal and informal structures, such as having a formal hierarchy but also allowing for flexible and autonomous teams.', '2025-09-15 16:25:44'),
(200, 18, 'Which of the following is the first stage of group development, characterized by uncertainty about the group\'s purpose, structure, and leadership?', 'Storming', 'Norming', 'Forming', 'Performing', 'option_c', 'The Forming stage is the initial phase where members are unsure about the group\'s objectives and leadership, focusing on getting acquainted.', '2025-09-15 16:25:46'),
(201, 18, 'During which stage of group development do intragroup conflicts often arise as members resist the constraints that the group imposes on individuality?', 'Forming', 'Storming', 'Norming', 'Performing', 'option_b', 'The Storming stage is characterized by conflict and resistance to group influence as members assert their individuality and deal with power structures.', '2025-09-15 16:25:48'),
(202, 18, 'A project team experiences high levels of agreement and discourages dissenting opinions, leading to a flawed decision despite individual members having doubts. This scenario best illustrates:', 'Social loafing', 'Group cohesiveness', 'Groupthink', 'Norming', 'option_c', 'Groupthink occurs when a highly cohesive group prioritizes conformity and harmony, leading to irrational or dysfunctional decision-making, often suppressing dissenting views.', '2025-09-15 16:25:50'),
(203, 18, 'What are the shared expectations that guide the behavior of group members called?', 'Group roles', 'Group status', 'Group norms', 'Group cohesiveness', 'option_c', 'Group norms are unwritten rules or standards of behavior that are accepted and shared by members of a group.', '2025-09-15 16:25:52'),
(204, 18, 'Which of the following factors is most likely to increase group cohesiveness?', 'Large group size', 'External threats', 'Frequent member turnover', 'Absence of clear goals', 'option_b', 'External threats or competition often lead group members to unite and work together more closely, thereby increasing group cohesiveness.', '2025-09-15 16:25:54'),
(205, 18, 'In a cross-functional team, an individual consistently defers responsibility and contributes less effort when working collectively than when working alone, expecting others to pick up the slack. This behavior is known as:', 'Social facilitation', 'Social loafing', 'Group polarization', 'Role ambiguity', 'option_b', 'Social loafing is the tendency for individuals to exert less effort when working as part of a group than when working alone, due to diffused responsibility.', '2025-09-15 16:25:56'),
(206, 18, 'The stage where a group develops close relationships and demonstrates cohesiveness is known as:', 'Storming', 'Norming', 'Performing', 'Adjourning', 'option_b', 'The Norming stage is where group members develop close relationships and demonstrate cohesiveness, establishing a sense of group identity.', '2025-09-15 16:25:58'),
(207, 18, 'Which of the following is a primary characteristic distinguishing a \"team\" from a \"group\"?', 'A team always has a formal leader, whereas a group might not.', 'Team members share a collective performance goal and mutual accountability.', 'Groups have individual accountability, while teams do not.', 'Teams are generally larger in size than groups.', 'option_b', 'A key differentiator for a team is mutual accountability for a collective performance goal, whereas in a group, members primarily have individual accountability.', '2025-09-15 16:26:00'),
(208, 18, 'A manager notices that her team, despite being highly skilled, is struggling to reach decisions and implement them effectively. She observes that members often engage in personal attacks during disagreements rather than focusing on the task. This suggests a problem primarily in which aspect of group dynamics?', 'Group status hierarchy', 'Development of group norms', 'Task-oriented roles', 'Managing conflict and communication', 'option_d', 'Personal attacks during disagreements indicate ineffective conflict management and poor communication, hindering decision-making and task implementation. It points to a breakdown in process.', '2025-09-15 16:26:02'),
(209, 18, 'The final stage in Tuckman\'s model for temporary groups, where the group disbands, is called:', 'Performing', 'Terminating', 'Adjourning', 'Concluding', 'option_c', 'The Adjourning stage is the fifth and final stage in Tuckman\'s model, primarily for temporary groups, where the group prepares for its dissolution.', '2025-09-15 16:26:04'),
(210, 19, 'What is the primary factor that influences individual behavior in an organization?', 'Personality', 'Environment', 'Culture', 'Motivation', 'option_a', 'Personality is the primary factor that influences individual behavior in an organization as it determines how individuals perceive and interact with their environment.', '2025-09-15 16:26:06'),
(211, 19, 'Which of the following theories suggests that individual behavior is influenced by their perceptions and attitudes?', 'Maslow\'s Hierarchy of Needs', 'Herzberg\'s Two-Factor Theory', 'McClelland\'s Acquired Needs Theory', 'Cognitive Dissonance Theory', 'option_d', 'Cognitive Dissonance Theory suggests that individual behavior is influenced by their perceptions and attitudes, and that they tend to avoid inconsistent or conflicting information.', '2025-09-15 16:26:08'),
(212, 19, 'What is the term for the process by which individuals learn and adapt to new situations and environments?', 'Socialization', 'Enculturation', 'Acculturation', 'Learning', 'option_a', 'Socialization is the process by which individuals learn and adapt to new situations and environments, and it plays a crucial role in shaping their behavior and attitudes.', '2025-09-15 16:26:10'),
(213, 19, 'Which of the following factors can influence an individual\'s motivation and job satisfaction?', 'Personality traits', 'Job design', 'Leadership style', 'All of the above', 'option_d', 'All of the above factors can influence an individual\'s motivation and job satisfaction, as they can impact their perceptions, attitudes, and behaviors.', '2025-09-15 16:26:12'),
(214, 19, 'What is the term for the tendency for individuals to overestimate the importance of personality and underestimate the impact of situational factors in shaping behavior?', 'Fundamental attribution error', 'Self-serving bias', 'Hindsight bias', 'Confirmation bias', 'option_a', 'Fundamental attribution error refers to the tendency for individuals to overestimate the importance of personality and underestimate the impact of situational factors in shaping behavior.', '2025-09-15 16:26:14'),
(215, 19, 'Which of the following theories suggests that individual behavior is influenced by their underlying needs and motivations?', 'Maslow\'s Hierarchy of Needs', 'Herzberg\'s Two-Factor Theory', 'McClelland\'s Acquired Needs Theory', 'Self-Determination Theory', 'option_a', 'Maslow\'s Hierarchy of Needs suggests that individual behavior is influenced by their underlying needs and motivations, and that these needs are hierarchically organized.', '2025-09-15 16:26:16'),
(216, 19, 'What is the term for the process by which individuals form impressions and make judgments about others based on limited information?', 'Stereotyping', 'Prejudice', 'Discrimination', 'Impression formation', 'option_d', 'Impression formation refers to the process by which individuals form impressions and make judgments about others based on limited information, and it can be influenced by various cognitive biases.', '2025-09-15 16:26:18'),
(217, 19, 'Which of the following factors can influence an individual\'s emotional intelligence and well-being?', 'Personality traits', 'Emotional regulation', 'Social support', 'All of the above', 'option_d', 'All of the above factors can influence an individual\'s emotional intelligence and well-being, as they can impact their ability to recognize and manage their emotions, and to form and maintain social relationships.', '2025-09-15 16:26:20');
INSERT INTO `questions` (`id`, `topic_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `explanation`, `created_at`) VALUES
(218, 19, 'What is the term for the tendency for individuals to experience stress and anxiety when they perceive a discrepancy between their desired and actual selves?', 'Cognitive dissonance', 'Self-discrepancy theory', 'Emotional intelligence', 'Personality traits', 'option_b', 'Self-discrepancy theory suggests that individuals experience stress and anxiety when they perceive a discrepancy between their desired and actual selves, and that this discrepancy can motivate them to make changes.', '2025-09-15 16:26:22'),
(219, 19, 'Which of the following theories suggests that individual behavior is influenced by their underlying values and beliefs?', 'Theory of Planned Behavior', 'Self-Efficacy Theory', 'Social Learning Theory', 'Expectancy Theory', 'option_a', 'Theory of Planned Behavior suggests that individual behavior is influenced by their underlying values and beliefs, and that these values and beliefs can impact their attitudes and intentions.', '2025-09-15 16:26:24'),
(220, 20, 'What is the primary focus of organizational behavior?', 'To study the structure of an organization', 'To understand individual and group behavior in an organizational setting', 'To analyze the financial performance of an organization', 'To develop marketing strategies for an organization', 'option_b', 'Organizational behavior is a field of study that focuses on understanding individual and group behavior in an organizational setting. It examines the social and psychological factors that influence behavior and performance in organizations.', '2025-09-15 16:26:26'),
(221, 20, 'Which of the following is a key concept in organizational behavior?', 'Motivation', 'Leadership', 'Communication', 'All of the above', 'option_d', 'Motivation, leadership, and communication are all key concepts in organizational behavior. Motivation refers to the forces that drive individuals to achieve their goals, leadership refers to the process of influencing others to achieve a common goal, and communication refers to the process of exchanging information and ideas.', '2025-09-15 16:26:28'),
(222, 20, 'What is the difference between a formal and an informal organization?', 'A formal organization is structured and has a clear hierarchy, while an informal organization is unstructured and lacks a clear hierarchy', 'A formal organization is unstructured and lacks a clear hierarchy, while an informal organization is structured and has a clear hierarchy', 'A formal organization is focused on achieving specific goals, while an informal organization is focused on building relationships', 'A formal organization is small and flexible, while an informal organization is large and bureaucratic', 'option_a', 'A formal organization is structured and has a clear hierarchy, with well-defined roles and responsibilities. An informal organization, on the other hand, is unstructured and lacks a clear hierarchy, with roles and responsibilities that are often unclear or undefined.', '2025-09-15 16:26:30'),
(223, 20, 'What is the role of a manager in an organization?', 'To plan, organize, lead, and control', 'To motivate, communicate, and delegate', 'To recruit, select, and train', 'To monitor, evaluate, and reward', 'option_a', 'A manager\'s role in an organization is to plan, organize, lead, and control. This includes setting goals, allocating resources, directing employees, and monitoring performance.', '2025-09-15 16:26:32'),
(224, 20, 'What is the difference between a centralized and a decentralized organization?', 'A centralized organization makes decisions at the top level, while a decentralized organization makes decisions at the lower levels', 'A centralized organization makes decisions at the lower levels, while a decentralized organization makes decisions at the top level', 'A centralized organization is flexible and adaptable, while a decentralized organization is rigid and bureaucratic', 'A centralized organization is small and simple, while a decentralized organization is large and complex', 'option_a', 'A centralized organization makes decisions at the top level, with authority and decision-making power concentrated in the hands of a few individuals. A decentralized organization, on the other hand, makes decisions at the lower levels, with authority and decision-making power distributed among many individuals.', '2025-09-15 16:26:34'),
(225, 20, 'What is the concept of organizational culture?', 'The shared values, norms, and beliefs that shape behavior in an organization', 'The formal structure and hierarchy of an organization', 'The informal relationships and networks within an organization', 'The external environment and market conditions that affect an organization', 'option_a', 'Organizational culture refers to the shared values, norms, and beliefs that shape behavior in an organization. It influences how employees interact with each other, how they perceive the organization, and how they respond to challenges and opportunities.', '2025-09-15 16:26:36'),
(226, 20, 'What is the difference between a mechanistic and an organic organization?', 'A mechanistic organization is rigid and bureaucratic, while an organic organization is flexible and adaptable', 'A mechanistic organization is flexible and adaptable, while an organic organization is rigid and bureaucratic', 'A mechanistic organization is focused on efficiency and productivity, while an organic organization is focused on innovation and creativity', 'A mechanistic organization is small and simple, while an organic organization is large and complex', 'option_a', 'A mechanistic organization is rigid and bureaucratic, with a focus on efficiency and productivity. An organic organization, on the other hand, is flexible and adaptable, with a focus on innovation and creativity.', '2025-09-15 16:26:38'),
(227, 20, 'What is the concept of organizational learning?', 'The process of acquiring and applying knowledge to improve organizational performance', 'The process of developing and implementing new technologies', 'The process of recruiting and training new employees', 'The process of monitoring and evaluating organizational performance', 'option_a', 'Organizational learning refers to the process of acquiring and applying knowledge to improve organizational performance. It involves the creation, acquisition, and transfer of knowledge, as well as the modification of behavior and practices based on that knowledge.', '2025-09-15 16:26:40'),
(228, 20, 'What is the difference between a functional and a divisional organization?', 'A functional organization is structured around specific functions or departments, while a divisional organization is structured around specific products or markets', 'A functional organization is structured around specific products or markets, while a divisional organization is structured around specific functions or departments', 'A functional organization is flexible and adaptable, while a divisional organization is rigid and bureaucratic', 'A functional organization is small and simple, while a divisional organization is large and complex', 'option_a', 'A functional organization is structured around specific functions or departments, such as marketing, finance, or human resources. A divisional organization, on the other hand, is structured around specific products or markets, with each division responsible for a specific product or market.', '2025-09-15 16:26:42'),
(229, 20, 'What is the concept of organizational change?', 'The process of planning, implementing, and evaluating changes to an organization\'s structure, culture, or technology', 'The process of developing and implementing new strategies', 'The process of recruiting and training new employees', 'The process of monitoring and evaluating organizational performance', 'option_a', 'Organizational change refers to the process of planning, implementing, and evaluating changes to an organization\'s structure, culture, or technology. It involves the identification of the need for change, the development of a plan for change, and the implementation and evaluation of that plan.', '2025-09-15 16:26:44'),
(230, 215, 'What does the acronym AMQP stand for in the context of messaging protocols?', 'Advanced Message Queue Protocol', 'Asynchronous Message Queuing Protocol', 'Advanced Messaging Quality Protocol', 'Asynchronous Message Quality Protocol', 'option_a', 'AMQP stands for Advanced Message Queuing Protocol, a standard for asynchronous message passing. It provides reliable and interoperable messaging between applications or systems.', '2025-09-15 16:26:46'),
(231, 215, 'In an AMQP system, which component is primarily responsible for sending messages?', 'Consumer', 'Broker', 'Exchange', 'Producer', 'option_d', 'A producer is the application that creates and sends messages to an AMQP broker. Consumers, on the other hand, receive and process messages from queues.', '2025-09-15 16:26:48'),
(232, 215, 'Which of the following is a core function of an AMQP broker?', 'Generating messages', 'Processing messages', 'Routing messages', 'Encrypting messages', 'option_c', 'An AMQP broker acts as an intermediary, receiving messages from producers and routing them to the appropriate queues based on defined rules and exchange types.', '2025-09-15 16:26:50'),
(233, 215, 'Which AMQP exchange type delivers a message to all queues bound to it, regardless of the routing key?', 'Direct', 'Topic', 'Fanout', 'Headers', 'option_c', 'A fanout exchange broadcasts all messages it receives to all connected queues. The routing key, if provided, is completely ignored for this exchange type, making it suitable for publish/subscribe scenarios.', '2025-09-15 16:26:52'),
(234, 215, 'What is the primary role of a \"binding\" in an AMQP messaging model?', 'To establish a connection between a producer and a broker.', 'To link an exchange to a queue using a routing key or header attributes.', 'To define the message format between a producer and a consumer.', 'To authenticate a consumer with the AMQP broker.', 'option_b', 'A binding is the link between an exchange and a queue. It uses a routing key or header attributes to determine which messages from the exchange should be delivered to that specific queue.', '2025-09-15 16:26:55'),
(235, 215, 'How does AMQP primarily ensure message reliability and data integrity during transmission?', 'By using UDP for faster delivery.', 'Through mandatory SSL/TLS encryption for all messages.', 'With mechanisms like publisher confirms and consumer acknowledgments.', 'By storing all messages indefinitely on the broker.', 'option_c', 'AMQP employs features like publisher confirms (ensuring the broker received the message) and consumer acknowledgments (ensuring the consumer processed the message) to guarantee reliable message delivery and processing.', '2025-09-15 16:26:57'),
(236, 215, 'A consumer application wants to receive messages that are processed in a specific, ordered manner without missing any. Which AMQP feature is crucial for achieving this?', 'Auto-acknowledgment mode.', 'Declaring an exclusive queue.', 'Manual acknowledgment with prefetch count.', 'Using a fanout exchange.', 'option_c', 'Manual acknowledgment allows a consumer to explicitly confirm message processing. Combined with a prefetch count, it prevents the broker from sending too many unacknowledged messages, ensuring ordered and reliable processing.', '2025-09-15 16:26:59'),
(237, 215, 'Consider an AMQP `topic` exchange. If a producer sends a message with the routing key `sensors.temperature.livingroom`, which of the following binding keys would cause a queue to receive this message?', '`sensors.temperature`', '`sensors.*.livingroom`', '`sensors.humidity.*`', '`sensors.#.temperature`', 'option_b', 'The `topic` exchange uses wildcard matching. `*` matches exactly one word, while `#` matches zero or more words. `sensors.*.livingroom` would match `sensors.temperature.livingroom` by matching \"temperature\" with `*`.', '2025-09-15 16:27:01'),
(238, 215, 'In AMQP, if a producer sends a message with the `mandatory` flag set to `true` to an exchange, and that message cannot be routed to any queue, what action will the broker take?', 'The message is silently dropped by the broker.', 'The broker logs an error but still drops the message.', 'The message is returned to the publisher.', 'The broker creates a new queue to hold the unroutable message.', 'option_c', 'When the `mandatory` flag is `true`, if an exchange cannot route a message to a queue, the broker will return the message to the publisher via the `basic.return` method, allowing the publisher to handle the unroutable message.', '2025-09-15 16:27:03'),
(239, 215, 'What is the fundamental difference in message consumption between competing consumers and multiple consumers on a fanout exchange?', 'Competing consumers each receive a copy, while fanout consumers share messages.', 'Competing consumers retrieve messages from a shared queue, while fanout consumers each get a unique message copy.', 'Competing consumers require unique queue names, while fanout consumers share a single queue.', 'Competing consumers use direct exchanges, while fanout consumers use topic exchanges.', 'option_b', 'Competing consumers typically share a single queue, and messages are distributed among them (processed once). Consumers on a fanout exchange each bind their own separate queue, and every message is delivered to all bound queues, meaning each consumer gets its own copy of the message.', '2025-09-15 16:27:05'),
(240, 215, 'An IoT application requires high throughput and resilience, where messages must be processed by one of several identical worker nodes. Which AMQP setup best supports this requirement?', 'A single producer sending to a direct exchange bound to multiple distinct queues, each with one consumer.', 'A producer sending to a fanout exchange with all worker nodes consuming from a single shared queue.', 'A producer sending to a direct exchange bound to a single queue, with multiple competing consumers for that queue.', 'A producer sending to a topic exchange with multiple queues, each queue bound with a different routing key.', 'option_c', 'For high throughput and resilience with identical worker nodes, multiple competing consumers on a single queue is ideal. The direct exchange ensures targeted delivery to that queue, and competing consumers distribute the load, ensuring parallel processing and fault tolerance.', '2025-09-15 16:27:07'),
(241, 215, 'Which of the following statements most accurately describes the \'pre-fetch count\' (Quality of Service - QoS) in AMQP for a consumer?', 'It defines the maximum number of messages a producer can send to the broker before awaiting confirmation.', 'It limits the number of unacknowledged messages a consumer will receive from the broker at any given time.', 'It specifies the maximum message size that can be transmitted over an AMQP channel.', 'It sets the time-to-live for messages in a queue before they are discarded.', 'option_b', 'The pre-fetch count (often set via `basic.qos`) allows a consumer to limit the number of unacknowledged messages it holds. This helps in managing consumer load, preventing resource exhaustion, and ensuring fair message distribution among competing consumers.', '2025-09-15 16:27:09'),
(242, 215, 'What does AMQP stand for in the context of messaging protocols?', 'Advanced Message Queueing Protocol', 'Asynchronous Message Querying Protocol', 'Automated Message Processing Protocol', 'Agile Message Quality Protocol', 'option_a', 'AMQP is an open standard for message-oriented middleware, allowing conforming clients to send and receive messages from any AMQP-compliant broker.\nIt focuses on enabling robust and interoperable messaging systems.', '2025-09-15 16:27:11'),
(243, 215, 'Which component in an AMQP system is responsible for receiving messages from producers and routing them to queues?', 'Consumer', 'Exchange', 'Queue', 'Binding', 'option_b', 'An Exchange is the first stop for a message published by a producer. It receives messages and routes them to one or more queues based on predefined rules like routing keys.', '2025-09-15 16:27:13'),
(244, 215, 'What is the primary role of a \'Queue\' in AMQP?', 'To send messages to exchanges', 'To store messages until a consumer retrieves them', 'To define routing logic for messages', 'To establish a connection between producers and brokers', 'option_b', 'An AMQP queue is a named entity that holds messages. Consumers subscribe to queues to receive messages when they become available, ensuring reliable message delivery.', '2025-09-15 16:27:15'),
(245, 215, 'In AMQP, what is a \'producer\'?', 'An application that receives messages', 'An application that sends messages', 'The central message broker', 'A routing mechanism', 'option_b', 'A producer is any application that publishes messages to an AMQP exchange. It does not directly send messages to a queue but rather to an exchange for routing.', '2025-09-15 16:27:17'),
(246, 215, 'Which AMQP exchange type delivers messages to all queues bound to it, ignoring routing keys?', 'Direct', 'Topic', 'Headers', 'Fanout', 'option_d', 'A Fanout exchange broadcasts all messages it receives to all queues that are bound to it. Routing keys are ignored by this exchange type, ensuring every bound queue gets a copy.', '2025-09-15 16:27:19'),
(247, 215, 'What is a \'binding\' in AMQP responsible for?', 'Connecting a producer to an exchange', 'Connecting a consumer to a queue', 'Connecting an exchange to a queue', 'Connecting two exchanges', 'option_c', 'A binding is a relationship between an exchange and a queue. It instructs the exchange to deliver messages to a specific queue based on criteria like a routing key.', '2025-09-15 16:27:21'),
(248, 215, 'How does a \'Direct\' exchange route messages in AMQP?', 'To all bound queues', 'Based on a full match between the routing key and binding key', 'Using wildcard patterns in the routing key', 'Based on message header attributes', 'option_b', 'A Direct exchange delivers messages to queues whose binding key exactly matches the routing key of the message. This provides precise, one-to-one or one-to-many routing.', '2025-09-15 16:27:23'),
(249, 215, 'What is the purpose of message \'acknowledgement\' in AMQP?', 'To confirm that a message has been routed to an exchange', 'To confirm that a message has been successfully delivered and processed by a consumer', 'To confirm that a message has been stored persistently', 'To confirm a new queue has been declared', 'option_b', 'Acknowledgement mechanisms allow consumers to inform the broker that they have successfully received and processed a message. This ensures reliable delivery, as messages are re-queued if not acknowledged.', '2025-09-15 16:27:25'),
(250, 215, 'Which of the following best describes \'message persistence\' in AMQP?', 'Messages are stored in memory until consumed', 'Messages are stored to disk to survive broker restarts', 'Messages are automatically re-sent if not acknowledged', 'Messages are guaranteed to be delivered in order', 'option_b', 'Message persistence ensures that messages survive a broker restart. If a message is marked persistent and published to a durable queue, it will be recovered after the broker goes down and comes back up.', '2025-09-15 16:27:27'),
(251, 215, 'In an AMQP \'Topic\' exchange, which routing key would correctly match a binding key of \"sensor.zone1.*\"?', 'sensor.zone1.temperature', 'sensor.zone1', 'sensor.zone1.humidity.level.high', 'sensor.zone2.temperature', 'option_a', 'The \'*\' wildcard in a Topic exchange matches exactly one word. \"sensor.zone1.*\" matches \"sensor.zone1.temperature\" (one word after \"zone1\"). \"sensor.zone1\" has zero words, and \"sensor.zone1.humidity.level.high\" has two words after \"zone1\".', '2025-09-15 16:27:29'),
(252, 215, 'If a message published to an AMQP \'Direct\' exchange with a specific routing key finds no matching bound queues, what is the default behavior?', 'The message is returned to the producer', 'The message is delivered to a dead-letter queue', 'The message is silently dropped', 'The broker raises an error and terminates the connection', 'option_c', 'By default, if a message published to a Direct exchange cannot be routed to any queue, it is silently dropped by the broker. Producers can specify the \'mandatory\' flag to request unroutable messages be returned.', '2025-09-15 16:27:31'),
(253, 215, 'Consider an AMQP setup with a \'Topic\' exchange and two queues: QueueA bound with \"logs.*.error\" and QueueB bound with \"logs.app.#\". A message arrives with routing key \"logs.app.server1.critical\". To which queue(s) will it be delivered?', 'Only QueueA', 'Only QueueB', 'Both QueueA and QueueB', 'Neither QueueA nor QueueB', 'option_b', 'QueueA\'s binding \"logs.*.error\" requires two words after \"logs.\" and the second one must be \"error\"; \"logs.app.server1.critical\" does not match. QueueB\'s binding \"logs.app.#\" matches \"logs.app\" followed by zero or more words, which \"server1.critical\" satisfies.', '2025-09-15 16:27:33'),
(254, 215, 'What is the primary advantage of using \'Virtual Hosts\' in AMQP?', 'To provide load balancing across multiple brokers', 'To isolate environments (users, exchanges, queues) within a single broker instance', 'To encrypt messages during transit', 'To enable message compression for faster delivery', 'option_b', 'Virtual hosts provide a way to segregate applications and users within the same AMQP broker instance. Each virtual host acts as an independent miniature broker, isolating configurations and resources for different applications.', '2025-09-15 16:27:35'),
(255, 215, 'In AMQP, what mechanism is used to ensure a consumer receives each message at most once, even if the consumer crashes after processing but before acknowledging?', 'Automatic re-queueing by the broker', 'Producer-side message deduplication', 'Consumer-side idempotent message processing and manual acknowledgements', 'Time-to-live (TTL) on messages', 'option_c', 'To achieve \"at most once\" delivery with recovery, consumers must be idempotent (processing the same message multiple times has no side effects) and use manual acknowledgements. If a crash occurs after processing but before ACK, the message will be redelivered, but idempotency handles the duplicate effectively.', '2025-09-15 16:27:37'),
(256, 215, 'A producer publishes a message with the `mandatory` flag set to `True`. If this message cannot be routed to any queue, what happens?', 'The message is silently dropped', 'The broker sends the message to a default \'dead-letter\' queue', 'The message is returned to the publishing producer', 'The broker throws an exception and closes the channel', 'option_c', 'When the `mandatory` flag is set to `True`, the broker will return the unroutable message to the producer using a `Basic.Return` method. If `mandatory` is `False` (default), the message is silently dropped without notification.', '2025-09-15 16:27:39'),
(257, 216, 'Which application layer protocol is specifically designed for constrained devices and networks, often running over UDP, and provides a RESTful architecture similar to HTTP?', 'MQTT', 'AMQP', 'CoAP', 'DDS', 'option_c', 'CoAP (Constrained Application Protocol) is optimized for constrained nodes and networks, using UDP as its transport layer and offering a RESTful interface for IoT devices.', '2025-09-15 16:27:41'),
(258, 216, 'MQTT (Message Queuing Telemetry Transport) operates on which messaging pattern primarily?', 'Request/Response', 'Point-to-point', 'Publish/Subscribe', 'Remote Procedure Call', 'option_c', 'MQTT is a lightweight messaging protocol that uses a publish/subscribe model, where clients publish messages to a broker and other clients subscribe to topics.', '2025-09-15 16:27:43'),
(259, 216, 'What is a key advantage of using CoAP over HTTP for deeply embedded IoT devices with limited resources?', 'CoAP supports more complex data structures and larger message payloads.', 'CoAP offers built-in end-to-end encryption by default, unlike HTTP.', 'CoAP is designed to run efficiently over UDP, reducing overhead and supporting simpler header formats.', 'CoAP provides stronger Quality of Service (QoS) guarantees than HTTP.', 'option_c', 'CoAP\'s design focuses on minimizing overhead by using UDP, smaller message sizes, and simpler parsing, making it suitable for resource-constrained IoT devices where HTTP is too heavy.', '2025-09-15 16:27:45'),
(260, 216, 'Which of the following Quality of Service (QoS) levels in MQTT guarantees that a message is delivered at least once, but could be delivered multiple times?', 'QoS 0 (At most once)', 'QoS 1 (At least once)', 'QoS 2 (Exactly once)', 'QoS 3 (Reliable once)', 'option_b', 'MQTT QoS 1 ensures a message reaches the recipient at least once. If the sender doesn\'t receive an acknowledgement (PUBACK), it retransmits, potentially leading to duplicates.', '2025-09-15 16:27:47'),
(261, 216, 'In an MQTT architecture, what is the primary function of the \'broker\'?', 'To store all historical sensor data from connected devices.', 'To manage device authentication and authorization only.', 'To receive messages from publishers and forward them to relevant subscribers based on topics.', 'To perform complex data analytics on incoming telemetry.', 'option_c', 'The MQTT broker acts as a central hub, receiving published messages from clients and distributing them to all clients that have subscribed to the respective topics.', '2025-09-15 16:27:49'),
(262, 216, 'Consider an IoT scenario requiring guaranteed, high-throughput, real-time data exchange between multiple applications without a central broker, often used in industrial control or autonomous systems. Which protocol is best suited for this?', 'MQTT', 'CoAP', 'AMQP', 'DDS', 'option_d', 'DDS (Data Distribution Service) is designed for real-time, peer-to-peer data distribution with high performance and reliability, making it ideal for critical industrial and autonomous systems.', '2025-09-15 16:27:51'),
(263, 216, 'A developer is designing an IoT application where devices frequently go offline and reconnect. Messages published while a device is offline must be delivered upon its reconnection. Which MQTT feature addresses this requirement?', 'Retained Messages', 'Last Will and Testament', 'Persistent Sessions', 'Keep Alive', 'option_c', 'MQTT Persistent Sessions allow a client\'s subscription state and undelivered messages to be stored by the broker even when the client is disconnected, ensuring delivery upon reconnection.', '2025-09-15 16:27:53'),
(264, 216, 'While HTTP is commonly used for cloud-to-device communication in IoT, what is its primary drawback when used for highly constrained edge devices generating frequent, small data packets?', 'Lack of security features for IoT.', 'Inability to support diverse data formats.', 'High overhead due to verbose headers and TCP handshake for each request.', 'Insufficient support for request/response messaging.', 'option_c', 'HTTP\'s verbose headers and the overhead of establishing a new TCP connection for each request make it inefficient for constrained devices sending many small data packets, consuming significant bandwidth and power.', '2025-09-15 16:27:55'),
(265, 216, 'Which of the following statements accurately distinguishes CoAP from MQTT in terms of message exchange patterns?', 'CoAP is primarily publish/subscribe, while MQTT is strictly request/response.', 'CoAP typically follows a request/response model, while MQTT uses publish/subscribe.', 'Both CoAP and MQTT are exclusively peer-to-peer without any central components.', 'CoAP offers reliable multicast, whereas MQTT is unicast only.', 'option_b', 'CoAP primarily uses a request/response model, similar to HTTP but optimized for constraints. MQTT, on the other hand, is a publish/subscribe protocol with a central broker.', '2025-09-15 16:27:57'),
(266, 216, 'Which application layer protocol provides advanced routing capabilities, message queues, and often includes features like transactions and acknowledgments, making it suitable for enterprise-level messaging in IoT backends?', 'MQTT', 'CoAP', 'AMQP', 'HTTP', 'option_c', 'AMQP (Advanced Message Queuing Protocol) is a robust, open standard for message-oriented middleware, offering sophisticated routing, queuing, and reliability features suitable for complex enterprise integration.', '2025-09-15 16:28:00'),
(267, 216, 'A smart city application needs to broadcast emergency alerts to a large number of diverse IoT devices, where immediate delivery is crucial but some packet loss can be tolerated. Which protocol, leveraging UDP, would be most suitable for this efficient one-to-many communication?', 'MQTT with QoS 2', 'HTTP/2', 'CoAP with Multicast', 'AMQP with fanout exchange', 'option_c', 'CoAP, being UDP-based, supports efficient multicast, which is well-suited for broadcasting messages to multiple devices simultaneously, especially when some loss is acceptable for speed.', '2025-09-15 16:28:02'),
(268, 216, 'What is a fundamental architectural difference between MQTT and DDS?', 'MQTT requires a central broker, while DDS enables direct peer-to-peer data exchange without a central server.', 'DDS is designed for constrained devices, while MQTT is for high-performance enterprise systems.', 'MQTT uses TCP, while DDS exclusively uses UDP.', 'DDS supports only synchronous communication, while MQTT is asynchronous.', 'option_a', 'MQTT relies on a central broker to mediate communication between publishers and subscribers. DDS, however, uses a decentralized peer-to-peer architecture for direct data exchange.', '2025-09-15 16:28:04'),
(269, 216, 'In the context of IoT security, what primary benefit does DTLS (Datagram Transport Layer Security) provide when used with CoAP?', 'It enables efficient persistent sessions for offline message delivery.', 'It secures communication by providing encryption, data integrity, and authentication for UDP.', 'It reduces message overhead by compressing CoAP headers.', 'It allows CoAP to operate over TCP for enhanced reliability.', 'option_b', 'DTLS is the security protocol for UDP-based communications, analogous to TLS for TCP. It provides essential security services like encryption, integrity, and authentication for CoAP.', '2025-09-15 16:28:06'),
(270, 217, 'In BLE, which device typically initiates a connection after discovering an advertiser?', 'Peripheral', 'Advertiser', 'Central', 'Slave', 'option_c', 'A Central device scans for advertising peripherals and initiates a connection upon discovery. Once connected, the Central device assumes the Master role.', '2025-09-15 16:28:08'),
(271, 217, 'What is the primary purpose of the \'advertising interval\' in BLE?', 'Determines how often a Central device scans', 'Defines the frequency at which a Peripheral sends advertisement packets', 'Sets the data transfer rate during a connection', 'Specifies the maximum time a connection can remain inactive', 'option_b', 'The advertising interval dictates how often an advertiser broadcasts its presence to potential scanners. A shorter interval increases discoverability but consumes more power for the advertising device.', '2025-09-15 16:28:10'),
(272, 217, 'Which BLE role is primarily responsible for broadcasting advertisement packets to signal its presence?', 'Central', 'Master', 'Initiator', 'Peripheral', 'option_d', 'A Peripheral device advertises its services and data, allowing Central devices to discover and connect to it. Once connected, the Peripheral typically assumes the Slave role.', '2025-09-15 16:28:12'),
(273, 217, 'How does a shorter \'Connection Interval\' generally impact power consumption for a BLE peripheral?', 'Leads to lower power consumption', 'Has no significant impact on power consumption', 'Leads to higher power consumption', 'Only affects the Central\'s power consumption', 'option_c', 'A shorter connection interval requires both connected devices, especially the peripheral, to wake up more frequently to exchange data. This increased activity directly results in higher average power consumption.', '2025-09-15 16:28:14'),
(274, 217, 'A BLE connection\'s \'Supervision Timeout\' is exceeded. What is the immediate consequence for both devices?', 'The Central device attempts to re-establish the connection', 'The connection enters a low-power sleep state', 'Both devices automatically assume the connection is lost and disconnect', 'The Peripheral device immediately starts re-advertising', 'option_c', 'If no data packets are successfully exchanged between the connected devices within the defined Supervision Timeout period, both the Master and Slave consider the link broken and terminate the connection.', '2025-09-15 16:28:16'),
(275, 217, 'What is the primary benefit of utilizing \'Slave Latency\' in a BLE connection?', 'Increases the data throughput for the slave device', 'Reduces the master\'s average power consumption', 'Lowers the slave\'s average power consumption', 'Ensures faster reconnection after a disconnection event', 'option_c', 'Slave Latency allows the slave to skip a specified number of connection events when it has no data to send, enabling it to stay in a deep sleep state longer and significantly reducing its average power consumption.', '2025-09-15 16:28:18'),
(276, 217, 'Consider a BLE application where a sensor needs to report data every 100ms, and immediate notification of critical events is paramount. Which connection parameter set is generally *least* suitable for this scenario due to latency issues?', 'Interval: 20ms, Latency: 0, Timeout: 2000ms', 'Interval: 100ms, Latency: 4, Timeout: 4000ms', 'Interval: 50ms, Latency: 0, Timeout: 1000ms', 'Interval: 1000ms, Latency: 9, Timeout: 6000ms', 'option_d', 'With a 1000ms interval and 9 slave latency, the slave could potentially delay waking up for up to (1000ms * (9+1)) = 10 seconds. This far exceeds the 100ms reporting requirement and makes immediate critical event notifications impossible.', '2025-09-15 16:28:20'),
(277, 217, 'What is the correct sequence of Link Layer states for a BLE device moving from an idle state to a connected state, specifically focusing on the initiation process?', 'Advertising -> Scanning -> Initiating -> Connection', 'Standby -> Advertising -> Connection -> Data Transfer', 'Standby -> Scanning -> Advertising -> Connection', 'Standby -> Advertising (Peripheral) / Standby -> Scanning (Central) -> Initiating -> Connection', 'option_d', 'A Peripheral typically moves from Standby to Advertising. A Central moves from Standby to Scanning. Upon discovery, the Central (as Initiator) sends a CONNECT_REQ, moving both devices into the Connection state.', '2025-09-15 16:28:22'),
(278, 217, 'A BLE peripheral is designed to operate for months on a small battery. Which combination of connection handling strategies is most critical for achieving this ultra-low power consumption?', 'Using the shortest possible advertising interval and a small connection interval', 'Minimizing slave latency and connection supervision timeout', 'Maximizing slave latency and utilizing appropriate (longer) connection intervals', 'Continuously scanning for other devices and frequently renegotiating connection parameters', 'option_c', 'Maximizing slave latency allows the peripheral to skip many connection events, keeping it in deep sleep longer. Using longer connection intervals further reduces the frequency of wake-ups, both significantly contributing to extended battery life.', '2025-09-15 16:28:24'),
(279, 217, 'During the BLE connection establishment phase, which specific PDU (Protocol Data Unit) is sent by the Initiator to request a connection from an Advertiser?', 'ADV_IND', 'SCAN_REQ', 'CONNECT_REQ', 'SCAN_RSP', 'option_c', 'The CONNECT_REQ PDU is a dedicated Link Layer packet sent by an Initiator (typically a Central device) to a connectable Advertiser (Peripheral) to transition from advertising/scanning to a connected state.', '2025-09-15 16:28:26'),
(280, 217, 'If a BLE peripheral frequently experiences disconnections with a reported \'Connection Timeout\' error, which connection parameter is most likely configured too aggressively (i.e., too short) causing this instability?', 'Advertising Interval', 'Connection Interval', 'Slave Latency', 'Supervision Timeout', 'option_d', 'A \'Connection Timeout\' indicates that no packets were exchanged between the connected devices within the allowed Supervision Timeout period. If this value is too short, even minor packet loss or temporary radio interference can cause the connection to drop prematurely.', '2025-09-15 16:28:28'),
(281, 217, 'Which of the following is NOT a standard Link Layer PDU type specifically for BLE advertising packets as defined in the Bluetooth Core Specification?', 'ADV_IND', 'ADV_NONCONN_IND', 'ADV_SCAN_IND', 'ADV_CONN_DIRECT', 'option_d', 'The standard PDU types for advertising include ADV_IND, ADV_NONCONN_IND, ADV_SCAN_IND, and ADV_DIRECT_IND. ADV_CONN_DIRECT is not a recognized name for an advertising PDU in the BLE specification.', '2025-09-15 16:28:30'),
(282, 217, 'What is the typical limit on the number of simultaneous slave devices that a single BLE master (central) can connect to?', '1', '7', 'The BLE specification sets no limit', 'Varies by implementation, commonly 3-10', 'option_d', 'The BLE specification does not impose an architectural limit on the number of concurrent connections for a Central device. However, practical constraints due to hardware resources and software stack capabilities typically limit this to a range like 3 to 10 connections.', '2025-09-15 16:28:32'),
(283, 217, 'During active scanning, what additional packet does a BLE scanner send to an advertiser compared to passive scanning?', 'ADV_IND', 'SCAN_RSP', 'SCAN_REQ', 'CONNECT_REQ', 'option_c', 'In active scanning, after receiving an advertising packet (like ADV_IND or ADV_SCAN_IND), the scanner sends a SCAN_REQ PDU. The advertiser then responds with a SCAN_RSP containing additional device information. Passive scanning only listens.', '2025-09-15 16:28:34'),
(284, 217, 'Which characteristic property must be enabled for a GATT client to receive automatic, server-initiated updates of a characteristic\'s value without actively polling?', 'Read', 'Write', 'Notify', 'Authenticate', 'option_c', 'The \'Notify\' property allows a GATT server to send unacknowledged data packets to subscribed clients whenever the characteristic\'s value changes. This enables real-time updates without the client needing to repeatedly request the value.', '2025-09-15 16:28:36');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_results`
--

CREATE TABLE `quiz_results` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `quiz_id` int(11) DEFAULT NULL,
  `chapter_id` int(11) DEFAULT NULL,
  `score` int(11) NOT NULL,
  `max_score` int(11) NOT NULL DEFAULT 100,
  `xp_delta` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_results`
--

INSERT INTO `quiz_results` (`id`, `user_id`, `quiz_id`, `chapter_id`, `score`, `max_score`, `xp_delta`, `created_at`) VALUES
(1, 1, NULL, 1, 15, 100, -10, '2025-09-17 16:09:54');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `created_at`) VALUES
(1, 'Industrial Management and Entrepreneurship', '2025-09-15 14:44:38'),
(2, 'Big Data & Cloud Computing', '2025-09-15 14:44:38'),
(3, 'Android Programming', '2025-09-15 14:44:38'),
(4, 'Internet Of Things', '2025-09-15 14:44:38'),
(5, 'Python Programming', '2025-09-15 14:44:38'),
(6, 'Android Programming Lab', '2025-09-15 14:44:38'),
(7, 'Python Programming Lab', '2025-09-15 14:44:38'),
(8, 'Life Skills', '2025-09-15 14:44:38'),
(9, 'Project Work', '2025-09-15 14:44:38');

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--

CREATE TABLE `topics` (
  `id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `topics`
--

INSERT INTO `topics` (`id`, `chapter_id`, `name`) VALUES
(1, 1, 'Controlling: techniques and systems'),
(2, 1, 'Decision making process'),
(3, 1, 'Definition and scope of management'),
(4, 1, 'Globalization and management'),
(5, 1, 'Innovation and change management'),
(6, 1, 'Leading and motivation theories'),
(7, 1, 'Levels of management'),
(8, 1, 'Management ethics and social responsibility'),
(9, 1, 'Management theories and evolution'),
(10, 1, 'Managerial roles and functions'),
(11, 1, 'Organizing: structure and design'),
(12, 1, 'Planning: types and process'),
(13, 2, 'Centralization and decentralization'),
(14, 2, 'Conflict management'),
(15, 2, 'Definition of organization structure'),
(16, 2, 'Departmentation methods'),
(17, 2, 'Formal vs informal structure'),
(18, 2, 'Group dynamics'),
(19, 2, 'Individual behavior determinants'),
(20, 2, 'Introduction to organizational behavior'),
(21, 2, 'Job satisfaction'),
(22, 2, 'Leadership theories'),
(23, 2, 'Learning theories'),
(24, 2, 'Motivation concepts'),
(25, 2, 'Organizational change management'),
(26, 2, 'Organizational culture'),
(27, 2, 'Organizational design'),
(28, 2, 'Perception and attribution'),
(29, 2, 'Span of control'),
(30, 2, 'Teamwork and development'),
(31, 2, 'Types of organizational structures'),
(32, 3, 'Aggregate production planning'),
(33, 3, 'Capacity planning'),
(34, 3, 'Definition and scope'),
(35, 3, 'Inventory management'),
(36, 3, 'Just-in-time (JIT) principles'),
(37, 3, 'Layout planning and design'),
(38, 3, 'Maintenance and reliability'),
(39, 3, 'Material requirements planning (MRP)'),
(40, 3, 'Operations strategy'),
(41, 3, 'Process selection and design'),
(42, 3, 'Production planning and control'),
(43, 3, 'Quality management'),
(44, 3, 'Supply chain management'),
(45, 3, 'Types of production systems'),
(46, 4, 'Accident prevention strategies'),
(47, 4, 'Codes of conduct engineers'),
(48, 4, 'Collective bargaining concepts'),
(49, 4, 'Contract labour regulations'),
(50, 4, 'Employee rights and duties'),
(51, 4, 'Employer obligations and liabilities'),
(52, 4, 'Ethical dilemmas engineering practice'),
(53, 4, 'Factories Act overview'),
(54, 4, 'Industrial Disputes Act provisions'),
(55, 4, 'Introduction to Indian labour laws'),
(56, 4, 'Labour welfare measures'),
(57, 4, 'Minimum Wages Act application'),
(58, 4, 'Moral responsibilities engineers'),
(59, 4, 'Occupational health and safety'),
(60, 4, 'Professional ethics in engineering'),
(61, 4, 'Risk assessment and management'),
(62, 4, 'Safety regulations industrial settings'),
(63, 4, 'Social security legislation'),
(64, 4, 'Trade union rights'),
(65, 4, 'Workplace hazard identification'),
(66, 5, 'Building a startup team'),
(67, 5, 'Characteristics of entrepreneurs'),
(68, 5, 'Competitor analysis methods'),
(69, 5, 'Defining entrepreneurship'),
(70, 5, 'Developing a business plan'),
(71, 5, 'Exit strategies for founders'),
(72, 5, 'Financial projections and ratios'),
(73, 5, 'Identifying business opportunities'),
(74, 5, 'Intellectual property protection'),
(75, 5, 'Legal structures for startups'),
(76, 5, 'Market research techniques'),
(77, 5, 'Marketing strategies for startups'),
(78, 5, 'Risk management in startups'),
(79, 5, 'Scaling a business'),
(80, 5, 'Sources of startup funding'),
(81, 5, 'The entrepreneurial process'),
(82, 5, 'Types entrepreneurial ventures'),
(83, 6, 'Association rule mining'),
(84, 6, 'Classification algorithms'),
(85, 6, 'Clustering methodologies'),
(86, 6, 'Data mining definitions'),
(87, 6, 'Data mining vs analytics'),
(88, 6, 'Data preprocessing techniques'),
(89, 6, 'Data warehousing concepts'),
(90, 6, 'Knowledge discovery process'),
(91, 6, 'Pattern evaluation metrics'),
(92, 6, 'Text mining applications'),
(93, 7, 'Big data integration'),
(94, 7, 'Cloud data warehousing'),
(95, 7, 'Data cubes and dimensions'),
(96, 7, 'Data quality assurance'),
(97, 7, 'Data sources and integration'),
(98, 7, 'Data storage architectures'),
(99, 7, 'Data warehouse definition'),
(100, 7, 'ETL process fundamentals'),
(101, 7, 'Metadata management'),
(102, 7, 'OLAP versus OLTP systems'),
(103, 7, 'Purpose and applications'),
(104, 7, 'Scalability and performance'),
(105, 7, 'Schema design principles'),
(106, 7, 'Warehouse management tools'),
(107, 8, '5 Vs of Big Data'),
(108, 8, 'Big Data Challenges and Solutions'),
(109, 8, 'Big Data Definition and Scope'),
(110, 8, 'Big Data Visualization Methods'),
(111, 8, 'Case Studies in Big Data Applications'),
(112, 8, 'Cloud Computing Integration'),
(113, 8, 'Data Integration and ETL Processes'),
(114, 8, 'Data Mining vs. Big Data Analytics'),
(115, 8, 'Data Privacy and Security Issues'),
(116, 8, 'Data Sources and Types'),
(117, 8, 'Emerging Trends and Future Directions'),
(118, 8, 'Ethical Considerations in Data Handling'),
(119, 8, 'Industries Using Big Data'),
(120, 8, 'Key Tools and Technologies'),
(121, 8, 'Real-Time Data Processing Techniques'),
(122, 8, 'Scalability and Performance Optimization'),
(123, 8, 'Traditional vs. Big Data Processing'),
(124, 9, 'Data collection techniques'),
(125, 9, 'Data governance policies'),
(126, 9, 'Data lakes architecture'),
(127, 9, 'Data mining algorithms'),
(128, 9, 'Data quality management'),
(129, 9, 'Data security measures'),
(130, 9, 'Data storage solutions'),
(131, 9, 'Data visualization tools'),
(132, 9, 'Distributed computing models'),
(133, 9, 'ETL processes optimization'),
(134, 9, 'Hadoop ecosystem components'),
(135, 9, 'Machine learning integration'),
(136, 9, 'Real-time analytics processing'),
(137, 9, 'Scalability in big data'),
(138, 9, 'Spark processing frameworks'),
(139, 10, 'Access control mechanisms'),
(140, 10, 'Cloud computing models'),
(141, 10, 'Cloud security protocols'),
(142, 10, 'Data encryption methods'),
(143, 10, 'Elastic resource allocation'),
(144, 10, 'Hybrid cloud management'),
(145, 10, 'IaaS vs PaaS vs SaaS'),
(146, 10, 'Private cloud architecture'),
(147, 10, 'Public cloud deployment'),
(148, 10, 'Scalability in cloud systems'),
(149, 11, ' Android operating system'),
(150, 11, 'Activity lifecycle methods'),
(151, 11, 'Android framework components'),
(152, 11, 'Android history overview'),
(153, 11, 'Android software stack'),
(154, 11, 'Android user interface'),
(155, 11, 'Intent and intent filters'),
(156, 11, 'Layout managers and types'),
(157, 11, 'Linux kernel basics'),
(158, 11, 'View and view groups'),
(159, 12, 'Activity component lifecycle'),
(160, 12, 'Activity states and callbacks'),
(161, 12, 'Android application components'),
(162, 12, 'Broadcast Receiver overview'),
(163, 12, 'Content Provider basics'),
(164, 12, 'Explicit Intent usage'),
(165, 12, 'Implicit Intent invocation'),
(166, 12, 'Intent filters definition'),
(167, 12, 'Passing data via Intents'),
(168, 12, 'Saving and restoring state'),
(169, 12, 'Service component introduction'),
(170, 12, 'Task and back stack'),
(171, 13, 'Adapters and ListViews'),
(172, 13, 'Common UI Widgets'),
(173, 13, 'Custom View Creation'),
(174, 13, 'Dialogs and Toasts'),
(175, 13, 'Event Handling Mechanisms'),
(176, 13, 'Fragments and UI Modularity'),
(177, 13, 'Layouts and ViewGroups'),
(178, 13, 'Material Design Principles'),
(179, 13, 'Navigation Components'),
(180, 13, 'RecyclerView Implementation'),
(181, 13, 'Styling and Theming'),
(182, 13, 'User Input Forms'),
(183, 14, 'Advanced Fragment management'),
(184, 14, 'Advanced Notifications and channels'),
(185, 14, 'App performance optimization'),
(186, 14, 'Content Provider implementation'),
(187, 14, 'Custom Broadcast Receiver patterns'),
(188, 14, 'Dependency Injection with Hilt'),
(189, 14, 'Foreground and background services'),
(190, 14, 'Location and Geofencing APIs'),
(191, 14, 'Multithreading with Coroutines'),
(192, 14, 'Sensor data processing'),
(193, 14, 'Testing strategies and frameworks'),
(194, 14, 'WorkManager for deferred tasks'),
(195, 15, 'Async database operations'),
(196, 15, 'Content provider implementation'),
(197, 15, 'Data backup and restore'),
(198, 15, 'Data persistence techniques'),
(199, 15, 'Database migration strategies'),
(200, 15, 'Database schema design'),
(201, 15, 'Database security measures'),
(202, 15, 'Room persistence library'),
(203, 15, 'SQL queries and execution'),
(204, 15, 'SQLite database creation'),
(205, 16, 'Cloud computing integration'),
(206, 16, 'Connectivity protocols'),
(207, 16, 'Data collection mechanisms'),
(208, 16, 'Definition and scope'),
(209, 16, 'Edge processing relevance'),
(210, 16, 'Historical evolution'),
(211, 16, 'Industry use cases (Healthcare, Agriculture, etc.)'),
(212, 16, 'Key components'),
(213, 16, 'Security vulnerabilities'),
(214, 16, 'Smart device ecosystem'),
(215, 17, 'AMQP Messaging'),
(216, 17, 'Application Layer Protocols'),
(217, 17, 'BLE Connection Handling'),
(218, 17, 'CBOR Efficiency Testing'),
(219, 17, 'CoAP Observability'),
(220, 17, 'CoAP Resource Discovery'),
(221, 17, 'DTLS Encryption Models'),
(222, 17, 'HTTP/REST Connectivity'),
(223, 17, 'JSON Data Exchange'),
(224, 17, 'LoRaWAN Data Rates'),
(225, 17, 'MQTT Communication'),
(226, 17, 'MQTT over WebSockets'),
(227, 17, 'MQTT QoS Levels'),
(228, 17, 'OPC UA for Industrial IoT'),
(229, 17, 'Payload Format Optimization'),
(230, 17, 'Protocol Buffers Usage'),
(231, 17, 'Protocol Stack Integration'),
(232, 17, 'Time Synchronization Protocols'),
(233, 17, 'UDP Reliability Limitations'),
(234, 17, 'Zigbee Reliability Metrics'),
(235, 18, '6LoWPAN Wireless Networking Adaptation'),
(236, 18, 'Bluetooth Low Energy (BLE)'),
(237, 18, 'Cellular Network Requirements'),
(238, 18, 'CoAP Design For RESTful Integration'),
(239, 18, 'Infrared Remote Communication'),
(240, 18, 'IoT Gateway Configurations'),
(241, 18, 'LoRaWAN Deployment Models'),
(242, 18, 'LTE-M Connectivity For Devices'),
(243, 18, 'MQTT Architectures And Messaging'),
(244, 18, 'Narrowband IoT (NB-IoT)'),
(245, 18, 'RFID Sensor Applications'),
(246, 18, 'Thread Protocol Frameworks'),
(247, 18, 'Wi-Fi Direct Establishments'),
(248, 18, 'Z-Wave Interoperability'),
(249, 18, 'Zigbee Network Protocols'),
(250, 19, 'Architecture of Sensor Networks'),
(251, 19, 'Coverage and Connectivity'),
(252, 19, 'Data Aggregation Techniques'),
(253, 19, 'Energy Efficient Routing'),
(254, 19, 'Environmental Monitoring Applications'),
(255, 19, 'Low-power Communication Technologies'),
(256, 19, 'MAC Protocols in WSN'),
(257, 19, 'Mesh and Star Topologies'),
(258, 19, 'Node Deployment Strategies'),
(259, 19, 'Security Challenges in Sensor Networks'),
(260, 19, 'Wireless Sensor Network Clustering'),
(261, 20, 'Agriculture IoT sensors'),
(262, 20, 'Emerging IoT technologies'),
(263, 20, 'Environmental monitoring networks'),
(264, 20, 'Healthcare monitoring devices'),
(265, 20, 'Industrial automation systems'),
(266, 20, 'Security vulnerabilities in IoT'),
(267, 20, 'Smart cities infrastructure'),
(268, 20, 'Smart home automation'),
(269, 20, 'Transportation IoT integration'),
(270, 20, 'Wearable technology applications');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `profile_image` longblob DEFAULT NULL,
  `level` tinyint(3) UNSIGNED DEFAULT 1,
  `xp` int(11) NOT NULL DEFAULT 20,
  `progress` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `streak` int(11) NOT NULL DEFAULT 0,
  `last_streak_date` date DEFAULT NULL,
  `daily_attempts` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `daily_attempts_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `profile_image`, `level`, `xp`, `progress`, `streak`, `last_streak_date`, `daily_attempts`, `daily_attempts_date`, `created_at`) VALUES
(1, 'sharuk', 'sharuk@gmail.com', '$2y$10$CN8OV9LINzuVbdVZyE37Bu6VpFeECCS9EqNKRSS5OtymPKQjcZVbS', NULL, 1, 10, 3, 0, NULL, 1, '2025-09-17', '2025-09-17 16:08:32'),
(2, 'reddy', 'reddy@gmail.com', '$2y$10$995Ng4WpRy5MIafFssyEA./6sX1kV0L7ALLwFS7O9qXzPqB/W8UY.', NULL, 1, 20, 0, 0, NULL, 0, NULL, '2025-09-17 16:10:56');

-- --------------------------------------------------------

--
-- Table structure for table `user_achievements`
--

CREATE TABLE `user_achievements` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `achievement_name` varchar(255) NOT NULL,
  `achieved_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_activity`
--

CREATE TABLE `user_activity` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `activity_type` varchar(64) NOT NULL,
  `meta` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_activity`
--

INSERT INTO `user_activity` (`id`, `user_id`, `activity_type`, `meta`, `created_at`) VALUES
(1, 1, 'quiz_submitted', '{\"chapter_id\":1,\"score\":15,\"xp_delta\":-10}', '2025-09-17 16:09:54');

-- --------------------------------------------------------

--
-- Table structure for table `user_quiz_progress`
--

CREATE TABLE `user_quiz_progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `score` int(11) DEFAULT 0,
  `completed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_quiz_progress`
--

INSERT INTO `user_quiz_progress` (`id`, `user_id`, `chapter_id`, `score`, `completed_at`) VALUES
(1, 1, 1, 15, '2025-09-17 16:09:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_subject_id` (`subject_id`);

--
-- Indexes for table `daily_attempts`
--
ALTER TABLE `daily_attempts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_user_date` (`user_id`,`date`),
  ADD KEY `da_user_idx` (`user_id`);

--
-- Indexes for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_topic_id` (`topic_id`);

--
-- Indexes for table `quiz_results`
--
ALTER TABLE `quiz_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `qr_user_idx` (`user_id`),
  ADD KEY `qr_chapter_idx` (`chapter_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chapter_id` (`chapter_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_user_achievement` (`user_id`,`achievement_name`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `user_activity`
--
ALTER TABLE `user_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `user_quiz_progress`
--
ALTER TABLE `user_quiz_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_user_chapter` (`user_id`,`chapter_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_chapter_id` (`chapter_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chapters`
--
ALTER TABLE `chapters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `daily_attempts`
--
ALTER TABLE `daily_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leaderboard`
--
ALTER TABLE `leaderboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=285;

--
-- AUTO_INCREMENT for table `quiz_results`
--
ALTER TABLE `quiz_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `topics`
--
ALTER TABLE `topics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=271;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_achievements`
--
ALTER TABLE `user_achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_activity`
--
ALTER TABLE `user_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_quiz_progress`
--
ALTER TABLE `user_quiz_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD CONSTRAINT `leaderboard_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `topics`
--
ALTER TABLE `topics`
  ADD CONSTRAINT `topics_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD CONSTRAINT `user_achievements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_quiz_progress`
--
ALTER TABLE `user_quiz_progress`
  ADD CONSTRAINT `user_quiz_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_quiz_progress_ibfk_2` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE;
--
-- Database: `restuarntadmin`
--
CREATE DATABASE IF NOT EXISTS `restuarntadmin` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `restuarntadmin`;

-- --------------------------------------------------------

--
-- Table structure for table `food_details`
--

CREATE TABLE `food_details` (
  `resturant_name` varchar(30) NOT NULL,
  `food_item_name` varchar(30) NOT NULL,
  `food_discount_price` int(11) NOT NULL,
  `food_orginal_price` int(11) NOT NULL,
  `rating` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `food_details`
--

INSERT INTO `food_details` (`resturant_name`, `food_item_name`, `food_discount_price`, `food_orginal_price`, `rating`) VALUES
('Jaswant biriyani cen', 'Biriyani', 100, 250, '4.5'),
('Jaswant biriyani center', 'Mut', 200, 300, '4.5'),
('ifthar', 'gobirice', 80, 100, '5'),
('mahaverr', 'chicken rice', 100, 150, '4'),
('masthan', 'gobi', 50, 100, '7'),
('mahaverr', 'chicken rice', 90, 300, '2'),
('chilles', 'potrota', 200, 300, '4.5'),
('Table 9', 'Lolipop Biriyani', 250, 299, '5.0'),
('asma', 'coffee', 50, 100, '5');
--
-- Database: `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
