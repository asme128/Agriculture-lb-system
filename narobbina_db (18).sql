-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 01, 2025 at 11:05 AM
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
-- Database: `narobbina_db`
--
--
-- Table structure for table `persons`
--
-- ========================
-- Insert sample roles
-- ========================
CREATE TABLE `roles` (
  `role_id` varchar(255) NOT NULL,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================
-- Insert sample roles
-- ========================
INSERT INTO `roles` (`role_id`, `name`) VALUES
('r-001', 'manager'),
('r-002', 'staff'),
('r-003', 'admin');
-- --------------------------------------------------------
--
-- Table structure for table `persons`
--

CREATE TABLE `permissions` (
  `permission_id` varchar(255) NOT NULL,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================
-- Insert sample permissions
-- ========================
INSERT INTO `permissions` (`permission_id`, `name`) VALUES
('p-001', 'view_stock'),
('p-002', 'add_fertilizer'),
('p-003', 'delete_fertilizer'),
('p-004', 'view_reports');

-- --------------------------------------------------------
-- Table structure for table `components`
-- --------------------------------------------------------
CREATE TABLE `components` (
  `component_id` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `visibility_type` enum('all', 'single_user', 'shared_users') NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================
-- Insert sample components
-- (Already added, keeping for reference)
-- ========================
INSERT INTO `components` (`component_id`, `name`, `visibility_type`) VALUES
('c-001', 'Dashboard', 'all'),
('c-002', 'FertilizerStock', 'shared_users'),
('c-003', 'AdminPanel', 'single_user'),
('c-004', 'Reports', 'shared_users'),
('c-005', 'PersonRecord', 'all');

--
-- Table structure for table `Auth`
--

CREATE TABLE `auth` (
  `auth_id` varchar(255) NOT NULL,
  `role_type` enum('Administrator','Finance','Sales','Project Manager') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `auth` (`auth_id`, `role_type`) VALUES
('1', 'Administrator'),
('2', 'Project Manager'),
('3', 'Sales'),
('4', 'Finance');


-- --------------------------------------------------------
CREATE TABLE `staff` (
  `user_id` varchar(255) NOT NULL,
  `staff_id` varchar(255) NOT NULL,
  `auth_id` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_password` varchar(1000) NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `phone` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`user_id`, `staff_id`, `auth_id`, `user_name`, `user_password`, `gender`, `phone`) VALUES
('186b908f-d76a-11ef-a0a5-50ebf630c639', 'STF1', '1', 'Abebe Balcha', '$2b$10$Y0dT4c7JgZytmcW22WrleeDW4xyhEPCzLUBlcPB5vQ/E.oYv09sbO', 'male', 988778784),
('bae1d0c4-1ebb-4894-be72-f2b8e90f5e7e', 'AB12', '2', 'Abera Lorenzos', '$2b$10$Y0dT4c7JgZytmcW22WrleeDW4xyhEPCzLUBlcPB5vQ/E.oYv09sbO', 'male', 955595555),
('d7844580-164e-42ba-9d82-e54e8ef31be0', 'ABD123', '3', 'Abdu Ezedin', '$2b$10$Y0dT4c7JgZytmcW22WrleeDW4xyhEPCzLUBlcPB5vQ/E.oYv09sbO', 'male', 988778888);

-- --------------------------------------------------------
--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `gender` enum('male','female') NOT NULL DEFAULT 'male',
  `phone` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `registered_by` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `first_name`, `last_name`, `gender`, `phone`, `email`, `registered_by`) VALUES
('08e40f74-25f0-11f0-9f08-50ebf630c639', 'Johnny', 'Depp', 'male', 901764166, 'jo@gmail.com', '186b908f-d76a-11ef-a0a5-50ebf630c639'),
('09ff565e-91c5-43ab-9e6c-55f6d85b725b', 'Abebech', 'G', 'female', 978637488, 'a@gmail.com', '186b908f-d76a-11ef-a0a5-50ebf630c639'),
('0f47729c-25f0-11f0-9f08-50ebf630c639', 'Christoper', 'Nolan', 'female', 901764888, 'chris@gmail.com', '186b908f-d76a-11ef-a0a5-50ebf630c639'),
('ddb05f5d-f8aa-47b0-b155-e0a1c5a02468', 'Kebede', 'G', 'male', 978637488, 'a@gmail.com', '186b908f-d76a-11ef-a0a5-50ebf630c639');

-- --------------------------------------------------------
--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `inventory_id` varchar(255) NOT NULL,
  `inventory_name` varchar(500) NOT NULL,
  `unit` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `buying_price` int(11) NOT NULL,
  `selling_price` int(11) NOT NULL,
  `acquired_from` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`inventory_id`, `inventory_name`, `unit`, `quantity`, `buying_price`, `selling_price`, `acquired_from`) VALUES
('23f79212-3e1c-48a8-b782-9cecbcb3d4e9', 'CCTV', 'Pcs', 400, 10000, 15000, 'naro'),
('aecaab95-1f6e-11f0-859b-50ebf630c639', 'Camera', 'Pcs', 5, 10000, 15000, 'Abebe'),
('aecac6e4-1f6e-11f0-859b-50ebf630c639', 'Fence', 'meters', 200, 1000, 2500, 'bekele'),
('installation', 'Installation', 'Pcs', 1, 15000, 15000, 'narobbina');

-- --------------------------------------------------------
-- --------------------------------------------------------
--
-- Table structure for table `system`
--

CREATE TABLE `system` (
  `system_id` varchar(255) NOT NULL,
  `system_name` varchar(255) NOT NULL,
  `order_form` longtext NOT NULL,
  `project_form` longtext NOT NULL,
  `bid_form` longtext NOT NULL,
  `visit_form` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system`
--

INSERT INTO `system` (`system_id`, `system_name`, `order_form`, `project_form`, `bid_form`, `visit_form`) VALUES
('fc2cb043-216b-11f0-9757-50ebf630c639', 'Narobbina Project Management System', '[{\"label\":\"Procedure\",\"type\":\"dropdown\",\"options\":[\"1000\",\"2000\"],\"required\":true,\"name\":\"procedure\"}]', '[{\"label\":\"Procedure\",\"name\":\"procedure\",\"type\":\"textfield\",\"options\":[],\"required\":true}]', '[{\"label\":\"Type\",\"name\":\"type\",\"type\":\"textfield\",\"options\":[],\"required\":true}]', '[{\"label\":\"Type\",\"name\":\"type\",\"type\":\"dropdown\",\"options\":[\"connection\",\"journey\"],\"required\":true}]');

-- --------------------------------------------------------
--
-- Table structure for table `bids`
--

CREATE TABLE `bids` (
  `bid_id` varchar(255) NOT NULL,
  `bid_date` date NOT NULL,
  `bid_by` varchar(255) NOT NULL,
  `bid_data` longtext NOT NULL,
  `registered_by` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bids`
--

INSERT INTO `bids` (`bid_id`, `bid_date`, `bid_by`, `bid_data`, `registered_by`) VALUES
('673158dc-264e-11f0-9f08-50ebf630c639', '2025-04-22', '09ff565e-91c5-43ab-9e6c-55f6d85b725b', '[{\"name\":\"type\",\"type\":\"dropdown\",\"value\":\"connection\",\"required\":true},{\"name\":\"v\",\"type\":\"voice\",\"value\":\"/uploads/voice/1746006005629.webm\",\"required\":true},{\"name\":\"kk\",\"type\":\"textfield\",\"value\":\"kkkk\",\"required\":true}]', '186b908f-d76a-11ef-a0a5-50ebf630c639'),
('f7ed463c-25a7-11f0-961f-50ebf630c639', '2025-04-30', 'ddb05f5d-f8aa-47b0-b155-e0a1c5a02468', '[{\"name\":\"type\",\"type\":\"dropdown\",\"value\":\"connection\",\"required\":true},{\"name\":\"v\",\"type\":\"voice\",\"value\":\"/uploads/voice/1746006005629.webm\",\"required\":true},{\"name\":\"kk\",\"type\":\"textfield\",\"value\":\"kkkk\",\"required\":true}]', '186b908f-d76a-11ef-a0a5-50ebf630c639');

-- --------------------------------------------------------
--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `expense_id` varchar(255) NOT NULL,
  `expense_name` varchar(255) NOT NULL,
  `expense_reason` varchar(500) NOT NULL,
  `expense_amount` int(11) NOT NULL,
  `expense_date` date NOT NULL,
  `expense_for` varchar(255) DEFAULT NULL,
  `registered_by` varchar(255) NOT NULL,
  `type` enum('project','order','none') NOT NULL DEFAULT 'none'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`expense_id`, `expense_name`, `expense_reason`, `expense_amount`, `expense_date`, `expense_for`, `registered_by`, `type`) VALUES
('31bd012a-1d13-4b40-822e-cc27bb64b6fc', 'jj', 'kkaa', 9010, '2025-04-28', '1b4f2913-f34e-4519-8d79-4e4189fa2be0', '186b908f-d76a-11ef-a0a5-50ebf630c639', 'order'),
('33d20cce-246b-11f0-bcc5-50ebf630c639', 'overtimess', 'At work', 50005, '2025-04-18', '1b4f2913-f34e-4519-8d79-4e4189fa2be0', 'bae1d0c4-1ebb-4894-be72-f2b8e90f5e7e', 'none'),
('4ece6289-240f-11f0-bcef-50ebf630c639', 'labour', 'for labour', 4000, '2025-04-09', '8c7dcba4-2b64-4807-8626-35de30bd405b', 'bae1d0c4-1ebb-4894-be72-f2b8e90f5e7e', 'project'),
('887233e0-92ee-47a7-b6f2-fbf09717c8ac', 'Okay', 'ok', 45000, '2025-04-15', 'e6ae632a-f378-470a-80e8-0a3a918225a7', '186b908f-d76a-11ef-a0a5-50ebf630c639', 'project'),
('c3beef53-168b-44e5-9f6e-7cb9965e0d1b', 'John', 'jj', 500, '2025-04-29', 'd03e0b9d-7998-46a1-8b89-c4b7ea097b17', '186b908f-d76a-11ef-a0a5-50ebf630c639', 'project'),
('c9399cbd-bf2d-43cd-91e4-5356fedc239b', 'adad', 'adad', 100, '2025-04-28', 'e6ae632a-f378-470a-80e8-0a3a918225a7', '186b908f-d76a-11ef-a0a5-50ebf630c639', 'project'),
('faa12268-d8bc-401e-bc8b-36e447702f26', 'order', 'or', 100, '2025-04-28', '1b4f2913-f34e-4519-8d79-4e4189fa2be0', '186b908f-d76a-11ef-a0a5-50ebf630c639', 'order');

-- --------------------------------------------------------
--
-- Table structure for table `operations`
--

CREATE TABLE `operations` (
  `operation_id` varchar(255) NOT NULL,
  `customer_id` varchar(255) NOT NULL,
  `type` enum('project','order') NOT NULL,
  `operation_name` varchar(255) NOT NULL,
  `operation_data` longtext NOT NULL,
  `operation_status` enum('approved','rejected','completed','pending') NOT NULL DEFAULT 'pending',
  `payment_status` enum('paid','not paid','partial') NOT NULL DEFAULT 'not paid',
  `created_by` varchar(255) NOT NULL,
  `created_at` date NOT NULL,
  `approved_by` varchar(255) DEFAULT NULL,
  `approved_at` date DEFAULT NULL,
  `stock_status` enum('in stock','out of stock') NOT NULL,
  `proforma_created` tinyint(1) NOT NULL DEFAULT 0,
  `proforma_by` varchar(255) DEFAULT NULL,
  `proforma_date` date DEFAULT NULL,
  `total_cost` int(11) DEFAULT NULL,
  `note` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `operations`
--

INSERT INTO `operations` (`operation_id`, `customer_id`, `type`, `operation_name`, `operation_data`, `operation_status`, `payment_status`, `created_by`, `created_at`, `approved_by`, `approved_at`, `stock_status`, `proforma_created`, `proforma_by`, `proforma_date`, `total_cost`, `note`) VALUES
('1b4f2913-f34e-4519-8d79-4e4189fa2be0', '09ff565e-91c5-43ab-9e6c-55f6d85b725b', 'order', 'New list', '[{\"name\":\"procedure\",\"type\":\"dropdown\",\"value\":\"2000\",\"required\":true},{\"name\":\"intro\",\"type\":\"voice\",\"value\":\"/uploads/voice/1745675807537.webm\",\"required\":true},{\"name\":\"view\",\"type\":\"image\",\"value\":\"/uploads/images/1745675807538.jpg\",\"required\":true}]', 'approved', 'not paid', '186b908f-d76a-11ef-a0a5-50ebf630c639', '2025-04-26', '186b908f-d76a-11ef-a0a5-50ebf630c639', '2025-04-26', 'in stock', 1, '186b908f-d76a-11ef-a0a5-50ebf630c639', '2025-04-26', 309, 'Approved by me'),
('7cd99b9e-264c-11f0-9f08-50ebf630c639', '08e40f74-25f0-11f0-9f08-50ebf630c639', 'order', 'New Order', '[{\"name\":\"procedure\",\"type\":\"dropdown\",\"value\":\"2000\",\"required\":true},{\"name\":\"intro\",\"type\":\"voice\",\"value\":\"/uploads/voice/1745675807537.webm\",\"required\":true},{\"name\":\"view\",\"type\":\"image\",\"value\":\"/uploads/images/1745675807538.jpg\",\"required\":true}]', 'approved', 'not paid', '186b908f-d76a-11ef-a0a5-50ebf630c639', '2025-04-16', '186b908f-d76a-11ef-a0a5-50ebf630c639', '2025-04-26', 'out of stock', 1, '186b908f-d76a-11ef-a0a5-50ebf630c639', '2025-04-26', 309, 'Approved by me'),
('8c7dcba4-2b64-4807-8626-35de30bd405b', '09ff565e-91c5-43ab-9e6c-55f6d85b725b', 'project', 'Project BB', '[{\"name\":\"procedure\",\"type\":\"textfield\",\"value\":\"hand\",\"required\":true},{\"name\":\"procedure1\",\"type\":\"image\",\"value\":\"/uploads/images/1745636437714.png\",\"required\":true}]', 'pending', 'paid', '186b908f-d76a-11ef-a0a5-50ebf630c639', '2025-04-09', '186b908f-d76a-11ef-a0a5-50ebf630c639', '2025-04-26', 'in stock', 1, '186b908f-d76a-11ef-a0a5-50ebf630c639', '2025-04-26', 500, 'project bb appoved'),
('d03e0b9d-7998-46a1-8b89-c4b7ea097b17', '08e40f74-25f0-11f0-9f08-50ebf630c639', 'project', 'Remain Proj', '[{\"name\":\"img\",\"type\":\"image\",\"value\":\"/uploads/images/1745929036991.png\",\"required\":true}]', 'pending', 'partial', '186b908f-d76a-11ef-a0a5-50ebf630c639', '2025-04-29', NULL, NULL, 'in stock', 0, NULL, NULL, 500, 'okf'),
('e6ae632a-f378-470a-80e8-0a3a918225a7', '08e40f74-25f0-11f0-9f08-50ebf630c639', 'project', 'Bridge Project', '[]', 'rejected', 'not paid', '186b908f-d76a-11ef-a0a5-50ebf630c639', '2025-04-25', NULL, NULL, 'out of stock', 0, NULL, NULL, 9200, 'new noteeee!');

-- --------------------------------------------------------

--
-- Table structure for table `operation_inventory`
--

CREATE TABLE `operation_inventory` (
  `op_inv_id` varchar(255) NOT NULL,
  `operation_id` varchar(255) NOT NULL,
  `type` enum('project','order') NOT NULL,
  `inventory_id` varchar(255) NOT NULL,
  `quantity_required` int(11) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `added_date` date NOT NULL,
  `customized_by` varchar(255) DEFAULT NULL,
  `comment` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `operation_inventory`
--

INSERT INTO `operation_inventory` (`op_inv_id`, `operation_id`, `type`, `inventory_id`, `quantity_required`, `price`, `added_date`, `customized_by`, `comment`) VALUES
('5e486c10-227c-4ad7-a681-3d740415c7cb', '8c7dcba4-2b64-4807-8626-35de30bd405b', 'project', 'installation', 1, 15000, '2025-04-26', '186b908f-d76a-11ef-a0a5-50ebf630c639', 'mee'),
('7eba3624-3c5d-4fcf-97cc-8dd25d3c0068', '1b4f2913-f34e-4519-8d79-4e4189fa2be0', 'order', 'aecac6e4-1f6e-11f0-859b-50ebf630c639', 30, 2500, '2025-04-09', '186b908f-d76a-11ef-a0a5-50ebf630c639', NULL),
('90d28972-7bf2-4504-8828-f143107e99ae', '1b4f2913-f34e-4519-8d79-4e4189fa2be0', 'order', 'installation', 1, 25000, '2025-04-26', '186b908f-d76a-11ef-a0a5-50ebf630c639', 'new price\nfor al the data available because you know it'),
('984a6cc5-6488-4fc3-ad34-c5f56b61d4f0', 'd03e0b9d-7998-46a1-8b89-c4b7ea097b17', 'project', '23f79212-3e1c-48a8-b782-9cecbcb3d4e9', 50, 15000, '2025-04-09', '186b908f-d76a-11ef-a0a5-50ebf630c639', NULL),
('bfda2ced-a421-4ecd-8353-9d9cdca7a4b1', 'd03e0b9d-7998-46a1-8b89-c4b7ea097b17', 'project', 'aecac6e4-1f6e-11f0-859b-50ebf630c639', 70, 2500, '2025-04-29', '186b908f-d76a-11ef-a0a5-50ebf630c639', NULL),
('e1cba1d4-53ab-435c-be60-006538264a45', '8c7dcba4-2b64-4807-8626-35de30bd405b', 'project', 'aecac6e4-1f6e-11f0-859b-50ebf630c639', 31, 3000, '2025-04-18', '186b908f-d76a-11ef-a0a5-50ebf630c639', 'new fence input\n');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` varchar(255) NOT NULL,
  `payment_for` varchar(255) DEFAULT NULL,
  `type` enum('project','order') NOT NULL,
  `payment_reason` varchar(500) DEFAULT NULL,
  `amount` int(11) NOT NULL,
  `payment_date` date NOT NULL,
  `registered_by` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `payment_for`, `type`, `payment_reason`, `amount`, `payment_date`, `registered_by`) VALUES
('1715b062-265e-11f0-9f08-50ebf630c639', '8c7dcba4-2b64-4807-8626-35de30bd405b', 'project', 'bottle', 4700, '2025-03-19', '186b908f-d76a-11ef-a0a5-50ebf630c639'),
('c70261d6-94bd-4cbf-8c7f-ef0af89893b1', 'd03e0b9d-7998-46a1-8b89-c4b7ea097b17', 'project', 'bottle', 4700, '2025-04-29', '186b908f-d76a-11ef-a0a5-50ebf630c639'),
('c9fba151-9624-49f2-8321-dd86edc2be05', 'd03e0b9d-7998-46a1-8b89-c4b7ea097b17', 'project', 'bottle', 300, '2025-04-29', '186b908f-d76a-11ef-a0a5-50ebf630c639');

-- --------------------------------------------------------

--
-- Table structure for table `remainders`
--

CREATE TABLE `remainders` (
  `remainder_id` varchar(255) NOT NULL,
  `remainder_for` varchar(255) NOT NULL,
  `remainder_reason` varchar(500) DEFAULT NULL,
  `user_id` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `type` enum('project','order') NOT NULL,
  `remainder_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `remainders`
--

INSERT INTO `remainders` (`remainder_id`, `remainder_for`, `remainder_reason`, `user_id`, `amount`, `type`, `remainder_date`) VALUES
('598a2236-b8c2-4563-88f5-9d5285a42ee8', 'd03e0b9d-7998-46a1-8b89-c4b7ea097b17', 'Project Invoice - Remain Proj', '186b908f-d76a-11ef-a0a5-50ebf630c639', 925000, 'project', '2025-04-29'),
('f7fc0942-264a-11f0-9f08-50ebf630c639', '8c7dcba4-2b64-4807-8626-35de30bd405b', 'Project Invoice - Remain Proj', 'bae1d0c4-1ebb-4894-be72-f2b8e90f5e7e', 8700, 'order', '2025-04-22');

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `token_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `refresh_token` varchar(2000) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `ip_address` varchar(255) NOT NULL,
  `is_revoked` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`token_id`, `user_id`, `refresh_token`, `expires_at`, `created_at`, `ip_address`, `is_revoked`) VALUES
('0353291e-f35d-40cf-a2bf-b60fd46c883b', 'd7844580-164e-42ba-9d82-e54e8ef31be0', '138967631b1e9f3b232ef4801860ecd90bd901ac7b70e88052082e8599758189', '2025-05-02 07:07:42', '2025-05-01 07:07:42', '127.0.0.1', 1),
('0b6f477e-139b-462a-870f-2be1c0d85b4a', 'd7844580-164e-42ba-9d82-e54e8ef31be0', 'b48275c0ea17d586b8614a5794645ac045606c622ec3aa6bdfdd06d4b224ef3e', '2025-05-02 07:11:15', '2025-05-01 07:11:15', '127.0.0.1', 1),
('0d31c004-1e48-4e10-9325-3caa56dadcc2', 'd7844580-164e-42ba-9d82-e54e8ef31be0', '7360e3f061fed5b910449ec26c541aecadf1abd02151b085412d32e90f514477', '2025-05-02 07:17:41', '2025-05-01 07:17:41', '127.0.0.1', 1),
('1045ca4b-2ae1-43b8-8c4b-86383f146978', 'd7844580-164e-42ba-9d82-e54e8ef31be0', '96517eb4989a527c570e490008996b970d3aa4de72ef65d3819cbf5632736d97', '2025-05-02 07:14:13', '2025-05-01 07:14:13', '127.0.0.1', 1),
('43d3b798-932b-4ed6-8d2e-8b9192f3c8a8', 'd7844580-164e-42ba-9d82-e54e8ef31be0', '74361832ccb4e92588e0a4067668398963e595d972c9cc5c6daa7a54434b1fe7', '2025-05-02 07:12:46', '2025-05-01 07:12:46', '127.0.0.1', 1),
('665ef1f0-41a6-4f0d-a0ee-1e3f55a19090', 'd7844580-164e-42ba-9d82-e54e8ef31be0', '54791deb36a80b050404f3ade515eb670db3747e50ca64938203e4b48f19e5ff', '2025-05-02 07:18:50', '2025-05-01 07:18:50', '127.0.0.1', 1),
('9fbf84c9-e0fd-4501-969f-110d8848cc53', '186b908f-d76a-11ef-a0a5-50ebf630c639', 'df5cda06d26f20cde45ead3145a993c87f9e9157a5bdad8abe78ec8b07578b38', '2025-05-02 07:22:25', '2025-05-01 07:22:25', '127.0.0.1', 1),
('a2ecd8da-b08c-408d-ada4-98c845e6f4ad', 'd7844580-164e-42ba-9d82-e54e8ef31be0', 'f674e4ec16a794656d54b35f73866000ed5f08fff486555194f624f1facd49ed', '2025-05-02 07:10:31', '2025-05-01 07:10:31', '127.0.0.1', 1),
('be869342-a64d-462d-9d15-8a0cfe0a2ab4', 'd7844580-164e-42ba-9d82-e54e8ef31be0', 'af2c8cc5c23dc12c866ccdd810f9f1877bd0109530c36e3d10d3bfcf543dd1ca', '2025-05-02 07:15:51', '2025-05-01 07:15:51', '127.0.0.1', 1),
('dc33755e-ebe6-42eb-bf03-14a45ca53ec9', 'd7844580-164e-42ba-9d82-e54e8ef31be0', '1f42ad9ff8c6ec1e96a58b8bb5a664f93c1e71e12294bd4ff762a9e016d65e97', '2025-05-02 12:05:33', '2025-05-01 12:05:33', '127.0.0.1', 0),
('eb75662b-a07d-4bd4-9c56-5257c14e0349', 'd7844580-164e-42ba-9d82-e54e8ef31be0', 'd9ab791de0a4b034d6268886bb471cfaba5fb9569221e842c22bd1af1e302341', '2025-05-02 12:04:46', '2025-05-01 12:04:46', '127.0.0.1', 1);

-- --------------------------------------------------------
--
-- Table structure for table `persons`
--

CREATE TABLE `persons` (
  `farmer_id` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `second_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `gender` enum('male','female', 'other') NOT NULL,
  `marital_status` enum('married','single', 'divorced') NOT NULL,
  `date_birth` date NOT NULL,
  `phone` int(11) NOT NULL,
  `optional_phone` int(11) NOT NULL,
  `id_number` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `zone` varchar(255) DEFAULT NULL,
  `woreda` varchar(255) DEFAULT NULL,
  `kebele` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `personal_profile` varchar(255) NOT NULL,
  `created_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `persons`
--

CREATE TABLE `land_information` (
  `land_id` varchar(255) NOT NULL,
  `farmer_id` varchar(255) NOT NULL,
  `total_area` varchar(255) NOT NULL,
  `book_number` varchar(255) DEFAULT NULL,
  `soil_type` varchar(255) DEFAULT NULL,
  `woreda` varchar(255) DEFAULT NULL,
  `kebele` varchar(255) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL, 
  `land_file` varchar(255) NOT NULL,
  `created_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- --------------------------------------------------------
-- Table structure for table `staff_roles`
-- --------------------------------------------------------
CREATE TABLE `spouse_information` (
  `spouse_id` varchar(255) NOT NULL,
  `farmer_id` varchar(255) NOT NULL,
  `spouse_first_name` varchar(255) NOT NULL,
  `spouse_second_name` varchar(255) DEFAULT NULL,
  `spouse_last_name` varchar(255) DEFAULT NULL,
  `spouse_phone` varchar(255) DEFAULT NULL,
  `woreda` varchar(255) DEFAULT NULL, 
  `kebele` varchar(255) DEFAULT NULL,
  `created_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `staff_roles`
-- --------------------------------------------------------
CREATE TABLE `staff_roles` (
  `user_id` varchar(255) NOT NULL,
  `role_id` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================
-- Staff roles mapping
-- ========================
INSERT INTO `staff_roles` (`user_id`, `role_id`) VALUES
('186b908f-d76a-11ef-a0a5-50ebf630c639', 'r-001'), -- John is manager
('bae1d0c4-1ebb-4894-be72-f2b8e90f5e7e', 'r-002'), -- Alice is staff
('d7844580-164e-42ba-9d82-e54e8ef31be0', 'r-003'); -- Bob is admin

-- --------------------------------------------------------
-- Table structure for table `role_permissions`
-- --------------------------------------------------------
CREATE TABLE `role_permissions` (
  `role_id` varchar(255) NOT NULL,
  `permission_id` varchar(255) NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================
-- Role permissions mapping
-- ========================
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
('r-001', 'p-001'),
('r-001', 'p-002'), -- Manager can view/add fertilizer
('r-002', 'p-001'), -- Staff can only view
('r-003', 'p-001'),
('r-003', 'p-002'),
('r-003', 'p-003'),
('r-003', 'p-004'); -- Admin can do everything

-- --------------------------------------------------------
-- Table structure for table `component_access`
-- --------------------------------------------------------
CREATE TABLE `component_access` (
  `component_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  PRIMARY KEY (`component_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================
-- Component access mapping
-- ========================
INSERT INTO `component_access` (`component_id`, `user_id`) VALUES
('c-001', '186b908f-d76a-11ef-a0a5-50ebf630c639'), -- Dashboard for John
('c-002', '186b908f-d76a-11ef-a0a5-50ebf630c639'), -- FertilizerStock for John
('c-001', 'bae1d0c4-1ebb-4894-be72-f2b8e90f5e7e'), -- Dashboard for Alice
('c-001', 'd7844580-164e-42ba-9d82-e54e8ef31be0'), -- Dashboard for Bob
('c-002', 'd7844580-164e-42ba-9d82-e54e8ef31be0'), -- FertilizerStock for Bob
('c-003', 'd7844580-164e-42ba-9d82-e54e8ef31be0'), -- AdminPanel for Bob
('c-005', '186b908f-d76a-11ef-a0a5-50ebf630c639'), -- AdminPanel for Bob
('c-004', 'd7844580-164e-42ba-9d82-e54e8ef31be0'); -- Reports for Bob
--
-- Table structure for table `visits`
--

CREATE TABLE `visits` (
  `visit_id` varchar(255) NOT NULL,
  `visit_by` varchar(255) NOT NULL,
  `visit_data` longtext NOT NULL,
  `visit_date` date NOT NULL,
  `registered_by` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `visits`
--

INSERT INTO `visits` (`visit_id`, `visit_by`, `visit_data`, `visit_date`, `registered_by`) VALUES
('142c6a5d-3295-4cb9-bc81-b100c9e1d4b5', '0f47729c-25f0-11f0-9f08-50ebf630c639', '[{\"name\":\"type\",\"type\":\"dropdown\",\"value\":\"connection\",\"required\":true},{\"name\":\"v\",\"type\":\"voice\",\"value\":\"/uploads/voice/1746006005629.webm\",\"required\":true},{\"name\":\"kk\",\"type\":\"textfield\",\"value\":\"kkkk\",\"required\":true}]', '2025-05-01', 'bae1d0c4-1ebb-4894-be72-f2b8e90f5e7e'),
('324427d2-259b-11f0-961f-50ebf630c639', '09ff565e-91c5-43ab-9e6c-55f6d85b725b', '[{\"name\":\"procedure\",\"type\":\"dropdown\",\"value\":\"2000\",\"required\":true},{\"name\":\"intro\",\"type\":\"voice\",\"value\":\"/uploads/voice/1745675807537.webm\",\"required\":true},{\"name\":\"view\",\"type\":\"image\",\"value\":\"/uploads/images/1745675807538.jpg\",\"required\":true}]', '2025-04-28', 'd7844580-164e-42ba-9d82-e54e8ef31be0');


-- --------------------------------------------------------

ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);
--
-- Indexes for table `staff`
--

ALTER TABLE `permissions`
  ADD PRIMARY KEY (`permission_id`);


ALTER TABLE `persons`
  ADD PRIMARY KEY (`farmer_id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `id_number` (`id_number`);

ALTER TABLE `land_information`
  ADD PRIMARY KEY (`land_id`),
  ADD UNIQUE KEY `book_number` (`book_number`),
  ADD FOREIGN KEY (`farmer_id`) REFERENCES `persons`(`farmer_id`);


ALTER TABLE `spouse_information`
  ADD PRIMARY KEY (`spouse_id`),
  ADD FOREIGN KEY (`farmer_id`) REFERENCES `persons`(`farmer_id`);


ALTER TABLE `components`
  ADD PRIMARY KEY (`component_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `staff_id` (`staff_id`),
  ADD UNIQUE KEY `auth_id` (`auth_id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `staff_id_2` (`staff_id`),
  ADD UNIQUE KEY `phone_2` (`phone`);


ALTER TABLE `staff_roles`
  ADD FOREIGN KEY (`user_id`) REFERENCES `staff`(`user_id`),
  ADD FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`);

ALTER TABLE `role_permissions`
  ADD FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`),
  ADD FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`permission_id`);

ALTER TABLE `component_access`
  ADD FOREIGN KEY (`component_id`) REFERENCES `components`(`component_id`),
  ADD FOREIGN KEY (`user_id`) REFERENCES `staff`(`user_id`);
--
-- Indexes for table `bids`
--
ALTER TABLE `bids`
  ADD PRIMARY KEY (`bid_id`),
  ADD KEY `bid_customer_fk` (`bid_by`),
  ADD KEY `bid_staff_fk` (`registered_by`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD KEY `registered_by_fk` (`registered_by`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`expense_id`),
  ADD KEY `expense_for_operation` (`expense_for`),
  ADD KEY `expense_registered_by_fk` (`registered_by`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`inventory_id`);

--
-- Indexes for table `operations`
--
ALTER TABLE `operations`
  ADD PRIMARY KEY (`operation_id`),
  ADD KEY `project_approver_fk` (`approved_by`),
  ADD KEY `project_creator_fk` (`created_by`),
  ADD KEY `project_customer_fk` (`customer_id`),
  ADD KEY `project_proforma_by_fk` (`proforma_by`);

--
-- Indexes for table `operation_inventory`
--
ALTER TABLE `operation_inventory`
  ADD PRIMARY KEY (`op_inv_id`),
  ADD UNIQUE KEY `op_inv_id_2` (`op_inv_id`),
  ADD KEY `customizer_fk` (`customized_by`),
  ADD KEY `operation_project_fk` (`operation_id`),
  ADD KEY `inventory_operation_fk` (`inventory_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `operation_payment_fk` (`payment_for`),
  ADD KEY `payment_staff_fk` (`registered_by`);

--
-- Indexes for table `remainders`
--
ALTER TABLE `remainders`
  ADD PRIMARY KEY (`remainder_id`),
  ADD KEY `patient_remainder_FK` (`remainder_for`),
  ADD KEY `staff_remainder_fk` (`user_id`);

--
-- Indexes for table `system`
--
ALTER TABLE `system`
  ADD PRIMARY KEY (`system_id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`token_id`),
  ADD KEY `user_token_fk` (`user_id`);

--
-- Indexes for table `visits`
--
ALTER TABLE `visits`
  ADD PRIMARY KEY (`visit_id`),
  ADD KEY `visit_customer_fk` (`visit_by`),
  ADD KEY `visit_staff_fk` (`registered_by`);

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `registered_by_fk` FOREIGN KEY (`registered_by`) REFERENCES `staff` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expense_for_operation` FOREIGN KEY (`expense_for`) REFERENCES `operations` (`operation_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `expense_registered_by_fk` FOREIGN KEY (`registered_by`) REFERENCES `staff` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `operations`
--
ALTER TABLE `operations`
  ADD CONSTRAINT `project_approver_fk` FOREIGN KEY (`approved_by`) REFERENCES `staff` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `project_creator_fk` FOREIGN KEY (`created_by`) REFERENCES `staff` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `project_customer_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `project_proforma_by_fk` FOREIGN KEY (`proforma_by`) REFERENCES `staff` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `operation_inventory`
--
ALTER TABLE `operation_inventory`
  ADD CONSTRAINT `customizer_fk` FOREIGN KEY (`customized_by`) REFERENCES `staff` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `inventory_operation_fk` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`inventory_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `operation_project_fk` FOREIGN KEY (`operation_id`) REFERENCES `operations` (`operation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `operation_payment_fk` FOREIGN KEY (`payment_for`) REFERENCES `operations` (`operation_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_staff_fk` FOREIGN KEY (`registered_by`) REFERENCES `staff` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `remainders`
--
ALTER TABLE `remainders`
  ADD CONSTRAINT `operation_remainder_fk` FOREIGN KEY (`remainder_for`) REFERENCES `operations` (`operation_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `staff_remainder_fk` FOREIGN KEY (`user_id`) REFERENCES `staff` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `user_token_fk` FOREIGN KEY (`user_id`) REFERENCES `staff` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `visits`
--
ALTER TABLE `visits`
  ADD CONSTRAINT `visit_customer_fk` FOREIGN KEY (`visit_by`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `visit_staff_fk` FOREIGN KEY (`registered_by`) REFERENCES `staff` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
