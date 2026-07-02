-- 1. 사용자 테이블 (users)
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_name` VARCHAR(20) UNIQUE NOT NULL,
  `user_password` VARCHAR(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 위키 문서 테이블 (pages)
CREATE TABLE IF NOT EXISTS `pages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(225) UNIQUE NOT NULL,
  `content` TEXT,
  `view_count` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 수정 이력 테이블 (revisions)
CREATE TABLE IF NOT EXISTS `revisions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page_id` INT NOT NULL,
  `user_id` INT,
  `content` TEXT,
  `summary` VARCHAR(225),
  `edited_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- 외래키 설정 (문서가 지워지면 이력도 삭제, 유저가 지워지면 이력의 유저 ID는 NULL 처리)
  FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;