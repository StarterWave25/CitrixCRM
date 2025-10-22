-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 22, 2025 at 06:03 PM
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

--
-- Dumping data for table `doctor activities`
--

INSERT INTO `doctor activities` (`recordId`, `docId`, `empId`, `Employee Name`, `Feedback`, `Order Status`, `date`) VALUES
(12, 7, 8, 'Prudvi', 'No response', 'No', '2025-10-22'),
(13, 8, 8, 'Prudvi', 'Ordered dolo 500 strips 10 strips free', 'Yes', '2025-10-22'),
(14, 11, 8, 'Prudvi', 'Ordered', 'Yes', '2025-10-22'),
(15, 12, 8, 'Prudvi', 'No response', 'No', '2025-10-22');

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
  `Date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`docId`, `Doctor Name`, `Phone`, `Address`, `exId`, `Status`, `Date`) VALUES
(7, 'Harsha', 9014709040, 'KT ROAD Tirupati', 4, 'Active', '2025-10-21'),
(8, 'SHerrr', 9828918921, 'Bhavani Nagar, tirupati', 4, 'Active', '2025-10-21'),
(11, 'Satheesh', 9019201929, 'Teacher \'s colony', 4, 'Active', '2025-10-22'),
(12, 'Reddy', 8928031010, 'Bhavani Nagar', 4, 'Active', '2025-10-22');

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
(13, 8, 4, 200, 0, 200, 'Not Paid', 'https://res.cloudinary.com/dikzz3qtt/image/upload/v1761112148/vliyeeftggjzh7wyqzlj.jpg', '', '2025-10-22');

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
(3, 'Pileru', 3, NULL, '2025-10-15'),
(4, 'Tirupati', 3, NULL, '2025-10-20');

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
(5, 'https://meet.google.com/vmq-vqpk-efy', 1, '2025-10-22');

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

--
-- Dumping data for table `ordered products`
--

INSERT INTO `ordered products` (`opId`, `orderId`, `pId`, `Strips`, `Free Strips`) VALUES
(8, 2, 2, 500, 10),
(9, 3, 2, 20, 2),
(10, 3, 1, 35, 5);

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
  `Total` float NOT NULL,
  `Date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`orderId`, `empId`, `Employee Name`, `docId`, `Doctor Name`, `exId`, `DL Copy`, `Prescription`, `Total`, `Date`) VALUES
(2, 8, 0, 8, 'SHerrr', 4, 'https://res.cloudinary.com/dikzz3qtt/image/upload/v1761141176/jl7lh8pzk9k3sq9vkwmj.png', 'https://res.cloudinary.com/dikzz3qtt/image/upload/v1761141177/b8nzqioyxyvyhv8astgv.png', 33000, '2025-10-22'),
(3, 8, 0, 11, 'Satheesh', 4, 'https://res.cloudinary.com/dikzz3qtt/image/upload/v1761141442/zc8vuxvmedfxehibjegf.png', 'https://res.cloudinary.com/dikzz3qtt/image/upload/v1761141444/mjctp7ekjg2j4dlandna.png', 3070.56, '2025-10-22');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `pId` int(11) NOT NULL,
  `Product Name` varchar(110) NOT NULL,
  `Price` int(11) NOT NULL,
  `Date` int(11) NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`pId`, `Product Name`, `Price`, `Date`) VALUES
(1, 'Para', 50, 0),
(2, 'DOLO', 66, 0),
(3, 'Anti', 30, 0);

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
(31, 8, 3, 4, 'Tirupati', 'No', 'http://localhost/phpmyadmin/index.php?route=/sql&db=citrix&table=tourplan&pos=0', '2025-10-10'),
(32, 8, 3, 4, 'Tirupati', '', '', '2025-09-28'),
(33, 8, 3, 4, 'Tirupati', '', '', '2025-10-06'),
(34, 8, 3, 4, 'Tirupati', '', '', '2025-10-16'),
(35, 8, 3, 4, 'Tirupati', 'No', '', '2025-10-22');

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
  MODIFY `recordId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `docId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `empId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `extensions`
--
ALTER TABLE `extensions`
  MODIFY `exId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `opId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `pId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stockists`
--
ALTER TABLE `stockists`
  MODIFY `stockId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tourplan`
--
ALTER TABLE `tourplan`
  MODIFY `tId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

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
